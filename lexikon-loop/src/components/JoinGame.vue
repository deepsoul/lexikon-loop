<template>
  <div>
    <div class="page-bg">
      <div class="main-card">
        <!-- Header -->
        <header class="header-section">
          <div class="header-content">
            <h1 class="game-title-animated">Lexikon-Loop</h1>
            <div class="subtitle-animated">Multiplayer beitreten</div>
          </div>
        </header>

        <!-- Join Status -->
        <div class="join-status-section">
          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Verbinde mit Host...</p>
          </div>

          <div v-else-if="joinError" class="error-state">
            <div class="error-icon">❌</div>
            <h3>Verbindung fehlgeschlagen</h3>
            <p>{{ joinError }}</p>
            <button class="retry-btn" @click="retryJoin">
              🔄 Erneut versuchen
            </button>
          </div>

          <div v-else-if="isConnected" class="success-state">
            <div class="success-icon">✅</div>
            <h3>Erfolgreich verbunden!</h3>
            <p>
              Du spielst als: <strong>{{ playerName }}</strong>
            </p>
            <p>
              Host-ID: <code>{{ hostId }}</code>
            </p>
            <div class="auto-redirect-info">
              <p>
                🔄 Automatische Weiterleitung in {{ redirectCountdown }}s...
              </p>
            </div>
          </div>

          <div v-else class="join-form">
            <h3>Multiplayer beitreten</h3>
            <p>Gib deine Spielerdaten ein:</p>

            <div class="form-group">
              <label class="form-label">Spielername:</label>
              <input
                v-model="playerName"
                class="form-input"
                placeholder="Dein Name"
                autofocus
              />
            </div>

            <div class="form-group">
              <label class="form-label">Host-ID:</label>
              <input
                v-model="hostId"
                class="form-input"
                placeholder="Host-ID eingeben"
                readonly
              />
              <small class="form-help">Host-ID aus URL übernommen</small>
            </div>

            <button
              class="join-btn"
              @click="joinGame"
              :disabled="!playerName.trim()"
            >
              🔗 Spiel beitreten
            </button>
          </div>
        </div>

        <!-- Back to Home -->
        <button class="back-home-btn" @click="router.push('/')">
          Zurück zur Startseite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {createSocket} from '../utils/socket';
import {Socket} from 'socket.io-client';

const router = useRouter();
const route = useRoute();

// Reactive data
const isLoading = ref(false);
const isConnected = ref(false);
const joinError = ref('');
const playerName = ref('');
const redirectCountdown = ref(3);
let redirectTimer: number | null = null;
const hostId = ref('');
let socket: Socket | null = null;

// Extract host ID from URL parameters
onMounted(() => {
  const urlHostId = route.query.host as string;
  if (urlHostId) {
    hostId.value = urlHostId;
    console.log('Host ID from URL:', urlHostId);
  } else {
    joinError.value = 'Keine Host-ID in der URL gefunden.';
  }
});

// Join game function
async function joinGame() {
  if (!playerName.value.trim()) {
    joinError.value = 'Bitte gib einen Spielernamen ein.';
    return;
  }

  if (!hostId.value) {
    joinError.value = 'Keine Host-ID verfügbar.';
    return;
  }

  isLoading.value = true;
  joinError.value = '';

  try {
    console.log('🔌 Creating socket connection for client...');
    socket = createSocket();

    socket.on('connect', () => {
      console.log('✅ Client connected to server');
      console.log('🆔 Client Socket ID:', socket!.id);

      // Join room as client
      console.log('👥 Joining room as client:', hostId.value);
      socket!.emit('joinRoom', {
        roomId: hostId.value,
        playerName: playerName.value,
        isHost: false,
      });
    });

    socket.on('playerJoined', (data) => {
      console.log('👥 Client: Player joined event received:', data);
      console.log('📊 All players:', data.allPlayers);

      // Store player data in localStorage for the main game
      localStorage.setItem('multiplayer_player_name', playerName.value);
      localStorage.setItem('multiplayer_host_id', hostId.value);
      localStorage.setItem('multiplayer_connected', 'true');

      isConnected.value = true;
      console.log('✅ Successfully joined game as:', playerName.value);

      // Start automatic redirect countdown
      startAutoRedirect();
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      joinError.value = 'Verbindung zum Server fehlgeschlagen.';
      isLoading.value = false;
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected from server');
    });
  } catch (error) {
    console.error('❌ Join game error:', error);
    joinError.value = 'Verbindung zum Host fehlgeschlagen.';
    isLoading.value = false;
  }
}

