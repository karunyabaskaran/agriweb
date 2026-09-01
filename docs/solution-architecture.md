# KisanSetu — Direct Farm-to-Market Platform
### Solution for: Ministry of Consumer Affairs — "Multiple intermediaries reduce farmers' earnings and increase consumer prices"

## 1. Core Idea

KisanSetu ("Farmer's Bridge") is a single platform that collapses the farmer → trader → commission agent → wholesaler → retailer chain into **farmer → aggregation hub → buyer**, while attacking the four root causes identified in the gap analysis at once, instead of solving only one:

| Root cause | Existing solutions cover it? | KisanSetu module |
|---|---|---|
| No price transparency | Partially (eNAM) | Live Price Transparency Dashboard |
| No direct buyer access for small farmers | Partially (agri-tech apps, urban-biased) | Open Marketplace + Direct Orders |
| Small, uneconomical individual lots | FPOs (slow to form) | Auto-Pooling Engine (village-cluster pooling) |
| Distress selling due to lack of credit | Not addressed | Advance-against-Produce (escrow) |
| Low tech literacy | Not addressed | Voice/SMS-first lightweight UI + regional language |
| No quality standard | Not addressed | Simple 3-tier self+buyer grading with trust score |

## 2. How It Closes Each Gap

1. **Price transparency** — every produce listing shows, side by side: nearest mandi price (via data.gov.in Agmarknet API, or manual entry where unavailable), the farmer's asking price, and the average retail price for that commodity. This kills information asymmetry that lets traders under-quote.
2. **Logistics/aggregation without waiting for formal FPOs** — the "Pooling Engine" automatically groups nearby farmers' small lots (by village/block + commodity + harvest window) into a single bulk lot that becomes attractive to bulk buyers, retail chains and government procurement — without requiring the legal/registration overhead of forming an FPO.
3. **Credit lock-in** — an "Advance Request" lets a farmer draw a partial advance against a *listed* (not yet sold) lot from a lending partner/NBFC integrated via API, so the farmer is not forced to sell to the first trader offering cash.
4. **Low-tech access** — the web UI is designed mobile-first, low-bandwidth, icon-heavy, and works in regional languages; the same backend exposes a simple API that an IVR/SMS gateway (e.g., Kisan Call Centre integration) can call, so a farmer without a smartphone can still list produce by phone call.
5. **Quality trust** — produce is graded A/B/C using a short visual checklist filled by the farmer at listing, and confirmed/adjusted by the buyer after delivery, building a trust score per farmer that improves their future bargaining position — replacing arbitrary undervaluation by middlemen.
6. **Government visibility** — an Analytics/Ministry Dashboard aggregates anonymised data: average farmer-to-retail price spread by commodity/state, number of intermediaries bypassed, and estimated farmer earnings uplift — giving the Ministry a live monitoring tool instead of periodic surveys.

## 3. User Roles

- **Farmer** — lists produce, sees price transparency data, joins pools, requests advances, tracks orders.
- **Buyer** (retailer / bulk consumer / FPO / government procurement agency) — browses marketplace, places direct orders, rates quality on delivery.
- **Admin/Ministry** — views aggregated analytics dashboard; no access to individual personal data beyond what's needed for grievance redressal.

## 4. High-Level Architecture

```
                     ┌─────────────────────────┐
                     │   Web / IVR / SMS Client │
                     └────────────┬─────────────┘
                                  │ REST (JSON)
                     ┌────────────▼─────────────┐
                     │   Express.js API Server   │
                     │  (auth, produce, orders,  │
                     │   pooling, prices, credit) │
                     └────────────┬─────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
      ┌───────▼──────┐   ┌────────▼───────┐   ┌───────▼───────┐
      │  App Database │   │ Agmarknet /    │   │ NBFC / Credit │
      │ (produce,     │   │ eNAM Price API │   │ Partner API   │
      │ users, orders)│   │ (external)     │   │ (external)    │
      └───────────────┘   └────────────────┘   └───────────────┘
```

## 5. Tech Stack (this prototype)

- **Backend:** Node.js + Express, JWT auth, JSON file data store (swap-in-ready for PostgreSQL in production)
- **Frontend:** Vanilla HTML/CSS/JS, mobile-first, no build step (so it can be swapped for a React app or wired to an IVR system without re-architecting the API)
- **Integrations (stubbed for demo, production-ready hooks):** Agmarknet/eNAM price API, SMS/IVR gateway, NBFC micro-credit API

## 6. What Makes This "Complete" vs. Point Solutions

Existing tools solve one link of the chain each (eNAM = price discovery only, Ninjacart/DeHaat = logistics only, FPOs = collective bargaining only). KisanSetu is designed so all four levers — **price transparency, direct market access, aggregation, and credit** — sit inside one workflow a farmer touches when listing a single item, so partial adoption still delivers value (a farmer doesn't need to also join an FPO or separately check a government price portal).
