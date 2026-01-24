-- Find all buyers who have successfully PAID for Feminine Magnetism
SELECT 
    created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' as waktu_bayar_jakarta,
    name as nama_pembeli,
    email,
    phone as whatsapp,
    amount as total_bayar,
    product_name as produk,
    tripay_reference as referensi
FROM 
    public.global_product
WHERE 
    status = 'PAID'
    AND (
        product_name ILIKE '%feminine%' 
        OR product_name ILIKE '%Feminine Magnetism%'
    )
ORDER BY 
    created_at DESC;
