import bcrypt

def get_initial_seed_data():
    # Passwords hashed with bcrypt: 'password123'
    hashed_pwd = bcrypt.hashpw(b"password123", bcrypt.gensalt()).decode("utf-8")

    return {
        "users": [
            {
                "id": "farmer-ramesh-101",
                "name": "Ramesh Kumar (Farmer)",
                "phone": "9876543210",
                "passwordHash": hashed_pwd,
                "role": "farmer",
                "village": "Dindori, Nashik",
                "state": "Maharashtra",
                "coordinates": {"lat": 20.201, "lng": 73.834},
                "language": "hi",
                "trustScore": 4.8,
                "ratings": [5, 5, 4, 5, 5],
                "createdAt": "2026-08-20T10:00:00Z"
            },
            {
                "id": "farmer-suresh-102",
                "name": "Suresh Patel (Farmer)",
                "phone": "9811223344",
                "passwordHash": hashed_pwd,
                "role": "farmer",
                "village": "Fatehabad, Agra",
                "state": "Uttar Pradesh",
                "coordinates": {"lat": 27.021, "lng": 78.312},
                "language": "hi",
                "trustScore": 4.6,
                "ratings": [4, 5, 5, 4],
                "createdAt": "2026-08-22T11:30:00Z"
            },
            {
                "id": "farmer-lakshmi-103",
                "name": "Lakshmi Ammal (Farmer)",
                "phone": "9766554433",
                "passwordHash": hashed_pwd,
                "role": "farmer",
                "village": "Tiruvallur, Chennai",
                "state": "Tamil Nadu",
                "coordinates": {"lat": 13.143, "lng": 79.908},
                "language": "ta",
                "trustScore": 4.9,
                "ratings": [5, 5, 5, 4, 5],
                "createdAt": "2026-08-23T09:15:00Z"
            },
            {
                "id": "buyer-freshmart-201",
                "name": "FreshMart Direct Retail",
                "phone": "9123456780",
                "passwordHash": hashed_pwd,
                "role": "buyer",
                "village": "Navi Mumbai Hub",
                "state": "Maharashtra",
                "coordinates": {"lat": 19.033, "lng": 73.029},
                "language": "en",
                "trustScore": 4.9,
                "ratings": [5, 5],
                "createdAt": "2026-08-15T08:00:00Z"
            },
            {
                "id": "buyer-apolloretail-202",
                "name": "Reliance Agri Procurement",
                "phone": "9844001122",
                "passwordHash": hashed_pwd,
                "role": "buyer",
                "village": "Delhi Central Warehouse",
                "state": "Delhi",
                "coordinates": {"lat": 28.613, "lng": 77.209},
                "language": "en",
                "trustScore": 4.8,
                "ratings": [5],
                "createdAt": "2026-08-16T14:20:00Z"
            },
            {
                "id": "admin-ministry-301",


                "name": "Consumer Affairs Officer",
                "phone": "9998887770",
                "passwordHash": hashed_pwd,
                "role": "admin",
                "village": "Krishi Bhawan, New Delhi",
                "state": "Delhi",
                "coordinates": {"lat": 28.619, "lng": 77.214},
                "language": "en",
                "trustScore": 5.0,
                "ratings": [],
                "createdAt": "2026-08-01T00:00:00Z"
            },
            {
                "id": "admin-main-999",
                "name": "Ministry Admin (Command Center)",
                "phone": "9999999999",
                "passwordHash": bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode("utf-8"),
                "role": "admin",
                "village": "Ministry HQ, New Delhi",
                "state": "Delhi",
                "coordinates": {"lat": 28.614, "lng": 77.215},
                "language": "en",
                "trustScore": 5.0,
                "ratings": [],
                "createdAt": "2026-08-01T00:00:00Z"
            }
        ],
        "produce": [],
        "tickets": [],

        "mandiPrices": [
            { "commodity": "Tomato", "mandi": "Koyambedu Wholesale Mandi", "state": "Tamil Nadu", "lat": 13.069, "lng": 80.194, "pricePerKg": 18.0, "retailPricePerKg": 42.0, "updatedAt": "2026-08-31" },
            { "commodity": "Onion", "mandi": "Lasalgaon APMC Mandi", "state": "Maharashtra", "lat": 20.145, "lng": 74.227, "pricePerKg": 14.5, "retailPricePerKg": 34.0, "updatedAt": "2026-08-31" },
            { "commodity": "Potato", "mandi": "Agra Wholesale APMC", "state": "Uttar Pradesh", "lat": 27.176, "lng": 78.008, "pricePerKg": 11.0, "retailPricePerKg": 26.0, "updatedAt": "2026-08-31" },
            { "commodity": "Wheat", "mandi": "Karnal Grain Mandi", "state": "Haryana", "lat": 29.685, "lng": 76.990, "pricePerKg": 22.5, "retailPricePerKg": 38.0, "updatedAt": "2026-08-31" },
            { "commodity": "Rice", "mandi": "Kurnool Commercial APMC", "state": "Andhra Pradesh", "lat": 15.828, "lng": 78.037, "pricePerKg": 29.0, "retailPricePerKg": 52.0, "updatedAt": "2026-08-31" },
            { "commodity": "Banana", "mandi": "Koyambedu Fruit Market", "state": "Tamil Nadu", "lat": 13.069, "lng": 80.194, "pricePerKg": 13.0, "retailPricePerKg": 30.0, "updatedAt": "2026-08-31" },
            { "commodity": "Brinjal", "mandi": "Vashi Wholesale APMC", "state": "Maharashtra", "lat": 19.076, "lng": 72.998, "pricePerKg": 16.0, "retailPricePerKg": 36.0, "updatedAt": "2026-08-31" },
            { "commodity": "Cauliflower", "mandi": "Azadpur APMC Mandi", "state": "Delhi", "lat": 28.716, "lng": 77.175, "pricePerKg": 14.0, "retailPricePerKg": 32.0, "updatedAt": "2026-08-31" },
            { "commodity": "Green Chilli", "mandi": "Guntur APMC Yard", "state": "Andhra Pradesh", "lat": 16.306, "lng": 80.436, "pricePerKg": 35.0, "retailPricePerKg": 75.0, "updatedAt": "2026-08-31" },
            { "commodity": "Soyabean", "mandi": "Indore Mandi", "state": "Madhya Pradesh", "lat": 22.719, "lng": 75.857, "pricePerKg": 44.0, "retailPricePerKg": 78.0, "updatedAt": "2026-08-31" }
        ],
        "pools": [
            {
                "id": "pool-nashik-onion-01",
                "commodity": "Onion",
                "village": "Dindori Cluster, Nashik",
                "state": "Maharashtra",
                "hubCoordinates": {"lat": 20.201, "lng": 73.834},
                "targetQuantityKg": 10000,
                "pooledQuantityKg": 3200,
                "memberFarmerIds": ["farmer-ramesh-101"],
                "status": "open",
                "freightSavingPercent": 28.5,
                "createdAt": "2026-08-27T10:00:00Z"
            },
            {
                "id": "pool-agra-potato-02",
                "commodity": "Potato",
                "village": "Fatehabad Hub, Agra",
                "state": "Uttar Pradesh",
                "hubCoordinates": {"lat": 27.021, "lng": 78.312},
                "targetQuantityKg": 15000,
                "pooledQuantityKg": 12000,
                "memberFarmerIds": ["farmer-suresh-102"],
                "status": "open",
                "freightSavingPercent": 34.0,
                "createdAt": "2026-08-26T12:00:00Z"
            }
        ],
        "orders": [
            {
                "id": "ord-771",
                "produceId": "prod-tomato-01",
                "commodity": "Tomato",
                "farmerId": "farmer-lakshmi-103",
                "farmerName": "Lakshmi Ammal",
                "buyerId": "buyer-freshmart-201",
                "buyerName": "FreshMart Direct Retail",
                "quantityKg": 600,
                "pricePerKg": 24.50,
                "totalPrice": 14700.0,
                "status": "delivered",
                "rating": 5,
                "confirmedGrade": "A",
                "paymentStatus": "escrow_released",
                "transactionId": "TXN_771_PAID",
                "deliveryOrigin": {"lat": 13.143, "lng": 79.908, "name": "Tiruvallur, Chennai"},
                "deliveryDestination": {"lat": 19.033, "lng": 73.029, "name": "Navi Mumbai Hub"},
                "createdAt": "2026-08-29T11:00:00Z"
            },
            {
                "id": "ord-772",
                "produceId": "prod-onion-02",
                "commodity": "Onion",
                "farmerId": "farmer-ramesh-101",
                "farmerName": "Ramesh Kumar",
                "buyerId": "buyer-freshmart-201",
                "buyerName": "FreshMart Direct Retail",
                "quantityKg": 1000,
                "pricePerKg": 21.00,
                "totalPrice": 21000.0,
                "status": "confirmed",
                "paymentStatus": "held_in_escrow",
                "transactionId": "TXN_772_ESCROW",
                "deliveryOrigin": {"lat": 20.201, "lng": 73.834, "name": "Dindori, Nashik"},
                "deliveryDestination": {"lat": 19.033, "lng": 73.029, "name": "Navi Mumbai Hub"},
                "createdAt": "2026-08-30T14:30:00Z"
            }
        ],
        "advances": [
            {
                "id": "adv-101",
                "farmerId": "farmer-ramesh-101",
                "produceId": "prod-onion-02",
                "commodity": "Onion",
                "listingValue": 67200.0,
                "approvedAmount": 40320.0,
                "disbursedAmount": 40320.0,
                "status": "disbursed",
                "repaymentTerms": "Auto-deduct on buyer escrow release",
                "createdAt": "2026-08-27T12:00:00Z"
            }
        ],
        "payments": [
            {
                "id": "pay-txn-001",
                "orderId": "ord-771",
                "amount": 14700.0,
                "method": "UPI / NetBanking",
                "status": "settled",
                "escrowStatus": "released_to_farmer",
                "farmerShare": 14553.0,
                "platformFee": 147.0,
                "timestamp": "2026-08-29T11:05:00Z"
            }
        ]
    }
