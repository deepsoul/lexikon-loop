<template>
  <div class="dice-timer-card flex flex-col items-center gap-4">
    <div class="dice-container mt-2">
      <div class="dice" :style="diceTransform">
        <slot name="dice-faces" />
      </div>
    </div>
    <button
      class="roll-btn mt-2"
      :disabled="rolling"
      @click="$emit('roll-dice')"
      style="width: 100%; max-width: 260px; align-self: center"
    >
      <span v-if="rolling">🎲 Würfelt...</span>
      <span v-else-if="resultText === 'Bereit zum Würfeln!'">🎲 WÜRFELN</span>
      <span v-else>🎲 NEU WÜRFELN</span>
    </button>
    <slot name="result-card" />
    <div
      class="flex gap-2 justify-center items-center mt-2 timer-controls-animated"
    >
      <button
        class="timer-btn-main"
        :class="{'timer-btn-glow': timerActive}"
        @click="$emit('toggle-timer')"
        aria-label="Timer starten/stoppen"
      >
        <span v-if="timerActive" class="timer-icon">
          <slot name="timer-pause-icon" />
        </span>
        <span v-else class="timer-icon">
          <slot name="timer-play-icon" />
        </span>
      </button>
      <button
        class="timer-btn-reset"
        @click="$emit('reset-game-timer')"
        aria-label="Timer zurücksetzen"
      >
        <span class="timer-icon-reset">
          <slot name="timer-reset-icon" />
        </span>
      </button>
    </div>
    <div v-if="timerActive || timeLeft < timerDuration" class="timer-container">
      <div class="timer-display">{{ timeLeft }}s</div>
      <div class="timer-bar">
        <div class="timer-progress" :style="timerProgressStyle"></div>
      </div>
    </div>
    <slot name="player-controls" />
    <slot name="points-controls" />
  </div>
</template>

<script setup lang="ts">
const {
  diceTransform,
  rolling,
  resultText,
  timerActive,
  timeLeft,
  timerDuration,
  timerProgressStyle,
} = defineProps({
  diceTransform: Object,
  rolling: Boolean,
  resultText: String,
  timerActive: Boolean,
  timeLeft: Number,
  timerDuration: Number,
  timerProgressStyle: Object,
});
const emit = defineEmits(['roll-dice', 'toggle-timer', 'reset-game-timer']);
</script>
