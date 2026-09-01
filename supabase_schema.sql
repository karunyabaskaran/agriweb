-- ============================================================
-- AGRIWEB FULL-STACK SUPABASE DATABASE SCHEMA
-- Copy and paste this script into Supabase SQL Editor & click RUN!
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    village TEXT,
    state TEXT,
    coordinates JSONB DEFAULT '{"lat": 19.076, "lng": 72.877}'::jsonb,
    language TEXT DEFAULT 'en',
    trust_score NUMERIC DEFAULT 4.5,
    ratings JSONB DEFAULT '[5, 4]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCE MARKETPLACE TABLE
CREATE TABLE IF NOT EXISTS public.produce (
    id TEXT PRIMARY KEY,
    farmer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    farmer_name TEXT,
    farmer_phone TEXT,
    farmer_trust_score NUMERIC DEFAULT 4.5,
    commodity TEXT NOT NULL,
    variety TEXT DEFAULT 'Standard Hybrid',
    quantity_kg NUMERIC NOT NULL,
    asking_price_per_kg NUMERIC NOT NULL,
    grade TEXT DEFAULT 'A',
    village TEXT,
    state TEXT,
    coordinates JSONB,
    harvest_date TEXT,
    shelf_life_days INT DEFAULT 10,
    status TEXT DEFAULT 'listed' CHECK (status IN ('listed', 'pooled', 'sold')),
    pool_id TEXT,
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DIRECT ORDERS & ESCROW TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    produce_id TEXT REFERENCES public.produce(id) ON DELETE CASCADE,
    buyer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    buyer_name TEXT,
    buyer_phone TEXT,
    farmer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    farmer_name TEXT,
    commodity TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    escrow_status TEXT DEFAULT 'funded' CHECK (escrow_status IN ('funded', 'released', 'disputed', 'refunded')),
    order_status TEXT DEFAULT 'dispatched' CHECK (order_status IN ('dispatched', 'delivered', 'completed')),
    farmer_rating INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MANDI BENCHMARK PRICES TABLE
CREATE TABLE IF NOT EXISTS public.mandi_prices (
    id TEXT PRIMARY KEY,
    commodity TEXT UNIQUE NOT NULL,
    mandi TEXT NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    retail_price_per_kg NUMERIC NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMIN PRICE CAPS TABLE
CREATE TABLE IF NOT EXISTS public.price_caps (
    id TEXT PRIMARY KEY,
    commodity TEXT UNIQUE NOT NULL,
    max_price_per_kg NUMERIC NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_produce_status ON public.produce(status);
CREATE INDEX IF NOT EXISTS idx_produce_commodity ON public.produce(commodity);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer ON public.orders(farmer_id);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PRODUCTION PROTECTION
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

-- 6. LOGISTICS TABLES
CREATE TABLE IF NOT EXISTS public.warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    license_plate TEXT NOT NULL,
    capacity NUMERIC NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available','in_transit','maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.routes (
    id TEXT PRIMARY KEY,
    source_warehouse_id TEXT REFERENCES public.warehouses(id) ON DELETE SET NULL,
    destination_farm_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
    distance_km NUMERIC,
    estimated_time INTERVAL,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned','in_progress','completed','cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.demand_forecasts (
    id TEXT PRIMARY KEY,
    produce_id TEXT REFERENCES public.produce(id) ON DELETE CASCADE,
    forecast_date DATE,
    predicted_quantity NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ALLOW PUBLIC ANONYMOUS / SERVICE ACCESS POLICIES
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read produce" ON public.produce FOR SELECT USING (true);
CREATE POLICY "Allow public insert produce" ON public.produce FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- INITIAL SEED DATA FOR MANDI PRICE RADAR
INSERT INTO public.mandi_prices (id, commodity, mandi, price_per_kg, retail_price_per_kg)
VALUES 
    ('mp-1', 'Onion', 'Lasalgaon APMC, Nashik', 18.5, 38.0),
    ('mp-2', 'Tomato', 'Kolar Mandi, Karnataka', 22.0, 45.0),
    ('mp-3', 'Potato', 'Agra Mandi, UP', 16.0, 32.0),
    ('mp-4', 'Wheat', 'Khanna APMC, Punjab', 24.0, 42.0)
ON CONFLICT (commodity) DO NOTHING;
