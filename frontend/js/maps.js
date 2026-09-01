/**
 * AGRIWEB — Interactive Leaflet / OpenStreetMap Logistics & Route Engine
 * High-Contrast Monochrome Aesthetic
 */

const agroMap = {
  mapInstance: null,
  markersLayer: null,
  routePolyline: null,
  allNodes: [],
  selectedOrigin: null,
  selectedDest: null,

  init() {
    const mapEl = document.getElementById("leafletMap");
    if (!mapEl || !window.L) return;

    if (this.mapInstance) {
      this.mapInstance.invalidateSize();
      return;
    }

    this.mapInstance = L.map("leafletMap", {
      center: [20.0, 75.5],
      zoom: 6,
      zoomControl: true,
    });

    // Clean Voyager / Positron CartoDB tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(this.mapInstance);

    this.markersLayer = L.layerGroup().addTo(this.mapInstance);
    this.loadNodes();
  },

  async loadNodes() {
    try {
      const nodes = await api.getMapNodes();
      // Filter out pooling hubs since user requested removal of pooling
      this.allNodes = (nodes || []).filter((n) => n.type !== "pooling_hub");
      this.renderMarkers(this.allNodes);
      // Automatically draw default route (Nashik to Mumbai)
      this.fetchAndDrawRoute(20.201, 73.834, 19.033, 73.029, 1000);
    } catch (e) {
      console.warn("Could not load map nodes:", e);
    }
  },

  renderMarkers(nodes) {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();

    nodes.forEach((node) => {
      if (!node.lat || !node.lng) return;

      let iconBg = "#000000";
      let iconColor = "#FFFFFF";
      let iconEmoji = "🌾";
      let label = "Farm Produce Lot";

      if (node.type === "mandi") {
        iconBg = "#27272A";
        iconColor = "#FFFFFF";
        iconEmoji = "🏢";
        label = "APMC Mandi Hub";
      } else if (node.type === "buyer_warehouse") {
        iconBg = "#52525B";
        iconColor = "#FFFFFF";
        iconEmoji = "🛒";
        label = "Buyer Distribution Hub";
      }

      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background: ${iconBg};
            color: ${iconColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            cursor: pointer;
          ">
            ${iconEmoji}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: Outfit, sans-serif; min-width: 190px; color: #0F172A; padding: 4px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 800; color: #52525B; margin-bottom: 2px;">
            ${label}
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; margin-bottom: 6px;">
            ${node.title || node.locationName}
          </div>
          ${
            node.commodity
              ? `<div style="font-size: 0.82rem; color: #475569; margin-bottom: 4px;">
                  Commodity: <strong>${node.commodity}</strong> ${node.grade ? `(${node.grade})` : ""}
                </div>`
              : ""
          }
          ${
            node.pricePerKg
              ? `<div style="font-size: 0.85rem; color: #09090B; font-weight: 800; margin-bottom: 8px;">
                  ₹${node.pricePerKg} / kg ${node.quantityKg ? `• ${node.quantityKg} kg` : ""}
                </div>`
              : ""
          }
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button onclick="agroMap.setAsRoutePoint('origin', ${node.lat}, ${node.lng}, '${node.locationName || node.title}')"
                    style="background: #000000; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: 700;">
              Set Origin
            </button>
            <button onclick="agroMap.setAsRoutePoint('dest', ${node.lat}, ${node.lng}, '${node.locationName || node.title}')"
                    style="background: #52525B; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: 700;">
              Set Dest
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markersLayer.addLayer(marker);
    });
  },

  setAsRoutePoint(type, lat, lng, name) {
    if (type === "origin") {
      this.selectedOrigin = { lat, lng, name };
      const el = document.getElementById("routeOriginLabel");
      if (el) el.textContent = name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    } else {
      this.selectedDest = { lat, lng, name };
      const el = document.getElementById("routeDestLabel");
      if (el) el.textContent = name || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }

    if (this.selectedOrigin && this.selectedDest) {
      this.fetchAndDrawRoute(
        this.selectedOrigin.lat,
        this.selectedOrigin.lng,
        this.selectedDest.lat,
        this.selectedDest.lng,
        1000
      );
    }
  },

  async fetchAndDrawRoute(originLat, originLng, destLat, destLng, weightKg = 1000) {
    try {
      const res = await api.calculateRoute({
        originLat,
        originLng,
        destLat,
        destLng,
        weightKg,
      });

      this.drawRoutePolyline(res.routePoints);
      this.renderRouteDetails(res);
    } catch (e) {
      console.warn("Routing calculation error:", e);
    }
  },

  drawRoutePolyline(points) {
    if (!this.mapInstance || !points || points.length === 0) return;

    if (this.routePolyline) {
      this.mapInstance.removeLayer(this.routePolyline);
    }

    const latLngs = points.map((p) => [p.lat, p.lng]);

    this.routePolyline = L.polyline(latLngs, {
      color: "#000000",
      weight: 4,
      opacity: 0.9,
      dashArray: "8, 6",
      lineJoin: "round",
    }).addTo(this.mapInstance);

    this.mapInstance.fitBounds(this.routePolyline.getBounds(), { padding: [40, 40] });
  },

  renderRouteDetails(routeData) {
    const distEl = document.getElementById("routeDistance");
    const timeEl = document.getElementById("routeTime");
    const carbonEl = document.getElementById("routeCarbon");
    const vehiclesContainer = document.getElementById("routeVehiclesList");

    if (distEl) distEl.textContent = `${routeData.roadDistanceKm} km`;
    if (timeEl) timeEl.textContent = `~${routeData.estimatedTransitHours} hrs`;
    if (carbonEl) carbonEl.textContent = `${routeData.carbonSavedKg} kg CO₂ saved`;

    if (vehiclesContainer && routeData.freightOptions) {
      vehiclesContainer.innerHTML = routeData.freightOptions
        .map((v, i) => `
          <div class="vehicle-card ${i === 0 ? "active" : ""}" onclick="agroMap.selectVehicle(this)">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:var(--text-main); font-size:0.9rem;">${v.vehicleType}</strong>
              <span style="font-weight:800; color:var(--text-main);">₹${v.totalFreightCost.toLocaleString()}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted);">
              <span>Cap: ${v.capacityKg} kg (${v.refrigerated ? "❄️ Cold Chain" : "Standard"})</span>
              <span>₹${v.costPerKg}/kg</span>
            </div>
          </div>
        `)
        .join("");
    }
  },

  selectVehicle(cardEl) {
    document.querySelectorAll(".vehicle-card").forEach((c) => c.classList.remove("active"));
    cardEl.classList.add("active");
  },
};

window.agroMap = agroMap;
