import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 5000))
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    SECRET_KEY = os.getenv("SECRET_KEY", "kisansetu-super-secret-key-2026")
    JWT_SECRET = os.getenv("JWT_SECRET", "kisansetu-jwt-secret-token-key-sih-2026")
    
    # Firebase & Supabase settings
    FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "")
    FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    
    # Razorpay & Stripe settings
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_kisansetu123")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "secret_kisansetu_test")
    STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_kisansetu123")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_kisansetu123")
    
    # Maps settings
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
    USE_OPENSTREETMAP = os.getenv("USE_OPENSTREETMAP", "true").lower() == "true"
    
    # Paths
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
    DB_FILE = os.path.join(os.path.dirname(__file__), "db", "db.json")
