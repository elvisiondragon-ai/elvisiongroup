-- Reviews tables for all brands
-- Each table stores user reviews with email, rating, content, and verification status

-- 1. Drelf Reviews
CREATE TABLE IF NOT EXISTS drelf_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    isi_review TEXT NOT NULL,
    status TEXT DEFAULT 'non-verified', -- 'verified' or 'non-verified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Parfum Reviews
CREATE TABLE IF NOT EXISTS parfum_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    isi_review TEXT NOT NULL,
    status TEXT DEFAULT 'non-verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Jewelry Reviews
CREATE TABLE IF NOT EXISTS jewelry_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    isi_review TEXT NOT NULL,
    status TEXT DEFAULT 'non-verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HungryLater Reviews
CREATE TABLE IF NOT EXISTS hungry_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    isi_review TEXT NOT NULL,
    status TEXT DEFAULT 'non-verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically verify reviews based on global_product paid status
-- This can be triggered or run periodically, but for now we'll handle it during fetch or via an admin tool
-- Alternatively, we can add a trigger on global_product update to PAID
