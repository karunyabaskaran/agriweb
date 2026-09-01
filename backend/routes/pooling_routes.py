from flask import Blueprint, request, jsonify
from backend.db.firebase_db import db
from backend.utils.helpers import new_id, current_iso_time

pooling_bp = Blueprint("pooling", __name__, url_prefix="/api/pools")

@pooling_bp.route("", methods=["GET"])
def get_pools():
    """Retrieve all open produce pools for aggregation."""
    pools = db.get_all("pools")
    return jsonify(pools), 200

@pooling_bp.route("", methods=["POST"])
def create_pool():
    """Create a new aggregation pool."""
    data = request.json
    commodity = data.get("commodity")
    village = data.get("village")
    target = data.get("targetQuantityKg", 10000)

    if not commodity or not village:
        return jsonify({"error": "Commodity and Village are required"}), 400

    pool = {
        "id": new_id("pool"),
        "commodity": commodity,
        "village": village,
        "state": data.get("state", "Unknown"),
        "targetQuantityKg": target,
        "pooledQuantityKg": 0,
        "memberFarmerIds": [],
        "status": "open",
        "createdAt": current_iso_time()
    }
    db.save("pools", pool["id"], pool)
    return jsonify({"message": "Pool created", "pool": pool}), 201

@pooling_bp.route("/<pool_id>/join", methods=["POST"])
def join_pool(pool_id):
    """Allow a farmer to join an existing pool with their produce."""
    data = request.json
    farmer_id = data.get("farmerId")
    quantity = data.get("quantityKg")

    if not farmer_id or not quantity:
        return jsonify({"error": "farmerId and quantityKg are required"}), 400

    pool = db.get_by_id("pools", pool_id)
    if not pool:
        return jsonify({"error": "Pool not found"}), 404

    pool["memberFarmerIds"].append(farmer_id)
    pool["pooledQuantityKg"] += float(quantity)

    # Check if target is met
    if pool["pooledQuantityKg"] >= pool["targetQuantityKg"]:
        pool["status"] = "ready_for_dispatch"

    db.save("pools", pool_id, pool)
    return jsonify({"message": "Successfully joined pool", "pool": pool}), 200
