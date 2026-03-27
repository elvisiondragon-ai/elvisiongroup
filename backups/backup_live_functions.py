import subprocess
import json
import os
from datetime import datetime

# Configuration
PROJECT_REF = "nlrgdhpmsittuwiiindq"
BACKUP_ROOT = "/Users/eldragon/git/el/elvisiongroup/backups/live_functions"

def run_command(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}")
        print(f"Status code: {e.returncode}")
        print(f"Output: {e.output}")
        print(f"Stderr: {e.stderr}")
        return None

def main():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = os.path.join(BACKUP_ROOT, timestamp)
    os.makedirs(backup_path, exist_ok=True)
    
    print(f"🚀 Starting backup of live functions to: {backup_path}")
    
    # 1. Get the list of functions in JSON format
    print("📋 Fetching function list...")
    list_output = run_command(f"npx supabase functions list --project-ref {PROJECT_REF} --output json")
    
    if not list_output:
        print("❌ Failed to fetch function list. Ensure you are logged in.")
        return

    try:
        functions = json.loads(list_output)
    except json.JSONDecodeError:
        print("❌ Failed to parse function list JSON.")
        return

    # 2. Iterate and download each function
    success_count = 0
    fail_count = 0
    
    # Supabase might return a list of objects or a single object depending on version
    if not isinstance(functions, list):
        functions = [functions]

    for func in functions:
        name = func.get('slug') or func.get('name')
        if not name:
            continue
            
        print(f"⬇️  Downloading function: {name}...")
        
        # We download into the backup_path
        # Note: 'supabase functions download' downloads into the project's functions folder by default.
        # To avoid overwriting local work, we can temporarily change the workdir or move the file.
        # But for this script, we'll try to download it specifically.
        
        cmd = f"npx supabase functions download {name} --project-ref {PROJECT_REF} --workdir {backup_path}"
        
        # We must create the folder for the function inside the backup path first
        os.makedirs(os.path.join(backup_path, "supabase/functions", name), exist_ok=True)
        
        download_result = run_command(cmd)
        
        if download_result is not None:
            print(f"✅ Successfully backed up: {name}")
            success_count += 1
        else:
            print(f"⚠️  Failed to back up: {name}")
            fail_count += 1

    print("\n--- Backup Summary ---")
    print(f"Total: {len(functions)}")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Location: {backup_path}")

if __name__ == "__main__":
    main()
