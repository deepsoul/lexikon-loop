<template>
  <div>
    <div>
      <div class="page-bg">
        <div class="main-card">
          <!-- Header mit Icons-Link -->
          <header class="header-section">
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

          <!-- Multiplayer Panel Component -->
          <MultiplayerPanel />

          <!-- Spieler-Management -->
          <div class="players-section">
            <div class="players-header">
              <h3 class="section-title">
                {{ isMultiplayerConnected ? 'Multiplayer Spieler' : 'Spieler' }}
              </h3>
              <button
                class="add-player-btn"
                @click="addPlayer"
                title="Spieler hinzufügen"
                v-if="!isMultiplayerConnected"
              >
                <span>＋</span>
              </button>
            </div>

            <!-- Spieler-Liste -->
            <div class="players-list">
              <!-- Multiplayer-Spieler -->
              <div
                v-if="isMultiplayerConnected"
                v-for="(p, i) in multiplayerPlayers"
                :key="p.id"
                class="player-item"
                :class="{'player-active': i === currentPlayer}"
              >
                <div class="player-info">
                  <span class="player-avatar">{{
                    p.name.charAt(0).toUpperCase()
                  }}</span>
                  <span class="player-name">{{ p.name }}</span>
                  <span class="player-score">{{ p.score }}</span>
                </div>
              </div>

              <!-- Lokale Spieler (nur im Singleplayer) -->
              <div
                v-if="!isMultiplayerConnected"
                v-for="(p, i) in players"
                :key="i"
                class="player-item"
                :class="{'player-active': i === currentPlayer}"
              >
                <div class="player-info">
                  <span class="player-avatar">{{
                    p.name.charAt(0).toUpperCase()
                  }}</span>
                  <span class="player-name">{{ p.name }}</span>
                  <span class="player-score">{{ p.score }}</span>
                </div>

                <!-- Nur im Singleplayer: Spieler-Aktionen -->
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

            <!-- Nur im Singleplayer: Reset-Button -->
            <button
              class="reset-all-btn"
              @click="resetAllPlayers"
              v-if="!isMultiplayerConnected"
            >
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
                <div
                  class="dice"
                  :style="{
                    transform: `rotateX(${diceRotation?.x || 0}deg) rotateY(${
                      diceRotation?.y || 0
                    }deg) rotateZ(${diceRotation?.z || 0}deg)`,
                  }"
                >
                  <!-- Dice faces here -->
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
              v-show="!rolling && resultText !== 'Bereit zum Würfeln!'"
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

              <!-- Spracheingabe und manuelle Eingabe -->
              <div class="input-section">
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
                      <!-- "Ist trotzdem richtig" Button für Fehler -->
                      <div
                        v-if="validationResult.includes('❌')"
                        class="manual-approval"
                      >
                        <button
                          class="approval-btn"
                          @click="approveWordManually"
                          title="Wort genehmigen"
                        >
                          ✅ Wort genehmigen
                        </button>
                        <button
                          class="approval-btn reject"
                          @click="rejectWord"
                          title="Wort ablehnen"
                        >
                          ❌ Wort ablehnen
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Manuelle Texteingabe -->
                  <div class="manual-input-section-new">
                    <div class="manual-input-header-new">
                      <div class="input-icon-new">✍️</div>
                      <h4 class="input-title-new">Manuelle Eingabe</h4>
                    </div>

                    <div class="input-group-new">
                      <div class="input-wrapper-new">
                        <input
                          v-model="manualWord"
                          class="manual-input-new"
                          placeholder="Dein Begriff hier eingeben..."
                          @keyup.enter="submitManualWord"
                        />
                        <div class="input-focus-border-new"></div>
                      </div>
                      <button
                        class="submit-btn-new"
                        @click="submitManualWord"
                        :disabled="!manualWord.trim()"
                      >
                        <span class="btn-icon-new">🚀</span>
                        <span class="btn-text-new">Eingeben</span>
                      </button>
                    </div>

                    <div v-if="manualWord" class="manual-result-new">
                      <div class="result-icon-new">📝</div>
                      <div class="result-content-new">
                        <span class="result-label-new">Eingegeben:</span>
                        <span class="result-word-new">{{ manualWord }}</span>
                      </div>
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

          <!-- Zurück zur Startseite -->
          <button class="back-home-btn" @click="router.push('/')">
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import MultiplayerPanel from './MultiplayerPanel.vue';
import {useMultiplayer} from '../utils/useMultiplayer.js';

