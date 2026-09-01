from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time, compute_trust_score

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

@order_bp.route("", methods=["POST"])
@auth_required
@require_role("buyer", "farmer", "admin")
def create_order():
    """Buyer places a direct order on a listed produce lot."""
    data = request.get_json() or {}
    produce_id = data.get("produceId")
    quantity_kg = data.get("quantityKg")

    if not produce_id or not quantity_kg:
        return jsonify({"error": "produceId and quantityKg are required"}), 400

    try:
        req_qty = float(quantity_kg)
    except ValueError:
        return jsonify({"error": "Invalid quantityKg"}), 400

    produce = db.get_by_id("produce", produce_id)
    if not produce or produce.get("status") not in ["listed", "pooled"]:
        return jsonify({"error": "This produce listing is not available"}), 404

    avail_qty = float(produce.get("quantityKg", 0))
    if req_qty <= 0 or req_qty > avail_qty:
        return jsonify({"error": f"Requested quantity ({req_qty}kg) exceeds available ({avail_qty}kg)"}), 400

    buyer = db.get_by_id("users", g.user["id"])
    buyer_name = buyer.get("name", g.user.get("name", "Buyer"))
    unit_price = float(produce.get("askingPricePerKg", 0))
    total_price = round(req_qty * unit_price, 2)

    order_id = f"ord-{new_id()[:8]}"
    transaction_id = f"TXN_{order_id.upper()}"

    origin = produce.get("coordinates") or {"lat": 19.076, "lng": 72.877, "name": produce.get("village")}
    dest = buyer.get("coordinates") or {"lat": 19.033, "lng": 73.029, "name": buyer.get("village", "Buyer Hub")}

    order = {
        "id": order_id,
        "produceId": produce_id,
        "commodity": produce.get("commodity"),
        "variety": produce.get("variety", ""),
        "farmerId": produce.get("farmerId"),
        "farmerName": produce.get("farmerName"),
        "buyerId": g.user["id"],
        "buyerName": buyer_name,
        "quantityKg": req_qty,
        "pricePerKg": unit_price,
        "totalPrice": total_price,
        "status": "confirmed", # confirmed -> dispatched -> delivered -> rated
        "paymentStatus": "held_in_escrow", # held_in_escrow -> released_to_farmer
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
        "method": data.get("paymentMethod", "UPI / Escrow"),
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
def update_order_status():
    """Update order status (dispatched, delivered, cancelled)."""
    data = request.get_json() or {}
    new_status = data.get("status")
    order = db.get_by_id("orders", order_id:=request.view_args["order_id"])

    if not order:
        return jsonify({"error": "Order not found"}), 404

    user_id = g.user["id"]
    role = g.user.get("role")
    if role != "admin" and order.get("farmerId") != user_id and order.get("buyerId") != user_id:
        return jsonify({"error": "Not authorized to update this order"}), 403

    valid_statuses = ["confirmed", "dispatched", "delivered", "cancelled"]
    if new_status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

    updates = {"status": new_status}

    # If delivered, automatically release escrow funds to the farmer
    if new_status == "delivered":
        updates["paymentStatus"] = "escrow_released"
        # Update matching payment entry
        payments = db.get_all("payments")
        for p in payments:
            if p.get("orderId") == order_id:
                db.update("payments", p.get("id"), {
                    "escrowStatus": "released_to_farmer",
                    "status": "settled"
                })

    updated = db.update("orders", order_id, updates)
    return jsonify(updated), 200

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
