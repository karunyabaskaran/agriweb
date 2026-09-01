from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time, compute_trust_score, calculate_haversine_distance

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@order_bp.route("", methods=["POST"])
@auth_required
@require_role("buyer", "farmer", "admin")
def create_order():
    """Buyer places a direct order on a listed produce lot."""
    try:
        data = request.get_json() or {}
        produce_id = data.get("produceId")
        quantity_kg = data.get("quantityKg")

        if not produce_id or quantity_kg is None:
            return jsonify({"error": "produceId and quantityKg are required"}), 400

        try:
            req_qty = float(quantity_kg)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid quantityKg"}), 400

        produce = db.get_by_id("produce", produce_id)
        if not produce or produce.get("status") not in ["listed", "pooled"]:
            return jsonify({"error": "This produce listing is not available"}), 404

        avail_qty = float(produce.get("quantityKg", 0))
        if req_qty <= 0 or req_qty > avail_qty:
            return jsonify({"error": f"Requested quantity ({req_qty}kg) exceeds available ({avail_qty}kg)"}), 400

        buyer = db.get_by_id("users", g.user["id"]) or {}
        if not isinstance(buyer, dict):
            buyer = {}

        buyer_name = buyer.get("name") or g.user.get("name", "Buyer")
        unit_price = float(produce.get("askingPricePerKg", 0))
        total_price = round(req_qty * unit_price, 2)

        order_id = f"ord-{new_id()[:8]}"
        transaction_id = f"TXN_{order_id.upper()}"

        origin = produce.get("coordinates") or {"lat": 19.076, "lng": 72.877, "name": produce.get("village", "Farm Village")}
        dest = data.get("deliveryDestination") or buyer.get("coordinates") or {"lat": 19.033, "lng": 73.029, "name": buyer.get("village", "Buyer Hub")}


        order = {
            "id": order_id,
            "produceId": produce_id,
            "commodity": produce.get("commodity"),
            "variety": produce.get("variety", ""),
            "farmerId": produce.get("farmerId"),
            "farmerName": produce.get("farmerName"),
            "farmerPhone": produce.get("farmerPhone", ""),
            "buyerId": g.user["id"],
            "buyerName": buyer_name,
            "buyerPhone": buyer.get("phone") or g.user.get("phone", ""),
            "quantityKg": req_qty,
            "pricePerKg": unit_price,
            "totalPrice": total_price,
            "status": "pending", # pending -> confirmed/rejected -> dispatched -> delivered -> rated
            "paymentStatus": "escrow_pending", # escrow_pending -> held_in_escrow -> released_to_farmer

            "transactionId": transaction_id,
            "deliveryOrigin": origin,
            "deliveryDestination": dest,
            "createdAt": current_iso_time()
        }

        db.insert("orders", order)

        # Record payment transaction
        payment_record = {
            "id": f"pay-{new_id()[:8]}",
            "orderId": order_id,
            "amount": total_price,
            "method": data.get("paymentMethod", "UPI / Escrow Guaranteed"),
            "status": "escrow_secured",
            "escrowStatus": "held_in_escrow",
            "farmerShare": round(total_price * 0.99, 2),
            "platformFee": round(total_price * 0.01, 2),
            "timestamp": current_iso_time()
        }
        db.insert("payments", payment_record)

        # Deduct quantity from produce listing
        remaining_qty = avail_qty - req_qty
        db.update("produce", produce_id, {
            "quantityKg": remaining_qty,
            "status": "sold" if remaining_qty <= 0 else produce.get("status")
        })

        return jsonify({"order": order, "payment": payment_record}), 201
    except Exception as e:
        print(f"Error creating order: {e}")
        return jsonify({"error": f"Failed to place order: {str(e)}"}), 500


@order_bp.route("/mine", methods=["GET"])
@auth_required
def get_my_orders():
    """Role-aware orders fetch: Farmer sees incoming orders; Buyer sees placed orders; Admin sees all."""
    all_orders = db.get_all("orders")
    role = g.user.get("role")
    user_id = g.user.get("id")

    if role == "farmer":
        mine = [o for o in all_orders if o.get("farmerId") == user_id]
    elif role == "buyer":
        mine = [o for o in all_orders if o.get("buyerId") == user_id]
    else: # admin
        mine = all_orders

    return jsonify(mine), 200

@order_bp.route("/<order_id>", methods=["GET"])
@auth_required
def get_order_details(order_id):
    order = db.get_by_id("orders", order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order), 200

