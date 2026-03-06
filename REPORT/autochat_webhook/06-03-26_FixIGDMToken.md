# Report: Fix Autochat Webhook — Token Matrix & Auth Fix
**Date:** 06/03/26  
**File:** `elvisiongroup/supabase/functions/autochat-webhook/index.ts`

---

## ✅ Status: FIXED & WORKING

---

## Token Matrix — Wajib

| Use Case | Token Type | Secret | Domain | Auth Method | Auto-Refresh? |
|---|---|---|---|---|---|
| **Chat IG** (DM) | `IGAAN...` Instagram User Token | `IG_ACCESS_TOKEN` | `graph.instagram.com` | `Authorization: Bearer` header | ✅ Ya, 60 hari |
| **Reply IG** (comment reply) | `IGAAN...` Instagram User Token | `IG_ACCESS_TOKEN` | `graph.instagram.com` | `Authorization: Bearer` header | ✅ Ya, 60 hari |
| **Chat Facebook** (DM) | `EAA...` Page Access Token | `FB_PAGE_TOKEN` | `graph.facebook.com` | `access_token` di request body | ♾️ Never expires |
| **Reply Facebook** (comment reply) | `EAA...` Page Access Token | `FB_PAGE_TOKEN` | `graph.facebook.com` | `access_token` di request body | ♾️ Never expires |

---

## Supabase Secrets Yang Dibutuhkan

```
IG_ACCESS_TOKEN  = IGAANxxxx...   (Instagram User Access Token, expires 60 hari)
FB_PAGE_TOKEN    = EAAxxx...      (Page Access Token, NEVER expires)
```

Set via Supabase Dashboard → Project Settings → Edge Functions → Secrets

---

## Auto-Refresh IG Token (IGAAN)

**Bisa!** Instagram long-lived token bisa di-refresh sebelum expired (dalam 60 hari):

```
GET https://graph.instagram.com/refresh_access_token
    ?grant_type=ig_refresh_token
    &access_token=IGAAN_TOKEN_LAMA
```

Response: token baru valid 60 hari lagi.

**Cara automasi:** Buat Supabase Edge Function + cron job (pg_cron) yang jalan setiap 50 hari untuk refresh token dan update secret otomatis.

---

## Root Cause & Fix Summary

### Problem
- Token lama `IGAAN...` di secret `IG_ACCESS_TOKEN` sudah **expired**
- Token dikirim sebagai query string `?access_token=` — Instagram API **menolak** format ini
- `GLOBAL_TOKEN` satu dipakai untuk IG dan FB — padahal token yang dibutuhkan **berbeda**

### Fix Applied

1. **Token placement** → Ubah dari query string ke `Authorization: Bearer` header untuk semua IG calls (match dengan `ig-webhook` yang working)
2. **Token separation** → Pisah `GLOBAL_IG_TOKEN` (untuk IG) dan `GLOBAL_FB_TOKEN` (untuk FB)
3. **FB comment reply** → Token dipindah dari query string ke request body

### Code Pattern

**Instagram (IGAAN token):**
```ts
await fetch(`https://graph.instagram.com/v22.0/${igUserId}/messages`, {
    method: "POST",
    headers: {
        'Authorization': `Bearer ${IGAAN_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipient: {...}, message: {...} })
});
```

**Facebook (EAA Page Token):**
```ts
await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        access_token: EAA_PAGE_TOKEN,
        recipient: {...},
        message: {...}
    })
});
```

---

## Cara Dapat Token

### IGAAN Token (IG)
1. Dari Instagram App (Instagram API, bukan Graph Explorer)  
2. App ID: `921459940839762`, App Secret: `6767795ff2f068e2f9a29b9a887070e0`
3. Expires 60 hari, refresh manual atau automasi via cron

### EAA Page Token (FB)
1. Graph API Explorer → pilih App → Generate Access Token → pilih **Page** bukan User
2. Atau: `GET /me/accounts?fields=id,access_token` dari User Token → ambil `access_token` dari page
3. **Never expires** selama permissions tidak dicabut
