# Download Supabase Edge Functions (Simplified)

Pastikan Anda sudah menjalankan `supabase link --project-ref nlrgdhpmsittuwiiindq` sebelum menggunakan perintah ini.

```bash
mkdir -p downloads; \
echo "Mulai mendownload semua fungsi..."; \
supabase functions download send-chat-notification & \
supabase functions download tripay-callback & \
supabase functions download tripay-create-payment & \
supabase functions download vip-status-check & \
supabase functions download tripay-store-payment & \
supabase functions download pro-status-check & \
supabase functions download update-subscription-status & \
supabase functions download send-payment-email & \
supabase functions download auth-webhook & \
supabase functions download send-reset-password-email & \
supabase functions download telegram-to-whatsapp & \
supabase functions download chatgpt-renata & \
supabase functions download expire-subscriptions & \
supabase functions download Watzap-telegram & \
supabase functions download auth-rate-limit & \
supabase functions download send-signup-email & \
supabase functions download renata-analysis & \
supabase functions download media-compress & \
supabase functions download save-avatar & \
supabase functions download admin-update-user & \
supabase functions download studio-portrait & \
supabase functions download photo-payment & \
supabase functions download demo & \
supabase functions download public-callback & \
supabase functions download auto-reply & \
supabase functions download capi-universal & \
supabase functions download send-ebooks-email & \
wait; \
echo "Download selesai. Sedang melakukan zip..."; \
zip -r downloads/functionset.zip supabase/functions; \
echo "Selesai. File tersimpan di downloads/functionset.zip"
```
