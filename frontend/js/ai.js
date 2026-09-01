/**
 * AGRIWEB — Scikit-Learn AI & ML Agri-Lab Controller
 * High-Contrast Monochrome Aesthetic
 */

const aiLab = {
  async runPricePrediction() {
    const commodity = document.getElementById("aiPriceCommodity")?.value || "Tomato";
    const state = document.getElementById("aiPriceState")?.value || "Maharashtra";
    const month = parseInt(document.getElementById("aiPriceMonth")?.value || "8", 10);
    const rainfallDev = parseFloat(document.getElementById("aiPriceRainfall")?.value || "0");
    const supplyFactor = parseFloat(document.getElementById("aiPriceSupply")?.value || "1.0");

    const resultBox = document.getElementById("aiPriceResult");
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="text-align:center; padding: 20px; color: var(--text-muted);">
        <span>🤖 Running RandomForest inference on agro-climatic tensors...</span>
      </div>
    `;
    resultBox.style.display = "block";

    try {
      const data = await api.predictPrice({
        commodity,
        state,
        month,
        rainfallDeviation: rainfallDev,
        supplyFactor,
      });

      resultBox.innerHTML = `
        <div style="border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 12px;">
          <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted); font-weight:800;">
            ML Price Forecast • ${data.commodity} (${data.state})
          </div>
          <div style="font-size:1.35rem; font-weight:900; color:var(--text-main); margin-top:2px;">
            Recommended Direct Rate: ₹${data.recommendedDirectPricePerKg} / kg
          </div>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Wholesale Mandi Benchmark:</span>
          <span style="font-weight:700; color:var(--text-muted);">₹${data.predictedMandiPricePerKg} / kg</span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Urban Consumer Retail Benchmark:</span>
          <span style="font-weight:700; color:var(--text-muted);">₹${data.estimatedRetailPricePerKg} / kg</span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Farmer Net Uplift vs Mandi:</span>
          <span style="font-weight:800; color:var(--text-main);">+${data.farmerProfitUpliftPercent}%</span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Middleman Margin Eliminated:</span>
          <span style="font-weight:800; color:var(--text-main);">₹${data.intermediaryMarginBypassedPerKg} / kg</span>
        </div>

        <div style="margin-top:14px; background:var(--bg-card); padding:10px 14px; border-radius:8px; border:1px solid var(--border-glass); font-size:0.84rem;">
          <strong style="color:var(--text-main);">Market Advisory:</strong> ${data.advisoryNote} (${data.priceTrend})
        </div>

        <div style="margin-top:12px; display:flex; justify-content:flex-end;">
          <button class="btn btn-outline btn-sm" onclick="aiLab.speakText('${data.commodity} in ${data.state}: Recommended direct price is ${data.recommendedDirectPricePerKg} rupees per kilogram, giving you a ${data.farmerProfitUpliftPercent} percent profit uplift.')">
            🔊 Listen in Voice
          </button>
        </div>
      `;
    } catch (e) {
      resultBox.innerHTML = `<div style="color:var(--text-dim);">Error running prediction: ${e.message}</div>`;
    }
  },

  async runQualityGrading() {
    const commodity = document.getElementById("aiGradeCommodity")?.value || "Tomato";
    const storage = document.getElementById("aiGradeStorage")?.value || "Ventilated Crate";
    const harvestDays = parseInt(document.getElementById("aiGradeHarvestDays")?.value || "2", 10);
    const blemish = parseFloat(document.getElementById("aiGradeBlemish")?.value || "5");

    const resultBox = document.getElementById("aiGradeResult");
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="text-align:center; padding: 20px; color: var(--text-muted);">
        <span>🌿 Evaluating produce attributes against AGMARK standards...</span>
      </div>
    `;
    resultBox.style.display = "block";

    try {
      const data = await api.gradeProduce({
        commodity,
        storageType: storage,
        daysSinceHarvest: harvestDays,
        blemishPercent: blemish,
        moisturePercent: 85,
        sizeUniformityPercent: 90,
      });

      resultBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 12px;">
          <div>
            <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted); font-weight:800;">
              AI Quality Assessment
            </div>
            <div style="font-size:1.25rem; font-weight:900; color:var(--text-main); margin-top:2px;">
              ${data.commodity} (${data.storageCondition})
            </div>
          </div>
          <span class="grade-pill" style="font-size:1rem; padding: 5px 14px; font-weight:800;">
            Grade ${data.predictedGrade}
          </span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Freshness Index:</span>
          <span style="font-weight:800; color:var(--text-main);">${data.freshnessScore} / 100</span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Estimated Shelf Life:</span>
          <span style="font-weight:700; color:var(--text-main);">${data.estimatedShelfLifeDays} Days Remaining</span>
        </div>

        <div class="result-metric">
          <span style="color:var(--text-muted); font-size:0.88rem;">Price Multiplier:</span>
          <span style="font-weight:700; color:var(--text-muted);">${data.priceMultiplier}x (Fair Benchmark)</span>
        </div>

        <div style="margin-top:14px; font-size:0.84rem; color:var(--text-muted); line-height:1.5;">
          ${data.description}
        </div>
      `;
    } catch (e) {
      resultBox.innerHTML = `<div style="color:var(--text-dim);">Error assessing quality: ${e.message}</div>`;
    }
  },

  speakText(text) {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    if (window.showToast) {
      showToast("Playing voice advisory 🔊", "info");
    }
  },
};

window.aiLab = aiLab;
