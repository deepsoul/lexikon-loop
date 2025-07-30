<template>
  <div>
    <div>
      <div class="page-bg">
        <div class="main-card">
          <!-- Header mit Icons-Link -->
          <header class="header-section">
            <!-- <router-link to="/" class="logo-link"></router-link> -->
            <div class="header-content">
              <h1 class="game-title-animated">Lexikon-Loop</h1>
              <div class="subtitle-animated">Das digitale Wortketten-Spiel</div>
            </div>
          </header>

          <!-- Timer-Einstellung (kompakter) -->
          <div class="timer-settings-section">
            <div class="timer-settings">
              <span class="timer-settings-label">Rundenzeit:</span>
              <div class="timer-buttons">
                <button
                  v-for="opt in timerOptions"
                  :key="opt"
                  class="timer-settings-btn"
                  :class="{active: timerDuration === opt}"
                  @click="setTimerDuration(opt)"
                >
                  {{ opt }}s
                </button>
              </div>
            </div>
            <div v-if="isSpeedRound" class="speed-round-badge">
              ⚡ Speed-Runde! Korrekte Antwort = 2 Punkte
            </div>
          </div>

          <!-- Multiplayer Section -->
          <div class="multiplayer-section">
            <div class="multiplayer-header">
              <h3 class="section-title">📱 Multiplayer (iOS & Android)</h3>
              <div class="multiplayer-status" :class="multiplayerStatusClass">
                {{ multiplayerStatusText }}
              </div>
            </div>

            <div class="multiplayer-controls">
              <button
                v-if="!isMultiplayerHost && !isMultiplayerConnected"
                class="multiplayer-btn host"
                @click="startMultiplayerHost"
              >
                🏠 Als Host starten
              </button>

              <button
                v-if="!isMultiplayerHost && !isMultiplayerConnected"
                class="multiplayer-btn join"
                @click="showJoinModal = true"
              >
                🔗 Spiel beitreten
              </button>

              <button
                v-if="isMultiplayerHost || isMultiplayerConnected"
                class="multiplayer-btn disconnect"
                @click="disconnectMultiplayer"
              >
                🔌 Verbindung trennen
              </button>
            </div>

            <div v-if="isMultiplayerHost" class="multiplayer-host-info">
              <div class="host-info">
                <strong>🏠 Du bist der Host</strong>
                <p>Andere Spieler können sich über QR-Code verbinden</p>

                <!-- QR Code für Verbindung -->
                <div class="qr-code-container">
                  <h4>QR-Code für Spieler:</h4>
                  <div class="qr-code" ref="qrCodeRef">
                    <div
                      v-if="!hostQRCode"
                      style="padding: 20px; text-align: center; color: #64748b"
                    >
                      QR-Code wird generiert...
                    </div>
                  </div>
                  <p class="qr-instruction">
                    Spieler scannen diesen QR-Code mit ihrem Handy
                  </p>
                </div>

                <div class="connected-players">
                  <h4>Verbundene Spieler:</h4>
                  <div
                    v-for="player in multiplayerPlayers"
                    :key="player.id"
                    class="multiplayer-player"
                  >
                    <span class="player-avatar">{{
                      player.name.charAt(0).toUpperCase()
                    }}</span>
                    <span class="player-name">{{ player.name }}</span>
                    <span class="player-score">{{ player.score }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="isMultiplayerConnected && !isMultiplayerHost"
              class="multiplayer-client-info"
            >
              <div class="client-info">
                <strong>📱 Verbunden mit Host</strong>
                <p>Du spielst als: {{ multiplayerPlayerName }}</p>
                <div class="game-status">
                  <p v-if="multiplayerGameState">
                    Aktuelle Kategorie: {{ multiplayerGameState.category }}
                  </p>
                  <p v-if="multiplayerGameState">
                    Aktueller Buchstabe:
                    {{ multiplayerGameState.currentLetter }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Spieler-Management (vereinfacht) -->
          <div class="players-section">
            <div class="players-header">
              <h3 class="section-title">Spieler</h3>
              <button
                class="add-player-btn"
                @click="addPlayer"
                title="Spieler hinzufügen"
              >
                <span>＋</span>
              </button>
            </div>

            <!-- Spieler-Liste (vereinfacht) -->
            <div class="players-list">
              <div
                v-for="(p, i) in players"
                :key="i"
                class="player-item"
                :class="{'player-active': i === currentPlayer}"
              >
                <div class="player-info">
                  <span class="player-avatar">{{
                    p.name.charAt(0).toUpperCase()
                  }}</span>
                  <span class="player-name" @click="startEditPlayer(i)">
                    <template v-if="editingPlayerIndex === i">
                      <input
                        v-model="editingPlayerName"
                        @keyup.enter="confirmEditPlayer"
                        @blur="confirmEditPlayer"
                        class="player-edit-input"
                        autofocus
                      />
                    </template>
                    <template v-else>{{ p.name }}</template>
                  </span>
                  <span class="player-score">{{ p.score }}</span>
                </div>

                <div class="player-actions">
                  <button
                    class="action-btn"
                    @click="deletePlayer(i)"
                    title="Löschen"
                  >
                    🗑️
                  </button>
                  <button
                    v-if="i > 0"
                    class="action-btn"
                    @click="movePlayer(i, 'up')"
                    title="Nach oben"
                  >
                    ▲
                  </button>
                  <button
                    v-if="i < players.length - 1"
                    class="action-btn"
                    @click="movePlayer(i, 'down')"
                    title="Nach unten"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <button class="reset-all-btn" @click="resetAllPlayers">
              <svg
                class="reset-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 3a7 7 0 0 0-7 7h-3l4 4 4-4H7a3 3 0 1 1 3 3v2a5 5 0 1 0-5-5H3a7 7 0 1 1 7 7v-2z"
                  fill="currentColor"
                />
              </svg>
              Alle zurücksetzen
            </button>
          </div>

          <!-- Hauptspielbereich -->
          <div class="game-section">
            <!-- Würfel-Bereich -->
            <div class="dice-section">
              <div class="dice-container">
                <div class="dice" :style="diceTransform">
                  <div class="dice-face">
                    <!-- Stadt-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#fdf8f4"
                        stroke="#2563eb"
                        stroke-width="2"
                      />
                      <g transform="translate(30,20)">
                        <rect
                          width="10"
                          height="20"
                          x="0"
                          y="10"
                          fill="#2563eb"
                        />
                        <rect
                          width="10"
                          height="30"
                          x="10"
                          y="0"
                          fill="#2563eb"
                        />
                        <rect
                          width="10"
                          height="20"
                          x="20"
                          y="10"
                          fill="#2563eb"
                        />
                      </g>
                    </svg>
                    STADT
                  </div>
                  <div class="dice-face">
                    <!-- Land-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#dff5dc"
                        stroke="#16a34a"
                        stroke-width="2"
                      />
                      <circle
                        cx="50"
                        cy="40"
                        r="18"
                        stroke="#16a34a"
                        stroke-width="2"
                        fill="none"
                      />
                      <path
                        d="M32,40 h36 M50,22 v36 M38,28 a18,18 0 0 1 24,24"
                        stroke="#16a34a"
                        fill="none"
                      />
                    </svg>
                    LAND
                  </div>
                  <div class="dice-face">
                    <!-- Fluss-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#d6edff"
                        stroke="#075985"
                        stroke-width="2"
                      />
                      <path
                        d="M20,40 q5,5 10,0 t10,0 t10,0 t10,0"
                        stroke="#075985"
                        stroke-width="3"
                        fill="none"
                      />
                      <path
                        d="M20,55 q5,5 10,0 t10,0 t10,0 t10,0"
                        stroke="#075985"
                        stroke-width="3"
                        fill="none"
                      />
                    </svg>
                    FLUSS
                  </div>
                  <div class="dice-face">
                    <!-- Name-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#fdeef2"
                        stroke="#9333ea"
                        stroke-width="2"
                      />
                      <circle cx="50" cy="35" r="10" fill="#9333ea" />
                      <path d="M35,70 q15,-20 30,0 z" fill="#9333ea" />
                    </svg>
                    NAME
                  </div>
                  <div class="dice-face">
                    <!-- Tier-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#fff2ea"
                        stroke="#d97706"
                        stroke-width="2"
                      />
                      <circle cx="35" cy="40" r="8" fill="#d97706" />
                      <circle cx="65" cy="40" r="8" fill="#d97706" />
                      <circle cx="40" cy="60" r="7" fill="#d97706" />
                      <circle cx="60" cy="60" r="7" fill="#d97706" />
                      <path
                        d="M42,55 q8,-10 16,0 q-4,10 -16,0"
                        fill="#d97706"
                      />
                    </svg>
                    TIER
                  </div>
                  <div class="dice-face">
                    <!-- Jackpot-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <rect
                        width="100"
                        height="100"
                        rx="10"
                        fill="#ffec69"
                        stroke="#ca8a04"
                        stroke-width="2"
                      />
                      <polygon
                        points="50,20 58,40 80,40 62,55 70,75 50,62 30,75 38,55 20,40 42,40"
                        fill="#ca8a04"
                      />
                    </svg>
                    JACKPOT
                  </div>
                </div>
              </div>

              <button class="roll-btn" :disabled="rolling" @click="rollDice">
                <span v-if="rolling">🎲 Würfelt...</span>
                <span v-else-if="resultText === 'Bereit zum Würfeln!'"
                  >🎲 WÜRFELN</span
                >
                <span v-else>🎲 NEU WÜRFELN</span>
              </button>
            </div>

            <!-- Ergebnis-Bereich -->
            <div
              v-if="!rolling && resultText !== 'Bereit zum Würfeln!'"
              class="result-section"
            >
              <div class="result-display">
                <div
                  class="result-category"
                  :class="{'jackpot-animation': isJackpot}"
                >
                  {{ resultText }}
                </div>
                <div class="result-description">{{ subResult }}</div>
                <div class="current-letter-display">
                  <span class="letter-label">Aktueller Buchstabe:</span>
                  <span class="current-letter">{{ currentLetter }}</span>
                </div>
              </div>

              <!-- Spracheingabe -->
              <div class="speech-section">
                <button
                  class="speech-btn"
                  @click="
                    isListening
                      ? stopSpeechRecognition()
                      : startSpeechRecognition()
                  "
                >
                  <span v-if="isListening">🎤 Hören…</span>
                  <span v-else>🎤 Spracheingabe</span>
                </button>
                <div v-if="recognizedWord" class="speech-result">
                  <strong>Erkannt:</strong> {{ recognizedWord }}<br />
                  <span v-if="recognizedLastLetter">
                    <strong>Letzter Buchstabe:</strong>
                    {{ recognizedLastLetter }}
                  </span>
                </div>

                <!-- Validierungsergebnis -->
                <div
                  v-if="validationResult"
                  class="validation-result"
                  :class="{
                    'validation-success': validationResult.includes('✅'),
                    'validation-error': validationResult.includes('❌'),
                    'validation-warning': validationResult.includes('⚠️'),
                  }"
                >
                  <div v-if="isValidating" class="validating-indicator">
                    🔍 Validiere...
                  </div>
                  <div v-else class="validation-message">
                    {{ validationResult }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Spielsteuerung -->
            <div class="game-controls">
              <!-- Timer-Bereich -->
              <div class="timer-section">
                <div
                  class="timer-display"
                  v-if="timerActive || timeLeft < timerDuration"
                >
                  <div class="timer-time">{{ timeLeft }}s</div>
                  <div class="timer-bar">
                    <div
                      class="timer-progress"
                      :style="timerProgressStyle"
                    ></div>
                  </div>
                </div>

                <div class="timer-buttons">
                  <button
                    class="timer-btn"
                    :class="{'timer-active': timerActive}"
                    @click="toggleTimer"
                  >
                    <span v-if="timerActive">⏸️ Pause</span>
                    <span v-else>▶️ Start</span>
                  </button>
                  <button class="timer-btn" @click="resetGameTimer">
                    🔄 Reset
                  </button>
                </div>
              </div>

              <!-- Spieler-Navigation -->
              <div class="player-navigation">
                <button class="nav-btn" @click="switchPlayer('prev')">
                  ← Vorheriger
                </button>
                <button class="nav-btn" @click="switchPlayer('next')">
                  Nächster →
                </button>
              </div>

              <!-- Punkte-Steuerung -->
              <div class="points-controls">
                <button class="points-btn" @click="addPoints(1)">
                  +1 Punkt
                </button>
                <button class="points-btn" @click="addPoints(2)">
                  +2 Punkte
                </button>
                <button class="points-btn negative" @click="addPoints(-1)">
                  -1 Punkt
                </button>
                <button class="points-btn reset" @click="resetPoints">
                  Reset Punkte
                </button>
              </div>
            </div>
          </div>

          <!-- Spielregeln -->
          <div class="rules-section">
            <h3 class="section-title">Spielregeln</h3>
            <ul class="rules-list">
              <li>
                <strong>Würfle</strong> und beachte die angezeigte Kategorie
              </li>
              <li>
                Bei <span class="jackpot-highlight">JACKPOT</span>: Wähle frei
                Kategorie & Anfangsbuchstabe
              </li>
              <li>
                Bei anderen Kategorien: Beginne mit dem letzten Buchstaben des
                vorherigen Begriffs
              </li>
              <li>
                Bei korrekter Antwort: Punkte erhalten (1 Punkt normal, 2 für
                Jackpot)
              </li>
              <li>Nach deinem Zug: Klicke auf "Nächster Spieler"</li>
              <li>
                <span class="speed-info"
                  >⚡ Bei Speed-Runden (10 oder 15 Sekunden) gibt es für jede
                  richtige Antwort automatisch 2 Punkte!</span
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Spieler hinzufügen Dialog -->
        <div v-if="showAddPlayer" class="add-player-modal">
          <div class="add-player-card">
            <label class="modal-label">Spielername:</label>
            <input
              v-model="newPlayerName"
              @keyup.enter="confirmAddPlayer"
              class="modal-input"
              placeholder="Name eingeben"
              autofocus
            />
            <div class="modal-buttons">
              <button class="modal-btn primary" @click="confirmAddPlayer">
                Hinzufügen
              </button>
              <button class="modal-btn secondary" @click="cancelAddPlayer">
                Abbrechen
              </button>
            </div>
          </div>
        </div>

        <!-- Multiplayer Join Modal -->
        <div v-if="showJoinModal" class="add-player-modal">
          <div class="add-player-card">
            <h3 class="modal-title">🎮 Multiplayer beitreten</h3>

            <div class="qr-scanner-section">
              <h4>QR-Code scannen:</h4>
              <div class="qr-scanner-container">
                <div id="qr-scanner" class="qr-scanner"></div>
                <p class="scanner-instruction">
                  Richte die Kamera auf den QR-Code des Hosts
                </p>
                <div class="scanner-status" v-if="scannerStatus">
                  {{ scannerStatus }}
                </div>
                <button
                  v-if="!scannerActive"
                  class="scanner-start-btn"
                  @click="startQRScanner"
                >
                  📷 Scanner starten
                </button>
              </div>
            </div>

            <div class="manual-join-section">
              <h4>Oder manuell verbinden:</h4>
              <div class="form-group">
                <label class="modal-label">Spielername:</label>
                <input
                  v-model="joinPlayerName"
                  class="modal-input"
                  placeholder="Dein Name"
                  autofocus
                />
              </div>
              <div class="form-group">
                <label class="modal-label">Host-ID:</label>
                <input
                  v-model="hostId"
                  class="modal-input"
                  placeholder="Host-ID eingeben"
                />
              </div>

              <!-- Test QR Code -->
              <div class="test-qr-section">
                <h4>Test QR-Code:</h4>
                <button class="test-qr-btn" @click="generateTestQRCode">
                  🧪 Test QR-Code generieren
                </button>
                <div v-if="testQRCode" class="test-qr-container">
                  <div class="test-qr-code" ref="testQRCodeRef"></div>
                  <p class="test-qr-info">Scanne diesen QR-Code zum Testen</p>
                </div>
              </div>
            </div>

            <div class="modal-buttons">
              <button class="modal-btn primary" @click="joinMultiplayerGame">
                Beitreten
              </button>
              <button
                class="modal-btn secondary"
                @click="showJoinModal = false"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>

        <!-- Zurück zur Startseite -->
        <button class="back-home-btn" @click="router.push('/')">
          Zurück zur Startseite
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, onUnmounted, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import QRCode from 'qrcode';
import {Html5QrcodeScanner, Html5QrcodeScanType} from 'html5-qrcode';
import {Socket} from 'socket.io-client';
import {createSocket} from '../utils/socket';
const router = useRouter();

// Typ für Spieler
interface Player {
  name: string;
  score: number;
}

// Spieler-Liste mit LocalStorage-Laden
const players = ref<Player[]>([]);
const currentPlayer = ref(0);
const currentLetter = ref('-');
const timerOptions = [10, 15, 30, 45];
const timerDuration = ref(30);
const timeLeft = ref(timerDuration.value);
const timerActive = ref(false);
let timerInterval: number | null = null;
const rolling = ref(false);
const resultText = ref('Bereit zum Würfeln!');
const subResult = ref('Klicke auf den Würfeln-Button');
const isJackpot = ref(false);
const diceRotation = ref({x: 0, y: 0, z: 0});
const scorePulse = ref(false);
const showAddPlayer = ref(false);
const newPlayerName = ref('');
const editingPlayerIndex = ref<number | null>(null);
const editingPlayerName = ref('');

const categories = [
  {
    name: 'STADT',
    description: 'Nenne eine Stadt (z.B. Berlin)',
    rotation: {x: 4, y: 5, z: 3},
    endRotation: {x: 0, y: 0, z: 0},
  },
  {
    name: 'LAND',
    description: 'Nenne ein Land (z.B. Frankreich)',
    rotation: {x: -5, y: -4, z: -3},
    endRotation: {x: 180, y: 0, z: 0},
  },
  {
    name: 'FLUSS',
    description: 'Nenne einen Fluss (z.B. Rhein)',
    rotation: {x: 6, y: -5, z: 4},
    endRotation: {x: 0, y: -90, z: 0},
  },
  {
    name: 'NAME',
    description: 'Nenne einen Vornamen (z.B. Anna)',
    rotation: {x: -4, y: 6, z: -5},
    endRotation: {x: 0, y: 90, z: 0},
  },
  {
    name: 'TIER',
    description: 'Nenne ein Tier (z.B. Elefant)',
    rotation: {x: 5, y: 3, z: -6},
    endRotation: {x: -90, y: 0, z: 0},
  },
  {
    name: 'JACKPOT',
    description: 'Wähle KATEGORIE & BUCHSTABEN frei!',
    rotation: {x: -3, y: -6, z: 5},
    endRotation: {x: 90, y: 0, z: 0},
  },
];

const diceTransform = computed(() => {
  const {x, y, z} = diceRotation.value;
  return {
    transform: `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`,
  };
});

const timerProgressStyle = computed(() => {
  const percent = (timeLeft.value / timerDuration.value) * 100;
  let bg = '#16a34a';
  if (timeLeft.value <= 10) bg = '#ef4444';
  else if (timeLeft.value <= 20) bg = '#fde047';
  return {
    width: percent + '%',
    background: bg,
  };
});

function playSound(type: 'roll' | 'success' | 'jackpot' | 'timer') {
  // @ts-ignore
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  switch (type) {
    case 'roll':
      // Schöner Würfel-Sound mit mehreren harmonischen Tönen
      const rollDuration = 0.8;
      const rollGain = ctx.createGain();
      rollGain.connect(ctx.destination);
      rollGain.gain.setValueAtTime(0.15, ctx.currentTime);
      rollGain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + rollDuration,
      );

      // Hauptton (sanfter Triangle-Wave)
      const mainOsc = ctx.createOscillator();
      mainOsc.type = 'triangle';
      mainOsc.frequency.setValueAtTime(220, ctx.currentTime);
      mainOsc.frequency.exponentialRampToValueAtTime(
        110,
        ctx.currentTime + rollDuration,
      );
      mainOsc.connect(rollGain);
      mainOsc.start();
      mainOsc.stop(ctx.currentTime + rollDuration);

      // Harmonie-Ton (höher)
      const harmonyOsc = ctx.createOscillator();
      harmonyOsc.type = 'triangle';
      harmonyOsc.frequency.setValueAtTime(330, ctx.currentTime);
      harmonyOsc.frequency.exponentialRampToValueAtTime(
        165,
        ctx.currentTime + rollDuration,
      );
      harmonyOsc.connect(rollGain);
      harmonyOsc.start();
      harmonyOsc.stop(ctx.currentTime + rollDuration);

      // Bass-Ton (tiefer)
      const bassOsc = ctx.createOscillator();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(110, ctx.currentTime);
      bassOsc.frequency.exponentialRampToValueAtTime(
        55,
        ctx.currentTime + rollDuration,
      );
      bassOsc.connect(rollGain);
      bassOsc.start();
      bassOsc.stop(ctx.currentTime + rollDuration);
      break;

    case 'success':
      // Angenehmer Erfolgs-Sound mit aufsteigender Melodie
      const successGain = ctx.createGain();
      successGain.connect(ctx.destination);
      successGain.gain.setValueAtTime(0.2, ctx.currentTime);
      successGain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.6,
      );

      // Aufsteigende Töne: C, E, G
      const tones = [523.25, 659.25, 783.99]; // C5, E5, G5
      tones.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
        osc.connect(successGain);
        osc.start(ctx.currentTime + index * 0.1);
        osc.stop(ctx.currentTime + index * 0.1 + 0.3);
      });
      break;

    case 'jackpot':
      // Spektakulärer Jackpot-Sound mit Glocken-Effekt
      const jackpotGain = ctx.createGain();
      jackpotGain.connect(ctx.destination);
      jackpotGain.gain.setValueAtTime(0.25, ctx.currentTime);
      jackpotGain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 1.2,
      );

      // Glocken-ähnliche Töne
      const jackpotTones = [392.0, 523.25, 659.25, 830.61, 1046.5]; // G4, C5, E5, G#5, C6
      jackpotTones.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);

        // Glocken-Effekt mit schneller Abnahme
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
        oscGain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + index * 0.15 + 0.4,
        );

        osc.connect(oscGain);
        oscGain.connect(jackpotGain);
        osc.start(ctx.currentTime + index * 0.15);
        osc.stop(ctx.currentTime + index * 0.15 + 0.4);
      });
      break;

    case 'timer':
      // Sanfter Timer-Sound
      const timerOsc = ctx.createOscillator();
      const timerGain = ctx.createGain();
      timerOsc.type = 'sine';
      timerOsc.frequency.setValueAtTime(440, ctx.currentTime);
      timerGain.gain.setValueAtTime(0.15, ctx.currentTime);
      timerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      timerOsc.connect(timerGain);
      timerGain.connect(ctx.destination);
      timerOsc.start();
      timerOsc.stop(ctx.currentTime + 0.2);
      break;
  }
}

