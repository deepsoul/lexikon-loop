<template>
  <div class="multiplayer-panel" :class="{'panel-open': showMultiplayerPanel}">
    <div class="panel-header" @click="toggleMultiplayerPanel">
      <h3>🎮 Multiplayer</h3>
      <span class="panel-toggle">{{ showMultiplayerPanel ? '▼' : '▶' }}</span>
    </div>

    <div v-if="showMultiplayerPanel" class="panel-content">
      <!-- Host Section -->
      <div v-if="!isMultiplayerConnected" class="host-section">
        <button @click="startMultiplayerHost" class="host-button">
          🚀 Als Host starten
        </button>

        <div v-if="generatedRoomId" class="room-info">
          <h4>🔗 Verbindungslink:</h4>
          <div class="qr-container">
            <div id="qrcode"></div>
          </div>
          <p class="room-id">Room ID: {{ generatedRoomId }}</p>
        </div>
      </div>

      <!-- Client Section -->
      <div v-if="!isMultiplayerConnected" class="client-section">
        <button @click="showJoinModal = true" class="join-button">
          🔗 Spiel beitreten
        </button>
      </div>

      <!-- Connected Status -->
      <div v-if="isMultiplayerConnected" class="connection-status">
        <div class="status-indicator" :class="multiplayerStatusClass">
          {{ multiplayerStatusText }}
        </div>
        <div class="player-info">
          <p>👤 {{ multiplayerPlayerName }}</p>
          <p>🏠 Room: {{ roomId }}</p>
        </div>
      </div>

      <!-- Player List -->
      <div v-if="multiplayerPlayers.length > 0" class="player-list">
        <h4>👥 Spieler:</h4>
        <div class="players">
          <div
            v-for="player in multiplayerPlayers"
            :key="player.id"
            class="player-item"
          >
            <span class="player-name">{{ player.name }}</span>
            <span class="player-score">{{ player.score }} Punkte</span>
            <span v-if="player.isHost" class="host-badge">👑</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Modal -->
    <div
      v-if="showJoinModal"
      class="modal-overlay"
      @click="showJoinModal = false"
    >
      <div class="modal-content" @click.stop>
        <h3>🎮 Spiel beitreten</h3>
        <div class="join-options">
          <div class="qr-scanner-section">
            <button @click="startQRScanner" class="qr-button">
              📱 QR-Code scannen
            </button>
            <div v-if="scannerActive" class="scanner-container">
              <div id="qr-reader"></div>
              <div class="scanner-status">{{ scannerStatus }}</div>
            </div>
          </div>

          <div class="manual-join-section">
            <input
              v-model="joinPlayerName"
              placeholder="Dein Name"
              class="join-input"
            />
            <input v-model="hostId" placeholder="Room ID" class="join-input" />
            <button @click="joinMultiplayerGame" class="join-submit-button">
              🔗 Beitreten
            </button>
          </div>
        </div>
        <button @click="showJoinModal = false" class="close-button">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {
  createSocket,
  joinRoomAsHost,
  joinRoomAsClient,
  registerDiceHandlers,
  registerPlayerHandlers,
  registerConnectionHandlers,
} from '../utils/multiplayer.js';

// Props
const props = defineProps({
  isMultiplayerConnected: Boolean,
  multiplayerPlayerName: String,
  roomId: String,
  multiplayerStatusText: String,
  multiplayerStatusClass: String,
  multiplayerPlayers: Array,
  currentPlayer: String,
});

// Emits
const emit = defineEmits([
  'update:isMultiplayerConnected',
  'update:multiplayerPlayerName',
  'update:roomId',
  'update:multiplayerStatusText',
  'update:multiplayerStatusClass',
  'update:multiplayerPlayers',
  'update:currentPlayer',
  'dice-rolled',
  'dice-stopped',
]);

// Local state
const showMultiplayerPanel = ref(false);
const generatedRoomId = ref('');
const showJoinModal = ref(false);
const joinPlayerName = ref('');
const hostId = ref('');
const scannerActive = ref(false);
const scannerStatus = ref('');

// Socket
let socket = null;
let qrScanner = null;

