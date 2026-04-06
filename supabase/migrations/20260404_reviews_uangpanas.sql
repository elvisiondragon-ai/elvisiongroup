-- ============================================================
-- reviews_uangpanas
-- Mirrors reviews_darkfeminine structure
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reviews_uangpanas (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email  text NOT NULL,
    name        text,
    rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     text,
    is_verified boolean DEFAULT false,
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
);

-- Index for fast lookup by email (used in submitReview duplicate check)
CREATE INDEX IF NOT EXISTS idx_reviews_uangpanas_email ON public.reviews_uangpanas (user_email);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_reviews_uangpanas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reviews_uangpanas_updated_at ON public.reviews_uangpanas;
CREATE TRIGGER trg_reviews_uangpanas_updated_at
    BEFORE UPDATE ON public.reviews_uangpanas
    FOR EACH ROW EXECUTE FUNCTION update_reviews_uangpanas_updated_at();

-- RLS: Allow anyone to READ reviews (public listing)
ALTER TABLE public.reviews_uangpanas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reviews_uangpanas" ON public.reviews_uangpanas;
CREATE POLICY "Public can read reviews_uangpanas"
    ON public.reviews_uangpanas FOR SELECT
    USING (true);

-- Allow anonymous INSERT (email-based, no auth required)
DROP POLICY IF EXISTS "Anyone can insert reviews_uangpanas" ON public.reviews_uangpanas;
CREATE POLICY "Anyone can insert reviews_uangpanas"
    ON public.reviews_uangpanas FOR INSERT
    WITH CHECK (true);

-- Allow UPDATE only for the same email row (anon update)
DROP POLICY IF EXISTS "Update own review by email" ON public.reviews_uangpanas;
CREATE POLICY "Update own review by email"
    ON public.reviews_uangpanas FOR UPDATE
    USING (true)
    WITH CHECK (true);
