-- CTWA Tracking Setup
CREATE TABLE IF NOT EXISTS global_ctwa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL,
    ctwa_clid TEXT NOT NULL,
    brand TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast phone lookup
CREATE INDEX IF NOT EXISTS idx_global_ctwa_phone ON global_ctwa(phone);

-- Add ctwa_clid to global_product for conversion tracking
ALTER TABLE global_product ADD COLUMN IF NOT EXISTS ctwa_clid TEXT;
