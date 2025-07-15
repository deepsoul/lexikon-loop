<template>
  <div class="notfound-container">
    <div class="notfound-content">
      <div class="notfound-icon">🚫</div>
      <h1>404 – Seite nicht gefunden</h1>
      <p>
        Die gewünschte Seite existiert leider nicht.<br />
        Vielleicht hast du dich vertippt oder der Link ist veraltet.
      </p>
      <button @click="goHome">Zurück zur Startseite</button>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router';
const router = useRouter();
function goHome() {
  router.push('/');
}
</script>
<style scoped>
.notfound-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e3eaff 100%);
}
.notfound-content {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px #2563eb11;
  padding: 3.2rem 2.5rem 2.7rem 2.5rem;
  min-width: 320px;
  text-align: center;
}
.notfound-icon {
  font-size: 4rem;
  margin-bottom: 1.2rem;
}
h1 {
  font-size: 2.2rem;
  color: #2563eb;
  margin-bottom: 1.2rem;
}
p {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 2.2rem;
}
button {
  background: linear-gradient(90deg, #2563eb 60%, #fbbf24 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 1.5rem;
  padding: 1rem 2.2rem;
  cursor: pointer;
  box-shadow: 0 2px 12px #2563eb22;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
}
button:active {
  transform: scale(0.97);
}
</style>
