from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import auth_required, require_role
from backend.utils.helpers import new_id, current_iso_time
from backend.ml import demand_forecaster
from backend.ai.optimizer import RouteOptimizer

# Logistics Blueprint
logistics_bp = Blueprint('logistics', __name__, url_prefix='/api/logistics')

# Warehouses CRUD
@logistics_bp.route('/warehouses', methods=['POST'])
@auth_required
@require_role('admin')
def create_warehouse():
    data = request.get_json() or {}
    required_fields = ['id', 'name', 'location', 'capacity']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request'}), 400
    try:
        db.insert('warehouses', data)
        return jsonify({'message': 'Warehouse created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@logistics_bp.route('/warehouses', methods=['GET'])
def list_warehouses():
    try:
        rows = db.select('warehouses')
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vehicles CRUD
@logistics_bp.route('/vehicles', methods=['POST'])
@auth_required
@require_role('admin')
def create_vehicle():
    data = request.get_json() or {}
    required_fields = ['id', 'license_plate', 'capacity']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request'}), 400
    try:
        db.insert('vehicles', data)
        return jsonify({'message': 'Vehicle created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@logistics_bp.route('/vehicles', methods=['GET'])
def list_vehicles():
    try:
        rows = db.select('vehicles')
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Routes CRUD
@logistics_bp.route('/routes', methods=['POST'])
@auth_required
@require_role('admin')
def create_route():
    data = request.get_json() or {}
    required_fields = ['id', 'source_warehouse_id', 'destination_farm_id', 'vehicle_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request'}), 400
    try:
        db.insert('routes', data)
        return jsonify({'message': 'Route created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@logistics_bp.route('/routes', methods=['GET'])
def list_routes():
    try:
        rows = db.select('routes')
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Demand forecasts CRUD
@logistics_bp.route('/demand-forecasts', methods=['POST'])
@auth_required
@require_role('farmer')
def create_demand_forecast():
    data = request.get_json() or {}
    required_fields = ['id', 'produce_id', 'forecast_date', 'predicted_quantity']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in request'}), 400
    try:
        db.insert('demand_forecasts', data)
        return jsonify({'message': 'Demand forecast recorded'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@logistics_bp.route('/demand-forecasts', methods=['GET'])
def list_demand_forecasts():
    try:
        rows = db.select('demand_forecasts')
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI demand forecast wrapper (reuse existing ML endpoint)
@logistics_bp.route('/forecast-demand', methods=['POST'])
def forecast_demand():
    data = request.get_json() or {}
    commodity = data.get('commodity')
    state = data.get('state')
    if not commodity or not state:
        return jsonify({'error': 'commodity and state required'}), 400
    forecast = demand_forecaster.forecast_demand(commodity=commodity, state=state)
    return jsonify(forecast), 200

# Route optimization endpoint using AI
@logistics_bp.route('/optimize-route', methods=['POST'])
def optimize_route():
    data = request.get_json() or {}
    demand = data.get('demand')  # list of demand dicts
    vehicles = data.get('vehicles')
    warehouses = data.get('warehouses')
    if not demand or not vehicles or not warehouses:
        return jsonify({'error': 'demand, vehicles, and warehouses required'}), 400
    optimizer = RouteOptimizer()
    result = optimizer.optimize(demand, vehicles, warehouses)
    return jsonify(result), 200

# Pools Blueprint
pools_bp = Blueprint("pools", __name__, url_prefix="/api/pools")

@pools_bp.route("", methods=["GET"])
def get_pools():
    """Returns all village pooling clusters."""
    pools = db.get_all("pools")
    return jsonify(pools), 200

@logistics_bp.route("", methods=["POST"])
@auth_required
@require_role("farmer")
def create_pool():
    """Farmer establishes a new village aggregation pool."""
    data = request.get_json() or {}
    commodity = data.get("commodity")
    village = data.get("village")
    state = data.get("state", "")
    target_qty = data.get("targetQuantityKg")
    lat = data.get("lat")
    lng = data.get("lng")

    if not commodity or not village or not target_qty:
        return jsonify({"error": "commodity, village, and targetQuantityKg are required"}), 400

    try:
        target_num = float(target_qty)
    except ValueError:
        return jsonify({"error": "Invalid targetQuantityKg"}), 400

    hub_coords = {"lat": float(lat), "lng": float(lng)} if lat and lng else {"lat": 20.201, "lng": 73.834}

    pool = {
        "id": f"pool-{new_id()[:8]}",
        "commodity": commodity.strip().title(),
        "village": village,
        "state": state,
        "hubCoordinates": hub_coords,
        "targetQuantityKg": target_num,
        "pooledQuantityKg": 0,
        "memberFarmerIds": [g.user["id"]],
        "status": "open", # open -> full -> dispatching -> completed
        "freightSavingPercent": 32.0,
        "createdAt": current_iso_time()
    }

    db.insert("pools", pool)
    return jsonify(pool), 201

@logistics_bp.route("/<pool_id>/join", methods=["POST"])
@auth_required
@require_role("farmer")
def join_pool(pool_id):
    """Farmer adds one of their produce listings into a pool."""
    data = request.get_json() or {}
    produce_id = data.get("produceId")

    pool = db.get_by_id("pools", pool_id)
    if not pool or pool.get("status") != "open":
        return jsonify({"error": "This pool is not open for joining"}), 404

    produce = db.get_by_id("produce", produce_id)
    if not produce or produce.get("farmerId") != g.user["id"]:
        return jsonify({"error": "Listing not found or unauthorized"}), 404

    if produce.get("commodity", "").lower() != pool.get("commodity", "").lower():
        return jsonify({"error": f"Produce commodity ({produce.get('commodity')}) must match pool ({pool.get('commodity')})"}), 400

    # Update produce status to pooled
    db.update("produce", produce_id, {
        "status": "pooled",
        "poolId": pool_id
    })

    # Update pool volume and members
    current_pooled = float(pool.get("pooledQuantityKg", 0)) + float(produce.get("quantityKg", 0))
    target = float(pool.get("targetQuantityKg", 1000))
    members = list(set(pool.get("memberFarmerIds", []) + [g.user["id"]]))
    status = "full" if current_pooled >= target else "open"

    updated_pool = db.update("pools", pool_id, {
        "pooledQuantityKg": current_pooled,
        "memberFarmerIds": members,
        "status": status
    })

    return jsonify({
        "success": True,
        "message": f"Successfully joined pool. Total pooled: {current_pooled}kg / {target}kg",
        "pool": updated_pool
    }), 200