const router = useRouter();

// Typ für Spieler
const Player = {
  name: String,
  score: Number,
};

// Timer und Spielvariablen
const timerOptions = [10, 15, 30, 45];
const timerDuration = ref(30);
const timeLeft = ref(timerDuration.value);
const timerActive = ref(false);
const isSpeedRound = computed(() => timerDuration.value <= 15);

// Use multiplayer composable
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
  updateScore,
  switchPlayer: switchMultiplayerPlayer,
  addPlayer: addMultiplayerPlayer,
} = useMultiplayer();

// Spieler-Liste mit LocalStorage-Laden
const players = ref([]);
const currentLetter = ref('-');
let timerInterval = null;
const rolling = ref(false);
const resultText = ref('Bereit zum Würfeln!');
const subResult = ref('Klicke auf den Würfeln-Button');
const isJackpot = ref(false);
const diceRotation = ref({x: 0, y: 0, z: 0});

// Ensure diceRotation is always a valid object
watch(
  diceRotation,
  (newValue) => {
    if (!newValue || typeof newValue !== 'object') {
      diceRotation.value = {x: 0, y: 0, z: 0};
    }
  },
  {deep: true},
);

const scorePulse = ref(false);
const showAddPlayer = ref(false);
const newPlayerName = ref('');
const editingPlayerIndex = ref(null);
const editingPlayerName = ref('');

// Speech Recognition Variables
const isListening = ref(false);
const recognizedWord = ref('');
const recognizedLastLetter = ref('');
const validationResult = ref('');
const isValidating = ref(false);
const usedWords = ref([]);
const currentCategory = ref('');
const manualWord = ref('');
let recognition = null;

// Timer functions
function setTimerDuration(val) {
  timerDuration.value = val;
  timeLeft.value = val;
}

