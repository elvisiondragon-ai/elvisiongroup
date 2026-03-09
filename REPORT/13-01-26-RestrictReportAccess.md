# Restrict Report Sales Access

## Task
Restrict access to the `/reportsales` route to specific allowed email addresses.

## Date
13 January 2026

## Status
Success

## Details
- **Allowed Emails:** `elvisiondragon@gmail.com`, `dragon@yahoo.com`, `elreyzandra@gmail.com`.
- **Action:** 
    - Added `checkAccess` function in `src/pages/reportsales.tsx` triggered on component mount.
    - Uses `supabase.auth.getUser()` to retrieve the current user's email.
    - If the user is not logged in or their email is not in the allowed list, they are redirected to the home page (`/`) using `useNavigate` from `react-router-dom`.
    - `fetchSales` is only called if access is granted.
