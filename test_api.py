#!/usr/bin/env python3
"""
Test script to verify the Twilio Video API is working
"""

import requests
import json
import time
from datetime import datetime

# Your API endpoint
API_URL = "https://twilio-video-app-react-master-bd2xri2tv-jagrit20s-projects.vercel.app/api/token"

def test_api():
    """Test the Twilio Video API endpoint"""
    
    print("🧪 Testing Twilio Video API")
    print("=" * 50)
    print(f"📡 Endpoint: {API_URL}")
    print(f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test cases
    test_cases = [
        {"identity": "alice", "roomName": "room1"},
        {"identity": "bob", "roomName": "room2"},
        {"identity": "charlie", "roomName": "general"},
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"Test {i}: {test_case['identity']} → {test_case['roomName']}")
        
        try:
            response = requests.post(API_URL, json=test_case, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                token = data.get("token", "")
                print(f"  ✅ Success! Token length: {len(token)} chars")
                print(f"  🎫 Token preview: {token[:30]}...")
            else:
                print(f"  ❌ Failed: {response.status_code}")
                print(f"  📝 Response: {response.text}")
                
        except requests.exceptions.Timeout:
            print("  ⏱️ Request timed out")
        except requests.exceptions.RequestException as e:
            print(f"  💥 Request error: {e}")
        except Exception as e:
            print(f"  🚨 Unexpected error: {e}")
        
        print()
        time.sleep(1)  # Small delay between requests
    
    print("🏁 Testing complete!")

if __name__ == "__main__":
    test_api() 