import requests
import json
import sys

def main():
    print("==============================================")
    print("META LONG-LIVED & PAGE TOKEN GENERATOR")
    print("App Name: AI EASY-IG")
    print("==============================================\n")

    app_id = "1234463122198129"
    app_secret = "21f9cc6672ac748222d64725f185395c"
    short_lived_token = input("Enter your Short-Lived User Token (from Graph Explorer): ").strip()
    page_id = input("Enter your Facebook Page ID (optional, hit enter to fetch all pages): ").strip()

    if not app_id or not short_lived_token:
        print("Error: App ID and Short-Lived Token are required.")
        sys.exit(1)

    print("\n[1/3] Exchanging for Long-Lived User Token (2 Months)...")
    url_1 = f"https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_token}"
    
    res_1 = requests.get(url_1)
    data_1 = res_1.json()

    if "error" in data_1:
        print("\n❌ Error generating Long-Lived Token:")
        print(json.dumps(data_1, indent=2))
        sys.exit(1)

    long_lived_user_token = data_1.get("access_token")
    print("✅ Success! Long-Lived User Token retrieved.")
    print(f"Token: {long_lived_user_token[:20]}...\n")

    print("[2/3] Fetching your User ID...")
    url_2 = f"https://graph.facebook.com/v22.0/me?access_token={long_lived_user_token}"
    res_2 = requests.get(url_2)
    data_2 = res_2.json()

    if "error" in data_2:
        print("\n❌ Error fetching User ID:")
        print(json.dumps(data_2, indent=2))
        sys.exit(1)

    user_id = data_2.get("id")
    print(f"✅ Success! User ID: {user_id}\n")

    print("[3/3] Fetching Permanent Page Access Tokens...")
    url_3 = f"https://graph.facebook.com/v22.0/{user_id}/accounts?access_token={long_lived_user_token}"
    res_3 = requests.get(url_3)
    data_3 = res_3.json()

    if "error" in data_3:
        print("\n❌ Error fetching Pages:")
        print(json.dumps(data_3, indent=2))
        sys.exit(1)

    pages = data_3.get("data", [])
    if not pages:
        print("⚠️ No pages found for this user.")
        sys.exit(0)

    print("\n🎉 DONE! Here are your Permanent Page Access Tokens (Never Expire):\n")
    
    for page in pages:
        if page_id and page.get('id') != page_id:
            continue
            
        print("-" * 50)
        print(f"Page Name: {page.get('name')}")
        print(f"Page ID:   {page.get('id')}")
        print(f"PERMANENT TOKEN:")
        print(page.get('access_token'))
        print("-" * 50)
        
    print("\nCopy the PERMANENT TOKEN above and set it as your FB_PAGE_TOKEN in Supabase Secrets.")

if __name__ == "__main__":
    main()