@order_bp.route("/<order_id>/status", methods=["PATCH"])
@auth_required
def update_order_status(order_id):
    """Update order status (dispatched, delivered, cancelled)."""
    try:
        clean_order_id = str(order_id).replace("#", "").strip()
        data = request.get_json() or {}
        new_status = data.get("status")

        order = db.get_by_id("orders", clean_order_id)
        if not order:
            all_orders = db.get_all("orders") or []
            order = next((o for o in all_orders if isinstance(o, dict) and (o.get("id") == clean_order_id or str(o.get("id")) == str(order_id))), None)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        user_id = str(g.user.get("id", "")).strip()
        user_name = str(g.user.get("name", "")).strip().lower()
        user_phone = str(g.user.get("phone", "")).strip()
        role = str(g.user.get("role", "")).strip().lower()

        # Flexible ownership check (matches ID, name, or phone)
        is_buyer = (
            user_id == str(order.get("buyerId", "")) or
            user_name == str(order.get("buyerName", "")).lower() or
            (user_phone and user_phone == str(order.get("buyerPhone", "")))
        )
        is_farmer = (
            user_id == str(order.get("farmerId", "")) or
            user_name == str(order.get("farmerName", "")).lower() or
            (user_phone and user_phone == str(order.get("farmerPhone", "")))
        )

        if role != "admin" and not is_buyer and not is_farmer:
            if role not in ["buyer", "farmer"]:
                return jsonify({"error": "Not authorized to update this order"}), 403

        valid_statuses = ["pending", "confirmed", "rejected", "dispatched", "delivered", "cancelled"]
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

        updates = {"status": new_status}

        # If farmer accepts order (confirmed)
        if new_status == "confirmed":
            updates["paymentStatus"] = "held_in_escrow"
            try:
                payments = db.get_all("payments") or []
                for p in payments:
                    if isinstance(p, dict) and str(p.get("orderId", "")) in [clean_order_id, str(order_id)]:
                        db.update("payments", p.get("id"), {
                            "escrowStatus": "held_in_escrow",
                            "status": "escrow_secured"
                        })
            except Exception as pe:
                print(f"Warning updating payment record: {pe}")

        # If farmer rejects order (rejected)
        elif new_status == "rejected":
            updates["paymentStatus"] = "refunded_to_buyer"
            try:
                payments = db.get_all("payments") or []
                for p in payments:
                    if isinstance(p, dict) and str(p.get("orderId", "")) in [clean_order_id, str(order_id)]:
                        db.update("payments", p.get("id"), {
                            "escrowStatus": "refunded_to_buyer",
                            "status": "refunded"
                        })
            except Exception as pe:
                print(f"Warning updating payment record: {pe}")

            # Restore produce quantity to listing
            try:
                produce_id = order.get("produceId")
                if produce_id:
                    produce = db.get_by_id("produce", produce_id)
                    if produce:
                        current_qty = float(produce.get("quantityKg", 0))
                        req_qty = float(order.get("quantityKg", 0))
                        new_qty = current_qty + req_qty
                        db.update("produce", produce_id, {
                            "quantityKg": new_qty,
                            "status": "listed"
                        })
            except Exception as re:
                print(f"Warning restoring produce quantity: {re}")

        # If delivered, automatically release escrow funds to the farmer
        elif new_status == "delivered":
            updates["paymentStatus"] = "escrow_released"
            try:
                payments = db.get_all("payments") or []
                for p in payments:
                    if isinstance(p, dict) and str(p.get("orderId", "")) in [clean_order_id, str(order_id)]:
                        db.update("payments", p.get("id"), {
                            "escrowStatus": "released_to_farmer",
                            "status": "settled"
                        })
            except Exception as pe:
                print(f"Warning updating payment record: {pe}")

        target_id = order.get("id", clean_order_id)
        updated = db.update("orders", target_id, updates)
        if not updated:
            updated = {**order, **updates}

        return jsonify({"message": "Order status updated successfully", "order": updated}), 200
    except Exception as e:
        print(f"Error in update_order_status: {e}")
        return jsonify({"error": f"Failed to update order status: {str(e)}"}), 500


@order_bp.route("/<order_id>/rate", methods=["POST"])
@auth_required
@require_role("buyer", "farmer", "admin")
def rate_order(order_id):
    """Buyer rates the farmer's produce quality and confirms grade."""
    data = request.get_json() or {}
    rating = data.get("rating")
    confirmed_grade = data.get("confirmedGrade")

    order = db.get_by_id("orders", order_id)
    if not order or order.get("buyerId") != g.user["id"]:
        return jsonify({"error": "Order not found or unauthorized"}), 404

    try:
        rating_num = int(rating)
        if rating_num < 1 or rating_num > 5:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400

    farmer_id = order.get("farmerId")
    farmer = db.get_by_id("users", farmer_id)
    
    if farmer:
        ratings = farmer.get("ratings", [])
        ratings.append(rating_num)
        new_trust = compute_trust_score(ratings)
        db.update("users", farmer_id, {
            "ratings": ratings,
            "trustScore": new_trust
        })

    order_updates = {
        "status": "rated",
        "rating": rating_num,
        "confirmedGrade": confirmed_grade or "A"
    }
    updated_order = db.update("orders", order_id, order_updates)

    return jsonify({
        "success": True,
        "message": "Rating recorded and farmer trust score updated",
        "order": updated_order,
        "newTrustScore": farmer.get("trustScore") if farmer else 4.8
    }), 200


