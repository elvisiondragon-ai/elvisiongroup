-- Clean up UNPAID transactions from global_product
-- Only deletes records older than 24 hours to prevent disrupting active checkouts

DELETE FROM public.global_product
WHERE status = 'UNPAID'
AND created_at < NOW() - INTERVAL '24 hours';

-- Optional: If you want to clear ALL unpaid immediately (Use with caution!)
-- DELETE FROM public.global_product WHERE status = 'UNPAID';
