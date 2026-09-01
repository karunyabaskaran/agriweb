from flask import Blueprint, request, jsonify
from backend.db.firebase_db import db

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
        db.save("priceCaps", cap["id"], cap)
        return jsonify({"message": "Price cap updated", "cap": cap}), 200