function switchPlayer(direction: 'next' | 'prev') {
  if (players.value.length === 0) return;
  if (direction === 'next') {
    currentPlayer.value = (currentPlayer.value + 1) % players.value.length;
  } else {
    currentPlayer.value =
      currentPlayer.value === 0
        ? players.value.length - 1
        : currentPlayer.value - 1;
  }
  playSound('success');
}

function addPlayer() {
  showAddPlayer.value = true;
  newPlayerName.value = '';
}
function confirmAddPlayer() {
  const name =
    newPlayerName.value.trim() || `Spieler ${players.value.length + 1}`;
  players.value.push({name, score: 0});
  currentPlayer.value = players.value.length - 1;
  showAddPlayer.value = false;
  newPlayerName.value = '';
  playSound('success');
}
function cancelAddPlayer() {
  showAddPlayer.value = false;
  newPlayerName.value = '';
}

function addPoints(points: number) {
  if (!players.value.length) return;
  // Speed-Runde: +2 statt +1 für korrekte Antwort
  let actualPoints = points;
  if (points === 1 && isSpeedRound.value) actualPoints = 2;
  players.value[currentPlayer.value].score += actualPoints;
  scorePulse.value = true;
  setTimeout(() => (scorePulse.value = false), 500);
  if (actualPoints > 0) playSound('success');
}

