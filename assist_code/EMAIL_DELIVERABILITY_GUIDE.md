# Email Deliverability Optimization Guide

## Why Emails Go to Spam?
When you send emails (especially via APIs like Mailketing), Gmail/Yahoo checks:
1.  **"Are you really elvisiongroup.com?"** (Authentication)
2.  **"Is this content safe?"** (Reputation)

If your DNS records aren't set, your emails look like:
`From: support@elvisiongroup.com (via mailketing.co.id)`
This is a HUGE red flag for spam filters.

## Step-by-Step Fix (Technical)

You need to add these records to your **Domain DNS Settings** (where you bought `elvisiongroup.com`, e.g., Namecheap, Cloudflare, Godaddy).

### 1. SPF Record (Sender Policy Framework)
Tells the world "Mailketing is allowed to send email for me".

*   **Type:** TXT
*   **Host:** @ (or blank)
*   **Value:** `v=spf1 include:mailketing.co.id ~all`
    *   *Note: If you already have an SPF record (like for Google Workspace), MERGE them. Do NOT create two SPF records.*
    *   *Merged Example:* `v=spf1 include:_spf.google.com include:mailketing.co.id ~all`

### 2. DKIM (DomainKeys Identified Mail)
Signs the email digitally so Gmail knows it wasn't tampered with.
*You usually need to get the specific DKIM key from your Mailketing Dashboard > Sender Domains.*

*   **Type:** CNAME (usually) or TXT
*   **Host:** `mailketing._domainkey` (Check Mailketing docs for the exact selector)
*   **Value:** (Provided by Mailketing dashboard)

### 3. DMARC (Domain-based Message Authentication)
Tells Gmail what to do if SPF/DKIM fails.

*   **Type:** TXT
*   **Host:** `_dmarc`
*   **Value:** `v=DMARC1; p=none; rua=mailto:support@elvisiongroup.com`
    *   *Start with `p=none` to monitor. Later change to `p=quarantine`.*

## Step-by-Step Fix (Content)

We have already optimized the subject lines in the code to remove "ALL CAPS" spam triggers.

**Further Tips:**
1.  **Warm Up:** If this is a new domain, don't send 5,000 emails on Day 1. Increase volume slowly.
2.  **Engagement:** Ask users to "Reply" to your email (e.g., "Reply 'YES' to confirm receipt"). This signals to Gmail that you are a friend, not a bot.
3.  **Unsubscribe:** Ensure every marketing email has a clear Unsubscribe link (Mailketing usually handles this).

## How to Test?
1.  Go to [https://www.mail-tester.com/](https://www.mail-tester.com/)
2.  Send a test email from your system to the address they give you.
3.  Check your score. Aim for 10/10. It will tell you exactly which DNS record is missing.
