const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { newId } = require("../utils/helpers");
const { authRequired, requireRole } = require("../middleware/auth");

// GET /api/produce  (marketplace browse, open to all, with filters)
router.get("/", (req, res) => {
  const { commodity, state, grade, minQty } = req.query;
  let items = db.getAll("produce").filter((p) => p.status === "listed" || p.status === "pooled");

  if (commodity) items = items.filter((p) => p.commodity.toLowerCase() === commodity.toLowerCase());
  if (state) items = items.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  if (grade) items = items.filter((p) => p.grade === grade);
  if (minQty) items = items.filter((p) => p.quantityKg >= Number(minQty));

  // attach mandi price context for transparency
  const mandiPrices = db.getAll("mandiPrices");
  items = items.map((p) => {
    const mandi = mandiPrices.find((m) => m.commodity.toLowerCase() === p.commodity.toLowerCase());
    return {
      ...p,
      mandiReference: mandi
        ? { mandiPricePerKg: mandi.pricePerKg, retailPricePerKg: mandi.retailPricePerKg, mandi: mandi.mandi }
        : null,
    };
  });

  res.json(items);
});

// GET /api/produce/mine (farmer's own listings)
router.get("/mine", authRequired, requireRole("farmer"), (req, res) => {
  const items = db.getAll("produce").filter((p) => p.farmerId === req.user.id);
  res.json(items);
});

// POST /api/produce  (farmer lists new produce)
router.post("/", authRequired, requireRole("farmer"), (req, res) => {
  const { commodity, quantityKg, askingPricePerKg, grade, village, state, harvestDate } = req.body;

  if (!commodity || !quantityKg || !askingPricePerKg) {
    return res.status(400).json({ error: "commodity, quantityKg and askingPricePerKg are required" });
  }

  const farmer = db.getById("users", req.user.id);

  const item = {
    id: newId(),
    farmerId: req.user.id,
    farmerName: farmer.name,
    commodity,
    quantityKg: Number(quantityKg),
    askingPricePerKg: Number(askingPricePerKg),
    grade: grade || "B", // A / B / C self-declared, confirmed later by buyer
    village: village || farmer.village,
    state: state || farmer.state,
    harvestDate: harvestDate || null,
    status: "listed", // listed -> pooled -> sold
    poolId: null,
    createdAt: new Date().toISOString(),
  };

  db.insert("produce", item);
  res.status(201).json(item);
});

// PATCH /api/produce/:id  (update own listing)
router.patch("/:id", authRequired, requireRole("farmer"), (req, res) => {
  const item = db.getById("produce", req.params.id);
  if (!item || item.farmerId !== req.user.id) {
    return res.status(404).json({ error: "Listing not found" });
  }
  const allowedFields = ["quantityKg", "askingPricePerKg", "grade", "status"];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const updated = db.update("produce", req.params.id, updates);
  res.json(updated);
});

// DELETE /api/produce/:id
router.delete("/:id", authRequired, requireRole("farmer"), (req, res) => {
  const item = db.getById("produce", req.params.id);
  if (!item || item.farmerId !== req.user.id) {
    return res.status(404).json({ error: "Listing not found" });
  }
  db.remove("produce", req.params.id);
  res.json({ success: true });
});

module.exports = router;
