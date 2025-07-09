#!/usr/bin/env python3
"""
Simple Python script to call the Twilio Video API endpoint
"""

import requests
import json
import sys

# Your deployed API endpoint
API_URL = "https://twilio-video-app-react-master-bd2xri2tv-jagrit20s-projects.vercel.app/api/token"

def get_twilio_token(user_identity, room_name):
    """
    Get a Twilio access token for video calling
    
    Args:
        user_identity (str): The username/identity of the user
        room_name (str): The name of the room to join
        
    Returns:
        dict: Response containing the access token or error message
    """
    
    # Prepare the request payload
    payload = {
        "identity": user_identity,
        "roomName": room_name
    }
    
    # Set headers
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Make the POST request
        print(f"🔄 Requesting token for user '{user_identity}' in room '{room_name}'...")
        response = requests.post(API_URL, json=payload, headers=headers)
        
        # Check if request was successful
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Successfully obtained access token!")
            print(f"🎫 Token: {token_data['token'][:50]}...")  # Show first 50 chars
            return token_data
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            return {"error": f"HTTP {response.status_code}", "message": response.text}
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return {"error": "Request failed", "message": str(e)}
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON response: {e}")
        return {"error": "Invalid JSON", "message": str(e)}

def main():
    """
    Main function to run the script
    """
    print("🎥 Twilio Video API Token Generator")
    print("=" * 40)
    
    # Get user input or use defaults
    if len(sys.argv) >= 3:
        user_identity = sys.argv[1]
        room_name = sys.argv[2]
    else:
        user_identity = input("Enter your username (default: 'test_user'): ").strip()
        if not user_identity:
            user_identity = "test_user"
        
        room_name = input("Enter room name (default: 'test_room'): ").strip()
        if not room_name:
            room_name = "test_room"
    
    # Call the API
    result = get_twilio_token(user_identity, room_name)
    
    # Display result
    if "error" not in result:
        print("\n🎉 Success! You can now use this token to join the video room.")
        print(f"📋 Full token: {result['token']}")
        print(f"👤 User: {user_identity}")
        print(f"🏠 Room: {room_name}")
    else:
        print(f"\n💥 Failed to get token: {result['error']}")
        print(f"📝 Details: {result['message']}")

if __name__ == "__main__":
    main() 