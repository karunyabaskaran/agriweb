from backend.routes.auth_routes import auth_bp
from backend.routes.produce_routes import produce_bp
from backend.routes.order_routes import order_bp
from backend.routes.price_routes import price_bp
from backend.routes.logistics_routes import logistics_bp
from backend.routes.advance_routes import advance_bp
from backend.routes.ml_routes import ml_bp
from backend.routes.map_routes import map_bp
from backend.routes.payment_routes import payment_bp
from backend.routes.analytics_routes import analytics_bp
from backend.routes.pooling_routes import pooling_bp
from backend.routes.ivr_sms_routes import ivr_sms_bp
from backend.routes.admin_routes import admin_bp

__all__ = [
    "auth_bp",
    "produce_bp",
    "order_bp",
    "price_bp",
    "logistics_bp",
    "advance_bp",
    "ml_bp",
    "map_bp",
    "payment_bp",
    "analytics_bp",
    "pooling_bp",
    "ivr_sms_bp",
    "admin_bp"
]
