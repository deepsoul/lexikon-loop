<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
// Sparkle-Effekt für Jackpot generieren
const createSparkle = () => {
  const sparksContainer = document.getElementById('sparks');
  for (let i = 0; i < 15; i++) {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.setProperty('--d', (Math.random() * 4).toString());
    // Explosionsrichtung: zufälliger Winkel und Radius
    const angle = Math.random() * 2 * Math.PI;
    const radius = 60 + Math.random() * 40; // 60-100px
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    spark.style.setProperty('--x', `${x}px`);
    spark.style.setProperty('--y', `${y}px`);
    const size = Math.random() * 18 + 8;
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.left = '50%';
    spark.style.top = '50%';
    spark.style.background =
      i % 3 === 0 ? 'gold' : i % 3 === 1 ? '#ff9e00' : 'white';
    spark.style.borderRadius = '50%'; // Kreis sicherstellen
    spark.style.position = 'absolute'; // Falls CSS-Scoping greift
    sparksContainer?.appendChild(spark);
  }
};

// 3D-Würfel-Logik für das Logo
const logoDiceRotation = ref({x: 0, y: 0, z: 0});
const logoRotations = [
  {x: 4, y: 5, z: 3},
  {x: -5, y: -4, z: -3},
  {x: 6, y: -5, z: 4},
  {x: -4, y: 6, z: -5},
  {x: 5, y: 3, z: -6},
  {x: -3, y: -6, z: 5},
];
let logoDiceInterval: null | number = null;
const logoDiceTransform = () => {
  const {x, y, z} = logoDiceRotation.value;
  return {
    transform: `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`,
  };
};
function randomizeLogoDice() {
  // Zufällige Seite (0-5)
  const result = Math.floor(Math.random() * 6);
  // Endpositionen wie in LetsPlay.vue
  switch (result) {
    case 0:
      logoDiceRotation.value = {x: 0, y: 0, z: 0};
      break;
    case 1:
      logoDiceRotation.value = {x: 180, y: 0, z: 0};
      break;
    case 2:
      logoDiceRotation.value = {x: 0, y: 90, z: 0};
      break;
    case 3:
      logoDiceRotation.value = {x: 0, y: -90, z: 0};
      break;
    case 4:
      logoDiceRotation.value = {x: 90, y: 0, z: 0};
      break;
    case 5:
      logoDiceRotation.value = {x: -90, y: 0, z: 0};
      break;
  }
}
onMounted(() => {
  // createSparkle();
  randomizeLogoDice();
  logoDiceInterval = setInterval(randomizeLogoDice, 15000);
});
onUnmounted(() => {
  if (logoDiceInterval !== null) {
    clearInterval(logoDiceInterval);
    logoDiceInterval = null;
  }
});
</script>
<template>
  <div class="package">
    <div class="jackpot-effect" id="sparks"></div>
    <div class="title">Lexikon-Loop</div>
    <div class="subtitle">Das kreative Wort-Ketten-Spiel</div>
    <!-- Animierter 3D-Würfel -->
    <div class="dice-container">
      <div class="dice" :style="logoDiceTransform()">
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
            <rect x="25" y="40" width="10" height="20" fill="#2563eb" />
            <rect x="45" y="40" width="10" height="20" fill="#2563eb" />
            <rect x="65" y="40" width="10" height="20" fill="#2563eb" />
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
            <path d="M45 60Q50 65 55 60" stroke="#d97706" stroke-width="2" />
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
    <!-- Restliches Template ... -->
    <div class="letter-chain mt-4">
      <div class="letter" style="--delay: 0">A</div>
      <div class="arrow">→</div>
      <div class="letter" style="--delay: 1">B</div>
      <div class="arrow">→</div>
      <div class="letter" style="--delay: 2">C</div>
      <div class="arrow">→</div>
      <div class="letter" style="--delay: 3">...</div>
    </div>
    <div class="subtitle">
      Stadt · Land · Fluss · Name · Tier ·
      <span class="jackpot-badge">JACKPOT!</span>
    </div>
  </div>
</template>

<style lang="scss">
.package {
  //   width: 400px;
  //   height: 400px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 20px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial Rounded MT Bold', 'Segoe UI', sans-serif;
}

.title {
  font-size: 42px;
  font-weight: bold;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: 10px;
  z-index: 3;
  text-align: center;
}

.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  z-index: 3;
  padding: 0 1rem;
}

.dice-container {
  width: 100px;
  height: 100px;
  margin: 20px auto 32px auto; /* Abstand nach unten vergrößert */
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
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #1e293b;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 10px;
}
.dice-face:nth-child(1) {
  transform: translateZ(50px);
  color: #2563eb;
} /* Vorne - Stadt */
.dice-face:nth-child(2) {
  transform: rotateX(180deg) translateZ(50px);
  color: #16a34a;
} /* Hinten - Land */
.dice-face:nth-child(3) {
  transform: rotateY(90deg) translateZ(50px);
  color: #075985;
} /* Rechts - Fluss */
.dice-face:nth-child(4) {
  transform: rotateY(-90deg) translateZ(50px);
  color: #9333ea;
} /* Links - Name */
.dice-face:nth-child(5) {
  transform: rotateX(90deg) translateZ(50px);
  color: #d97706;
} /* Oben - Tier */
.dice-face:nth-child(6) {
  transform: rotateX(-90deg) translateZ(50px);
  color: #ca8a04;
} /* Unten - Jackpot */

.letter-chain {
  display: flex;
  gap: 15px;
  z-index: 2;
  margin-top: 0; /* Reset, falls überschrieben */
}

.letter {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #6a11cb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
  animation-delay: calc(var(--delay) * 0.3s);
}

.arrow {
  font-size: 30px;
  color: white;
  margin-top: 5px;
}

.jackpot-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10; /* erhöht */
}

.spark {
  position: absolute;
  background: gold;
  border-radius: 50%;
  opacity: 0.7;
  animation: sparkle 4s infinite;
  animation-delay: calc(var(--d) * -1s);
  z-index: 11; /* erhöht */
  left: 50%;
  top: 50%;
  /* Start exakt im Zentrum */
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(15deg);
  }
  50% {
    transform: translateY(-15px) rotate(20deg);
  }
  100% {
    transform: translateY(0) rotate(15deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes sparkle {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y)))
      scale(0.7);
    opacity: 0;
  }
}
@media (max-width: 600px) {
  .dice-container {
    margin-bottom: 24px;
  }
  .letter-chain {
    gap: 10px;
  }
}
</style>
