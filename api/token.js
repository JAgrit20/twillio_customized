const { AccessToken } = require('twilio').jwt;
const { VideoGrant } = AccessToken;

export default function handler(req, res) {
  // Add CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identity, roomName } = req.body;

    // Validate required fields
    if (!identity || !roomName) {
      return res.status(400).json({ 
        error: 'Both identity and roomName are required' 
      });
    }

    // Validate environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY_SID || !process.env.TWILIO_API_KEY_SECRET) {
      console.error('Missing Twilio environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error' 
      });
    }

    // Create access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      { identity }
    );

    // Create video grant
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Add grant to token
    token.addGrant(videoGrant);

    // Generate and return token
    const jwt = token.toJwt();
    
    res.json({
      token: jwt,
      identity,
      roomName
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ 
      error: 'Failed to generate token' 
    });
  }
} 