function toggleTimer() {
  if (timerActive.value) {
    stopTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  console.log('startTimer');
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

// Game functions
function rollDice() {
  if (rolling.value) return;
  
  rolling.value = true;
  playSound('roll');
  
  // Use multiplayer dice roll if connected
  if (isMultiplayerConnected.value) {
    // Multiplayer dice roll handled by composable
    setTimeout(() => {
      rolling.value = false;
    }, 1500);
  } else {
    // Single player dice roll
    setTimeout(() => {
      finishDiceRoll();
    }, 1500);
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
  
  resultText.value = category.name;
  subResult.value = category.description;
  isJackpot.value = result === 5;
  
  if (isJackpot.value) {
    resultText.value = '🎰 JACKPOT 🎰';
    playSound('jackpot');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    currentLetter.value = letters[Math.floor(Math.random() * 26)];
  }
  
  rolling.value = false;
}

// Player management
function addPlayer() {
  showAddPlayer.value = true;
  newPlayerName.value = '';
}

function confirmAddPlayer() {
  const name = newPlayerName.value.trim() || `Spieler ${players.value.length + 1}`;
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

function deletePlayer(i) {
  if (players.value.length <= 1) return;
  if (confirm(`Spieler "${players.value[i].name}" wirklich löschen?`)) {
    players.value.splice(i, 1);
    if (currentPlayer.value >= players.value.length) currentPlayer.value = 0;
    playSound('timer');
  }
}

function movePlayer(i, dir) {
  const newIndex = dir === 'up' ? i - 1 : i + 1;
  if (newIndex < 0 || newIndex >= players.value.length) return;
  const temp = players.value[i];
  players.value[i] = players.value[newIndex];
  players.value[newIndex] = temp;
  if (currentPlayer.value === i) currentPlayer.value = newIndex;
  else if (currentPlayer.value === newIndex) currentPlayer.value = i;
  playSound('success');
}

function switchPlayer(direction) {
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

function addPoints(points) {
  if (!players.value.length) return;
  
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

function resetAllPlayers() {
  if (confirm('Möchtest du wirklich alle Spieler und Punkte löschen?')) {
    players.value = [{name: 'Spieler 1', score: 0}];
    currentPlayer.value = 0;
    localStorage.removeItem('lexikonloop_players_v1');
    playSound('timer');
  }
}

// Sound functions
function playSound(type) {
  // Sound implementation here
  console.log('Playing sound:', type);
}

// Speech recognition
function startSpeechRecognition() {
  // Speech recognition implementation here
  console.log('Starting speech recognition');
}

function stopSpeechRecognition() {
  if (recognition) recognition.stop();
  isListening.value = false;
}

// Word validation and submission
function validateWord(word, category, currentLetter) {
  if (!word || !category || !currentLetter) {
    return {valid: false, reason: 'Ungültige Eingabe'};
  }

  const cleanWord = word.trim().toLowerCase();
  const cleanLetter = currentLetter.toLowerCase();

  if (!cleanWord.startsWith(cleanLetter)) {
    return {
      valid: false,
      reason: 'Wort muss mit ' + currentLetter + ' beginnen',
    };
  }

  if (cleanWord.length < 3) {
    return {valid: false, reason: 'Wort muss mindestens 3 Buchstaben haben'};
  }

  if (usedWords.value.includes(cleanWord)) {
    return {valid: false, reason: 'Wort wurde bereits verwendet'};
  }

  return {valid: true, reason: 'Wort ist gültig'};
}

function approveWordManually() {
  if (recognizedWord.value) {
    const validation = validateWord(
      recognizedWord.value,
      currentCategory.value,
      currentLetter.value,
    );

    if (validation.valid) {
      usedWords.value.push(recognizedWord.value.toLowerCase());
      addPoints(1);
      validationResult.value = `✅ "${recognizedWord.value}" wurde genehmigt! +1 Punkt`;
      playSound('success');
      switchPlayer('next');
    } else {
      validationResult.value = `❌ "${recognizedWord.value}": ${validation.reason}`;
      playSound('timer');
    }

    setTimeout(() => {
      validationResult.value = '';
      recognizedWord.value = '';
      recognizedLastLetter.value = '';
    }, 3000);
  }
}

function rejectWord() {
  if (recognizedWord.value) {
    addPoints(-1);
    validationResult.value = `❌ "${recognizedWord.value}" wurde abgelehnt! -1 Punkt`;
    playSound('timer');
    switchPlayer('next');

    setTimeout(() => {
      validationResult.value = '';
      recognizedWord.value = '';
      recognizedLastLetter.value = '';
    }, 3000);
  }
}

function submitManualWord() {
  if (manualWord.value.trim()) {
    recognizedWord.value = manualWord.value.trim();
    recognizedLastLetter.value = manualWord.value
      .trim()
      .charAt(manualWord.value.trim().length - 1);

    const validation = validateWord(
      manualWord.value.trim(),
      currentCategory.value,
      currentLetter.value,
    );

    if (validation.valid) {
      usedWords.value.push(manualWord.value.trim().toLowerCase());
      addPoints(1);
      validationResult.value = `✅ "${manualWord.value.trim()}" wurde genehmigt! +1 Punkt`;
      playSound('success');
      switchPlayer('next');
    } else {
      validationResult.value = `❌ "${manualWord.value.trim()}": ${validation.reason}`;
      playSound('timer');
    }

    manualWord.value = '';

    setTimeout(() => {
      validationResult.value = '';
      recognizedWord.value = '';
      recognizedLastLetter.value = '';
    }, 3000);
  }
}

// LocalStorage
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
  players.value = [{name: 'Spieler 1', score: 0}];
}

// Event handlers
function handleKeydown(e) {
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

// Lifecycle
watch(players, savePlayers, {deep: true});

onMounted(() => {
  loadPlayers();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="scss" scoped>
/* Include your existing styles here */
</style> 