import os
import sys

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # Try using waitress on Windows if available, else Flask dev server
    try:
        from waitress import serve
        print(f"Starting KisanSetu production server on port {port} via Waitress...")
        serve(app, host="0.0.0.0", port=port)
    except ImportError:
        print(f"Waitress not found, running with Flask server on port {port}...")
        app.run(host="0.0.0.0", port=port, debug=False)
