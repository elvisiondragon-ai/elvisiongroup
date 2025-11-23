-- This script adds a nullable user_id column to the global_product table.
-- This is the first step towards implementing Row Level Security.

-- 1. Add user_id column
-- The column is of type UUID and is nullable to allow for anonymous checkouts.
ALTER TABLE public.global_product
ADD COLUMN user_id UUID;

-- Note: A foreign key constraint to auth.users(id) is not added here
-- to avoid potential errors if there is existing data in the table.
-- You might want to add it later for better data integrity:
-- ALTER TABLE public.global_product
-- ADD CONSTRAINT global_product_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES auth.users(id);
