-- Fix global_ctwa to have a unique constraint on phone for upsert to work
ALTER TABLE global_ctwa ADD CONSTRAINT global_ctwa_phone_unique UNIQUE (phone);
