import requests
import json

def generate_meeting_link(room_name, username, server_url="http://localhost:8081"):
    """
    Generate a meeting link by calling the Twilio video app API.
    
    Args:
        room_name (str): Name of the room to join
        username (str): Username for the participant
        server_url (str): Base URL of the server (default: http://localhost:8081)
    
    Returns:
        dict: Response from the API containing the join URL
    """
    
    # API endpoint
    endpoint = f"{server_url}/generate-join-link"
    
    # Request payload
    payload = {
        "roomName": room_name,
        "username": username
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Making API call to: {endpoint}")
        print(f"Payload: {payload}")
        
        # Make the API call
        response = requests.post(endpoint, json=payload, headers=headers)
        
        print(f"Response status code: {response.status_code}")
        print(f"Response text: {response.text}")
        
        # Check if request was successful
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "data": data
            }
        else:
            return {
                "success": False,
                "error": f"API returned status code {response.status_code}",
                "message": response.text
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": "Network error",
            "message": str(e)
        }

def main():
    """
    Main function to generate a meeting link for the specified room and user.
    """
    
    # Your specified parameters
    room_name = "test"
    username = "jag"
    
    print(f"Generating meeting link for:")
    print(f"Room: {room_name}")
    print(f"Username: {username}")
    print("-" * 50)
    
    # Generate the meeting link
    result = generate_meeting_link(room_name, username)
    
    if result["success"]:
        data = result["data"]
        print("✅ Meeting link generated successfully!")
        print(f"Join URL: {data['joinUrl']}")
        print(f"Room Name: {data['roomName']}")
        print(f"Username: {data['username']}")
        print("\n🔗 Click the URL above to join the video call!")
    else:
        print("❌ Failed to generate meeting link!")
        print(f"Error: {result['error']}")
        print(f"Message: {result['message']}")

if __name__ == "__main__":
    main() 