// Multiplayer functions
function startMultiplayerHost() {
  console.log('🚀 Starting Multiplayer Host...');

  // Generate unique room ID
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  generatedRoomId.value = `room_${timestamp}_${randomId}`;

  console.log('📋 Generated Room ID:', generatedRoomId.value);

  // Create connection URL
  const connectionUrl = `${window.location.origin}/join?host=${generatedRoomId.value}`;
  console.log('🔗 Connection URL:', connectionUrl);

  // Initialize WebSocket connection
  console.log('🔌 Creating socket connection...');
  socket = createSocket();

  // Register connection handlers
  registerConnectionHandlers({
    onConnect: (socketId) => {
      console.log('✅ Host connected to server');
      emit('update:isMultiplayerConnected', true);

      // Join room as host
      setTimeout(() => {
        joinRoomAsHost(generatedRoomId.value, 'Host');
      }, 100);
    },
    onDisconnect: () => {
      console.log('❌ Host disconnected from server');
      emit('update:isMultiplayerConnected', false);
    },
  });

  // Register player handlers
  registerPlayerHandlers({
    onPlayerJoined: (data) => {
      console.log('👥 Player joined:', data);
      emit('update:multiplayerPlayers', data.allPlayers);
    },
    onScoreUpdated: (data) => {
      console.log('📊 Score updated:', data);
      emit('update:multiplayerPlayers', data.allPlayers);
    },
    onPlayerTurnChanged: (data) => {
      console.log('🔄 Player turn changed:', data);
      emit('update:currentPlayer', data.currentPlayer);
    },
  });

  // Register dice handlers
  registerDiceHandlers({
    onDiceRolled: (gameState) => {
      console.log('🎲 Host received dice roll event');
      emit('dice-rolled', gameState);
    },
    onDiceStopped: (gameState) => {
      console.log('🛑 Host received dice stopped event');
      emit('dice-stopped', gameState);
    },
  });

  // Set host state
  emit('update:isMultiplayerConnected', true);
  emit('update:multiplayerPlayerName', 'Host');
  emit('update:roomId', generatedRoomId.value);
  emit('update:multiplayerStatusText', 'Host gestartet');
  emit('update:multiplayerStatusClass', 'status-host');

  // Open multiplayer panel
  showMultiplayerPanel.value = true;
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
      emit('update:isMultiplayerConnected', true);

      // Join room as client
      setTimeout(() => {
        joinRoomAsClient(hostId.value, joinPlayerName.value);
      }, 100);
    },
    onDisconnect: () => {
      console.log('❌ Client disconnected from server');
      emit('update:isMultiplayerConnected', false);
    },
  });

  // Register player handlers
  registerPlayerHandlers({
    onPlayerJoined: (data) => {
      console.log('👥 Client: Joined room:', data);
      emit('update:multiplayerPlayers', data.allPlayers);
    },
    onScoreUpdated: (data) => {
      console.log('📊 Score updated:', data);
      emit('update:multiplayerPlayers', data.allPlayers);
    },
    onPlayerTurnChanged: (data) => {
      console.log('🔄 Player turn changed:', data);
      emit('update:currentPlayer', data.currentPlayer);
    },
  });

  // Register dice handlers
  registerDiceHandlers({
    onDiceRolled: (gameState) => {
      console.log('🎲 Client received dice roll event');
      emit('dice-rolled', gameState);
    },
    onDiceStopped: (gameState) => {
      console.log('🛑 Client received dice stopped event');
      emit('dice-stopped', gameState);
    },
  });

  // Set client state
  emit('update:isMultiplayerConnected', true);
  emit('update:multiplayerPlayerName', joinPlayerName.value);
  emit('update:roomId', hostId.value);
  emit('update:multiplayerStatusText', 'Verbunden mit Host');
  emit('update:multiplayerStatusClass', 'status-connected');

  showJoinModal.value = false;
}

// QR Scanner
function startQRScanner() {
  if (qrScanner) {
    qrScanner.clear();
  }

  qrScanner = new Html5QrcodeScanner(
    'qr-reader',
    {
      fps: 10,
      qrbox: {width: 250, height: 250},
      aspectRatio: 1.0,
    },
    false,
  );

  qrScanner.render(
    (decodedText) => {
      console.log('📱 QR Code scanned:', decodedText);

      // Extract room ID from URL
      try {
        const url = new URL(decodedText);
        const hostParam = url.searchParams.get('host');
        if (hostParam) {
          hostId.value = hostParam;
          scannerStatus.value = 'QR-Code erfolgreich gelesen!';

          setTimeout(() => {
            scannerActive.value = false;
            qrScanner.clear();
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error parsing QR code URL:', error);
        scannerStatus.value = 'Ungültiger QR-Code!';
      }
    },
    (error) => {
      console.log('📱 QR Scanner error:', error);
    },
  );

  scannerActive.value = true;
  scannerStatus.value = 'Scanner aktiv...';
}

// UI functions
function toggleMultiplayerPanel() {
  showMultiplayerPanel.value = !showMultiplayerPanel.value;
}
</script>

<style scoped>
.multiplayer-panel {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel-header {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.panel-toggle {
  color: #fff;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.panel-content {
  padding: 20px;
}

.host-section,
.client-section {
  margin-bottom: 20px;
}

.host-button,
.join-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 15px;
}

.host-button:hover,
.join-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.room-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.room-info h4 {
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 14px;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.room-id {
  color: #fff;
  font-size: 12px;
  text-align: center;
  margin: 10px 0 0 0;
}

.connection-status {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.status-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.status-host {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
}

.status-connected {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
}

.player-info p {
  color: #fff;
  margin: 5px 0;
  font-size: 14px;
}

.player-list h4 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-name {
  color: #fff;
  font-weight: bold;
}

.player-score {
  color: #fff;
  font-size: 14px;
}

.host-badge {
  font-size: 16px;
  margin-left: 8px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
}

.join-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-scanner-section,
.manual-join-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qr-button,
.join-submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-button:hover,
.join-submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.join-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.join-input:focus {
  outline: none;
  border-color: #667eea;
}

.scanner-container {
  margin-top: 15px;
}

.scanner-status {
  margin-top: 10px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}
</style>
