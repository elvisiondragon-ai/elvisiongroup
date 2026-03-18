// ig-webhook is dead function dont fucking touch u retard

# El Vision Group - Next.js

## 🚀 MANDATORY RULE
**ALWAYS** run `npm run build` immediately after making any code changes. 
Do not assume the code works just because it looks right. Next.js is strict about types and SSR; the build must pass 100% before any task is considered done.

## 📱 Local Network Access
To access the app from your mobile phone via Wi-Fi:
1. Run `npm run dev`
2. The correct URL (e.g., `http://192.168.100.152:3002`) will be displayed in the console.

## 🔐 Environment Variables
- All frontend-accessible environment variables **MUST** start with `NEXT_PUBLIC_`.
- Example: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never remove `.env` or `.next/` from `.gitignore`.

## 🛠️ Development Mandates
See `GEMINI.md` for full architectural rules and security protocols.