function resetPoints() {
  players.value.forEach((p) => (p.score = 0));
  playSound('timer');
}

function toggleTimer() {
  if (timerActive.value) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  stopTimer();
  timeLeft.value = timerDuration.value;
  timerActive.value = true;
  timerInterval = window.setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      stopTimer();
      playSound('timer');
      alert(
        `Zeit abgelaufen! Spieler ${
          players.value[currentPlayer.value]?.name ?? ''
        } ist dran.`,
      );
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerActive.value = false;
  timerInterval = null;
}

function resetGameTimer() {
  stopTimer();
  timeLeft.value = timerDuration.value;
}

function rollDice() {
  if (rolling.value) return;
  rolling.value = true;
  playSound('roll');

  // Send dice roll to server if in multiplayer
  if (socket && roomId.value) {
    socket.emit('rollDice', {roomId: roomId.value});
    return; // Server will handle the result
  }

  // Single player mode
  // Zufällige Kategorie auswählen
  const result = Math.floor(Math.random() * categories.length);
  const category = categories[result];

  // Animation mit zufälliger Rotation
  const randomRotation = Math.floor(Math.random() * categories.length);
  const randomCategory = categories[randomRotation];
  diceRotation.value = {
    x: randomCategory.rotation.x * 360,
    y: randomCategory.rotation.y * 360,
    z: randomCategory.rotation.z * 360,
  };

  // Text während der Animation ausblenden
  resultText.value = '';
  subResult.value = '';
  currentLetter.value = '-';

  setTimeout(() => {
    // Endposition setzen basierend auf der gewählten Kategorie
    diceRotation.value = category.endRotation;

    // Kurze Verzögerung für bessere Synchronisation
    setTimeout(() => {
      // Ergebnis anzeigen
      resultText.value = category.name;
      subResult.value = category.description;
      isJackpot.value = result === 5; // JACKPOT ist immer Index 5

      if (isJackpot.value) {
        resultText.value = '🎰 JACKPOT 🎰';
        playSound('jackpot');
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        currentLetter.value = letters[Math.floor(Math.random() * 26)];
      }

      rolling.value = false;

      // Timer ggf. neu starten
      if (timerActive.value) {
        resetGameTimer();
        startTimer();
      }
    }, 1100); // Zusätzliche 100ms Verzögerung für bessere Synchronisation
  }, 400);
}

