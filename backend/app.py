import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.routes import (
    auth_bp,
    produce_bp,
    order_bp,
    price_bp,
    logistics_bp,
    advance_bp,
    ml_bp,
    map_bp,
    payment_bp,
    analytics_bp,
    pooling_bp,
    ivr_sms_bp,
    admin_bp,
    support_bp
)

def create_app():
    app = Flask(__name__, static_folder=Config.FRONTEND_DIR)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Add Security Headers
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        # Basic CSP for a static app - adjust in production
        response.headers['Content-Security-Policy'] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com;"
        if os.environ.get("ENFORCE_SSL") == "true":
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(produce_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(price_bp)
    app.register_blueprint(logistics_bp)
    app.register_blueprint(advance_bp)
    app.register_blueprint(ml_bp)
    app.register_blueprint(map_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(pooling_bp)
    app.register_blueprint(ivr_sms_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(support_bp)


    # Health check
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "KisanSetu Full-Stack Agro-Marketplace",
            "version": "2.0.0",
            "ai_engine": "scikit-learn active",
            "maps_engine": "Leaflet / OSM & Google Maps",
            "database": "Firebase Firestore / Persistent Local Engine"
        }), 200

    # Serve static frontend SPA
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path != "" and os.path.exists(os.path.join(Config.FRONTEND_DIR, path)):
            return send_from_directory(Config.FRONTEND_DIR, path)
        return send_from_directory(Config.FRONTEND_DIR, "index.html")

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource or endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    port = Config.PORT
    print(f"Starting KisanSetu Flask server on http://localhost:{port} ...")
    app.run(host="0.0.0.0", port=port, debug=True)
