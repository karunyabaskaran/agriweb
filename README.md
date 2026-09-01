# AGRIWEB — Direct Farm-to-Market Platform

**Solution for Ministry of Consumer Affairs Problem Statement:**  
*"Multiple intermediaries reduce farmers' earnings and increase consumer prices."*

AGRIWEB is a full-stack agricultural trade and price transparency platform designed with a high-contrast Black & White monochrome aesthetic, real-time multi-language support (English, Hindi, Marathi, Tamil, Telugu), and integrated Scikit-Learn AI/ML predictive engines.

---

## 🌟 Key Features

1. **🛒 Open Produce Marketplace**: Direct farm produce listings with live side-by-side APMC Mandi wholesale and urban retail benchmark comparisons, filters (commodity, grade, state, search), and 1-click Direct Buy with 100% Escrow buyer protection.
2. **📊 Live Price Transparency Radar**: Real-time comparison table and monochrome Chart.js bar graphs showing Mandi wholesale rate vs AGRIWEB direct rate vs retail rate, along with farmer net income uplift (+36.4%) and middleman margins eliminated.
3. **🛍️ Direct Orders & Escrow Ledger**: Track direct farm orders, milestone delivery confirmation, escrow fund release to farmers, and 1-5 star quality grading that builds a verified grower trust score.
4. **🤖 Scikit-Learn AI & ML Agri-Lab**:
   - **Smart Crop Price Forecaster** (RandomForestRegressor calculating fair direct farmer pricing based on rainfall anomalies and multi-state arrival indices).
   - **AI Quality & Freshness Grader** (DecisionTree evaluating harvest age, storage condition, surface blemish %, and moisture % against AGMARK standards into Grade A/B/C and remaining shelf life).
   - **Kisan Voice Audio Guide** (Web Speech API text-to-speech for rural accessibility).
5. **🗺️ Agro-Logistics & Routing Map**: Interactive OpenStreetMap / Leaflet geocoding farms, APMC mandis, and buyer distribution warehouses with road distance, transit hours, vehicle options (Mini Agro-Truck, 3.5T Commercial Transporter, Solar-Reefer Cold Chain), and CO₂ emissions saved.
6. **🏛️ Ministry Policy Dashboard**: Macro-economic indicators (Total Farmers, Total Buyers, Middleman Margins Eliminated, Value Realisation Doughnut Chart, and Live Policy Impact Statements).
7. **🌐 Real-Time Multi-Language Support**: Instant translation across the entire user interface into **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**, **தமிழ் (Tamil)**, and **తెలుగు (Telugu)**.
8. **⚡ 1-Click Role / Persona Switcher**: Instant switching between Farmers (Ramesh Kumar, Suresh Patel, Lakshmi Ammal), Direct Retail Buyers (FreshMart, Reliance Procurement), and Ministry Officers.

---

## 🚀 Running the Application

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python wsgi.py
```

### 3. Open in Browser
```
http://localhost:5000
```
*(The backend automatically serves the complete frontend Single Page Application at the root URL).*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register as farmer / buyer / admin |
| `POST` | `/api/auth/login` | Login with phone & password, returns JWT |
| `GET` | `/api/auth/demo-users` | Get demo user accounts for 1-click testing |
| `GET` | `/api/produce` | Browse marketplace (filters: commodity, state, grade, search) |
| `GET` | `/api/produce/mine` | Farmer's own listings (Auth) |
| `POST` | `/api/produce` | List new produce lot (Auth) |
| `PATCH` | `/api/produce/:id` | Update produce listing (Auth) |
| `DELETE` | `/api/produce/:id` | Remove produce listing (Auth) |
| `GET` | `/api/prices` | Mandi vs AGRIWEB direct vs Retail price spread comparison |
| `POST` | `/api/orders` | Place direct purchase order with escrow payment record (Auth) |
| `GET` | `/api/orders/mine` | Role-aware order ledger (Auth) |
| `PATCH` | `/api/orders/:id/status` | Update order status: dispatched / delivered (Auth) |
| `POST` | `/api/orders/:id/rate` | Rate farmer quality & update trust score (Auth) |
| `POST` | `/api/ml/predict-price` | RandomForest price inference and market trend |
| `POST` | `/api/ml/grade-produce` | DecisionTree quality grading & shelf life estimation |
| `POST` | `/api/ml/forecast-demand` | Metropolitan demand pressure forecast |
| `GET` | `/api/maps/nodes` | Geocoded locations of farmers, mandis, and buyers |
| `POST` | `/api/maps/route` | Road distance, transit time, vehicle freight costs, CO₂ saved |
| `GET` | `/api/analytics/overview` | Ministry macro-economic dashboard indicators (Auth) |
| `GET` | `/api/health` | System health check |
