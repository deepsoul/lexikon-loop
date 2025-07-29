<template>
  <div v-if="show" class="add-player-modal">
    <div class="add-player-card">
      <label class="mb-2 font-semibold text-gray-700">Spielername:</label>
      <input
        :value="newPlayerName"
        @input="$emit('update:newPlayerName', $event.target.value)"
        @keyup.enter="$emit('confirm')"
        class="add-player-input"
        placeholder="Name eingeben"
        autofocus
      />
      <div class="flex gap-3 w-full mt-4">
        <button class="points-btn flex-1" @click="$emit('confirm')">
          Hinzufügen
        </button>
        <button class="control-btn flex-1" @click="$emit('cancel')">
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';
const props = defineProps({
  show: Boolean,
  newPlayerName: String,
});
defineEmits(['update:newPlayerName', 'confirm', 'cancel']);
</script>
