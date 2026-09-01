const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { newId } = require("../utils/helpers");
const { authRequired, requireRole } = require("../middleware/auth");

/**
 * Advance-against-produce: lets a farmer request a partial cash advance
 * against an already-listed lot, so they are not forced into distress
 * selling to the first trader who offers ready cash. In production this
 * would call an NBFC/bank partner's disbursal API; here it is simulated
 * with an approval rule (max 60% of listing value, auto-approved for demo).
 */

router.get("/mine", authRequired, requireRole("farmer"), (req, res) => {
  const mine = db.getAll("advances").filter((a) => a.farmerId === req.user.id);
  res.json(mine);
});

router.post("/", authRequired, requireRole("farmer"), (req, res) => {
  const { produceId } = req.body;
  const produce = db.getById("produce", produceId);
  if (!produce || produce.farmerId !== req.user.id) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const listingValue = produce.quantityKg * produce.askingPricePerKg;
  const maxAdvance = Math.round(listingValue * 0.6);

  const advance = {
    id: newId(),
    farmerId: req.user.id,
    produceId,
    commodity: produce.commodity,
    listingValue,
    approvedAmount: maxAdvance,
    status: "approved", // demo: instant approval; production: pending -> approved/rejected
    createdAt: new Date().toISOString(),
  };
  db.insert("advances", advance);
  res.status(201).json(advance);
});

module.exports = router;
