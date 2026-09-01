const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const produceRoutes = require("./routes/produce.routes");
const orderRoutes = require("./routes/orders.routes");
const priceRoutes = require("./routes/prices.routes");
const logisticsRoutes = require("./routes/logistics.routes");
const advanceRoutes = require("./routes/advances.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// serve the plain-HTML frontend directly so the whole app runs off one server
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/pools", logisticsRoutes);
app.use("/api/advances", advanceRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "KisanSetu API" }));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => {
  console.log(`KisanSetu API running on http://localhost:${PORT}`);
});
