<script setup lang="ts">
// Keine Sparkle- oder Würfel-Logik mehr nötig
</script>
<template>
  <div class="package">
    <div class="title">Lexikon-Loop</div>
    <div class="subtitle">Das kreative Wort-Ketten-Spiel</div>
    <div class="dice mb-4">
      <div class="dice-face">JACKPOT</div>
    </div>
    <div class="letter-chain mt-2">
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
  min-height: 400px;
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
</style>
