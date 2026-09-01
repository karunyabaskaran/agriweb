const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { newId, computeTrustScore } = require("../utils/helpers");
const { authRequired, requireRole } = require("../middleware/auth");

// POST /api/orders  (buyer places a direct order on a produce listing)
router.post("/", authRequired, requireRole("buyer"), (req, res) => {
  const { produceId, quantityKg } = req.body;
  const produce = db.getById("produce", produceId);

  if (!produce || (produce.status !== "listed" && produce.status !== "pooled")) {
    return res.status(404).json({ error: "Listing not available" });
  }
  if (quantityKg > produce.quantityKg) {
    return res.status(400).json({ error: "Requested quantity exceeds available quantity" });
  }

  const buyer = db.getById("users", req.user.id);
  const totalPrice = quantityKg * produce.askingPricePerKg;

  const order = {
    id: newId(),
    produceId: produce.id,
    commodity: produce.commodity,
    farmerId: produce.farmerId,
    farmerName: produce.farmerName,
    buyerId: req.user.id,
    buyerName: buyer.name,
    quantityKg: Number(quantityKg),
    pricePerKg: produce.askingPricePerKg,
    totalPrice,
    status: "pending", // pending -> confirmed -> delivered -> rated
    createdAt: new Date().toISOString(),
  };

  db.insert("orders", order);

  // reduce available quantity; mark sold out if fully consumed
  const remaining = produce.quantityKg - quantityKg;
  db.update("produce", produce.id, {
    quantityKg: remaining,
    status: remaining <= 0 ? "sold" : produce.status,
  });

  res.status(201).json(order);
});

// GET /api/orders/mine  (role-aware: farmer sees orders on their produce, buyer sees own orders)
router.get("/mine", authRequired, (req, res) => {
  const all = db.getAll("orders");
  const mine =
    req.user.role === "farmer"
      ? all.filter((o) => o.farmerId === req.user.id)
      : all.filter((o) => o.buyerId === req.user.id);
  res.json(mine);
});

// PATCH /api/orders/:id/status  (farmer confirms, buyer marks delivered)
router.patch("/:id/status", authRequired, (req, res) => {
  const { status } = req.body;
  const order = db.getById("orders", req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const isParty = order.farmerId === req.user.id || order.buyerId === req.user.id;
  if (!isParty) return res.status(403).json({ error: "Not authorized for this order" });

  const validTransitions = ["confirmed", "delivered", "cancelled"];
  if (!validTransitions.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const updated = db.update("orders", req.params.id, { status });
  res.json(updated);
});

// POST /api/orders/:id/rate  (buyer rates farmer's produce quality on delivery -> builds trust score)
router.post("/:id/rate", authRequired, requireRole("buyer"), (req, res) => {
  const { rating, confirmedGrade } = req.body; // rating 1-5
  const order = db.getById("orders", req.params.id);
  if (!order || order.buyerId !== req.user.id) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const farmer = db.getById("users", order.farmerId);
  const ratings = [...(farmer.ratings || []), rating];
  const trustScore = computeTrustScore(ratings);
  db.update("users", farmer.id, { ratings, trustScore });

  db.update("orders", req.params.id, { status: "rated", rating, confirmedGrade: confirmedGrade || null });

  res.json({ success: true, newTrustScore: trustScore });
});

module.exports = router;
