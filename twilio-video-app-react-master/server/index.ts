import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

// This server reuses the serverless endpoints from the "plugin-rtc" Twilio CLI Plugin, which is used when the "npm run deploy:twilio-cli" command is run.
// The documentation for this endpoint can be found in the README file here: https://github.com/twilio-labs/plugin-rtc
const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const recordingRulesFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules')
  .handler;
const recordingRulesEndpoint = createExpressHandler(recordingRulesFunction);

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

app.all('/token', authMiddleware, tokenEndpoint);
app.all('/recordingrules', authMiddleware, recordingRulesEndpoint);

// New endpoint to generate join links
app.post('/generate-join-link', (req, res) => {
  try {
    const { roomName, username } = req.body;
    
    if (!roomName || !username) {
      return res.status(400).json({ 
        error: 'Room name and username are required' 
      });
    }
    
    // Get the server's base URL
    const protocol = req.secure ? 'https' : 'http';
    const baseUrl = `${protocol}://${req.get('host')}`;
    
    // Create the join URL with room name and username as query parameters
    const joinUrl = `${baseUrl}/?roomName=${encodeURIComponent(roomName)}&username=${encodeURIComponent(username)}`;
    
    res.json({
      success: true,
      joinUrl: joinUrl,
      roomName: roomName,
      username: username
    });
  } catch (error) {
    console.error('Error generating join link:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  } else {
    res.set('Cache-Control', 'max-age=31536000');
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
});

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
