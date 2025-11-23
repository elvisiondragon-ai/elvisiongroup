-- Create a custom type for subscription status to ensure data consistency
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending_payment');

-- Create the global_member table to store subscription details
-- user_id is the Primary Key, linking directly to auth.users
CREATE TABLE public.global_member (
    user_id uuid NOT NULL PRIMARY KEY,
    user_email text,
    status public.subscription_status NOT NULL DEFAULT 'pending_payment',
    start_date timestamptz,
    end_date timestamptz,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Add comments for clarity on the table and key columns
COMMENT ON TABLE public.global_member IS 'Manages ecosystem-wide memberships. An active status may grant product discounts.';
COMMENT ON COLUMN public.global_member.user_id IS 'Primary key, foreign key to the user in auth.users.';
COMMENT ON COLUMN public.global_member.user_email IS 'The email of the user at the time of membership creation/update.';
COMMENT ON COLUMN public.global_member.end_date IS 'The timestamp when the membership expires.';
COMMENT ON COLUMN public.global_member.status IS 'Current status of the membership (e.g., active, expired).';

-- Enable Row Level Security to protect user data
ALTER TABLE public.global_member ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing users to view their own membership details
CREATE POLICY "Allow individual read access"
ON public.global_member
FOR SELECT
USING (auth.uid() = user_id);
