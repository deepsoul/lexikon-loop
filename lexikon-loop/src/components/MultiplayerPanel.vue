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
        123 {{ roomId }}
      </div>
      <div v-if="roomId" class="room-info">
        <h4>🔗 Verbindungslink:</h4>
        <div class="qr-container">
          <div id="qrcode"></div>
        </div>
        <p class="room-id">Room ID: {{ roomId }}</p>

        <!-- Share Game Section -->
        <div class="share-game-section">
          <h4>Spiel einladen:</h4>
          <div class="share-buttons">
            <button class="share-btn whatsapp" @click="shareViaWhatsApp">
              📱 WhatsApp
            </button>
            <button class="share-btn email" @click="shareViaEmail">
              📧 Email
            </button>
            <button class="share-btn copy" @click="copyJoinLink">
              📋 Link kopieren
            </button>
          </div>
          <div class="join-link-info">
            <p>
              <strong>Join-ID:</strong> <code>{{ roomId }}</code>
            </p>
            <p>
              <strong>Link:</strong> <code>{{ joinLink }}</code>
            </p>
          </div>
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
import {ref, computed, watch, nextTick} from 'vue';
import {Html5QrcodeScanner} from 'html5-qrcode';
import {useMultiplayer} from '../utils/useMultiplayer.js';

// Use the multiplayer composable
const {
  isMultiplayerConnected,
  multiplayerPlayerName,
  roomId,
  multiplayerStatusText,
  multiplayerStatusClass,
  multiplayerPlayers,
  currentPlayer,
  showMultiplayerPanel,
  showJoinModal,
  joinPlayerName,
  hostId,
  scannerActive,
  scannerStatus,
  joinLink,
  startMultiplayerHost,
  joinMultiplayerGame,
  disconnectMultiplayer,
  shareViaWhatsApp,
  shareViaEmail,
  copyJoinLink,
  onDiceRolled,
  onDiceStopped,
} = useMultiplayer();

// Local state
let qrScanner = null;

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

// QR Code Generation
function generateQRCode() {
  if (!roomId.value) return;

  // Clear existing QR code
  const qrContainer = document.getElementById('qrcode');
  if (qrContainer) {
    qrContainer.innerHTML = '';
  }

  // Generate QR code for join link
  const qrcode = require('qrcode');
  qrcode.toCanvas(
    qrContainer,
    joinLink.value,
    {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    },
    function (error) {
      if (error) {
        console.error('QR Code generation failed:', error);
      } else {
        console.log('QR Code generated successfully');
      }
    },
  );
}

// Dice functions for multiplayer
function rollDice() {
  if (isMultiplayerConnected.value) {
    // Use multiplayer dice roll
    console.log('🎲 Rolling dice in multiplayer mode...');
    // This will be handled by the useMultiplayer composable
  }
}

function finishDiceRoll() {
  const categories = [
    {name: 'STADT', description: 'Nenne eine Stadt (z.B. Berlin)'},
    {name: 'LAND', description: 'Nenne ein Land (z.B. Frankreich)'},
    {name: 'FLUSS', description: 'Nenne einen Fluss (z.B. Rhein)'},
    {name: 'NAME', description: 'Nenne einen Vornamen (z.B. Anna)'},
    {name: 'TIER', description: 'Nenne ein Tier (z.B. Elefant)'},
    {name: 'JACKPOT', description: 'Wähle KATEGORIE & BUCHSTABEN frei!'},
  ];

  const result = Math.floor(Math.random() * categories.length);
  const category = categories[result];

  // Emit dice result to parent component
  window.dispatchEvent(
    new CustomEvent('dice-result', {
      detail: {
        category: category.name,
        description: category.description,
        isJackpot: result === 5,
      },
    }),
  );
}

// Watch for roomId changes to generate QR code
watch(roomId, (newRoomId) => {
  if (newRoomId) {
    nextTick(() => {
      generateQRCode();
    });
  }
});

// UI functions
function toggleMultiplayerPanel() {
  showMultiplayerPanel.value = !showMultiplayerPanel.value;
}
</script>

<style scoped>
.multiplayer-panel {
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.panel-header {
  padding: 15px 20px;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.panel-toggle {
  color: #64748b;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.panel-content {
  padding: 20px;
  background: #ffffff;
}

.host-section,
.client-section {
  margin-bottom: 20px;
}

.host-button,
.join-button {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 15px;
  font-weight: 500;
}

.host-button:hover,
.join-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.room-info {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid #e2e8f0;
}

.room-info h4 {
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.room-id {
  color: #1e293b;
  font-size: 12px;
  text-align: center;
  margin: 10px 0 0 0;
  font-weight: 500;
}

.connection-status {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
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
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.status-connected {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.player-info p {
  color: #1e293b;
  margin: 5px 0;
  font-size: 14px;
}

.player-list h4 {
  color: #1e293b;
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}

.players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-item {
  background: #ffffff;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.player-name {
  color: #1e293b;
  font-weight: 600;
}

.player-score {
  color: #64748b;
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #1e293b;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
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

/* Share Game Section Styles */
.share-game-section {
  margin-top: 15px;
  padding: 15px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.share-game-section h4 {
  margin: 0 0 10px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.share-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.share-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: 500;
}

.share-btn.whatsapp {
  background: #25d366;
}

.share-btn.email {
  background: #ea4335;
}

.share-btn.copy {
  background: #4285f4;
}

.share-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.join-link-info {
  background: #f8fafc;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  border: 1px solid #e2e8f0;
}

.join-link-info p {
  color: #1e293b;
  font-size: 12px;
  margin: 5px 0;
}

.join-link-info code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  word-break: break-all;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}
</style>
