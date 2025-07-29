<template>
  <div class="player-chips flex gap-2 overflow-x-auto pb-2 mb-4">
    <span
      v-for="(p, i) in players"
      :key="i"
      class="player-chip flex items-center gap-2 px-4 py-2 rounded-full shadow transition-all duration-200 relative"
      :class="{'chip-active': i === currentPlayer}"
    >
      <span class="chip-avatar bg-blue-200 text-blue-700 font-bold">
        {{ p.name.charAt(0).toUpperCase() }}
      </span>
      <span class="chip-name-block" @click="$emit('edit-player', i)">
        <template v-if="editingPlayerIndex === i">
          <input
            :value="editingPlayerName"
            @input="$emit('update:editingPlayerName', $event.target.value)"
            @keyup.enter="$emit('confirm-edit-player')"
            @blur="$emit('confirm-edit-player')"
            class="chip-edit-input"
            autofocus
          />
          <button class="chip-cancel" @click="$emit('cancel-edit-player')">
            ✕
          </button>
        </template>
        <template v-else>{{ p.name }}</template>
      </span>
      <span class="chip-score bg-yellow-400 text-gray-900 font-bold">
        {{ p.score }}
      </span>
      <button
        class="chip-icon"
        @click="$emit('delete-player', i)"
        title="Spieler löschen"
      >
        🗑️
      </button>
      <button
        v-if="i > 0"
        class="chip-icon"
        @click="$emit('move-player', i, 'up')"
        title="Nach oben"
      >
        ▲
      </button>
      <button
        v-if="i < players.length - 1"
        class="chip-icon"
        @click="$emit('move-player', i, 'down')"
        title="Nach unten"
      >
        ▼
      </button>
    </span>
    <button
      class="chip-add-btn"
      @click="$emit('add-player')"
      title="Spieler hinzufügen"
    >
      ＋
    </button>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';
const props = defineProps({
  players: Array,
  currentPlayer: Number,
  editingPlayerIndex: Number,
  editingPlayerName: String,
});
const emit = defineEmits([
  'edit-player',
  'confirm-edit-player',
  'cancel-edit-player',
  'delete-player',
  'move-player',
  'add-player',
  'update:editingPlayerName',
]);
</script>