// LocalStorage: Spieler speichern und laden
const STORAGE_KEY = 'lexikonloop_players_v1';
function savePlayers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players.value));
}
function loadPlayers() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      const arr = JSON.parse(data);
      if (
        Array.isArray(arr) &&
        arr.every(
          (p) => typeof p.name === 'string' && typeof p.score === 'number',
        )
      ) {
        players.value = arr;
        return;
      }
    } catch {}
  }
  // Fallback: 1 Spieler
  players.value = [{name: 'Spieler 1', score: 0}];
}

function resetAllPlayers() {
  if (confirm('Möchtest du wirklich alle Spieler und Punkte löschen?')) {
    players.value = [{name: 'Spieler 1', score: 0}];
    currentPlayer.value = 0;
    localStorage.removeItem(STORAGE_KEY);
    playSound('timer');
  }
}

function startEditPlayer(i: number) {
  editingPlayerIndex.value = i;
  editingPlayerName.value = players.value[i].name;
}
function confirmEditPlayer() {
  if (editingPlayerIndex.value !== null) {
    const name =
      editingPlayerName.value.trim() ||
      `Spieler ${editingPlayerIndex.value + 1}`;
    players.value[editingPlayerIndex.value].name = name;
    editingPlayerIndex.value = null;
    editingPlayerName.value = '';
    playSound('success');
  }
}
function cancelEditPlayer() {
  editingPlayerIndex.value = null;
  editingPlayerName.value = '';
}
function deletePlayer(i: number) {
  if (players.value.length <= 1) return;
  if (confirm(`Spieler "${players.value[i].name}" wirklich löschen?`)) {
    players.value.splice(i, 1);
    if (currentPlayer.value >= players.value.length) currentPlayer.value = 0;
    playSound('timer');
  }
}
function movePlayer(i: number, dir: 'up' | 'down') {
  const newIndex = dir === 'up' ? i - 1 : i + 1;
  if (newIndex < 0 || newIndex >= players.value.length) return;
  const temp = players.value[i];
  players.value[i] = players.value[newIndex];
  players.value[newIndex] = temp;
  if (currentPlayer.value === i) currentPlayer.value = newIndex;
  else if (currentPlayer.value === newIndex) currentPlayer.value = i;
  playSound('success');
}

function setTimerDuration(val: number) {
  timerDuration.value = val;
  timeLeft.value = val;
}

const isSpeedRound = computed(() => timerDuration.value <= 15);

// Spracherkennung (SpeechRecognition API)
const isListening = ref(false);
const recognizedWord = ref('');
const recognizedLastLetter = ref('');
const validationResult = ref('');
const isValidating = ref(false);
let recognition: any = null;

// Bluetooth Multiplayer Variables
// Multiplayer Variables (iOS & Android compatible)
const isMultiplayerHost = ref(false);
const isMultiplayerConnected = ref(false);
const multiplayerStatusText = ref('Multiplayer verfügbar');
const multiplayerStatusClass = ref('status-available');
const multiplayerPlayers = ref<
  Array<{id: string; name: string; score: number}>
>([]);
const multiplayerPlayerName = ref('');
const multiplayerGameState = ref<{
  category: string;
  currentLetter: string;
} | null>(null);
const showJoinModal = ref(false);
const joinPlayerName = ref('');
const hostId = ref('');
const hostQRCode = ref('');
const qrCodeRef = ref<HTMLElement | null>(null);
const qrScannerRef = ref<HTMLElement | null>(null);
const scannerActive = ref(false);
const scannerStatus = ref('');
const testQRCode = ref('');
const testQRCodeRef = ref<HTMLElement | null>(null);
let qrScanner: Html5QrcodeScanner | null = null;

// WebSocket connection
let socket: Socket | null = null;
const isConnected = ref(false);
const roomId = ref('');
const playerId = ref('');

function startSpeechRecognition() {
  if (
    !('webkitSpeechRecognition' in window) &&
    !('SpeechRecognition' in window)
  ) {
    alert('Dein Browser unterstützt keine Spracheingabe.');
    return;
  }
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  isListening.value = true;
  recognizedWord.value = '';
  recognizedLastLetter.value = '';
  validationResult.value = '';
  recognition.onresult = async (event: any) => {
    const word = event.results[0][0].transcript.trim();
    recognizedWord.value = word;
    // Letzten Buchstaben extrahieren (ohne Sonderzeichen)
    const match = word.match(/[a-zA-ZäöüÄÖÜß](?=[^a-zA-ZäöüÄÖÜß]*$)/);
    recognizedLastLetter.value = match ? match[0].toUpperCase() : '';
    // Setze currentLetter automatisch auf den letzten Buchstaben
    if (recognizedLastLetter.value)
      currentLetter.value = recognizedLastLetter.value;
    isListening.value = false;

    // Validiere das Wort gegen die aktuelle Kategorie
    await validateWord(word);
  };
  recognition.onerror = () => {
    isListening.value = false;
  };
  recognition.onend = () => {
    isListening.value = false;
  };
  recognition.start();
}
function stopSpeechRecognition() {
  if (recognition) recognition.stop();
  isListening.value = false;
}

