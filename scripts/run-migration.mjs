import pg from 'pg';
const { Client } = pg;

const sql = `
-- ============================================================================
-- All About Pawz OS: PostgreSQL Supabase Schema Migration (Production v1.0)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    notes TEXT,
    vip BOOLEAN DEFAULT false,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOGS / PETS TABLE
CREATE TABLE IF NOT EXISTS public.dogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT,
    weight TEXT,
    gender TEXT,
    color TEXT,
    photo_url TEXT,
    vaccinations_current BOOLEAN DEFAULT true,
    rabies_exp_date DATE,
    special_handling_notes TEXT,
    behavioral_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STAFF & GROOMERS TABLE
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Groomer',
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    commission_rate NUMERIC(5, 2) DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES CATALOG
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Grooming',
    base_price NUMERIC(10, 2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKINGS & APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    dog_id UUID REFERENCES public.dogs(id) ON DELETE SET NULL,
    groomer_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    owner_name TEXT,
    dog_name TEXT,
    breed TEXT,
    email TEXT,
    phone TEXT,
    service TEXT NOT NULL,
    service_price TEXT DEFAULT '$85.00',
    deposit_amount TEXT DEFAULT '$25.00',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    payment_status TEXT DEFAULT 'Unpaid',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS & OMS FULFILLMENT TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    fulfillment_status TEXT DEFAULT 'UNFULFILLED',
    payment_status TEXT DEFAULT 'PAID',
    shipping_carrier TEXT,
    tracking_number TEXT,
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    sku TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY & SALON SUPPLIES TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Retail',
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 5,
    unit TEXT DEFAULT 'units',
    barcode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS & TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tip_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_method TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    status TEXT DEFAULT 'succeeded',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING',
    due_date DATE DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FULL TEXT SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_search ON public.customers USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || coalesce(email, '') || ' ' || coalesce(phone, '')));
CREATE INDEX IF NOT EXISTS idx_dogs_search ON public.dogs USING gin(to_tsvector('english', name || ' ' || breed));
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.customers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Public Insert Access') THEN
        CREATE POLICY "Public Insert Access" ON public.customers FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Public Update Access') THEN
        CREATE POLICY "Public Update Access" ON public.customers FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dogs' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.dogs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dogs' AND policyname = 'Public Insert Access') THEN
        CREATE POLICY "Public Insert Access" ON public.dogs FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dogs' AND policyname = 'Public Update Access') THEN
        CREATE POLICY "Public Update Access" ON public.dogs FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.bookings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public Insert Access') THEN
        CREATE POLICY "Public Insert Access" ON public.bookings FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Public Update Access') THEN
        CREATE POLICY "Public Update Access" ON public.bookings FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.orders FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Public Insert Access') THEN
        CREATE POLICY "Public Insert Access" ON public.orders FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.payments FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'invoices' AND policyname = 'Public Read Access') THEN
        CREATE POLICY "Public Read Access" ON public.invoices FOR SELECT USING (true);
    END IF;
END $$;
`;

async function run() {
  const connectionString = process.env.SUPABSE_SESSION_POOLER || process.env.SUPABSE_DIRECT_CONNECTION || process.env.DATABASE_URL;
  console.log('Connecting to database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully! Running migration...');
    await client.query(sql);
    console.log('Migration executed successfully!');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Public tables in Supabase:');
    console.table(res.rows);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
