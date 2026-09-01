from flask import Blueprint, jsonify
from backend.db.firebase_db import db

price_bp = Blueprint("prices", __name__, url_prefix="/api/prices")

@price_bp.route("", methods=["GET"])
def get_price_transparency():
    """
    Core Price Transparency Radar:
    Returns wholesale Mandi price, average farmer asking price on KisanSetu,
    and retail consumer price for each agricultural commodity.
    Kills the information asymmetry that middlemen exploit.
    """
    mandi_prices = db.get_all("mandiPrices")
    produce_list = db.get_all("produce")

    results = []
    for m in mandi_prices:
        comm = m.get("commodity", "").lower()
        active_listings = [
            p for p in produce_list
            if p.get("commodity", "").lower() == comm and p.get("status") != "sold"
        ]

        if active_listings:
            avg_asking = round(
                sum(float(p.get("askingPricePerKg", 0)) for p in active_listings) / len(active_listings),
                2
            )
        else:
            avg_asking = round(float(m.get("pricePerKg", 0)) * 1.35, 2)

        mandi_p = float(m.get("pricePerKg", 0))
        retail_p = float(m.get("retailPricePerKg", 0))
        spread_pct = round(((retail_p - mandi_p) / retail_p) * 100, 1) if retail_p > 0 else 0
        farmer_gain_pct = round(((avg_asking - mandi_p) / mandi_p) * 100, 1) if mandi_p > 0 else 0
        middleman_margin_bypassed = round(retail_p - avg_asking, 2)

        results.append({
            "commodity": m.get("commodity"),
            "mandi": m.get("mandi"),
            "state": m.get("state"),
            "lat": m.get("lat"),
            "lng": m.get("lng"),
            "mandiPricePerKg": mandi_p,
            "avgFarmerAskingPricePerKg": avg_asking,
            "retailPricePerKg": retail_p,
            "mandiToRetailSpreadPercent": spread_pct,
            "farmerEarningUpliftPercent": farmer_gain_pct,
            "middlemanMarginBypassedPerKg": middleman_margin_bypassed,
            "updatedAt": m.get("updatedAt")
        })

    return jsonify(results), 200
