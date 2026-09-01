const express = require("express");
const router = express.Router();
const db = require("../db/database");

/**
 * GET /api/prices
 * Returns mandi price, average farmer asking price on the platform, and
 * retail reference price for each commodity — the core "price transparency"
 * feature that removes information asymmetry.
 *
 * In production, `mandiPrices` would be refreshed periodically from the
 * Agmarknet/eNAM public API (https://data.gov.in) instead of the seed file.
 */
router.get("/", (req, res) => {
  const mandiPrices = db.getAll("mandiPrices");
  const produce = db.getAll("produce");

  const result = mandiPrices.map((m) => {
    const platformListings = produce.filter(
      (p) => p.commodity.toLowerCase() === m.commodity.toLowerCase() && p.status !== "sold"
    );
    const avgFarmerAsking =
      platformListings.length > 0
        ? Math.round(
            (platformListings.reduce((sum, p) => sum + p.askingPricePerKg, 0) / platformListings.length) * 100
          ) / 100
        : null;

    return {
      commodity: m.commodity,
      mandi: m.mandi,
      state: m.state,
      mandiPricePerKg: m.pricePerKg,
      avgFarmerAskingPricePerKg: avgFarmerAsking,
      retailPricePerKg: m.retailPricePerKg,
      spreadPercent: Math.round(((m.retailPricePerKg - m.pricePerKg) / m.retailPricePerKg) * 1000) / 10,
      updatedAt: m.updatedAt,
    };
  });

  res.json(result);
});

module.exports = router;
