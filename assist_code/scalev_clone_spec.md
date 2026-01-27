# Project Specification: Scalev.id Clone
**Target**: Create a high-performance Landing Page Builder & Order Management System (OMS) website similar to [Scalev.id](https://scalev.id).

## 1. Project Objective
Build a modern, high-converting SaaS landing page that promotes a "Super Fast" landing page builder and order management system tailored for advertisers and online sellers. The key value propositions are speed, conversion optimization (autofill), and local Indonesian integrations (payments/couriers).

## 2. Visual Identity & Design System
*   **Vibe**: Professional, Minimalist, Performance-Focused.
*   **Color Palette**:
    *   *Primary*: Trust Blue or Growth Green (e.g., `#0066FF` or `#10B981`).
    *   *Background*: Clean White (`#FFFFFF`) to Light Gray (`#F9FAFB`) for sections.
    *   *Text*: Dark Slate (`#1E293B`) for headings, Cool Gray (`#475569`) for body.
*   **Typography**: Modern Sans-Serif (e.g., *Inter*, *Roboto*, or *Plus Jakarta Sans*). Bold headings, readable body text.
*   **UI Elements**: 
    *   High-contrast CTA buttons (rounded corners).
    *   Card-based layouts for Features and Pricing.
    *   Clean icons (Lucide/Heroicons) representing speed, analytics, and shipping.

## 3. Page Structure & Content

### A. Navbar
*   **Logo**: Text-based or simple icon.
*   **Links**: Features, Pricing, Tutorial/Guide.
*   **Auth**: "Login" (Secondary), "Register Now" (Primary CTA).

### B. Hero Section
*   **Headline**: "Buat Landing Page Cepat & Kelola Orderan Otomatis" (Create Fast Landing Pages & Manage Orders Automatically).
*   **Sub-headline**: "Platform landing page builder yang dioptimalkan untuk kecepatan dan konversi tinggi. Dilengkapi fitur Autofill dan integrasi pembayaran lengkap."
*   **CTA**: "Coba Gratis Sekarang" (Try for Free Now).
*   **Visual**: A dashboard mockup or a speed test graphic showing "100/100" score.

### C. Key Features (The "Why Us")
*   **Super Fast Loading**: Optimized for mobile and ads.
*   **Autofill Checkout**: Pre-fills customer data to increase conversion rates.
*   **Local Integrations**:
    *   *Payment*: QRIS, GoPay, ShopeePay, DANA, Virtual Accounts (via Xendit/Moota).
    *   *Couriers*: Lincah, Mengantar (Ongkir checks).
*   **Analytics**: Pixel, CAPI (Facebook/TikTok) integration.
*   **Custom Domain**: Use your own .com/.id domain.

### D. Pricing Section (Tiered)
Display 5 tiers with monthly/yearly toggle.

1.  **FREE**
    *   Unlimited Orders.
    *   3 Active Landing Pages.
    *   5% Fee per e-payment transaction.
    *   Basic Integrations.
2.  **LITE (Rp 57k/mo)**
    *   200 Orders/mo.
    *   Unlimited Landing Pages.
    *   1 Custom Domain.
3.  **BASIC (Rp 147k/mo)**
    *   6,000 Orders/mo.
    *   3 Custom Domains.
    *   5 Team Members.
    *   Fee: 1% (with custom domain).
4.  **PRO (Rp 247k/mo)**
    *   25,000 Orders/mo.
    *   10 Custom Domains.
    *   100 Team Members.
5.  **ULTIMATE (Rp 497k/mo)**
    *   Unlimited everything.
    *   20 Custom Domains.

### E. Social Proof / Trust
*   "Trusted by [Number]+ Sellers"
*   Logos of integrated partners (TikTok, Meta, Xendit, JNE, J&T).

### F. Footer
*   Links: Support, Terms of Service, Privacy Policy.
*   Copyright info.
*   Social Media icons.

## 4. Technical Stack (Recommended)
*   **Frontend**: React (Vite) or Next.js.
*   **Styling**: Tailwind CSS.
*   **Icons**: Lucide React.
*   **Animation**: Framer Motion (for subtle fade-ins).

## 5. Implementation Steps for DEV AI
1.  **Scaffold**: Set up a new React project with Tailwind.
2.  **Components**: Create reusable `Button`, `Card`, `PricingTable`, `Navbar`.
3.  **Layout**: Build the landing page sections sequentially (Hero -> Features -> Pricing).
4.  **Responsiveness**: Ensure mobile-first design (critical for this niche).
5.  **Polish**: Add hover effects and "sticky" navbar.
