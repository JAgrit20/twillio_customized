import React, { useState, useEffect } from 'react';
import { connect, LocalVideoTrack } from 'twilio-video';
import './App.css';

function App() {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [identity, setIdentity] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState('');

  // Initialize local media tracks
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const videoTrack = await LocalVideoTrack.create();
        setLocalVideoTrack(videoTrack);
        
        // Attach video track to preview element
        const previewElement = document.getElementById('local-preview');
        if (previewElement) {
          videoTrack.attach(previewElement);
        }
      } catch (error) {
        console.error('Error initializing media:', error);
      }
    };

    initializeMedia();
  }, []);

  // Join room function
  const joinRoom = async () => {
    if (!identity || !roomName) {
      setError('Please enter both name and room name');
      return;
    }

    setIsConnecting(true);
    setError('');
    
    try {
      // Get token from server - using /api/token for Vercel deployment
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identity: identity, 
          roomName: roomName 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get token');
      }

      // Connect to the room
      const connectedRoom = await connect(data.token, {
        name: roomName,
        audio: isAudioEnabled,
        video: isVideoEnabled,
      });

      setRoom(connectedRoom);
      setIsConnected(true);
      setIsConnecting(false);

      // Handle participants
      const remoteParticipants = Array.from(connectedRoom.participants.values());
      setParticipants(remoteParticipants);

      // Listen for participant events
      connectedRoom.on('participantConnected', participant => {
        setParticipants(prev => [...prev, participant]);
      });

      connectedRoom.on('participantDisconnected', participant => {
        setParticipants(prev => prev.filter(p => p.sid !== participant.sid));
      });

      // Handle room disconnect
      connectedRoom.on('disconnected', () => {
        setRoom(null);
        setIsConnected(false);
        setParticipants([]);
      });

    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room: ' + error.message);
      setIsConnecting(false);
    }
  };

  // Leave room function
  const leaveRoom = () => {
    if (room) {
      room.disconnect();
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (room && room.localParticipant) {
      room.localParticipant.audioTracks.forEach(track => {
        if (isAudioEnabled) {
          track.track.disable();
        } else {
          track.track.enable();
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (room && room.localParticipant) {
      room.localParticipant.videoTracks.forEach(track => {
        if (isVideoEnabled) {
          track.track.disable();
        } else {
          track.track.enable();
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="App">
      {!isConnected ? (
        <div className="intro-container">
          <div className="intro-left">
            <div className="logo-container">
              <div className="video-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                </svg>
              </div>
              <div className="logo-text">
                <h1>Twilio Programmable Video</h1>
              </div>
            </div>
          </div>
          <div className="intro-right">
            <div className="join-room-container">
              <h2>Join a Room</h2>
              <p>Enter your name and the name of a room you'd like to join</p>
              
              <div className="form-group">
                <label htmlFor="identity">Your Name</label>
                <input
                  id="identity"
                  type="text"
                  placeholder=""
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  disabled={isConnecting}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="roomName">Room Name</label>
                <input
                  id="roomName"
                  type="text"
                  placeholder=""
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={isConnecting}
                />
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <button 
                className="continue-btn"
                onClick={joinRoom} 
                disabled={isConnecting || !identity || !roomName}
              >
                {isConnecting ? 'Connecting...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="room-container">
          <div className="room-header">
            <h2>Room: {roomName}</h2>
            <div className="controls">
              <button onClick={toggleAudio} className={isAudioEnabled ? 'enabled' : 'disabled'}>
                {isAudioEnabled ? '🎤' : '🎤❌'}
              </button>
              <button onClick={toggleVideo} className={isVideoEnabled ? 'enabled' : 'disabled'}>
                {isVideoEnabled ? '📹' : '📹❌'}
              </button>
              <button onClick={leaveRoom} className="leave-btn">
                Leave Room
              </button>
            </div>
          </div>
          
          <div className="participants-grid">
            {/* Local participant */}
            <div className="participant local-participant">
              <h4>You ({identity})</h4>
              <div id="local-video" />
            </div>
            
            {/* Remote participants */}
            {participants.map(participant => (
              <ParticipantView key={participant.sid} participant={participant} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for rendering remote participants
function ParticipantView({ participant }) {
  const videoRef = React.useRef();
  const audioRef = React.useRef();

  React.useEffect(() => {
    const trackSubscribed = track => {
      if (track.kind === 'video') {
        track.attach(videoRef.current);
      } else if (track.kind === 'audio') {
        track.attach(audioRef.current);
      }
    };

    const trackUnsubscribed = track => {
      track.detach();
    };

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(publication.track);
      }
    });

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      participant.removeListener('trackSubscribed', trackSubscribed);
      participant.removeListener('trackUnsubscribed', trackUnsubscribed);
    };
  }, [participant]);

  return (
    <div className="participant">
      <h4>{participant.identity}</h4>
      <video ref={videoRef} autoPlay playsInline />
      <audio ref={audioRef} autoPlay />
    </div>
  );
}

export default App; 