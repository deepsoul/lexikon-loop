<script setup>
import Logo from './components/Logo.vue';
import CookieConsent from './components/CookieConsent.vue';
import CookieSettings from './components/CookieSettings.vue';
// Keine Logik nötig
</script>

<template>
  <router-view />
  <CookieConsent />
  <CookieSettings />
</template>
