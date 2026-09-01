const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { authRequired, requireRole } = require("../middleware/auth");

/**
 * GET /api/analytics/overview
 * Ministry/admin dashboard: aggregated, anonymised metrics only — no
 * individual personal data — showing the platform's real-world impact.
 */
router.get("/overview", authRequired, requireRole("admin"), (req, res) => {
  const users = db.getAll("users");
  const produce = db.getAll("produce");
  const orders = db.getAll("orders");
  const pools = db.getAll("pools");
  const mandiPrices = db.getAll("mandiPrices");

  const totalFarmers = users.filter((u) => u.role === "farmer").length;
  const totalBuyers = users.filter((u) => u.role === "buyer").length;
  const totalListings = produce.length;
  const completedOrders = orders.filter((o) => o.status === "delivered" || o.status === "rated");
  const totalTradeValue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const avgSpread =
    mandiPrices.length > 0
      ? Math.round(
          (mandiPrices.reduce((s, m) => s + (m.retailPricePerKg - m.pricePerKg) / m.retailPricePerKg, 0) /
            mandiPrices.length) *
            1000
        ) / 10
      : 0;

  res.json({
    totalFarmers,
    totalBuyers,
    totalListings,
    activePools: pools.filter((p) => p.status !== "closed").length,
    completedOrders: completedOrders.length,
    totalTradeValue,
    avgMandiToRetailSpreadPercent: avgSpread,
  });
});

module.exports = router;
