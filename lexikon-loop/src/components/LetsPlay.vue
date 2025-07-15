<script setup lang="ts">
import {ref, computed, watch, onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
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
  {name: 'STADT', description: 'Nenne eine Stadt (z.B. Berlin)'},
  {name: 'LAND', description: 'Nenne ein Land (z.B. Frankreich)'},
  {name: 'FLUSS', description: 'Nenne einen Fluss (z.B. Rhein)'},
  {name: 'NAME', description: 'Nenne einen Vornamen (z.B. Anna)'},
  {name: 'TIER', description: 'Nenne ein Tier (z.B. Elefant)'},
  {name: 'JACKPOT', description: 'Wähle KATEGORIE & BUCHSTABEN frei!'},
];

const rotations = [
  {x: 4, y: 5, z: 3},
  {x: -5, y: -4, z: -3},
  {x: 6, y: -5, z: 4},
  {x: -4, y: 6, z: -5},
  {x: 5, y: 3, z: -6},
  {x: -3, y: -6, z: 5},
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
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  switch (type) {
    case 'roll':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 1,
      );
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      break;
    case 'success':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      break;
    case 'jackpot':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(392.0, ctx.currentTime);
      oscillator.frequency.setValueAtTime(523.25, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(830.61, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      break;
    case 'timer':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      break;
  }
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
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
  // Animation
  const randomRotation = Math.floor(Math.random() * 6);
  const result = Math.floor(Math.random() * 6);
  const rot = rotations[randomRotation];
  diceRotation.value = {x: rot.x * 360, y: rot.y * 360, z: rot.z * 360};
  setTimeout(() => {
    // Endposition setzen
    switch (result) {
      case 0:
        diceRotation.value = {x: 0, y: 0, z: 0};
        break;
      case 1:
        diceRotation.value = {x: 180, y: 0, z: 0};
        break;
      case 2:
        diceRotation.value = {x: 0, y: 90, z: 0};
        break;
      case 3:
        diceRotation.value = {x: 0, y: -90, z: 0};
        break;
      case 4:
        diceRotation.value = {x: 90, y: 0, z: 0};
        break;
      case 5:
        diceRotation.value = {x: -90, y: 0, z: 0};
        break;
    }
    // Ergebnis anzeigen
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
    // Timer ggf. neu starten
    if (timerActive.value) {
      resetGameTimer();
      startTimer();
    }
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
const recognizedFirstLetter = ref('');
let recognition: any = null;

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
  recognizedFirstLetter.value = '';
  recognition.onresult = (event: any) => {
    const word = event.results[0][0].transcript.trim();
    recognizedWord.value = word;
    // Ersten Buchstaben extrahieren (ohne Sonderzeichen)
    const match = word.match(/[a-zA-ZäöüÄÖÜß]/);
    recognizedFirstLetter.value = match ? match[0].toUpperCase() : '';
    // Beispiel: Setze currentLetter automatisch
    if (recognizedFirstLetter.value)
      currentLetter.value = recognizedFirstLetter.value;
    isListening.value = false;
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

watch(players, savePlayers, {deep: true});
onMounted(() => {
  loadPlayers();
  window.addEventListener('keydown', handleKeydown);
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

<template>
  <div>
    <div>
      <div class="page-bg">
        <div class="main-card">
          <header class="header-animated">
            <h1 class="game-title-animated">Lexikon-Loop</h1>
            <div class="subtitle-animated">Das digitale Wortketten-Spiel</div>
          </header>
          <div class="icons-link-btn-wrapper">
            <button
              class="icons-link-btn"
              @click="router.push('/icons')"
              title="Alle Icons anzeigen"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle
                  cx="11"
                  cy="11"
                  r="10"
                  stroke="#2563eb"
                  stroke-width="2"
                />
                <path
                  d="M7 11h8M11 7v8"
                  stroke="#2563eb"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span class="icons-link-text">Icons</span>
            </button>
          </div>
          <!-- Timer-Einstellung -->
          <div
            class="timer-settings flex flex-wrap gap-2 justify-center items-center mb-2"
          >
            <span class="timer-settings-label">Rundenzeit:</span>
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
          <div v-if="isSpeedRound" class="speed-round-badge">
            ⚡ Speed-Runde! Korrekte Antwort = 2 Punkte
          </div>
          <!-- Spieler-Chips -->
          <div class="player-chips flex gap-2 overflow-x-auto pb-2 mb-4">
            <span
              v-for="(p, i) in players"
              :key="i"
              class="player-chip flex items-center gap-2 px-4 py-2 rounded-full shadow transition-all duration-200 relative"
              :class="{'chip-active': i === currentPlayer}"
            >
              <span class="chip-avatar bg-blue-200 text-blue-700 font-bold">{{
                p.name.charAt(0).toUpperCase()
              }}</span>
              <span class="chip-name-block" @click="startEditPlayer(i)">
                <template v-if="editingPlayerIndex === i">
                  <input
                    v-model="editingPlayerName"
                    @keyup.enter="confirmEditPlayer"
                    @blur="confirmEditPlayer"
                    class="chip-edit-input"
                    autofocus
                  />
                  <button class="chip-cancel" @click="cancelEditPlayer">
                    ✕
                  </button>
                </template>
                <template v-else>{{ p.name }}</template>
              </span>
              <span class="chip-score bg-yellow-400 text-gray-900 font-bold">{{
                p.score
              }}</span>
              <button
                class="chip-icon"
                @click="deletePlayer(i)"
                title="Spieler löschen"
              >
                🗑️
              </button>
              <button
                v-if="i > 0"
                class="chip-icon"
                @click="movePlayer(i, 'up')"
                title="Nach oben"
              >
                ▲
              </button>
              <button
                v-if="i < players.length - 1"
                class="chip-icon"
                @click="movePlayer(i, 'down')"
                title="Nach unten"
              >
                ▼
              </button>
            </span>
            <button
              class="chip-add-btn"
              @click="addPlayer"
              title="Spieler hinzufügen"
            >
              ＋
            </button>
          </div>
          <div
            class="reset-all-container flex items-center justify-center mb-4"
          >
            <button
              class="reset-all-btn"
              @click="resetAllPlayers"
              title="Alle Spieler & Punkte löschen"
            >
              <svg
                class="reset-all-icon"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="14"
                  width="24"
                  height="10"
                  rx="4"
                  fill="#fbbf24"
                />
                <rect x="7" y="6" width="14" height="8" rx="4" fill="#2563eb" />
                <path
                  d="M9 8l2 2 4-4 4 4"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="12"
                  y="18"
                  width="4"
                  height="4"
                  rx="2"
                  fill="#fffbe8"
                />
              </svg>
              <span class="reset-all-text"
                >Alle Spieler & Punkte zurücksetzen</span
              >
            </button>
          </div>
          <!-- Hauptbereich: Würfel, Ergebnis, Steuerung -->
          <div
            class="flex flex-col md:flex-row gap-6 items-center justify-center"
          >
            <!-- Würfel & Timer -->
            <div class="dice-timer-card flex flex-col items-center gap-4">
              <div class="dice-container mt-2">
                <div class="dice" :style="diceTransform">
                  <div class="dice-face">
                    <!-- Stadt-Icon -->
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 100 100"
                      style="display: block; margin: 0 auto 2px auto"
                    >
                      <path
                        d="M20 60V30L35 20L50 30V60M50 30L65 20L80 30V60M20 60H80V90H20V60Z"
                        stroke="#2563eb"
                        stroke-width="4"
                        fill="none"
                      />
                      <rect
                        x="25"
                        y="40"
                        width="10"
                        height="20"
                        fill="#2563eb"
                      />
                      <rect
                        x="45"
                        y="40"
                        width="10"
                        height="20"
                        fill="#2563eb"
                      />
                      <rect
                        x="65"
                        y="40"
                        width="10"
                        height="20"
                        fill="#2563eb"
                      />
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
                      <path
                        d="M20 60Q35 45 50 50Q65 55 80 40V80Q65 65 50 70Q35 75 20 60Z"
                        fill="#16a34a"
                        stroke="#166534"
                        stroke-width="3"
                      />
                      <circle cx="40" cy="55" r="3" fill="#166534" />
                      <circle cx="60" cy="50" r="3" fill="#166534" />
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
                      <path
                        d="M20 50Q30 40 40 55Q50 70 60 55Q70 40 80 50V70Q70 60 60 70Q50 80 40 70Q30 60 20 70Z"
                        fill="#38bdf8"
                        stroke="#075985"
                        stroke-width="2"
                      />
                      <path
                        d="M30 55L35 60M50 60L55 55M70 55L65 60"
                        stroke="#075985"
                        stroke-width="2"
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
                        x="30"
                        y="30"
                        width="40"
                        height="40"
                        rx="5"
                        stroke="#9333ea"
                        stroke-width="4"
                        fill="none"
                      />
                      <path
                        d="M40 45V65M40 50H55M45 55L55 65"
                        stroke="#9333ea"
                        stroke-width="3"
                      />
                      <circle cx="65" cy="40" r="3" fill="#9333ea" />
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
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="#fbbf24"
                        stroke="#d97706"
                        stroke-width="3"
                      />
                      <circle cx="40" cy="45" r="3" fill="#d97706" />
                      <circle cx="60" cy="45" r="3" fill="#d97706" />
                      <path
                        d="M45 60Q50 65 55 60"
                        stroke="#d97706"
                        stroke-width="2"
                      />
                      <path
                        d="M35 40L25 35M65 40L75 35"
                        stroke="#d97706"
                        stroke-width="3"
                        stroke-linecap="round"
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
                      <path
                        d="M40 35L50 25L60 35V65L50 75L40 65V35Z"
                        fill="#fde047"
                        stroke="#ca8a04"
                        stroke-width="3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="10"
                        fill="#facc15"
                        stroke="#ca8a04"
                        stroke-width="2"
                      />
                      <path
                        d="M50 40L53 47L60 48L55 53L56 60L50 57L44 60L45 53L40 48L47 47L50 40Z"
                        fill="#ca8a04"
                      />
                      <path
                        d="M30 30L35 25M70 30L65 25"
                        stroke="#facc15"
                        stroke-width="3"
                        stroke-linecap="round"
                      />
                    </svg>
                    JACKPOT
                  </div>
                </div>
              </div>
              <button
                class="roll-btn mt-2"
                :disabled="rolling"
                @click="rollDice"
                style="width: 100%; max-width: 260px; align-self: center"
              >
                <span v-if="rolling">🎲 Würfelt...</span>
                <span v-else-if="resultText === 'Bereit zum Würfeln!'"
                  >🎲 WÜRFELN</span
                >
                <span v-else>🎲 NEU WÜRFELN</span>
              </button>
              <!-- Ergebnis & Steuerung -->
              <div
                class="result-card flex flex-col items-center gap-4 w-full max-w-md"
              >
                <div
                  class="result-text flex justify-center"
                  :class="{'jackpot-animation': isJackpot}"
                >
                  <span> {{ resultText }}</span>
                </div>
                <div class="result-subtext">{{ subResult }}</div>
                <div class="current-letter-box">
                  <span class="current-letter">{{ currentLetter }}</span>
                </div>
                <!-- Spracheingabe-UI -->
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
                    <span v-if="recognizedFirstLetter"
                      ><strong>Erster Buchstabe:</strong>
                      {{ recognizedFirstLetter }}</span
                    >
                  </div>
                </div>
                <div
                  class="flex gap-2 justify-center items-center mt-2 timer-controls-animated"
                >
                  <button
                    class="timer-btn-main"
                    :class="{'timer-btn-glow': timerActive}"
                    @click="toggleTimer"
                    aria-label="Timer starten/stoppen"
                  >
                    <span v-if="timerActive" class="timer-icon">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="8"
                          y="7"
                          width="7"
                          height="24"
                          rx="2.5"
                          fill="white"
                          filter="url(#shadow)"
                        />
                        <rect
                          x="23"
                          y="7"
                          width="7"
                          height="24"
                          rx="2.5"
                          fill="white"
                          filter="url(#shadow)"
                        />
                        <defs>
                          <filter
                            id="shadow"
                            x="0"
                            y="0"
                            width="38"
                            height="38"
                            filterUnits="userSpaceOnUse"
                          >
                            <feDropShadow
                              dx="0"
                              dy="1"
                              stdDeviation="2"
                              flood-color="#1e293b"
                              flood-opacity="0.25"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </span>
                    <span v-else class="timer-icon">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points="10,7 30,19 10,31"
                          fill="white"
                          filter="url(#shadow)"
                        />
                        <defs>
                          <filter
                            id="shadow"
                            x="0"
                            y="0"
                            width="38"
                            height="38"
                            filterUnits="userSpaceOnUse"
                          >
                            <feDropShadow
                              dx="0"
                              dy="1"
                              stdDeviation="2"
                              flood-color="#1e293b"
                              flood-opacity="0.25"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </span>
                  </button>
                  <button
                    class="timer-btn-reset"
                    @click="resetGameTimer"
                    aria-label="Timer zurücksetzen"
                  >
                    <span class="timer-icon-reset">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r="13"
                          stroke="white"
                          stroke-width="3"
                          filter="url(#resetshadow)"
                          fill="none"
                        />
                        <path
                          d="M16 5v5l4-4"
                          stroke="white"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          filter="url(#resetshadow)"
                        />
                        <defs>
                          <filter
                            id="resetshadow"
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            filterUnits="userSpaceOnUse"
                          >
                            <feDropShadow
                              dx="0"
                              dy="1"
                              stdDeviation="2"
                              flood-color="#1e293b"
                              flood-opacity="0.25"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </span>
                  </button>
                </div>
                <!-- TIMER-ANZEIGE WIEDER EINFÜGEN -->
                <div
                  v-if="timerActive || timeLeft < timerDuration"
                  class="timer-container"
                >
                  <div class="timer-display">{{ timeLeft }}s</div>
                  <div class="timer-bar">
                    <div
                      class="timer-progress"
                      :style="timerProgressStyle"
                    ></div>
                  </div>
                </div>
                <div class="player-controls flex gap-2 w-full justify-center">
                  <button
                    class="control-btn flex-1"
                    @click="switchPlayer('prev')"
                  >
                    ← Vorheriger
                  </button>
                  <button
                    class="control-btn flex-1"
                    @click="switchPlayer('next')"
                  >
                    Nächster →
                  </button>
                </div>
                <div class="points-container flex gap-2 w-full justify-center">
                  <button class="points-btn flex-1" @click="addPoints(1)">
                    +1 Punkt
                  </button>
                  <button class="points-btn flex-1" @click="addPoints(2)">
                    +2 Punkte
                  </button>
                  <button class="points-btn flex-1" @click="addPoints(-1)">
                    -1 Punkt
                  </button>
                  <button class="points-btn flex-1" @click="resetPoints">
                    Punkte zurücksetzen
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Spielregeln -->
          <div class="rules-card mt-8">
            <h3>Spielregeln</h3>
            <ul>
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
            <label class="mb-2 font-semibold text-gray-700">Spielername:</label>
            <input
              v-model="newPlayerName"
              @keyup.enter="confirmAddPlayer"
              class="add-player-input"
              placeholder="Name eingeben"
              autofocus
            />
            <div class="flex gap-3 w-full mt-4">
              <button class="points-btn flex-1" @click="confirmAddPlayer">
                Hinzufügen
              </button>
              <button class="control-btn flex-1" @click="cancelAddPlayer">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
        <!-- Reset Button Floating -->
        <button class="back-home-btn" @click="router.push('/')">
          Zurück zur Startseite
        </button>
      </div>
    </div>
  </div>
</template>

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
.game-title {
  font-size: 2.7rem;
  font-weight: 900;
  color: #2563eb;
  letter-spacing: 0.04em;
  margin-bottom: 0.2em;
  text-align: center;
}
.subtitle {
  color: #64748b;
  font-size: 1.2rem;
  text-align: center;
}
.player-chips {
  margin-bottom: 0.5em;
  scrollbar-width: thin;
  scrollbar-color: #2563eb #e0e7ff;
}
.player-chip {
  background: #f1f5f9;
  border: 2px solid #e0e7ff;
  color: #1e293b;
  font-size: 1.05rem;
  font-weight: 500;
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  cursor: pointer;
  min-width: 120px;
  user-select: none;
}
.chip-active {
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  color: #fff;
  border: 2px solid #2563eb;
  box-shadow: 0 2px 12px #2563eb33;
}
.chip-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
}
.chip-score {
  margin-left: 0.5em;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  background: #fde047;
  color: #1e293b;
}
.chip-icon {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.1rem;
  margin-left: 0.2em;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0 2px;
}
.chip-icon:hover {
  color: #ef4444;
}
.chip-add-btn {
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
  margin-left: 0.5em;
  box-shadow: 0 2px 8px #2563eb33;
  cursor: pointer;
  transition: background 0.2s;
}
.chip-add-btn:hover {
  background: #1d4ed8;
}
.chip-edit-input {
  border: 1px solid #2563eb;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 1rem;
  width: 80px;
}
.chip-cancel {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1rem;
  margin-left: 0.2em;
  cursor: pointer;
}

/* Timer Bereich */
.timer-container {
  margin: 15px auto;
  width: 100%;
  max-width: 300px;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fde047;
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

.timer-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.timer-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.timer-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Würfel-Container */
.dice-container {
  width: 200px;
  height: 200px;
  margin: 20px auto;
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
} /* Vorne - Stadt */
.dice-face:nth-child(2) {
  transform: rotateX(180deg) translateZ(100px);
  color: #16a34a;
} /* Hinten - Land */
.dice-face:nth-child(3) {
  transform: rotateY(90deg) translateZ(100px);
  color: #075985;
} /* Rechts - Fluss */
.dice-face:nth-child(4) {
  transform: rotateY(-90deg) translateZ(100px);
  color: #9333ea;
} /* Links - Name */
.dice-face:nth-child(5) {
  transform: rotateX(90deg) translateZ(100px);
  color: #d97706;
} /* Oben - Tier */
.dice-face:nth-child(6) {
  transform: rotateX(-90deg) translateZ(100px);
  color: #ca8a04;
} /* Unten - Jackpot */

/* Ergebnis-Anzeige */
.result {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.result-text {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  text-align: center;
}

.result-subtext {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* Würfel-Button */
.roll-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 18px 44px;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 18px rgba(30, 41, 59, 0.18);
  margin: 18px 0;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.roll-btn:hover {
  background: #1d4ed8;
  color: #fff;
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.25);
}
.roll-btn:active {
  background: #1e293b;
  color: #fff;
}

/* Spielersteuerung */
.player-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.control-btn {
  background: #fbbf24;
  color: #1e293b;
  border: none;
  padding: 12px 28px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.1);
  margin: 2px 0;
  letter-spacing: 0.01em;
}
.control-btn:hover {
  background: #f59e1b;
  color: #fff;
}
.control-btn:active {
  background: #b45309;
  color: #fff;
}

/* Punkte-Container */
.points-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 15px 0;
  flex-wrap: wrap;
}

.points-btn {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.1);
  margin: 2px 0;
  letter-spacing: 0.01em;
  border: 2px solid #16a34a;
}
.points-btn:hover {
  background: #16a34a;
  color: #fff;
  border-color: #15803d;
}
.points-btn:active {
  background: #166534;
  color: #fff;
  border-color: #166534;
}

/* Spielregeln */
.rules {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-top: 30px;
  text-align: left;
}

.rules h3 {
  margin-bottom: 15px;
  font-size: 1.3rem;
  text-align: center;
}

.rules ul {
  padding-left: 20px;
}

.rules li {
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 0.95rem;
}

.jackpot-highlight {
  background: linear-gradient(45deg, #fde047, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* Animationen */
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

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.pulse {
  animation: pulse 0.5s;
}

/* Responsive Design */
@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .dice-container {
    transform: scale(0.8);
    margin: 0 auto;
  }
  .result-text {
    font-size: 1.8rem;
  }
  .game-info {
    flex-direction: column;
  }
  .info-value {
    font-size: 1.8rem;
  }
  .current-letter {
    font-size: 2.5rem;
  }
  .player-chips {
    gap: 0.5em;
    padding-bottom: 0.5em;
    margin-bottom: 1.2em;
    box-shadow: 0 2px 12px #2563eb11;
    background: #f8fafc;
    border-radius: 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .player-chip {
    min-width: 80px;
    max-width: 110px;
    font-size: 0.97rem;
    padding: 6px 8px;
    border-radius: 18px;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .chip-avatar {
    width: 22px;
    height: 22px;
    font-size: 0.98rem;
    margin-bottom: 2px;
  }
  .chip-score {
    font-size: 0.92rem;
    padding: 1px 7px;
    border-radius: 9px;
    margin: 0 auto 2px auto;
    display: block;
  }
  .chip-icon {
    font-size: 0.95rem;
    margin-left: 0.1em;
    padding: 0 1px;
  }
  .chip-name {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
  }
  .chip-add-btn {
    width: 28px;
    height: 28px;
    font-size: 1.2rem;
    margin-left: 0.2em;
  }
  .toggle-names-btn {
    display: block;
  }
  .player-chips.collapsed-mobile {
    gap: 0.2em;
    background: #f8fafc;
    box-shadow: 0 2px 12px #2563eb11;
    border-radius: 16px;
    padding-bottom: 0.5em;
    margin-bottom: 1.2em;
  }
  .player-chip.collapsed-mobile-chip {
    min-width: 44px;
    max-width: 54px;
    padding: 6px 4px;
    border-radius: 18px;
    font-size: 0.97rem;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .chip-name-full {
    display: block;
    max-width: 100vw;
    font-size: 1.01rem;
    font-weight: 500;
    white-space: normal;
    overflow-wrap: anywhere;
    margin: 0 2px;
    text-align: center;
  }
  .chip-name-block {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 0.99rem;
    margin: 0 0 2px 0;
    line-height: 1.15;
    max-width: 100%;
    white-space: normal;
    word-break: break-word;
  }
  .dice-timer-card {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    width: 100%;
  }
  .dice-container {
    margin: 0 auto 0.5em auto !important;
    display: block !important;
  }
  .timer-circle {
    margin-bottom: 0 !important;
    margin-right: 0 !important;
    margin-left: 0 !important;
    display: block !important;
  }
  .timer-controls-animated {
    flex-direction: row !important;
    align-items: center !important;
    gap: 10px !important;
    margin-top: 0 !important;
    justify-content: center !important;
    width: 100%;
  }
}
@media (min-width: 601px) {
  .toggle-names-btn {
    display: none !important;
  }
  .player-chips.collapsed-mobile,
  .player-chip.collapsed-mobile-chip {
    /* Desktop: immer ausgeklappt */
    min-width: 120px;
    max-width: 220px;
    font-size: 1.05rem;
    padding: 8px 16px;
    border-radius: 22px;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .chip-name-full {
    display: inline-block;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  .chip-name-block {
    display: inline-block;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    margin: 0 6px 0 0;
    text-align: left;
  }
  .chip-score {
    font-size: 1rem;
    padding: 2px 10px;
    border-radius: 12px;
    margin-left: 0.5em;
    display: inline-block;
  }
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
.header-animated {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5em;
}
@keyframes fadeSlideIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.timer-controls-animated {
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.timer-btn-main {
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 72px;
  height: 72px;
  font-size: 2.5rem;
  font-weight: bold;
  box-shadow: 0 4px 24px #2563eb33, 0 0 0 0 #60a5fa44;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  position: relative;
  z-index: 1;
}
.timer-btn-main:active {
  transform: scale(0.96);
}
.timer-btn-glow {
  animation: timer-glow 1.2s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 0 0 #60a5fa44, 0 8px 32px #2563eb55;
}
@keyframes timer-glow {
  0% {
    box-shadow: 0 0 0 0 #60a5fa44, 0 8px 32px #2563eb55;
    transform: scale(1);
  }
  60% {
    box-shadow: 0 0 0 16px #60a5fa22, 0 8px 32px #2563eb55;
    transform: scale(1.08);
  }
  100% {
    box-shadow: 0 0 0 0 #60a5fa44, 0 8px 32px #2563eb55;
    transform: scale(1);
  }
}
.timer-settings {
  margin-bottom: 0.5em;
  gap: 0.5em;
}
.timer-settings-label {
  font-weight: 500;
  color: #2563eb;
  font-size: 1.08rem;
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
  margin: 0 auto 1em auto;
  text-align: center;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px #fde04733;
  display: inline-block;
}
.speed-info {
  color: #fbbf24;
  font-weight: bold;
  font-size: 1.01rem;
  display: inline-block;
  margin-top: 0.2em;
}
.timer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: white;
  filter: drop-shadow(0 2px 6px #1e293b33);
}
.timer-btn-reset {
  background: linear-gradient(90deg, #64748b 60%, #2563eb 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 2px 12px #2563eb33, 0 0 0 0 #64748b44;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  position: relative;
  z-index: 1;
  margin-left: 8px;
}
.timer-btn-reset:active {
  transform: scale(0.96);
}
.timer-icon-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: white;
  filter: drop-shadow(0 2px 6px #1e293b33);
}
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
.back-home-btn:active {
  transform: scale(0.97);
}
.code-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 41, 59, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.code-modal-content {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px #2563eb33, 0 2px 24px #fbbf2444;
  padding: 3.2rem 2.5rem 2.7rem 2.5rem;
  min-width: 340px;
  text-align: center;
  position: relative;
  animation: popIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
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
.code-modal-content h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 0.7rem;
  letter-spacing: 0.01em;
}
.code-modal-content p {
  color: #64748b;
  font-size: 1.13rem;
  margin-bottom: 2.2rem;
}
.code-modal-content input {
  font-size: 2.1rem;
  padding: 1.1rem 2.2rem;
  border-radius: 2.5rem;
  border: 2.5px solid #2563eb;
  margin: 0 0 1.5rem 0;
  outline: none;
  width: 90%;
  max-width: 260px;
  text-align: center;
  background: #f8fafc;
  box-shadow: 0 2px 16px #2563eb22, 0 0px 0px #fbbf2444;
  transition: border 0.2s, box-shadow 0.2s;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.18em;
}
.code-modal-content input:focus {
  border: 2.5px solid #fbbf24;
  box-shadow: 0 0 0 4px #fbbf2422, 0 2px 16px #2563eb22;
  background: #fffbe8;
}
.code-modal-content button {
  background: linear-gradient(90deg, #2563eb 60%, #fbbf24 100%);
  color: #fff;
  border: none;
  border-radius: 2.5rem;
  padding: 1.1rem 2.7rem 1.1rem 2.7rem;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.2rem;
  box-shadow: 0 2px 16px #2563eb22, 0 0px 0px #fbbf2444;
  display: inline-flex;
  align-items: center;
  gap: 0.7em;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  position: relative;
}
.code-modal-content button:active {
  transform: scale(0.97);
}
.code-modal-content button::after {
  content: '→';
  font-size: 1.3em;
  margin-left: 0.5em;
  color: #fffbe8;
  opacity: 0.8;
  transition: margin 0.2s;
}
.code-modal-content button:hover::after {
  margin-left: 0.8em;
}
.code-error {
  color: #ef4444;
  margin-top: 1.1rem;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  background: #fff0f0;
  border-radius: 1.2rem;
  padding: 0.5em 1.2em;
  display: inline-block;
  box-shadow: 0 2px 8px #ef444422;
}
.reset-all-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.reset-all-btn {
  display: flex;
  align-items: center;
  gap: 0.7em;
  background: linear-gradient(90deg, #fbbf24 60%, #2563eb 100%);
  color: #fff;
  border: none;
  border-radius: 2.2em;
  padding: 0.9em 1.7em;
  font-size: 1.08rem;
  font-weight: 600;
  box-shadow: 0 2px 12px #2563eb22;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  outline: none;
  margin: 0 auto;
}
.reset-all-btn:active {
  transform: scale(0.97);
}
.reset-all-icon {
  width: 28px;
  height: 28px;
  margin-right: 0.3em;
  filter: drop-shadow(0 2px 6px #fbbf2422);
}
.reset-all-text {
  color: #fffbe8;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 1.08rem;
  text-shadow: 0 1px 4px #2563eb33;
}
@media (max-width: 700px) {
  .reset-all-btn {
    font-size: 0.97rem;
    padding: 0.7em 1.1em;
  }
  .reset-all-icon {
    width: 22px;
    height: 22px;
  }
  .reset-all-text {
    font-size: 0.97rem;
  }
}
.icons-link-btn-wrapper {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  z-index: 10;
}
.icons-link-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f1f5f9;
  border: 1.5px solid #2563eb;
  border-radius: 1.5rem;
  padding: 0.4rem 1.1rem 0.4rem 0.7rem;
  color: #2563eb;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px #2563eb11;
  transition: background 0.2s, box-shadow 0.2s;
}
.icons-link-btn:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb22;
}
.icons-link-text {
  font-size: 1rem;
  font-weight: 500;
}
.rules-card {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 12px #2563eb11;
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  text-align: left;
}
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
.add-player-input {
  width: 80%;
  font-size: 1.1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 1.2rem;
  border: 2px solid #e0e7ef;
  margin: 1.2rem 0 1.5rem 0;
  outline: none;
  box-shadow: 0 2px 12px #2563eb11;
  transition: border 0.2s, box-shadow 0.2s;
}
.add-player-input:focus {
  border: 2px solid #2563eb;
  box-shadow: 0 0 0 2px #2563eb33;
}
.speech-section {
  margin: 1.2rem 0 0.5rem 0;
  text-align: center;
}
.speech-btn {
  background: linear-gradient(
    90deg,
    var(--color-primary) 60%,
    var(--color-accent) 100%
  );
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 2px 12px var(--color-primary) 22;
  cursor: pointer;
  margin-bottom: 0.7rem;
  transition: background 0.2s, box-shadow 0.2s;
}
.speech-btn:active {
  transform: scale(0.97);
}
.speech-result {
  font-size: 1.08rem;
  color: var(--color-primary);
  margin-top: 0.3rem;
}
</style>