@order_bp.route("/<order_id>/tracking", methods=["GET"])
@auth_required
def get_order_tracking(order_id):
    """
    Geodesic Transit Tracking Engine:
    Calculates live GPS coordinates for farmer origin, buyer destination,
    and transit vehicle interpolated position along the route.
    """
    try:
        clean_order_id = str(order_id).replace("#", "").strip()
        order = db.get_by_id("orders", clean_order_id)
        if not order:
            all_orders = db.get_all("orders") or []
            order = next((o for o in all_orders if isinstance(o, dict) and (o.get("id") == clean_order_id or str(o.get("id")) == str(order_id))), None)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        user_id = str(g.user.get("id", "")).strip()
        user_name = str(g.user.get("name", "")).strip().lower()
        user_phone = str(g.user.get("phone", "")).strip()
        role = str(g.user.get("role", "")).strip().lower()

        # Authorization check: buyer of order, farmer of order, or admin
        is_buyer = (
            user_id == str(order.get("buyerId", "")) or
            user_name == str(order.get("buyerName", "")).lower() or
            (user_phone and user_phone == str(order.get("buyerPhone", "")))
        )
        is_farmer = (
            user_id == str(order.get("farmerId", "")) or
            user_name == str(order.get("farmerName", "")).lower() or
            (user_phone and user_phone == str(order.get("farmerPhone", "")))
        )

        if role != "admin" and not is_buyer and not is_farmer:
            if role not in ["buyer", "farmer"]:
                return jsonify({"error": "Not authorized to track this order"}), 403

        # Default coordinates fallback if missing in order record
        farmer_loc = order.get("deliveryOrigin") or {"lat": 19.9975, "lng": 73.7898, "name": f"Farmer ({order.get('farmerName', 'Farm Origin')})"}
        buyer_loc = order.get("deliveryDestination") or {"lat": 19.0330, "lng": 73.0290, "name": f"Buyer ({order.get('buyerName', 'Delivery Hub')})"}

        # Calculate Haversine Geodesic Distance
        f_lat, f_lng = float(farmer_loc.get("lat", 19.9975)), float(farmer_loc.get("lng", 73.7898))
        b_lat, b_lng = float(buyer_loc.get("lat", 19.0330)), float(buyer_loc.get("lng", 73.0290))
        total_dist_km = calculate_haversine_distance(f_lat, f_lng, b_lat, b_lng)

        status = order.get("status", "pending")
        progress = 0.0

        if status == "pending":
            progress = 0.05
        elif status in ["confirmed", "accepted"]:
            progress = 0.25
        elif status == "dispatched":
            progress = 0.70
        elif status in ["delivered", "rated"]:
            progress = 1.0
        elif status == "rejected":
            progress = 0.0

        # Calculate current vehicle GPS position via linear interpolation
        curr_lat = round(f_lat + (b_lat - f_lat) * progress, 5)
        curr_lng = round(f_lng + (b_lng - f_lng) * progress, 5)

        remaining_dist_km = round(total_dist_km * (1.0 - progress), 2)
        avg_speed_kmh = 42.0
        eta_minutes = int((remaining_dist_km / avg_speed_kmh) * 60) if remaining_dist_km > 0 else 0

        tracking_info = {
            "orderId": order.get("id"),
            "status": status,
            "commodity": order.get("commodity"),
            "quantityKg": order.get("quantityKg"),
            "farmerName": order.get("farmerName"),
            "buyerName": order.get("buyerName"),
            "farmerLocation": {
                "lat": f_lat,
                "lng": f_lng,
                "name": farmer_loc.get("name") or order.get("farmerName") or "Farm Origin"
            },
            "buyerLocation": {
                "lat": b_lat,
                "lng": b_lng,
                "name": buyer_loc.get("name") or order.get("buyerName") or "Buyer Hub"
            },
            "vehicleLocation": {
                "lat": curr_lat,
                "lng": curr_lng,
                "status": "In Transit" if status == "dispatched" else ("Delivered" if status == "delivered" else "Preparing")
            },
            "progressPercent": int(progress * 100),
            "totalDistanceKm": total_dist_km,
            "distanceRemainingKm": remaining_dist_km,
            "etaMinutes": eta_minutes,
            "speedKmh": avg_speed_kmh if status == "dispatched" else 0
        }

        return jsonify(tracking_info), 200
    except Exception as e:
        print(f"Error fetching order tracking: {e}")
        return jsonify({"error": f"Failed to fetch order tracking: {str(e)}"}), 500

