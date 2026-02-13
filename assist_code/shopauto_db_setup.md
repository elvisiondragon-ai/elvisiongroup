# ShopAuto AI Database & Setup Guide

This guide details the database modifications and configuration steps required to activate the ShopAuto AI features.

## 1. Database Modification (Supabase)

Run the following SQL in your Supabase SQL Editor to add the settings storage to the existing `profiles` table:

```sql
-- Add shopauto_settings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shopauto_settings JSONB DEFAULT '{}'::jsonb;

-- Recommended: Add an index for shop_id lookups (used by Webhook Handler)
CREATE INDEX IF NOT EXISTS idx_profiles_shopauto_shop_id 
ON public.profiles ((shopauto_settings->>'shopeShopId'));
```

## 2. JSON Structure Reference

The `shopauto_settings` column stores the following configuration:

```json
{
  "aiProviderType": "system",
  "aiEngine": "openai", 
  "apiKey": "sk-...",
  "isShopeeConnected": true,
  "shopeStoreName": "Store Name",
  "shopeShopId": "12345678",
  "shopePartnerId": "12345",
  "shopePartnerKey": "...",
  "autoChatEnabled": true,
  "autoOrderEnabled": true,
  "aiKnowledgeEssay": "...",
  "whatsappDestination": "628...",
  "whatsappForwardEnabled": true,
  "waAdminType": "system",
  "isWaConnected": true,
  "waAccount": "+62...",
  "waBackendUrl": "http://..."
}
```

## 3. Webhook Integration

To receive real-time order and chat updates, configure the following URL in your **Shopee Open Platform Console**:

**Webhook Push URL:**
`https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/shopauto-handler`

### Required Webhook Events:
- **Code 3:** Order Status Update (For Order Detail Capture)
- **Code 10:** New Message (For AI Auto Chat)

## 4. Backend Dependencies

1. **WhatsApp Backend:** Ensure the Node.js server in `elvisiongroup/whatsapp-backend` is running and accessible by the Edge Function (if using "Admin Kamu").
2. **Green-API:** Used by default for "Admin Kami".
3. **AI Engine:** Supports OpenAI and Gemini 2.5 Flash.
4. **Edge Function:** `shopauto-handler`.
