const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db/database");
const { newId } = require("../utils/helpers");
const { JWT_SECRET } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, phone, password, role, village, state, language } = req.body;

  if (!name || !phone || !password || !role) {
    return res.status(400).json({ error: "name, phone, password and role are required" });
  }
  if (!["farmer", "buyer", "admin"].includes(role)) {
    return res.status(400).json({ error: "role must be farmer, buyer or admin" });
  }

  const existing = db.getAll("users").find((u) => u.phone === phone);
  if (existing) {
    return res.status(409).json({ error: "An account with this phone number already exists" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: newId(),
    name,
    phone,
    passwordHash,
    role,
    village: village || "",
    state: state || "",
    language: language || "en",
    trustScore: 4.0,
    ratings: [],
    createdAt: new Date().toISOString(),
  };
  db.insert("users", user);

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { phone, password } = req.body;
  const user = db.getAll("users").find((u) => u.phone === phone);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid phone number or password" });
  }
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

module.exports = router;
