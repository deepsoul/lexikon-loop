<template>
  <div class="reset-all-container flex items-center justify-center mb-4">
    <button
      class="reset-all-btn"
      @click="$emit('reset-all')"
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
        <rect x="2" y="14" width="24" height="10" rx="4" fill="#fbbf24" />
        <rect x="7" y="6" width="14" height="8" rx="4" fill="#2563eb" />
        <path
          d="M9 8l2 2 4-4 4 4"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect x="12" y="18" width="4" height="4" rx="2" fill="#fffbe8" />
      </svg>
      <span class="reset-all-text">Alle Spieler & Punkte zurücksetzen</span>
    </button>
  </div>
</template>
<script setup lang="ts">
defineEmits(['reset-all']);
</script>