// Wort-Validierung gegen die aktuelle Kategorie
async function validateWord(word: string) {
  if (
    !word ||
    !resultText.value ||
    resultText.value === 'Bereit zum Würfeln!'
  ) {
    return;
  }

  isValidating.value = true;
  validationResult.value = '';

  try {
    const category = resultText.value;
    const validation = await validateWordForCategory(word, category);

    if (validation.isValid) {
      validationResult.value = `✅ Korrekt! "${word}" ist ein gültiges ${category.toLowerCase()} Wort.`;
      playSound('success');
      // Automatisch Punkte geben
      addPoints(1);
    } else {
      validationResult.value = `❌ "${word}" ist kein gültiges ${category.toLowerCase()} Wort. ${
        validation.reason
      }`;
      playSound('timer');
    }
  } catch (error) {
    validationResult.value =
      '⚠️ Validierung nicht verfügbar. Bitte manuell prüfen.';
  } finally {
    isValidating.value = false;
  }
}

// Validierung für verschiedene Kategorien
async function validateWordForCategory(
  word: string,
  category: string,
): Promise<{isValid: boolean; reason?: string}> {
  const cleanWord = word.toLowerCase().trim();

  switch (category) {
    case 'STADT':
      return await validateCity(cleanWord);
    case 'LAND':
      return await validateCountry(cleanWord);
    case 'FLUSS':
      return await validateRiver(cleanWord);
    case 'NAME':
      return await validateName(cleanWord);
    case 'TIER':
      return await validateAnimal(cleanWord);
    case 'JACKPOT':
      return {isValid: true, reason: 'Jackpot - alle Wörter erlaubt!'};
    default:
      return {isValid: false, reason: 'Unbekannte Kategorie'};
  }
}

// Stadt-Validierung
async function validateCity(
  word: string,
): Promise<{isValid: boolean; reason?: string}> {
  try {
    // Wikipedia API für deutsche Städte
    const response = await fetch(
      `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        word,
      )}`,
    );
    const data = await response.json();

    if (data.type === 'standard' && data.content_urls?.desktop?.page) {
      // Prüfe, ob es sich um eine Stadt handelt
      const content = data.extract?.toLowerCase() || '';
      const isCity =
        content.includes('stadt') ||
        content.includes('gemeinde') ||
        content.includes('stadt in') ||
        content.includes('stadt der');

      if (isCity) {
        return {isValid: true};
      } else {
        return {isValid: false, reason: 'Keine bekannte Stadt'};
      }
    } else {
      return {isValid: false, reason: 'Stadt nicht gefunden'};
    }
  } catch (error) {
    // Fallback: Einfache Validierung
    return validateGermanWord(word, 'Stadt');
  }
}

// Land-Validierung
async function validateCountry(
  word: string,
): Promise<{isValid: boolean; reason?: string}> {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(word)}`,
    );
    const countries = await response.json();

    if (countries.length > 0) {
      const country = countries[0];
      const germanName =
        country.translations?.deu?.common || country.name.common;

      if (
        germanName.toLowerCase().includes(word) ||
        word.includes(germanName.toLowerCase())
      ) {
        return {isValid: true};
      }
    }

    return {isValid: false, reason: 'Land nicht gefunden'};
  } catch (error) {
    return validateGermanWord(word, 'Land');
  }
}

// Fluss-Validierung
async function validateRiver(
  word: string,
): Promise<{isValid: boolean; reason?: string}> {
  try {
    const response = await fetch(
      `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        word,
      )}`,
    );
    const data = await response.json();

    if (data.type === 'standard' && data.content_urls?.desktop?.page) {
      const content = data.extract?.toLowerCase() || '';
      const isRiver =
        content.includes('fluss') ||
        content.includes('river') ||
        content.includes('gewässer') ||
        content.includes('wasserlauf');

      if (isRiver) {
        return {isValid: true};
      } else {
        return {isValid: false, reason: 'Kein bekannter Fluss'};
      }
    } else {
      return {isValid: false, reason: 'Fluss nicht gefunden'};
    }
  } catch (error) {
    return validateGermanWord(word, 'Fluss');
  }
}

// Name-Validierung
async function validateName(
  word: string,
): Promise<{isValid: boolean; reason?: string}> {
  try {
    // Deutsche Vornamen-Datenbank
    const response = await fetch(
      `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        word,
      )}`,
    );
    const data = await response.json();

    if (data.type === 'standard' && data.content_urls?.desktop?.page) {
      const content = data.extract?.toLowerCase() || '';
      const isName =
        content.includes('vorname') ||
        content.includes('name') ||
        content.includes('person') ||
        content.includes('männlich') ||
        content.includes('weiblich');

      if (isName) {
        return {isValid: true};
      } else {
        return {isValid: false, reason: 'Kein bekannter Vorname'};
      }
    } else {
      return {isValid: false, reason: 'Name nicht gefunden'};
    }
  } catch (error) {
    return validateGermanWord(word, 'Name');
  }
}

// Tier-Validierung
async function validateAnimal(
  word: string,
): Promise<{isValid: boolean; reason?: string}> {
  try {
    const response = await fetch(
      `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        word,
      )}`,
    );
    const data = await response.json();

    if (data.type === 'standard' && data.content_urls?.desktop?.page) {
      const content = data.extract?.toLowerCase() || '';
      const isAnimal =
        content.includes('tier') ||
        content.includes('animal') ||
        content.includes('säugetier') ||
        content.includes('vogel') ||
        content.includes('fisch') ||
        content.includes('reptil') ||
        content.includes('insekten') ||
        content.includes('amphibien');

      if (isAnimal) {
        return {isValid: true};
      } else {
        return {isValid: false, reason: 'Kein bekanntes Tier'};
      }
    } else {
      return {isValid: false, reason: 'Tier nicht gefunden'};
    }
  } catch (error) {
    return validateGermanWord(word, 'Tier');
  }
}

// Fallback-Validierung für deutsche Wörter
function validateGermanWord(
  word: string,
  category: string,
): {isValid: boolean; reason?: string} {
  // Einfache Validierung basierend auf Wortlänge und deutschen Zeichen
  if (word.length < 2) {
    return {isValid: false, reason: 'Wort zu kurz'};
  }

  // Prüfe auf deutsche Umlaute und ß
  const germanChars = /[äöüÄÖÜß]/;
  const hasGermanChars = germanChars.test(word);

  // Prüfe auf gültige deutsche Buchstaben
  const validGermanWord = /^[a-zA-ZäöüÄÖÜß\s-]+$/.test(word);

  if (!validGermanWord) {
    return {isValid: false, reason: 'Enthält ungültige Zeichen'};
  }

  // Für Fallback akzeptieren wir das Wort, wenn es deutsche Zeichen enthält
  if (hasGermanChars) {
    return {isValid: true, reason: 'Fallback-Validierung: Wort akzeptiert'};
  }

  return {isValid: true, reason: 'Fallback-Validierung: Wort akzeptiert'};
}

// Multiplayer Functions with WebSocket
async function startMultiplayerHost() {
  try {
    console.log('🚀 Starting Multiplayer Host...');
    multiplayerStatusText.value = 'Starte Multiplayer Host...';
    multiplayerStatusClass.value = 'status-connecting';

    // Generate unique room ID
    const generatedRoomId = `room_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log('📋 Generated Room ID:', generatedRoomId);

    // Create connection URL
    const connectionUrl = `${window.location.origin}/join?host=${generatedRoomId}`;
    console.log('🔗 Connection URL:', connectionUrl);

    // Initialize WebSocket connection
    console.log('🔌 Creating socket connection...');
    socket = createSocket();

    socket.on('connect', () => {
      console.log('✅ Connected to server');
      console.log('🆔 Socket ID:', socket!.id);
      isConnected.value = true;
      playerId.value = socket!.id || '';

      // Join room as host
      console.log('🏠 Joining room as host:', generatedRoomId);
      socket!.emit('joinRoom', {
        roomId: generatedRoomId,
        playerName: 'Host',
        isHost: true,
      });
    });

    socket.on('playerJoined', (data) => {
      console.log('👥 Player joined:', data);
      console.log('📊 All players:', data.allPlayers);
      console.log('🎮 Game state:', data.gameState);
      multiplayerPlayers.value = data.allPlayers;
      multiplayerGameState.value = data.gameState;
    });

    socket.on('diceRolled', (gameState) => {
      console.log('Dice rolled:', gameState);
      resultText.value = gameState.resultText;
      subResult.value = gameState.subResult;
      isJackpot.value = gameState.isJackpot;
      rolling.value = gameState.rolling;
      currentLetter.value = gameState.currentLetter;
    });

    socket.on('diceStopped', (gameState) => {
      console.log('Dice stopped:', gameState);
      rolling.value = false;
    });

    socket.on('scoreUpdated', (data) => {
      console.log('Score updated:', data);
      multiplayerPlayers.value = data.allPlayers;
    });

    socket.on('playerTurnChanged', (data) => {
      console.log('Player turn changed:', data);
      currentPlayer.value = data.currentPlayer;
      multiplayerGameState.value = data.gameState;
    });

    socket.on('speechRecognized', (data) => {
      console.log('Speech recognized:', data);
      recognizedWord.value = data.word;
      recognizedLastLetter.value = data.lastLetter;
      currentLetter.value = data.lastLetter;
    });

    socket.on('timerUpdated', (data) => {
      console.log('Timer updated:', data);
      timeLeft.value = data.timeLeft;
      timerActive.value = data.timerActive;
    });

    socket.on('playerLeft', (data) => {
      console.log('Player left:', data);
      multiplayerPlayers.value = data.allPlayers;
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      isConnected.value = false;
    });

    // Start hosting
    isMultiplayerHost.value = true;
    isMultiplayerConnected.value = true;
    roomId.value = generatedRoomId;
    multiplayerStatusText.value = 'Host aktiv - Warte auf Spieler...';
    multiplayerStatusClass.value = 'status-connected';

    // Wait for DOM update
    await nextTick();

    // Additional delay to ensure DOM is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Generate QR Code after DOM is updated
    await generateQRCode(connectionUrl);

    playSound('success');
  } catch (error) {
    console.error('Multiplayer Host Error:', error);
    multiplayerStatusText.value = 'Multiplayer Host Fehler';
    multiplayerStatusClass.value = 'status-error';
    playSound('timer');
  }
}

