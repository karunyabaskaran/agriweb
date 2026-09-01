from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time

produce_bp = Blueprint("produce", __name__, url_prefix="/api/produce")

@produce_bp.route("", methods=["GET"])
def get_all_produce():
    """Browse marketplace open to all buyers and farmers with filters and Mandi comparison."""
    commodity = request.args.get("commodity", "").strip().lower()
    state = request.args.get("state", "").strip().lower()
    grade = request.args.get("grade", "").strip().upper()
    min_qty = request.args.get("minQty")
    search = request.args.get("search", "").strip().lower()

    items = db.get_all("produce")
    # Only show active listings (listed or pooled)
    items = [p for p in items if p.get("status") in ["listed", "pooled"]]

    if commodity:
        items = [p for p in items if p.get("commodity", "").lower() == commodity]
    if state:
        items = [p for p in items if p.get("state", "").lower() == state]
    if grade:
        items = [p for p in items if p.get("grade", "").upper() == grade]
    if min_qty:
        try:
            min_val = float(min_qty)
            items = [p for p in items if float(p.get("quantityKg", 0)) >= min_val]
        except ValueError:
            pass
    if search:
        items = [p for p in items if (
            search in p.get("commodity", "").lower() or
            search in p.get("variety", "").lower() or
            search in p.get("village", "").lower() or
            search in p.get("farmerName", "").lower()
        )]

    # Attach live Mandi reference comparison for price transparency
    mandi_prices = db.get_all("mandiPrices")
    enriched_items = []
    for p in items:
        p_comm = p.get("commodity", "").lower()
        mandi_match = next((m for m in mandi_prices if m.get("commodity", "").lower() == p_comm), None)
        
        mandi_ref = None
        if mandi_match:
            asking = float(p.get("askingPricePerKg", 0))
            mandi_p = float(mandi_match.get("pricePerKg", 0))
            retail_p = float(mandi_match.get("retailPricePerKg", 0))
            farmer_gain = round(((asking - mandi_p) / mandi_p) * 100, 1) if mandi_p > 0 else 0
            buyer_saving = round(((retail_p - asking) / retail_p) * 100, 1) if retail_p > 0 else 0
            
            mandi_ref = {
                "mandi": mandi_match.get("mandi"),
                "mandiPricePerKg": mandi_p,
                "retailPricePerKg": retail_p,
                "farmerUpliftVsMandi": f"+{farmer_gain}%",
                "buyerSavingsVsRetail": f"{buyer_saving}%",
                "updatedAt": mandi_match.get("updatedAt")
            }

        item_copy = dict(p)
        item_copy["mandiReference"] = mandi_ref
        enriched_items.append(item_copy)

    return jsonify(enriched_items), 200

@produce_bp.route("/mine", methods=["GET"])
@auth_required
@require_role("farmer")
def get_my_produce():
    """Farmer views their own produce listings."""
    items = db.get_all("produce")
    mine = [p for p in items if p.get("farmerId") == g.user["id"]]
    return jsonify(mine), 200

@produce_bp.route("/<item_id>", methods=["GET"])
def get_produce_details(item_id):
    """View details of a single produce lot."""
    item = db.get_by_id("produce", item_id)
    if not item:
        return jsonify({"error": "Produce not found"}), 404
    return jsonify(item), 200

