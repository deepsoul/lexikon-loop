<template>
  <div class="icons-page">
    <h2>Alle SVG-Icons</h2>
    <div class="icons-svg-wrapper">
      <object
        type="image/svg+xml"
        data="/assets/icons2.svg"
        class="icons-svg"
      ></object>
    </div>
    <button class="back-home-btn" @click="router.push('/')">
      Zurück zur Startseite
    </button>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();
</script>
<style scoped>
.icons-page {
  max-width: 700px;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px #2563eb11;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  text-align: center;
}
.icons-page h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2563eb;
}
.icons-svg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
}
.icons-svg {
  width: 90%;
  max-width: 480px;
  min-height: 220px;
  border: none;
  background: none;
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

.back-home-btn:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb33;
}

.back-home-btn:active {
  transform: scale(0.97);
}
</style>
