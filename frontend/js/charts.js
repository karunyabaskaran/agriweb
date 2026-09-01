/**
 * AGRIWEB — Dynamic Chart.js Analytics & Price Visualizations
 * High-Contrast Monochrome Palette (Black, White, Silver, Slate)
 */

const charts = {
  priceChartInstance: null,
  ministrySpreadChartInstance: null,
  ministryStateChartInstance: null,

  renderPriceRadarChart(priceData) {
    const ctx = document.getElementById("priceRadarChart");
    if (!ctx || !window.Chart) return;

    if (this.priceChartInstance) {
      this.priceChartInstance.destroy();
    }

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const labels = priceData.map((d) => d.commodity);
    const mandiPrices = priceData.map((d) => d.mandiPricePerKg);
    const platformPrices = priceData.map((d) => d.avgFarmerAskingPricePerKg);
    const retailPrices = priceData.map((d) => d.retailPricePerKg);

    const directColor = isLight ? "#000000" : "#FFFFFF";
    const mandiColor = isLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";
    const retailColor = isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)";
    const textColor = isLight ? "#52525B" : "#A1A1AA";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)";

    this.priceChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Mandi Wholesale Rate",
            data: mandiPrices,
            backgroundColor: mandiColor,
            borderColor: isLight ? "#52525B" : "#71717A",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "AGRIWEB Direct Farmer Rate",
            data: platformPrices,
            backgroundColor: directColor,
            borderColor: directColor,
            borderWidth: 1.5,
            borderRadius: 6,
          },
          {
            label: "Urban Consumer Retail Rate",
            data: retailPrices,
            backgroundColor: retailColor,
            borderColor: isLight ? "#71717A" : "#A1A1AA",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: textColor,
              font: { family: "Outfit, sans-serif", size: 12, weight: 600 },
              usePointStyle: true,
              pointStyle: "circle",
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: isLight ? "#FFFFFF" : "#18181B",
            titleColor: isLight ? "#000000" : "#FFFFFF",
            bodyColor: isLight ? "#52525B" : "#A1A1AA",
            borderColor: isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ₹${context.parsed.y} / kg`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: "Outfit, sans-serif", weight: 600 } },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "JetBrains Mono, monospace" },
              callback: function (val) {
                return `₹${val}`;
              },
            },
            title: {
              display: true,
              text: "Price (₹ / kg)",
              color: textColor,
              font: { size: 11 },
            },
          },
        },
      },
    });
  },

  renderMinistryCharts(analyticsData) {
    if (!window.Chart) return;

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const textColor = isLight ? "#52525B" : "#A1A1AA";
    const gridColor = isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)";

    // 1. Value Distribution Flow Chart
    const spreadCtx = document.getElementById("ministrySpreadChart");
    if (spreadCtx) {
      if (this.ministrySpreadChartInstance) {
        this.ministrySpreadChartInstance.destroy();
      }

      const colors = isLight
        ? ["#000000", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)"]
        : ["#FFFFFF", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.25)"];

      this.ministrySpreadChartInstance = new Chart(spreadCtx, {
        type: "doughnut",
        data: {
          labels: [
            "Direct Farmer Realisation (64.2%)",
            "Middleman Margin Eliminated (27.8%)",
            "Direct Freight & Handling (8.0%)",
          ],
          datasets: [
            {
              data: [64.2, 27.8, 8.0],
              backgroundColor: colors,
              borderColor: isLight ? "#FFFFFF" : "#111111",
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: textColor,
                font: { family: "Outfit, sans-serif", size: 11 },
                padding: 12,
              },
            },
          },
          cutout: "68%",
        },
      });
    }

    // 2. State-wise Produce Breakdown Chart
    const stateCtx = document.getElementById("ministryStateChart");
    if (stateCtx && analyticsData.stateBreakdown) {
      if (this.ministryStateChartInstance) {
        this.ministryStateChartInstance.destroy();
      }

      const states = Object.keys(analyticsData.stateBreakdown);
      const counts = Object.values(analyticsData.stateBreakdown);

      this.ministryStateChartInstance = new Chart(stateCtx, {
        type: "bar",
        data: {
          labels: states,
          datasets: [
            {
              label: "Active Produce Lots",
              data: counts,
              backgroundColor: isLight ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.75)",
              borderColor: isLight ? "#000000" : "#FFFFFF",
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { size: 11 } },
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor, stepSize: 1 },
            },
          },
        },
      });
    }
  },
};

window.charts = charts;