function joinMultiplayerGame() {
  try {
    console.log('🔗 Starting client join process...');
    const playerName =
      joinPlayerName.value.trim() ||
      `Spieler ${Math.floor(Math.random() * 1000)}`;
    console.log('👤 Player name:', playerName);
    console.log('🏠 Host ID:', hostId.value);

    // Initialize WebSocket connection
    console.log('🔌 Creating socket connection for client...');
    socket = createSocket();

    socket.on('connect', () => {
      console.log('Connected to server as client');
      isConnected.value = true;
      playerId.value = socket!.id || '';

      // Join room as client
      socket!.emit('joinRoom', {
        roomId: hostId.value,
        playerName: playerName,
        isHost: false,
      });
    });

    socket.on('playerJoined', (data) => {
      console.log('Joined room:', data);
      multiplayerPlayers.value = data.allPlayers;
      multiplayerGameState.value = data.gameState;
    });

    socket.on('diceRolled', (gameState) => {
      console.log('Dice rolled:', gameState);
      resultText.value = gameState.resultText;
      subResult.value = gameState.subResult;
      isJackpot.value = gameState.isJackpot;
      rolling.value = gameState.rolling;
      currentLetter.value = gameState.currentLetter;
    });

    socket.on('diceStopped', (gameState) => {
      console.log('Dice stopped:', gameState);
      rolling.value = false;
    });

    socket.on('scoreUpdated', (data) => {
      console.log('Score updated:', data);
      multiplayerPlayers.value = data.allPlayers;
    });

    socket.on('playerTurnChanged', (data) => {
      console.log('Player turn changed:', data);
      currentPlayer.value = data.currentPlayer;
      multiplayerGameState.value = data.gameState;
    });

    socket.on('speechRecognized', (data) => {
      console.log('Speech recognized:', data);
      recognizedWord.value = data.word;
      recognizedLastLetter.value = data.lastLetter;
      currentLetter.value = data.lastLetter;
    });

    socket.on('timerUpdated', (data) => {
      console.log('Timer updated:', data);
      timeLeft.value = data.timeLeft;
      timerActive.value = data.timerActive;
    });

    socket.on('playerLeft', (data) => {
      console.log('Player left:', data);
      multiplayerPlayers.value = data.allPlayers;
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      isConnected.value = false;
    });

    // Join as client
    isMultiplayerHost.value = false;
    isMultiplayerConnected.value = true;
    multiplayerPlayerName.value = playerName;
    roomId.value = hostId.value;
    multiplayerStatusText.value = 'Verbunden mit Host';
    multiplayerStatusClass.value = 'status-connected';

    showJoinModal.value = false;
    playSound('success');
  } catch (error) {
    console.error('Multiplayer Join Error:', error);
    multiplayerStatusText.value = 'Verbindung fehlgeschlagen';
    multiplayerStatusClass.value = 'status-error';
    playSound('timer');
  }
}

function disconnectMultiplayer() {
  // Disconnect WebSocket
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  isMultiplayerHost.value = false;
  isMultiplayerConnected.value = false;
  isConnected.value = false;
  multiplayerPlayers.value = [];
  multiplayerPlayerName.value = '';
  multiplayerGameState.value = null;
  hostQRCode.value = '';
  roomId.value = '';
  playerId.value = '';
  showJoinModal.value = false;

  multiplayerStatusText.value = 'Multiplayer verfügbar';
  multiplayerStatusClass.value = 'status-available';

  playSound('timer');
}

