import requests
from flask import Blueprint, request, jsonify
from backend.config import Config
from backend.db.firebase_db import db
from backend.utils.helpers import calculate_haversine_distance

map_bp = Blueprint("maps", __name__, url_prefix="/api/maps")

@map_bp.route("/config", methods=["GET"])
def get_map_config():
    """Returns maps integration configuration."""
    return jsonify({
        "useOpenStreetMap": True,
        "tileServer": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "googleMapsEnabled": bool(Config.GOOGLE_MAPS_API_KEY),
        "googleMapsApiKey": Config.GOOGLE_MAPS_API_KEY if Config.GOOGLE_MAPS_API_KEY else None
    }), 200

@map_bp.route("/nodes", methods=["GET"])
def get_map_nodes():
    """Returns geocoded locations of all actors across the agri supply chain."""
    produce_list = db.get_all("produce")
    mandi_prices = db.get_all("mandiPrices")
    pools = db.get_all("pools")
    users = db.get_all("users")

    nodes = []

    # 1. Farmers / Produce Lots
    for p in produce_list:
        coords = p.get("coordinates")
        if coords and "lat" in coords and "lng" in coords:
            nodes.append({
                "id": p.get("id"),
                "type": "farmer_lot",
                "title": f"🌾 {p.get('farmerName')} ({p.get('commodity')})",
                "commodity": p.get("commodity"),
                "quantityKg": p.get("quantityKg"),
                "pricePerKg": p.get("askingPricePerKg"),
                "grade": p.get("grade"),
                "locationName": p.get("village"),
                "state": p.get("state"),
                "lat": coords["lat"],
                "lng": coords["lng"],
                "status": p.get("status")
            })

    # 2. Mandi Wholesale Hubs
    for m in mandi_prices:
        if "lat" in m and "lng" in m:
            nodes.append({
                "id": f"mandi-{m.get('commodity')}-{m.get('state')}",
                "type": "mandi",
                "title": f"🏢 {m.get('mandi')}",
                "commodity": m.get("commodity"),
                "pricePerKg": m.get("pricePerKg"),
                "retailPricePerKg": m.get("retailPricePerKg"),
                "locationName": m.get("mandi"),
                "state": m.get("state"),
                "lat": m["lat"],
                "lng": m["lng"]
            })

    # 3. Aggregation Pooling Hubs
    for pool in pools:
        coords = pool.get("hubCoordinates")
        if coords and "lat" in coords and "lng" in coords:
            nodes.append({
                "id": pool.get("id"),
                "type": "pooling_hub",
                "title": f"📦 Pooling Hub: {pool.get('village')} ({pool.get('commodity')})",
                "commodity": pool.get("commodity"),
                "pooledQuantityKg": pool.get("pooledQuantityKg"),
                "targetQuantityKg": pool.get("targetQuantityKg"),
                "locationName": pool.get("village"),
                "state": pool.get("state"),
                "lat": coords["lat"],
                "lng": coords["lng"],
                "status": pool.get("status")
            })

    # 4. Buyer Warehouses
    buyers = [u for u in users if u.get("role") == "buyer"]
    for b in buyers:
        coords = b.get("coordinates")
        if coords and "lat" in coords and "lng" in coords:
            nodes.append({
                "id": b.get("id"),
                "type": "buyer_warehouse",
                "title": f"🛒 {b.get('name')} (Delivery Hub)",
                "locationName": b.get("village", "Distribution Hub"),
                "state": b.get("state"),
                "lat": coords["lat"],
                "lng": coords["lng"]
            })

    return jsonify(nodes), 200

@map_bp.route("/route", methods=["POST"])
def calculate_route():
    """
    Calculates distance, duration, freight cost estimates,
    and returns waypoint path between origin and destination coordinates.
    """
    data = request.get_json() or {}
    origin_lat = data.get("originLat")
    origin_lng = data.get("originLng")
    dest_lat = data.get("destLat")
    dest_lng = data.get("destLng")
    weight_kg = float(data.get("weightKg", 1000))

    if None in [origin_lat, origin_lng, dest_lat, dest_lng]:
        # Provide default Nashik to Mumbai route
        origin_lat, origin_lng = 20.201, 73.834
        dest_lat, dest_lng = 19.033, 73.029

    origin_lat, origin_lng = float(origin_lat), float(origin_lng)
    dest_lat, dest_lng = float(dest_lat), float(dest_lng)

    # Calculate direct great-circle distance
    haversine_dist = calculate_haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    
    # Road routing factor (approx 1.25x haversine)
    road_distance_km = round(max(5.0, haversine_dist * 1.25), 1)
    
    # Estimated transit time (averaging 42 km/h for commercial agro trucks)
    transit_hours = round(road_distance_km / 42.0, 1)
    
    # Generate route polyline points (interpolated with realistic curvature)
    steps = 15
    route_points = []
    for i in range(steps + 1):
        t = i / steps
        # Linear interpolation with slight bezier curve
        lat = origin_lat + t * (dest_lat - origin_lat)
        lng = origin_lng + t * (dest_lng - origin_lng)
        # Add slight natural road curvature
        curve = 0.08 * np_sin_approx(t)
        route_points.append({"lat": round(lat + curve, 5), "lng": round(lng, 5)})

    # Freight cost options
    freight_options = [
        {
            "vehicleType": "Mini Agro Truck (Tata Ace / Mahindra Bolero)",
            "capacityKg": 1500,
            "costPerKm": 14.0,
            "totalFreightCost": round(road_distance_km * 14.0, 2),
            "costPerKg": round((road_distance_km * 14.0) / max(weight_kg, 100), 2),
            "refrigerated": False
        },
        {
            "vehicleType": "3.5-Ton Commercial Agro Transporter",
            "capacityKg": 3500,
            "costPerKm": 24.0,
            "totalFreightCost": round(road_distance_km * 24.0, 2),
            "costPerKg": round((road_distance_km * 24.0) / max(weight_kg, 100), 2),
            "refrigerated": False
        },
        {
            "vehicleType": "Solar-Reefer Cold Chain Van (Zero Spoilage)",
            "capacityKg": 3000,
            "costPerKm": 32.0,
            "totalFreightCost": round(road_distance_km * 32.0, 2),
            "costPerKg": round((road_distance_km * 32.0) / max(weight_kg, 100), 2),
            "refrigerated": True
        }
    ]

    # Carbon emissions saved by direct route bypassing 3 unnecessary middleman trips
    carbon_saved_kg = round(road_distance_km * 0.42 * 2.8, 1)

    return jsonify({
        "origin": {"lat": origin_lat, "lng": origin_lng},
        "destination": {"lat": dest_lat, "lng": dest_lng},
        "roadDistanceKm": road_distance_km,
        "estimatedTransitHours": transit_hours,
        "carbonSavedKg": carbon_saved_kg,
        "freightOptions": freight_options,
        "routePoints": route_points
    }), 200

def np_sin_approx(t):
    import math
    return math.sin(t * math.pi)
