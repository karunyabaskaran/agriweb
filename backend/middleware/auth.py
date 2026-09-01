import jwt
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify, g
from backend.config import Config

JWT_SECRET = Config.JWT_SECRET

def generate_token(user):
    """Generates a 7-day JWT token containing user identity and role."""
    payload = {
        "id": user["id"],
        "role": user["role"],
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def auth_required(f):
    """Decorator ensuring request contains a valid Bearer JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401
        
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid token format, expected 'Bearer <token>'"}), 401
        
        token = parts[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            g.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired, please log in again"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authorization token"}), 401
        
        return f(*args, **kwargs)
    return decorated

def require_role(*roles):
    """Decorator ensuring authenticated user has one of the allowed roles."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, "user") or not g.user:
                return jsonify({"error": "Authentication required"}), 401
            
            user_role = g.user.get("role")
            if user_role not in roles:
                return jsonify({"error": f"Access restricted. Required role(s): {', '.join(roles)}"}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator
