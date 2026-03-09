#!/usr/bin/env python3
import os
import requests
import re
import json
from pathlib import Path

# Configuration
SUPABASE_ACCESS_TOKEN = "sbp_fcfd5bb05ed39c23b04ee43526dd29c845ad1259"
PROJECT_REF = "nlrgdhpmsittuwiiindq"
BASE_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/functions"

# List of functions to download
FUNCTIONS = [
    "send-chat-notification", "tripay-callback", "tripay-create-payment", "vip-status-check", 
    "tripay-store-payment", "pro-status-check", "update-subscription-status", 
    "send-payment-email", "auth-webhook", "send-reset-password-email", 
    "telegram-to-whatsapp", "chatgpt-renata", "expire-subscriptions", 
    "Watzap-telegram", "auth-rate-limit", "send-signup-email", "renata-analysis", 
    "downloadfolder", "media-compress", "save-avatar", "admin-update-user", 
    "studio-portrait", "photo-payment", "demo", "tripay-public-payment", 
    "public-callback", "send-ebook-email", "ebook-diet-mail"
]

def extract_source_code(binary_data):
    """Extract TypeScript/JavaScript source code from binary ESZIP data"""
    try:
        # Convert to string, handling potential encoding issues
        text_data = binary_data.decode('utf-8', errors='ignore')
        
        # Look for import statements or serve functions that indicate TypeScript code
        patterns = [
            r'(import\s+.*?from\s+["\'].*?["\'];.*?serve\s*\(.*?\)\s*=>.*?)(?=---SUPABASE|$)',
            r'(import.*?serve.*?\.ts.*?)(?=\n\n|\r\n\r\n|---)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_data, re.DOTALL | re.MULTILINE)
            if matches:
                # Clean up the match
                source = matches[0]
                if isinstance(source, tuple):
                    source = source[0]
                
                # Clean up extra whitespace and binary artifacts
                source = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', source)
                source = re.sub(r'\n\s*\n\s*\n', '\n\n', source)
                
                if 'import' in source and ('serve' in source or 'export' in source):
                    return source.strip()
        
        # Fallback: try to find any TypeScript-like code block
        lines = text_data.split('\n')
        start_idx = -1
        end_idx = -1
        
        for i, line in enumerate(lines):
            if 'import' in line and ('serve' in line or 'supabase' in line.lower()):
                start_idx = i
                break
        
        if start_idx >= 0:
            # Find the end of the function (look for closing braces or serve call)
            brace_count = 0
            in_serve_block = False
            
            for i in range(start_idx, len(lines)):
                line = lines[i]
                if 'serve(' in line:
                    in_serve_block = True
                
                if in_serve_block:
                    brace_count += line.count('{') - line.count('}')
                    if brace_count == 0 and (line.strip().endswith('});') or line.strip().endswith('}')):
                        end_idx = i
                        break
            
            if end_idx > start_idx:
                source = '\n'.join(lines[start_idx:end_idx + 1])
                # Clean binary artifacts
                source = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', source)
                return source.strip()
    
    except Exception as e:
        print(f"Error extracting source code: {e}")
    
    return None

def download_function(function_name):
    """Download a single function"""
    url = f"{BASE_URL}/{function_name}/body"
    headers = {
        "Authorization": f"Bearer {SUPABASE_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Downloading {function_name}...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Extract source code from binary data
        source_code = extract_source_code(response.content)
        
        if source_code:
            # Create directory structure
            func_dir = Path(f"supabase/functions/{function_name}")
            func_dir.mkdir(parents=True, exist_ok=True)
            
            # Save source code
            index_file = func_dir / "index.ts"
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(source_code)
            
            print(f"✅ Downloaded {function_name}")
            return True
        else:
            print(f"❌ Could not extract source code for {function_name}")
            return False
    
    except Exception as e:
        print(f"❌ Error downloading {function_name}: {e}")
        return False

def main():
    """Download all functions"""
    print("Downloading Supabase Edge Functions...")
    
    # Create base directory
    Path("supabase/functions").mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    for function_name in FUNCTIONS:
        if download_function(function_name):
            success_count += 1
    
    print(f"\nCompleted: {success_count}/{len(FUNCTIONS)} functions downloaded successfully")

if __name__ == "__main__":
    main()