import {io} from 'socket.io-client';

// Socket connection
let socket = null;

// Create socket connection
export function createSocket() {
  const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  console.log('🔌 Creating socket connection to:', serverUrl);

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

// Get current socket
export function getSocket() {
  return socket;
}

// Join room as host
export function joinRoomAsHost(roomId, playerName = 'Host') {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return;
  }

  console.log('🏠 Joining room as host:', roomId);

  socket.emit('joinRoom', {
    roomId: roomId,
    playerName: playerName,
    isHost: true,
  });
}

// Join room as client
export function joinRoomAsClient(roomId, playerName) {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return;
  }

  console.log('🔌 Joining room as client:', roomId);

  socket.emit('joinRoom', {
    roomId: roomId,
    playerName: playerName,
    isHost: false,
  });
}

// Roll dice
export function rollDice(roomId) {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return false;
  }

  if (!socket.connected) {
    console.error('❌ Socket not connected');
    return false;
  }

  console.log('🎲 Rolling dice for room:', roomId);

  socket.emit('rollDice', {roomId: roomId});
  return true;
}

// Register dice event handlers
export function registerDiceHandlers(callbacks) {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return;
  }

  // Remove existing handlers to prevent duplicates
  socket.off('diceRolled');
  socket.off('diceStopped');

  // Register dice roll started handler
  socket.on('diceRolled', (gameState) => {
    console.log('🎲 === DICE ROLLED EVENT ===');
    console.log('📊 Game state:', gameState);

    if (callbacks.onDiceRolled) {
      callbacks.onDiceRolled(gameState);
    }
  });

  // Register dice roll stopped handler
  socket.on('diceStopped', (gameState) => {
    console.log('🛑 === DICE STOPPED EVENT ===');
    console.log('📊 Final game state:', gameState);

    if (callbacks.onDiceStopped) {
      callbacks.onDiceStopped(gameState);
    }
  });
}

// Register player management handlers
export function registerPlayerHandlers(callbacks) {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return;
  }

  // Remove existing handlers to prevent duplicates
  socket.off('playerJoined');
  socket.off('playerAdded');
  socket.off('scoreUpdated');
  socket.off('playerTurnChanged');

  // Register player joined handler
  socket.on('playerJoined', (data) => {
    console.log('👥 Player joined:', data);

    if (callbacks.onPlayerJoined) {
      callbacks.onPlayerJoined(data);
    }
  });

  // Register player added handler
  socket.on('playerAdded', (data) => {
    console.log('👤 Player added:', data);

    if (callbacks.onPlayerAdded) {
      callbacks.onPlayerAdded(data);
    }
  });

  // Register score updated handler
  socket.on('scoreUpdated', (data) => {
    console.log('📊 Score updated:', data);

    if (callbacks.onScoreUpdated) {
      callbacks.onScoreUpdated(data);
    }
  });

  // Register player turn changed handler
  socket.on('playerTurnChanged', (data) => {
    console.log('🔄 Player turn changed:', data);

    if (callbacks.onPlayerTurnChanged) {
      callbacks.onPlayerTurnChanged(data);
    }
  });
}

// Register connection handlers
export function registerConnectionHandlers(callbacks) {
  if (!socket) {
    console.error('❌ Socket not initialized');
    return;
  }

  // Remove existing handlers to prevent duplicates
  socket.off('connect');
  socket.off('disconnect');

  // Register connect handler
  socket.on('connect', () => {
    console.log('✅ Connected to server');
    console.log('🆔 Socket ID:', socket.id);

    if (callbacks.onConnect) {
      callbacks.onConnect(socket.id);
    }
  });

  // Register disconnect handler
  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');

    if (callbacks.onDisconnect) {
      callbacks.onDisconnect();
    }
  });
}

// Disconnect socket
export function disconnectSocket() {
  if (socket) {
    console.log('🔌 Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
}

// Check if socket is connected
export function isSocketConnected() {
  return socket && socket.connected;
}

// Get socket ID
export function getSocketId() {
  return socket ? socket.id : null;
}
