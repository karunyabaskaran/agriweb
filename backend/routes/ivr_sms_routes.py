from flask import Blueprint, request, jsonify
from backend.db.firebase_db import db
from backend.utils.helpers import new_id, current_iso_time

ivr_sms_bp = Blueprint("ivr_sms", __name__, url_prefix="/api/ivr")

@ivr_sms_bp.route("/sms", methods=["POST"])
def handle_sms():
    """Mock webhook for Twilio SMS."""
    # Twilio sends form data, we will simulate it with JSON for testing if form data is missing
    body = request.form.get("Body", request.json.get("Body", "") if request.is_json else "")
    from_number = request.form.get("From", request.json.get("From", "") if request.is_json else "")

    if not body:
        return "<Response><Message>Invalid command.</Message></Response>", 400

    parts = body.strip().upper().split()
    if len(parts) >= 3 and parts[0] == "SELL":
        commodity = parts[1]
        try:
            qty = float(parts[2])
            # Find farmer by phone number (mocking matching)
            farmer = next((u for u in db.get_all("users") if u.get("role") == "farmer" and from_number.endswith(u.get("phone", ""))), None)
            
            if farmer:
                produce_id = new_id("prod")
                new_produce = {
                    "id": produce_id,
                    "farmerId": farmer["id"],
                    "farmerName": farmer["name"],
                    "farmerPhone": farmer["phone"],
                    "commodity": commodity.capitalize(),
                    "quantityKg": qty,
                    "askingPricePerKg": 0, # To be updated later by farmer
                    "status": "listed",
                    "createdAt": current_iso_time()
                }
                db.save("produce", produce_id, new_produce)
                response_msg = f"Successfully listed {qty}kg of {commodity}."
            else:
                response_msg = "Error: Farmer account not found for this number."
        except ValueError:
            response_msg = "Error: Invalid quantity."
    else:
        response_msg = "Send 'SELL [CROP] [QTY]' to list your produce."

    # Return TwiML
    return f"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message>{response_msg}</Message></Response>", 200

@ivr_sms_bp.route("/voice", methods=["POST"])
def handle_voice():
    """Mock webhook for Twilio Voice / IVR."""
    # TwiML for an automated voice menu
    twiml = """<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Gather numDigits="1" action="/api/ivr/voice/process" method="POST">
            <Say language="hi-IN">KisanSetu mein aapka swagat hai. Fasal bechne ke liye ek dabayein. Mandi bhav janne ke liye do dabayein.</Say>
        </Gather>
    </Response>
    """
    return twiml, 200
