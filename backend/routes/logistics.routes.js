const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { newId } = require("../utils/helpers");
const { authRequired, requireRole } = require("../middleware/auth");

/**
 * Pooling Engine: lets small farmers combine listings from the same
 * village/commodity/harvest-window into one bulk lot that is attractive to
 * bulk buyers/retail chains, without needing to formally register an FPO.
 */

// GET /api/pools  (open pools, visible to all)
router.get("/", (req, res) => {
  res.json(db.getAll("pools"));
});

// POST /api/pools  (farmer creates a new pool for a village + commodity)
router.post("/", authRequired, requireRole("farmer"), (req, res) => {
  const { commodity, village, state, targetQuantityKg } = req.body;
  if (!commodity || !village || !targetQuantityKg) {
    return res.status(400).json({ error: "commodity, village and targetQuantityKg are required" });
  }

  const pool = {
    id: newId(),
    commodity,
    village,
    state: state || "",
    targetQuantityKg: Number(targetQuantityKg),
    pooledQuantityKg: 0,
    memberFarmerIds: [],
    status: "open", // open -> full -> closed
    createdAt: new Date().toISOString(),
  };
  db.insert("pools", pool);
  res.status(201).json(pool);
});

// POST /api/pools/:id/join  (farmer adds one of their own listings to a pool)
router.post("/:id/join", authRequired, requireRole("farmer"), (req, res) => {
  const { produceId } = req.body;
  const pool = db.getById("pools", req.params.id);
  const produce = db.getById("produce", produceId);

  if (!pool || pool.status !== "open") return res.status(404).json({ error: "Pool not open" });
  if (!produce || produce.farmerId !== req.user.id) {
    return res.status(404).json({ error: "Listing not found" });
  }
  if (produce.commodity.toLowerCase() !== pool.commodity.toLowerCase()) {
    return res.status(400).json({ error: "Commodity does not match this pool" });
  }

  db.update("produce", produce.id, { status: "pooled", poolId: pool.id });

  const pooledQuantityKg = pool.pooledQuantityKg + produce.quantityKg;
  const memberFarmerIds = Array.from(new Set([...pool.memberFarmerIds, req.user.id]));
  const status = pooledQuantityKg >= pool.targetQuantityKg ? "full" : "open";

  const updated = db.update("pools", pool.id, { pooledQuantityKg, memberFarmerIds, status });
  res.json(updated);
});

module.exports = router;