@produce_bp.route("", methods=["POST"])
@auth_required
@require_role("farmer")
def create_produce():
    """Farmer posts a new produce lot."""
    try:
        data = request.get_json() or {}
        commodity = data.get("commodity")
        quantity_kg = data.get("quantityKg")
        asking_price = data.get("askingPricePerKg") if data.get("askingPricePerKg") is not None else data.get("directPricePerKg")
        variety = data.get("variety", "Standard Hybrid")
        grade = data.get("grade", "A")
        village = data.get("village") or data.get("location")
        state = data.get("state")
        harvest_date = data.get("harvestDate")
        shelf_life_days = data.get("shelfLifeDays", 10)
        lat = data.get("lat")
        lng = data.get("lng")

        if not commodity or quantity_kg is None or asking_price is None:
            return jsonify({"error": "commodity, quantityKg, and askingPricePerKg are required"}), 400

        try:
            qty_val = float(quantity_kg)
            price_val = float(asking_price)
        except ValueError:
            return jsonify({"error": "quantityKg and askingPricePerKg must be valid numbers"}), 400

        # Enforce Price Cap (Admin Phase 5)
        cap_id = f"cap_{str(commodity).strip().lower()}"
        cap = db.get_by_id("priceCaps", cap_id) or {}
        if isinstance(cap, dict) and cap.get("maxPricePerKg"):
            max_price = float(cap["maxPricePerKg"])
            if price_val > max_price:
                return jsonify({"error": f"Price exceeds admin enforced cap of ₹{max_price}/kg for {commodity}"}), 400

        farmer = db.get_by_id("users", g.user["id"]) or {}
        if not isinstance(farmer, dict):
            farmer = {}
        farmer_name = farmer.get("name") or g.user.get("name", "Farmer")
        farmer_phone = farmer.get("phone") or g.user.get("phone", "")
        farmer_trust = farmer.get("trustScore", 4.5)

        coords = farmer.get("coordinates") if isinstance(farmer, dict) else None
        if lat and lng:
            try:
                coords = {"lat": float(lat), "lng": float(lng)}
            except ValueError:
                coords = {"lat": 19.076, "lng": 72.877}
        elif not coords:
            coords = {"lat": 19.076, "lng": 72.877}

        item = {
            "id": new_id(),
            "farmerId": g.user["id"],
            "farmerName": farmer_name,
            "farmerPhone": farmer_phone,
            "farmerTrustScore": farmer_trust,
            "commodity": str(commodity).strip().title(),
            "variety": variety,
            "quantityKg": qty_val,
            "askingPricePerKg": price_val,
            "grade": str(grade).upper(),
            "village": village or farmer.get("village", "Farm Village") or "Farm Village",
            "state": state or farmer.get("state", "State") or "State",
            "coordinates": coords,
            "harvestDate": harvest_date,
            "shelfLifeDays": int(shelf_life_days) if str(shelf_life_days).isdigit() else 10,
            "status": "listed", # listed -> pooled -> sold
            "poolId": None,
            "imagePath": data.get("imagePath"), # Base64 Image
            "createdAt": current_iso_time()
        }

        db.insert("produce", item)
        return jsonify(item), 201
    except Exception as e:
        print(f"Error creating produce: {e}")
        return jsonify({"error": f"Failed to post product: {str(e)}"}), 500

@produce_bp.route("/<item_id>", methods=["PATCH"])
@auth_required
@require_role("farmer")
def update_produce(item_id):
    """Farmer updates their listing."""
    item = db.get_by_id("produce", item_id)
    if not item or item.get("farmerId") != g.user["id"]:
        return jsonify({"error": "Listing not found or unauthorized"}), 404

    data = request.get_json() or {}
    allowed_fields = ["quantityKg", "askingPricePerKg", "grade", "variety", "status", "shelfLifeDays"]
    updates = {}
    for key in allowed_fields:
        if key in data:
            if key in ["quantityKg", "askingPricePerKg"]:
                updates[key] = float(data[key])
            elif key == "shelfLifeDays":
                updates[key] = int(data[key])
            else:
                updates[key] = data[key]

    updated = db.update("produce", item_id, updates)
    return jsonify(updated), 200

@produce_bp.route("/<item_id>", methods=["DELETE"])
@auth_required
@require_role("farmer")
def delete_produce(item_id):
    """Farmer removes listing."""
    item = db.get_by_id("produce", item_id)
    if not item or item.get("farmerId") != g.user["id"]:
        return jsonify({"error": "Listing not found or unauthorized"}), 404

    db.remove("produce", item_id)
    return jsonify({"success": True, "message": "Listing removed"}), 200