// Retry join
function retryJoin() {
  joinError.value = '';
  joinGame();
}

// Start automatic redirect countdown
function startAutoRedirect() {
  redirectCountdown.value = 3;

  redirectTimer = window.setInterval(() => {
    redirectCountdown.value--;

    if (redirectCountdown.value <= 0) {
      if (redirectTimer) {
        clearInterval(redirectTimer);
        redirectTimer = null;
      }
      console.log('🔄 Redirecting to game...');
      router.push('/lets-play');
    }
  }, 1000);
}

// Start playing
function startPlaying() {
  router.push('/lets-play');
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-bg {
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(30, 41, 59, 0.1);
  padding: 32px 18px 24px 18px;
  margin: 0 0 0 0;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
}

.game-title-animated {
  font-size: 2.1rem;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: linear-gradient(90deg, #2563eb 30%, #fbbf24 70%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 0.1em;
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
  animation: fadeSlideIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
}

.subtitle-animated {
  color: #64748b;
  font-size: 1.08rem;
  text-align: center;
  margin-bottom: 1.5em;
  opacity: 0;
  transform: translateY(-12px);
  animation: fadeSlideIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s forwards;
}

/* Join Status Section */
.join-status-section {
  margin-bottom: 2rem;
  text-align: center;
}

.loading-state {
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e7ff;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  padding: 2rem;
  background: #fef2f2;
  border-radius: 16px;
  border: 2px solid #fecaca;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #7f1d1d;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #b91c1c;
}

.success-state {
  padding: 2rem;
  background: #f0fdf4;
  border-radius: 16px;
  border: 2px solid #bbf7d0;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.success-state h3 {
  color: #16a34a;
  margin-bottom: 0.5rem;
}

.success-state p {
  color: #166534;
  margin-bottom: 0.5rem;
}

.success-state code {
  background: #e0e7ff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}

.play-btn {
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.play-btn:hover {
  background: #15803d;
  transform: translateY(-2px);
}

.join-form {
  padding: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid #e0e7ff;
}

.join-form h3 {
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.join-form p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
  border: 2px solid #e0e7ef;
  outline: none;
  box-shadow: 0 2px 12px #2563eb11;
  transition: border 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border: 2px solid #2563eb;
  box-shadow: 0 0 0 2px #2563eb33;
}

.form-input[readonly] {
  background: #f1f5f9;
  color: #64748b;
}

.form-help {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.join-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.join-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Back Home Button */
.back-home-btn {
  display: block;
  margin: 2.5rem auto 0 auto;
  padding: 1.1rem 2.2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2563eb;
  background: #f1f5f9;
  border: 2px solid #2563eb;
  border-radius: 2rem;
  box-shadow: 0 2px 12px #2563eb22;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
}

.back-home-btn:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb33;
}

.back-home-btn:active {
  transform: scale(0.97);
}

/* Animations */
@keyframes fadeSlideIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile-optimierte Styles */
.auto-redirect-info {
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
}

.auto-redirect-info p {
  color: #0c4a6e;
  font-weight: 500;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-card {
    padding: 20px 12px 16px 12px;
    margin: 0 4px;
    border-radius: 16px;
  }

  .game-title-animated {
    font-size: 1.6rem;
  }

  .subtitle-animated {
    font-size: 0.9rem;
  }

  .join-form h3 {
    font-size: 1.2rem;
  }

  .form-input {
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }

  .join-btn {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
  }

  .loading-state,
  .error-state,
  .success-state {
    padding: 1.5rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .error-icon,
  .success-icon {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .main-card {
    padding: 16px 8px 12px 8px;
    margin: 0 2px;
  }

  .game-title-animated {
    font-size: 1.4rem;
  }

  .form-input {
    font-size: 0.9rem;
    padding: 0.7rem 0.8rem;
  }

  .join-btn {
    font-size: 0.9rem;
    padding: 0.7rem 1.2rem;
  }
}
</style>
