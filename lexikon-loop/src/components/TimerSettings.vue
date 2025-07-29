<template>
  <div
    class="timer-settings flex flex-wrap gap-2 justify-center items-center mb-2"
  >
    <span class="timer-settings-label">Rundenzeit:</span>
    <button
      v-for="opt in timerOptions"
      :key="opt"
      class="timer-settings-btn"
      :class="{active: timerDuration === opt}"
      @click="$emit('update:timerDuration', opt)"
    >
      {{ opt }}s
    </button>
  </div>
</template>
<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';
const props = defineProps({
  timerOptions: Array,
  timerDuration: Number,
});
defineEmits(['update:timerDuration']);
</script>
