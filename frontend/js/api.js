const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("aw_token") || localStorage.getItem("ks_token");
}

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

const api = {
  // Auth & Personas
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  getMe: () => apiRequest("/auth/me", { auth: true }),
  getDemoUsers: () => apiRequest("/auth/demo-users"),

  // Produce Listings
  getProduce: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/produce${qs ? "?" + qs : ""}`);
  },
  getMyProduce: () => apiRequest("/produce/mine", { auth: true }),
  getProduceDetails: (id) => apiRequest(`/produce/${id}`),
  createProduce: (payload) => apiRequest("/produce", { method: "POST", body: payload, auth: true }),
  updateProduce: (id, payload) => apiRequest(`/produce/${id}`, { method: "PATCH", body: payload, auth: true }),
  deleteProduce: (id) => apiRequest(`/produce/${id}`, { method: "DELETE", auth: true }),

  // Price Transparency Radar
  getPrices: () => apiRequest("/prices"),

  // Orders & Escrow
  createOrder: (payload) => apiRequest("/orders", { method: "POST", body: payload, auth: true }),
  getMyOrders: () => apiRequest("/orders/mine", { auth: true }),
  getOrderDetails: (id) => apiRequest(`/orders/${id}`, { auth: true }),
  updateOrderStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, { method: "PATCH", body: { status }, auth: true }),
  rateOrder: (id, payload) => apiRequest(`/orders/${id}/rate`, { method: "POST", body: payload, auth: true }),

  // Aggregation & Small-Lot Pooling
  getPools: () => apiRequest("/pools"),
  createPool: (payload) => apiRequest("/pools", { method: "POST", body: payload, auth: true }),
  joinPool: (id, produceId) =>
    apiRequest(`/pools/${id}/join`, { method: "POST", body: { produceId }, auth: true }),

  // Anti-Distress Sale Advances
  requestAdvance: (produceId) => apiRequest("/advances", { method: "POST", body: { produceId }, auth: true }),
  getMyAdvances: () => apiRequest("/advances/mine", { auth: true }),

  // Scikit-Learn AI & ML Agri-Lab
  predictPrice: (payload) => apiRequest("/ml/predict-price", { method: "POST", body: payload }),
  gradeProduce: (payload) => apiRequest("/ml/grade-produce", { method: "POST", body: payload }),
  forecastDemand: (payload) => apiRequest("/ml/forecast-demand", { method: "POST", body: payload }),
  getModelsInfo: () => apiRequest("/ml/models-info"),

  // Logistics, Maps & Routing
  getMapConfig: () => apiRequest("/maps/config"),
  getMapNodes: () => apiRequest("/maps/nodes"),
  calculateRoute: (payload) => apiRequest("/maps/route", { method: "POST", body: payload }),

  // Escrow Payments
  createPaymentOrder: (payload) => apiRequest("/payments/create-order", { method: "POST", body: payload, auth: true }),
  verifyPayment: (payload) => apiRequest("/payments/verify", { method: "POST", body: payload, auth: true }),
  getPaymentHistory: () => apiRequest("/payments/history", { auth: true }),

  // Ministry Macro Analytics
  getAnalytics: () => apiRequest("/analytics/overview", { auth: true }),
};

window.api = api;
