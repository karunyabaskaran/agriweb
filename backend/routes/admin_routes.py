from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/price-caps", methods=["GET", "POST"])
def manage_price_caps():
    """Get or Set global price caps to regulate selling."""
    if request.method == "GET":
        caps = db.get_all("priceCaps")
        return jsonify(caps), 200

    if request.method == "POST":
        data = request.json
        commodity = data.get("commodity")
        max_price = data.get("maxPricePerKg")

        if not commodity or max_price is None:
            return jsonify({"error": "Commodity and maxPricePerKg required"}), 400

        cap = {
            "id": f"cap_{commodity.lower()}",
            "commodity": commodity,
            "maxPricePerKg": float(max_price)
        }
        db.update("priceCaps", cap["id"], cap)
        return jsonify({"message": "Price cap updated", "cap": cap}), 200

@admin_bp.route("/farmers", methods=["GET"])
@auth_required
@require_role("admin")
def get_all_farmers_summary():
    """
    Returns list of all farmers with total order counts, revenue,
    active produce listings, trust scores, and ban status.
    """
    try:
        users = db.get_all("users") or []
        farmers = [u for u in users if isinstance(u, dict) and u.get("role") == "farmer"]

        all_orders = db.get_all("orders") or []
        all_produce = db.get_all("produce") or []

        summary = []
        for f in farmers:
            f_id = f.get("id")
            f_phone = f.get("phone", "")

            # Count orders placed for this farmer
            farmer_orders = [
                o for o in all_orders
                if isinstance(o, dict) and (o.get("farmerId") == f_id or (f_phone and o.get("farmerPhone") == f_phone))
            ]

            active_listings = [
                p for p in all_produce
                if isinstance(p, dict) and (p.get("farmerId") == f_id or (f_phone and p.get("farmerPhone") == f_phone))
            ]

            total_revenue = sum(float(o.get("totalPrice", 0)) for o in farmer_orders if o.get("status") in ["confirmed", "dispatched", "delivered"])

            summary.append({
                "id": f_id,
                "name": f.get("name"),
                "phone": f.get("phone"),
                "village": f.get("village", "N/A"),
                "state": f.get("state", "N/A"),
                "trustScore": f.get("trustScore", 4.5),
                "totalOrders": len(farmer_orders),
                "totalRevenue": round(total_revenue, 2),
                "activeListings": len(active_listings),
                "isBanned": bool(f.get("isBanned", False))
            })

        return jsonify(summary), 200
    except Exception as e:
        print(f"Error fetching admin farmers summary: {e}")
        return jsonify({"error": str(e)}), 500


@admin_bp.route("/farmers/<farmer_id>/ban", methods=["POST"])
@auth_required
@require_role("admin")
def toggle_ban_farmer(farmer_id):
    """Ban or unban a farmer account."""
    try:
        farmer = db.get_by_id("users", farmer_id)
        if not farmer:
            all_u = db.get_all("users") or []
            farmer = next((u for u in all_u if isinstance(u, dict) and (u.get("id") == farmer_id or str(u.get("id")) == str(farmer_id))), None)

        if not farmer:
            return jsonify({"error": "Farmer account not found"}), 404

        current_banned = bool(farmer.get("isBanned", False))
        new_banned = not current_banned

        target_id = farmer.get("id", farmer_id)
        db.update("users", target_id, {"isBanned": new_banned})

        # If banned, remove active listings
        if new_banned:
            all_produce = db.get_all("produce") or []
            for p in all_produce:
                if isinstance(p, dict) and (p.get("farmerId") == target_id or p.get("farmerPhone") == farmer.get("phone")):
                    db.remove("produce", p.get("id"))

        status_str = "banned and listings deactivated" if new_banned else "unbanned"
        return jsonify({"message": f"Farmer account {status_str} successfully", "isBanned": new_banned}), 200
    except Exception as e:
        print(f"Error banning farmer: {e}")
        return jsonify({"error": str(e)}), 500
