import bcrypt
from flask import Blueprint, request, jsonify, g
from backend.db.firebase_db import db
from backend.middleware.auth import generate_token, auth_required
from backend.utils.helpers import new_id, current_iso_time

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role")
    village = data.get("village", "")
    state = data.get("state", "")
    language = data.get("language", "en")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name or not phone or not password or not role:
        return jsonify({"error": "name, phone, password and role are required"}), 400

    clean_phone = str(phone).strip()
    if role not in ["farmer", "buyer", "admin"]:
        return jsonify({"error": "role must be farmer, buyer, or admin"}), 400

    # Check if user exists
    users = db.get_all("users")
    for u in users:
        if str(u.get("phone", "")).strip() == clean_phone:
            return jsonify({"error": "An account with this mobile number already exists"}), 409

    # Hash password
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    coordinates = None
    if lat and lng:
        coordinates = {"lat": float(lat), "lng": float(lng)}
    else:
        # Default coordinates for demo
        coordinates = {"lat": 19.076, "lng": 72.877}

    user = {
        "id": new_id(),
        "name": name,
        "phone": clean_phone,
        "passwordHash": password_hash,
        "role": role,
        "village": village,
        "state": state,
        "coordinates": coordinates,
        "language": language,
        "trustScore": 4.5,
        "ratings": [5, 4],
        "createdAt": current_iso_time()
    }

    db.insert("users", user)
    token = generate_token(user)

    safe_user = {k: v for k, v in user.items() if k != "passwordHash"}
    return jsonify({"message": "Account created successfully", "token": token, "user": safe_user}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "phone and password are required"}), 400

    clean_phone = str(phone).strip()
    users = db.get_all("users")
    user = next((u for u in users if str(u.get("phone", "")).strip() == clean_phone), None)

    if not user:
        return jsonify({"error": "Invalid mobile number or password"}), 401

    if user.get("isBanned"):
        return jsonify({"error": "This account has been deactivated/banned by Ministry Administration."}), 403



    try:

        stored_hash = user.get("passwordHash", "")
        if not stored_hash or not bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return jsonify({"error": "Invalid mobile number or password"}), 401
    except Exception as e:
        return jsonify({"error": "Invalid mobile number or password"}), 401

    token = generate_token(user)
    safe_user = {k: v for k, v in user.items() if k != "passwordHash"}
    return jsonify({"token": token, "user": safe_user}), 200

@auth_bp.route("/me", methods=["GET"])
@auth_required
def get_me():
    user = db.get_by_id("users", g.user["id"])
    if not user:
        return jsonify({"error": "User not found"}), 404
    safe_user = {k: v for k, v in user.items() if k != "passwordHash"}
    return jsonify({"user": safe_user}), 200

@auth_bp.route("/demo-users", methods=["GET"])
def get_demo_users():
    """Returns sample demo users for instant 1-click persona testing."""
    users = db.get_all("users")
    safe_users = [{k: v for k, v in u.items() if k != "passwordHash"} for u in users]
    return jsonify(safe_users), 200
