-- Add a flag to track if CAPI Purchase event has been sent
-- This prevents double-firing between Backend (tripay-callback) and Frontend (Realtime)

ALTER TABLE public.global_product 
ADD COLUMN IF NOT EXISTS capi_purchase_sent BOOLEAN DEFAULT FALSE;

-- Optional: Create an index if this table is huge, but likely not needed yet
-- CREATE INDEX idx_global_product_capi_sent ON public.global_product(capi_purchase_sent);