// Generate QR Code for connection
async function generateQRCode(data: string) {
  try {
    console.log('Generating QR code for:', data);
    console.log('qrCodeRef.value:', qrCodeRef.value);

    if (qrCodeRef.value) {
      // Clear previous QR code
      qrCodeRef.value.innerHTML = '';

      // Generate QR code as canvas
      const canvas = await QRCode.toCanvas(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#2563eb',
          light: '#ffffff',
        },
      });

      // Add canvas to the QR code container
      qrCodeRef.value.appendChild(canvas);

      // Store the data for reference
      hostQRCode.value = data;
      console.log('QR Code generated successfully for:', data);
    } else {
      console.error('qrCodeRef.value is null - DOM element not found');
    }
  } catch (error) {
    console.error('QR Code generation error:', error);
    // Fallback: show data as text
    if (qrCodeRef.value) {
      qrCodeRef.value.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b;">
        <strong>Verbindungs-URL:</strong><br>
        <code style="word-break: break-all; font-size: 0.8rem;">${data}</code>
      </div>`;
    }
  }
}

// QR Scanner Functions
function startQRScanner() {
  if (!qrScanner) {
    scannerActive.value = true;
    scannerStatus.value = 'Scanner wird gestartet...';

    qrScanner = new Html5QrcodeScanner(
      'qr-scanner',
      {
        fps: 10,
        qrbox: {width: 200, height: 200},
        aspectRatio: 1.0,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false,
    );

    qrScanner.render(
      (decodedText: string) => {
        // Handle scanned QR code
        console.log('QR Code scanned:', decodedText);
        scannerStatus.value = 'QR-Code erkannt!';

        try {
          // Extract host ID from URL
          const url = new URL(decodedText);
          const extractedHostId = url.searchParams.get('host');

          if (extractedHostId) {
            hostId.value = extractedHostId;
            scannerStatus.value = 'Verbinde mit Host...';
            // Auto-join the game
            joinMultiplayerGame();
          } else {
            scannerStatus.value = 'QR-Code enthält keine Host-ID';
            console.log('No host ID found in QR code');
          }
        } catch (error) {
          scannerStatus.value = 'Ungültiger QR-Code Format';
          console.log('Invalid QR code format:', error);
        }

        // Stop scanner after successful scan
        setTimeout(() => {
          stopQRScanner();
        }, 2000);
      },
      (error: any) => {
        // Only log actual errors, not "no QR code detected" messages
        if (
          error &&
          !error.toString().includes('No barcode or QR code detected')
        ) {
          console.log('QR Scanner error:', error);
          scannerStatus.value = 'Scanner Fehler: ' + error.toString();
        }
      },
    );

    scannerStatus.value = 'Scanner bereit - QR-Code scannen';
  }
}

function stopQRScanner() {
  if (qrScanner) {
    qrScanner.clear();
    qrScanner = null;
  }
  scannerActive.value = false;
  scannerStatus.value = '';
}

// Generate test QR code for testing
async function generateTestQRCode() {
  try {
    const testUrl = `${window.location.origin}/join?host=test_host_123`;
    testQRCode.value = testUrl;

    await nextTick();

    if (testQRCodeRef.value) {
      testQRCodeRef.value.innerHTML = '';

      const canvas = await QRCode.toCanvas(testUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: '#16a34a',
          light: '#ffffff',
        },
      });

      testQRCodeRef.value.appendChild(canvas);
    }
  } catch (error) {
    console.error('Test QR Code generation error:', error);
  }
}

// Watch for modal opening to start scanner
watch(showJoinModal, (newValue) => {
  if (newValue) {
    // Start QR scanner when modal opens
    nextTick(() => {
      setTimeout(() => {
        startQRScanner();
      }, 100);
    });
  } else {
    // Stop QR scanner when modal closes
    stopQRScanner();
  }
});

// Sync game state with multiplayer players
function syncGameStateWithMultiplayer() {
  if (isMultiplayerHost.value && multiplayerPlayers.value.length > 0) {
    // Send current game state to all connected players
    const gameState = {
      category: resultText.value,
      currentLetter: currentLetter.value,
      currentPlayer: currentPlayer.value,
      players: players.value,
    };

    // In a real implementation, this would send via WebRTC or WebSocket
    console.log('Syncing game state:', gameState);
  }
}

watch(players, savePlayers, {deep: true});
onMounted(() => {
  loadPlayers();
  window.addEventListener('keydown', handleKeydown);

  // Check for multiplayer connection from /join page
  const storedMultiplayerConnected =
    localStorage.getItem('multiplayer_connected') === 'true';
  const storedPlayerName = localStorage.getItem('multiplayer_player_name');
  const storedHostId = localStorage.getItem('multiplayer_host_id');

  if (storedMultiplayerConnected && storedPlayerName && storedHostId) {
    // Set multiplayer state
    isMultiplayerConnected.value = true;
    multiplayerPlayerName.value = storedPlayerName;
    hostId.value = storedHostId;
    multiplayerStatusText.value = 'Verbunden mit Host';
    multiplayerStatusClass.value = 'status-connected';

    // Clear localStorage after reading
    localStorage.removeItem('multiplayer_connected');
    localStorage.removeItem('multiplayer_player_name');
    localStorage.removeItem('multiplayer_host_id');

    console.log('Multiplayer connection restored:', storedPlayerName);
  }
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function handleKeydown(e: KeyboardEvent) {
  if (showAddPlayer.value) return;
  if (e.code === 'Space' || e.code === 'Enter') {
    rollDice();
  }
  if (e.code === 'ArrowRight') {
    switchPlayer('next');
  }
  if (e.code === 'ArrowLeft') {
    switchPlayer('prev');
  }
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
  max-width: 900px;
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
  margin-bottom: 1.5rem;
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

/* Timer Settings Section */
.timer-settings-section {
  margin-bottom: 2rem;
}

.timer-settings {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.timer-settings-label {
  font-weight: 500;
  color: #2563eb;
  font-size: 1.08rem;
}

.timer-buttons {
  display: flex;
  gap: 0.5rem;
}

.timer-settings-btn {
  background: #f1f5f9;
  color: #1e293b;
  border: 2px solid #e0e7ff;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
}

.timer-settings-btn.active,
.timer-settings-btn:hover {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.speed-round-badge {
  background: linear-gradient(90deg, #fde047 60%, #fbbf24 100%);
  color: #1e293b;
  font-weight: bold;
  border-radius: 16px;
  padding: 6px 18px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px #fde04733;
  display: inline-block;
}

/* Multiplayer Section */
.multiplayer-section {
  margin-bottom: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(30, 41, 59, 0.1);
}

.multiplayer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.multiplayer-status {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-available {
  background: #dcfce7;
  color: #166534;
}

.status-connecting {
  background: #fef3c7;
  color: #d97706;
}

.status-connected {
  background: #dbeafe;
  color: #1e40af;
}

.status-error {
  background: #fef2f2;
  color: #dc2626;
}

.status-disconnected {
  background: #f1f5f9;
  color: #64748b;
}

.multiplayer-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.multiplayer-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.multiplayer-btn.host {
  background: #2563eb;
  color: #fff;
}

.multiplayer-btn.host:hover {
  background: #1d4ed8;
}

.multiplayer-btn.join {
  background: #16a34a;
  color: #fff;
}

.multiplayer-btn.join:hover {
  background: #15803d;
}

.multiplayer-btn.disconnect {
  background: #ef4444;
  color: #fff;
}

.multiplayer-btn.disconnect:hover {
  background: #dc2626;
}

.multiplayer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.multiplayer-host-info,
.multiplayer-client-info {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid #e0e7ff;
}

.host-info,
.client-info {
  text-align: center;
}

.qr-code-container {
  margin: 1rem 0;
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: #f1f5f9;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #64748b;
}

.qr-instruction {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.connected-players {
  margin-top: 1rem;
}

.connected-players h4 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.multiplayer-player {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.game-status {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f1f5f9;
  border-radius: 8px;
}

.game-status p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #64748b;
}

/* QR Scanner Styles */
.qr-scanner-section {
  margin: 1rem 0;
}

.qr-scanner-container {
  text-align: center;
}

.qr-scanner {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: #f1f5f9;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #64748b;
}

.scanner-instruction {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.scanner-status {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  background: #f1f5f9;
  color: #64748b;
}

.scanner-start-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.scanner-start-btn:hover {
  background: #1d4ed8;
}

.test-qr-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e0e7ff;
}

.test-qr-btn {
  padding: 0.75rem 1.5rem;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.test-qr-btn:hover {
  background: #15803d;
}

.test-qr-container {
  margin-top: 1rem;
  text-align: center;
}

.test-qr-code {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  background: #fff;
  border: 2px solid #16a34a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.test-qr-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.manual-join-section {
  margin: 1rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: center;
}

/* Players Section */
.players-section {
  margin-bottom: 2rem;
}

.players-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.add-player-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.add-player-btn:hover {
  background: #1d4ed8;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
}

.player-active {
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  color: #fff;
  border-color: #2563eb;
  box-shadow: 0 2px 12px #2563eb33;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.player-active .player-avatar {
  background: #fff;
  color: #2563eb;
}

.player-name {
  font-weight: 500;
  cursor: pointer;
  flex: 1;
}

.player-score {
  background: #fde047;
  color: #1e293b;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
}

.player-active .player-score {
  background: #fff;
  color: #2563eb;
}

.player-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #ef4444;
}

.player-active .action-btn {
  color: rgba(255, 255, 255, 0.8);
}

.player-active .action-btn:hover {
  color: #fff;
}

.player-edit-input {
  border: 1px solid #2563eb;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  width: 120px;
}

.reset-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fbbf24;
  color: #1e293b;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin: 0 auto;
}

.reset-all-btn:hover {
  background: #f59e1b;
}

.reset-icon {
  width: 20px;
  height: 20px;
}

/* Game Section */
.game-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

/* Dice Section */
.dice-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dice-container {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  position: relative;
}

.dice {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dice-face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e293b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 20px;
}

/* Positionen der Würfelseiten */
.dice-face:nth-child(1) {
  transform: translateZ(100px);
  color: #2563eb;
}
.dice-face:nth-child(2) {
  transform: rotateX(180deg) translateZ(100px);
  color: #16a34a;
}
.dice-face:nth-child(3) {
  transform: rotateY(90deg) translateZ(100px);
  color: #075985;
}
.dice-face:nth-child(4) {
  transform: rotateY(-90deg) translateZ(100px);
  color: #9333ea;
}
.dice-face:nth-child(5) {
  transform: rotateX(90deg) translateZ(100px);
  color: #d97706;
}
.dice-face:nth-child(6) {
  transform: rotateX(-90deg) translateZ(100px);
  color: #ca8a04;
}

.roll-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 18px rgba(30, 41, 59, 0.18);
  min-width: 200px;
}

.roll-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.25);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Result Section */
.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
}

.result-display {
  text-align: center;
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(30, 41, 59, 0.1);
  width: 100%;
}

.result-category {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.result-description {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.current-letter-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.letter-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.current-letter {
  font-size: 3rem;
  font-weight: bold;
  color: #2563eb;
  background: #f1f5f9;
  border: 3px solid #2563eb;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  min-width: 80px;
  text-align: center;
}

/* Speech Section */
.speech-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.speech-btn {
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.speech-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.speech-result {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  color: #1e293b;
  text-align: center;
  width: 100%;
}

/* Validation Result Styles */
.validation-result {
  margin-top: 1rem;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  animation: slideIn 0.3s ease-out;
}

.validation-success {
  background: #dcfce7;
  color: #166534;
  border: 2px solid #22c55e;
}

.validation-error {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #ef4444;
}

.validation-warning {
  background: #fef3c7;
  color: #d97706;
  border: 2px solid #f59e0b;
}

.validating-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.validation-message {
  font-weight: 500;
  line-height: 1.4;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Game Controls */
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
}

/* Timer Section */
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.timer-display {
  text-align: center;
  width: 100%;
}

.timer-time {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fde047;
  margin-bottom: 0.5rem;
}

.timer-bar {
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #fde047, #ef4444);
  width: 100%;
  transition: width 1s linear;
}

.timer-buttons {
  display: flex;
  gap: 1rem;
}

.timer-btn {
  background: #64748b;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.timer-btn:hover {
  background: #475569;
}

.timer-active {
  background: #2563eb;
}

.timer-active:hover {
  background: #1d4ed8;
}

/* Player Navigation */
.player-navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-btn {
  background: #fbbf24;
  color: #1e293b;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  max-width: 150px;
}

.nav-btn:hover {
  background: #f59e1b;
  transform: translateY(-1px);
}

/* Points Controls */
.points-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.points-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.points-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.points-btn.negative {
  background: #ef4444;
}

.points-btn.negative:hover {
  background: #dc2626;
}

.points-btn.reset {
  background: #64748b;
}

.points-btn.reset:hover {
  background: #475569;
}

/* Rules Section */
.rules-section {
  margin-top: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(30, 41, 59, 0.1);
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
}

.rules-list li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.rules-list li::before {
  content: '•';
  color: #2563eb;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.jackpot-highlight {
  background: linear-gradient(45deg, #fde047, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.speed-info {
  color: #fbbf24;
  font-weight: bold;
  font-size: 1.01rem;
  display: inline-block;
  margin-top: 0.2em;
}

/* Modal Styles */
.add-player-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 41, 59, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.add-player-card {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px #2563eb33, 0 2px 24px #fbbf2444;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 320px;
  text-align: center;
  position: relative;
  animation: popIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: block;
}

.modal-input {
  width: 100%;
  font-size: 1.1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
  border: 2px solid #e0e7ef;
  margin: 1.2rem 0 1.5rem 0;
  outline: none;
  box-shadow: 0 2px 12px #2563eb11;
  transition: border 0.2s, box-shadow 0.2s;
}

.modal-input:focus {
  border: 2px solid #2563eb;
  box-shadow: 0 0 0 2px #2563eb33;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.primary {
  background: #2563eb;
  color: #fff;
}

.modal-btn.primary:hover {
  background: #1d4ed8;
}

.modal-btn.secondary {
  background: #64748b;
  color: #fff;
}

.modal-btn.secondary:hover {
  background: #475569;
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

@keyframes jackpot-glow {
  0% {
    text-shadow: 0 0 5px #fde047;
  }
  50% {
    text-shadow: 0 0 20px #facc15, 0 0 30px #fbbf24;
  }
  100% {
    text-shadow: 0 0 5px #fde047;
  }
}

.jackpot-animation {
  animation: jackpot-glow 2s infinite;
}

@keyframes popIn {
  0% {
    transform: scale(0.85) translateY(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-card {
    padding: 24px 16px 20px 16px;
    margin: 0 8px;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .game-title-animated {
    font-size: 1.8rem;
  }

  .subtitle-animated {
    font-size: 1rem;
  }

  .timer-settings {
    flex-direction: column;
    gap: 0.5rem;
  }

  .timer-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .players-list {
    gap: 0.25rem;
  }

  .player-item {
    padding: 0.5rem 0.75rem;
  }

  .player-info {
    gap: 0.5rem;
  }

  .player-avatar {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .player-name {
    font-size: 0.9rem;
  }

  .player-score {
    font-size: 0.9rem;
    padding: 0.2rem 0.5rem;
  }

  .action-btn {
    font-size: 0.9rem;
    padding: 0.2rem;
  }

  .dice-container {
    width: 160px;
    height: 160px;
  }

  .dice-face {
    width: 160px;
    height: 160px;
    font-size: 1.4rem;
    padding: 16px;
  }

  .roll-btn {
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
    min-width: 180px;
  }

  .result-category {
    font-size: 1.6rem;
  }

  .result-description {
    font-size: 1rem;
  }

  .current-letter {
    font-size: 2.5rem;
    padding: 0.4rem 0.8rem;
    min-width: 70px;
  }

  .game-controls {
    gap: 1rem;
  }

  .timer-time {
    font-size: 2rem;
  }

  .timer-buttons {
    flex-direction: column;
    width: 100%;
  }

  .timer-btn {
    width: 100%;
  }

  .player-navigation {
    flex-direction: column;
  }

  .nav-btn {
    max-width: none;
  }

  .points-controls {
    grid-template-columns: 1fr;
  }

  .rules-section {
    padding: 1rem;
  }

  .rules-list li {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  /* Multiplayer responsive */
  .multiplayer-section {
    padding: 1rem;
  }

  .multiplayer-controls {
    flex-direction: column;
  }

  .multiplayer-btn {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }

  .multiplayer-player {
    font-size: 0.9rem;
  }

  .qr-code,
  .qr-scanner {
    width: 150px;
    height: 150px;
  }

  .game-status p {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .main-card {
    padding: 20px 12px 16px 12px;
    margin: 0 4px;
  }

  .game-title-animated {
    font-size: 1.6rem;
  }

  .dice-container {
    width: 140px;
    height: 140px;
  }

  .dice-face {
    width: 140px;
    height: 140px;
    font-size: 1.2rem;
    padding: 12px;
  }

  .roll-btn {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
    min-width: 160px;
  }

  .result-category {
    font-size: 1.4rem;
  }

  .current-letter {
    font-size: 2rem;
    padding: 0.3rem 0.6rem;
    min-width: 60px;
  }

  .timer-time {
    font-size: 1.8rem;
  }

  .points-btn {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }
}
</style>
