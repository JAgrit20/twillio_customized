# 🐍 Python Scripts for Twilio Video API

This directory contains Python scripts to call your deployed Twilio Video API endpoint.

## 📦 Installation

1. **Install required dependencies:**
   ```bash
   pip install -r python_requirements.txt
   ```

## 🔧 Scripts Available

### 1. `simple_example.py` - Basic Usage
A minimal example showing how to get a token:

```bash
python simple_example.py
```

### 2. `call_twilio_api.py` - Interactive Script
Full-featured script with user input and error handling:

```bash
# Run interactively
python call_twilio_api.py

# Or with command line arguments
python call_twilio_api.py "john_doe" "meeting_room"
```

### 3. `test_api.py` - API Testing
Test script to verify your API is working:

```bash
python test_api.py
```

## 🚀 Quick Start

```python
import requests

# Your API endpoint
API_URL = "https://twilio-video-app-react-master-bd2xri2tv-jagrit20s-projects.vercel.app/api/token"

# Get a token
response = requests.post(API_URL, json={
    "user_identity": "your_username",
    "room_name": "your_room"
})

if response.status_code == 200:
    token = response.json()["token"]
    print(f"Token: {token}")
else:
    print(f"Error: {response.text}")
```

## 📋 API Details

- **Endpoint**: `/api/token`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "user_identity": "string",
  "room_name": "string"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiI..."
}
```

## ⚠️ Important Notes

- **Environment Variables**: Make sure your Twilio credentials are set up in the Vercel dashboard
- **Rate Limiting**: The API may have rate limits, so avoid making too many requests rapidly
- **Token Expiration**: Tokens have a limited lifespan (typically 4 hours)

## 🔍 Troubleshooting

1. **403 Forbidden**: Check your Twilio credentials in Vercel
2. **500 Internal Server Error**: Verify your environment variables are set correctly
3. **Network Issues**: Check your internet connection and the API endpoint URL

## 🎯 Next Steps

Use the obtained token in your video application to connect to Twilio Video rooms! 