import {io} from 'socket.io-client';

// Get socket URL based on environment
export function getSocketUrl() {
  // Check if we're in production (Vercel)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost'
  ) {
    // In production, use Render server
    return 'https://lexikon-loop-server.onrender.com';
  } else {
    // In development, use localhost
    return 'http://localhost:3001';
  }
}

// Create socket connection
export function createSocket() {
  const socketUrl = getSocketUrl();
  console.log('Connecting to socket:', socketUrl);

  return io(socketUrl, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
  });
}

// Fetch socket config from API
export async function getSocketConfig() {
  try {
    const response = await fetch('/api/socket-config');
    const config = await response.json();
    return config.socketUrl;
  } catch (error) {
    console.error('Failed to fetch socket config:', error);
    return getSocketUrl(); // Fallback
  }
}
