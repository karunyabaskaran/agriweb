/**
 * Lightweight JSON-file data layer.
 * In production, swap this module for a PostgreSQL/MySQL layer with the same
 * function signatures (getAll, getById, insert, update, remove) — no route
 * code needs to change.
 */
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = require("./seed.json");
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getAll(collection) {
  const data = loadData();
  return data[collection] || [];
}

function getById(collection, id) {
  return getAll(collection).find((item) => item.id === id);
}

function insert(collection, item) {
  const data = loadData();
  if (!data[collection]) data[collection] = [];
  data[collection].push(item);
  saveData(data);
  return item;
}

function update(collection, id, updates) {
  const data = loadData();
  const idx = (data[collection] || []).findIndex((item) => item.id === id);
  if (idx === -1) return null;
  data[collection][idx] = { ...data[collection][idx], ...updates };
  saveData(data);
  return data[collection][idx];
}

function remove(collection, id) {
  const data = loadData();
  data[collection] = (data[collection] || []).filter((item) => item.id !== id);
  saveData(data);
  return true;
}

module.exports = { getAll, getById, insert, update, remove, loadData, saveData };
