#!/usr/bin/env python3
"""
Simple example of calling the Twilio Video API
"""

import requests

# Your API endpoint
API_URL = "https://twilio-video-app-react-master-bd2xri2tv-jagrit20s-projects.vercel.app/api/token"

def get_token(username, room):
    """Get a Twilio access token"""
    
    data = {
        "identity": username,
        "roomName": room
    }
    
    response = requests.post(API_URL, json=data)
    
    if response.status_code == 200:
        return response.json()["token"]
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Example usage
if __name__ == "__main__":
    # Get token for user "john" in room "meeting123"
    token = get_token("john", "meeting123")
    
    if token:
        print("✅ Token obtained successfully!")
        print(f"Token: {token}")
        print("\nYou can now use this token in your video application!")
    else:
        print("❌ Failed to get token") 