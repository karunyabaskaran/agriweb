from flask import Blueprint, request, jsonify
from backend.ml import price_predictor, quality_grader, demand_forecaster

ml_bp = Blueprint("ml", __name__, url_prefix="/api/ml")

@ml_bp.route("/predict-price", methods=["POST"])
def predict_price_endpoint():
    """Predicts Mandi wholesale benchmark, fair farmer asking price, and retail price."""
    data = request.get_json() or {}
    commodity = data.get("commodity", "Tomato")
    state = data.get("state", "Maharashtra")
    month = data.get("month", 8)
    rainfall_dev = data.get("rainfallDeviation", 0)
    supply_factor = data.get("supplyFactor", 1.0)
    current_asking = data.get("currentAskingPrice")

    if current_asking is not None:
        try:
            current_asking = float(current_asking)
        except ValueError:
            current_asking = None

    prediction = price_predictor.predict_price(
        commodity=commodity,
        state=state,
        month=month,
        rainfall_deviation=rainfall_dev,
        supply_factor=supply_factor,
        current_asking=current_asking
    )

    return jsonify(prediction), 200

@ml_bp.route("/grade-produce", methods=["POST"])
def grade_produce_endpoint():
    """Predicts quality grade (A/B/C), freshness score (0-100), and remaining shelf life."""
    data = request.get_json() or {}
    commodity = data.get("commodity", "Tomato")
    storage = data.get("storageType", "Ventilated Crate")
    harvest_days = data.get("daysSinceHarvest", 2)
    blemish = data.get("blemishPercent", 5)
    moisture = data.get("moisturePercent", 85)
    uniformity = data.get("sizeUniformityPercent", 90)

    result = quality_grader.grade_produce(
        commodity=commodity,
        storage_type=storage,
        days_since_harvest=harvest_days,
        blemish_percent=blemish,
        moisture_percent=moisture,
        size_uniformity_percent=uniformity
    )

    return jsonify(result), 200

@ml_bp.route("/forecast-demand", methods=["POST"])
def forecast_demand_endpoint():
    """Forecasts market demand pressure and price movement over 7 & 14 days."""
    data = request.get_json() or {}
    commodity = data.get("commodity", "Tomato")
    state = data.get("state", "Maharashtra")

    forecast = demand_forecaster.forecast_demand(commodity=commodity, state=state)
    return jsonify(forecast), 200

@ml_bp.route("/models-info", methods=["GET"])
def get_models_info():
    """Returns AI/ML model architecture and pipeline details."""
    return jsonify({
        "framework": "scikit-learn (Python 3)",
        "models": [
            {
                "name": "AgroPriceForecast-RF",
                "algorithm": "RandomForestRegressor + ColumnTransformer + OneHotEncoder",
                "features": ["Commodity", "State", "Month", "RainfallAnomaly", "SupplyIndex"],
                "target": "Wholesale Mandi Price (₹/kg) & Fair Farmer Direct Price"
            },
            {
                "name": "AgriGrade-Classifier",
                "algorithm": "RandomForestClassifier / DecisionTree",
                "features": ["Commodity", "StorageCondition", "DaysSinceHarvest", "BlemishPercent", "MoisturePercent", "SizeUniformity"],
                "target": "Grade (A/B/C) + Freshness Score (0-100)"
            },
            {
                "name": "DemandPressure-Engine",
                "algorithm": "Urban Inflow Analysis & Time-Series Seasonality",
                "features": ["Metro Consumption Hubs", "Arrival Inflow"],
                "target": "Demand Index & Optimal Holding Window"
            }
        ],
        "status": "online"
    }), 200
