import subprocess
import sys

# The full list of your Supabase functions
FUNCTIONS_TO_DOWNLOAD = [
    "send-chat-notification", "tripay-callback", "tripay-create-payment", "vip-status-check",
    "tripay-store-payment", "pro-status-check", "update-subscription-status",
    "send-payment-email", "auth-webhook", "send-reset-password-email",
    "telegram-to-whatsapp", "chatgpt-renata", "expire-subscriptions",
    "Watzap-telegram", "auth-rate-limit", "send-signup-email", "renata-analysis",
    "downloadfolder", "media-compress", "save-avatar", "admin-update-user",
    "studio-portrait", "photo-payment", "demo", "tripay-public-payment",
    "public-callback", "send-ebook-email", "ebook-diet-mail"
]

def run_command(command):
    """
    Executes a shell command, prints its output in real-time, and checks for errors.
    Returns True for success, False for failure.
    """
    try:
        # Using Popen for real-time output
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8')
        
        # Read and print output line by line
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        
        # Check the return code
        if process.returncode != 0:
            print(f"\n❌ Error: Command '{' '.join(command)}' failed with return code {process.returncode}", file=sys.stderr)
            return False
            
        return True
        
    except FileNotFoundError:
        print(f"❌ Error: The 'supabase' command was not found. Make sure the Supabase CLI is installed and in your system's PATH.", file=sys.stderr)
        return False
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}", file=sys.stderr)
        return False

def main():
    """
    Loops through all functions and downloads them one by one using the Supabase CLI.
    """
    print("🚀 Starting to download all Supabase Edge Functions...")
    
    success_count = 0
    total_count = len(FUNCTIONS_TO_DOWNLOAD)
    
    for i, func_name in enumerate(FUNCTIONS_TO_DOWNLOAD):
        print(f"\n--- Downloading function {i+1}/{total_count}: {func_name} ---")
        command = ["supabase", "functions", "download", func_name]
        
        if run_command(command):
            success_count += 1
        else:
            print(f"🛑 Failed to download '{func_name}'. Please check the error above.")
            # You can choose to stop on the first error by uncommenting the next line
            # break 

    print(f"\n✅ Download process finished. Successfully downloaded {success_count}/{total_count} functions.")
    if success_count < total_count:
        print("Some functions failed to download. Please review the log.")

if __name__ == "__main__":
    main()
