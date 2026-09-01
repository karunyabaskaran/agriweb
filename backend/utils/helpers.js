const { v4: uuidv4 } = require("uuid");

function newId() {
  return uuidv4();
}

/**
 * Trust score: simple weighted average of past ratings (1-5), defaults to 4.0
 * for new users so they aren't penalised before any transactions.
 */
function computeTrustScore(pastRatings) {
  if (!pastRatings || pastRatings.length === 0) return 4.0;
  const sum = pastRatings.reduce((a, b) => a + b, 0);
  return Math.round((sum / pastRatings.length) * 10) / 10;
}

module.exports = { newId, computeTrustScore };
