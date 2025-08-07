import {ref, computed} from 'vue';
import {Socket} from 'socket.io-client';
import {
  createSocket,
  joinRoomAsHost,
  joinRoomAsClient,
  rollDice,
  registerDiceHandlers,
  registerPlayerHandlers,
  registerConnectionHandlers,
  isSocketConnected,
  getSocketId,
} from './multiplayer.js';

export function useMultiplayer() {
  // State
  const isMultiplayerHost = ref(false);
  const isMultiplayerConnected = ref(false);
  const multiplayerStatusText = ref('Multiplayer verfügbar');
  const multiplayerStatusClass = ref('status-available');
  const multiplayerPlayers = ref([]);
  const multiplayerPlayerName = ref('');
  const roomId = ref('');
  const showMultiplayerPanel = ref(false);
  const showJoinModal = ref(false);
  const newPlayerName = ref('');
  const joinPlayerName = ref('');
  const hostId = ref('');
  const scannerActive = ref(false);
  const scannerStatus = ref('');
  const currentPlayer = ref(0);

  // Socket
  let socket = null;

  // Computed
  const joinLink = computed(() => {
    if (!roomId.value) return '';
    return `${window.location.origin}/join?host=${roomId.value}`;
  });

  // Methods
  function startMultiplayerHost() {
    console.log('🚀 Starting Multiplayer Host...');

    // Generate unique room ID
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const generatedRoomId = `room_${timestamp}_${randomId}`;
    console.log('📋 Generated Room ID:', generatedRoomId);

    // Create connection URL
    const connectionUrl = `${window.location.origin}/join?host=${generatedRoomId}`;
    console.log('🔗 Connection URL:', connectionUrl);

    // Initialize WebSocket connection
    console.log('🔌 Creating socket connection...');
    socket = createSocket();

    // Register connection handlers
    registerConnectionHandlers({
      onConnect: (socketId) => {
        console.log('✅ Host connected to server');
        isMultiplayerConnected.value = true;

        // Join room as host
        setTimeout(() => {
          joinRoomAsHost(generatedRoomId, 'Host');
        }, 100);
      },
      onDisconnect: () => {
        console.log('❌ Host disconnected from server');
        isMultiplayerConnected.value = false;
      },
    });

    // Register player handlers
    registerPlayerHandlers({
      onPlayerJoined: (data) => {
        console.log('👥 Player joined:', data);
        multiplayerPlayers.value = data.allPlayers;
      },
      onScoreUpdated: (data) => {
        console.log('📊 Score updated:', data);
        multiplayerPlayers.value = data.allPlayers;
      },
      onPlayerTurnChanged: (data) => {
        console.log('🔄 Player turn changed:', data);
        currentPlayer.value = data.currentPlayer;
      },
    });

    // Register dice handlers
    registerDiceHandlers({
      onDiceRolled: (gameState) => {
        console.log('🎲 Host received dice roll event');
        // Emit event for parent component
        window.dispatchEvent(
          new CustomEvent('dice-rolled', {detail: gameState}),
        );
      },
      onDiceStopped: (gameState) => {
        console.log('🛑 Host received dice stopped event');
        // Emit event for parent component
        window.dispatchEvent(
          new CustomEvent('dice-stopped', {detail: gameState}),
        );
      },
    });

    // Set host state
    isMultiplayerHost.value = true;
    isMultiplayerConnected.value = true;
    multiplayerPlayerName.value = 'Host';
    roomId.value = generatedRoomId;
    multiplayerStatusText.value = 'Host gestartet';
    multiplayerStatusClass.value = 'status-host';

    // Open multiplayer panel
    showMultiplayerPanel.value = true;

    return generatedRoomId;
  }

  function joinMultiplayerGame() {
    if (!hostId.value || !joinPlayerName.value) {
      alert('Bitte gib Room ID und deinen Namen ein!');
      return;
    }

    console.log('🔌 Joining multiplayer game...');
    console.log('🏠 Room ID:', hostId.value);
    console.log('👤 Player name:', joinPlayerName.value);

    // Initialize WebSocket connection
    socket = createSocket();

    // Register connection handlers
    registerConnectionHandlers({
      onConnect: (socketId) => {
        console.log('✅ Client connected to server');
        isMultiplayerConnected.value = true;

        // Join room as client
        setTimeout(() => {
          joinRoomAsClient(hostId.value, joinPlayerName.value);
        }, 100);
      },
      onDisconnect: () => {
        console.log('❌ Client disconnected from server');
        isMultiplayerConnected.value = false;
      },
    });

    // Register player handlers
    registerPlayerHandlers({
      onPlayerJoined: (data) => {
        console.log('👥 Client: Joined room:', data);
        multiplayerPlayers.value = data.allPlayers;
      },
      onScoreUpdated: (data) => {
        console.log('📊 Score updated:', data);
        multiplayerPlayers.value = data.allPlayers;
      },
      onPlayerTurnChanged: (data) => {
        console.log('🔄 Player turn changed:', data);
        currentPlayer.value = data.currentPlayer;
      },
    });

    // Register dice handlers
    registerDiceHandlers({
      onDiceRolled: (gameState) => {
        console.log('🎲 Client received dice roll event');
        // Emit event for parent component
        window.dispatchEvent(
          new CustomEvent('dice-rolled', {detail: gameState}),
        );
      },
      onDiceStopped: (gameState) => {
        console.log('🛑 Client received dice stopped event');
        // Emit event for parent component
        window.dispatchEvent(
          new CustomEvent('dice-stopped', {detail: gameState}),
        );
      },
    });

    // Set client state
    isMultiplayerHost.value = false;
    isMultiplayerConnected.value = true;
    multiplayerPlayerName.value = joinPlayerName.value;
    roomId.value = hostId.value;
    multiplayerStatusText.value = 'Verbunden mit Host';
    multiplayerStatusClass.value = 'status-connected';

    showJoinModal.value = false;
  }

  function disconnectMultiplayer() {
    // Disconnect WebSocket
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    isMultiplayerHost.value = false;
    isMultiplayerConnected.value = false;
    multiplayerPlayers.value = [];
    multiplayerPlayerName.value = '';
    roomId.value = '';
    showJoinModal.value = false;

    multiplayerStatusText.value = 'Multiplayer verfügbar';
    multiplayerStatusClass.value = 'status-available';
  }

  function rollDice() {
    if (socket && roomId.value && isMultiplayerConnected.value) {
      console.log('🎲 Rolling dice in multiplayer mode...');
      return rollDice(roomId.value);
    }
    return false;
  }

  function handleDiceRolled(gameState) {
    console.log('🎲 Dice rolled event received:', gameState);
    // Handle dice roll event from MultiplayerPanel
    window.dispatchEvent(new CustomEvent('dice-rolled', {detail: gameState}));
  }

  function handleDiceStopped(gameState) {
    console.log('🛑 Dice stopped event received:', gameState);
    // Handle dice stopped event from MultiplayerPanel
    window.dispatchEvent(new CustomEvent('dice-stopped', {detail: gameState}));
  }

  function updateScore(points) {
    if (socket && roomId.value && isMultiplayerConnected.value) {
      console.log('📡 Sending points to server:', points);
      socket.emit('updateScore', {
        roomId: roomId.value,
        playerId: socket.id,
        points: points,
      });
    }
  }

  function switchPlayer(direction) {
    if (socket && roomId.value && isMultiplayerConnected.value) {
      console.log('📡 Sending player switch to server:', direction);
      socket.emit('switchPlayer', {
        roomId: roomId.value,
        direction: direction,
      });
    }
  }

  function addPlayer(playerName) {
    if (socket && roomId.value && isMultiplayerConnected.value) {
      console.log('📡 Sending new player to server:', playerName);
      socket.emit('addPlayer', {
        roomId: roomId.value,
        playerName: playerName,
        playerId: socket.id,
      });
    }
  }

  // Share functions
  function shareViaWhatsApp() {
    const text = `🎮 Lexikon-Loop Multiplayer!\n\nSpiel beitreten:\n${joinLink.value}\n\nHost-ID: ${roomId.value}\n\nViel Spaß beim Spielen! 🎲`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  function shareViaEmail() {
    const subject = '🎮 Lexikon-Loop Multiplayer Einladung';
    const body = `Hallo!\n\nDu wurdest zu einem Lexikon-Loop Multiplayer-Spiel eingeladen!\n\nSpiel beitreten:\n${joinLink.value}\n\nHost-ID: ${roomId.value}\n\nViel Spaß beim Spielen! 🎲`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  }

  async function copyJoinLink() {
    try {
      await navigator.clipboard.writeText(joinLink.value);
      alert('✅ Link wurde in die Zwischenablage kopiert!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback: select and copy
      const textArea = document.createElement('textarea');
      textArea.value = joinLink.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Link wurde in die Zwischenablage kopiert!');
    }
  }

  // Event listeners for dice events
  function onDiceRolled(callback) {
    window.addEventListener('dice-rolled', (event) => {
      callback(event.detail);
    });
  }

  function onDiceStopped(callback) {
    window.addEventListener('dice-stopped', (event) => {
      callback(event.detail);
    });
  }

  return {
    // State
    isMultiplayerHost,
    isMultiplayerConnected,
    multiplayerStatusText,
    multiplayerStatusClass,
    multiplayerPlayers,
    multiplayerPlayerName,
    roomId,
    showMultiplayerPanel,
    showJoinModal,
    newPlayerName,
    joinPlayerName,
    hostId,
    scannerActive,
    scannerStatus,
    currentPlayer,

    // Computed
    joinLink,

    // Methods
    startMultiplayerHost,
    joinMultiplayerGame,
    disconnectMultiplayer,
    rollDice,
    updateScore,
    switchPlayer,
    addPlayer,
    shareViaWhatsApp,
    shareViaEmail,
    copyJoinLink,
    onDiceRolled,
    onDiceStopped,
    handleDiceRolled,
    handleDiceStopped,
  };
}
