import requests
import json

# Test endpoints
endpoints = [
    "https://twilio-video-app-react-master-hp21jcese-jagrit20s-projects.vercel.app/api/test",
    "https://twilio-video-app-react-master-hp21jcese-jagrit20s-projects.vercel.app/api/token"
]

print("🧪 Testing API Access...")
print("=" * 50)

for endpoint in endpoints:
    try:
        if "/test" in endpoint:
            response = requests.get(endpoint)
            print(f"✅ GET {endpoint}")
        else:
            response = requests.post(endpoint, json={
                "user_identity": "test_user",
                "room_name": "test_room"
            })
            print(f"✅ POST {endpoint}")
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Error: {response.text[:100]}...")
        print()
        
    except Exception as e:
        print(f"❌ Error testing {endpoint}: {e}")
        print()

print("�� Test complete!") 