<script setup lang="ts">
import {onMounted} from 'vue';
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

onMounted(() => {
  createSparkle();
});
</script>
<template>
  <div class="package">
    <div class="jackpot-effect" id="sparks"></div>

    <div class="title">Lexikon-Loop</div>
    <div class="subtitle">Das kreative Wort-Ketten-Spiel</div>

    <div class="dice">
      <div class="dice-face">JACKPOT</div>
    </div>

    <div class="letter-chain">
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

.dice {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 20px;
  position: relative;
  transform: rotate(15deg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin-bottom: 40px;
  animation: float 3s ease-in-out infinite;
}

.dice-face {
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  color: #2575fc;
  transform: rotate(-15deg);
}

.letter-chain {
  display: flex;
  gap: 15px;
  z-index: 2;
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
</style>
