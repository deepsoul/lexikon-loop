<template>
  <div class="login-modal">
    <div class="login-modal-content">
      <h2>🔒 Zugang geschützt</h2>
      <p>Bitte Passwort eingeben, um fortzufahren:</p>
      <input
        v-model="password"
        @keyup.enter="login"
        type="password"
        maxlength="16"
        autofocus
        placeholder="Passwort"
      />
      <button @click="login">
        <span>Login</span>
      </button>
      <div v-if="error" class="login-error">Falsches Passwort!</div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
const password = ref('');
const error = ref(false);
const router = useRouter();
function login() {
  if (password.value === '1312') {
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/lets-play');
  } else {
    error.value = true;
    password.value = '';
  }
}
</script>
<style scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 41, 59, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.login-modal-content {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px #2563eb33, 0 2px 24px #fbbf2444;
  padding: 3.2rem 2.5rem 2.7rem 2.5rem;
  min-width: 340px;
  text-align: center;
  position: relative;
  animation: popIn 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes popIn {
  0% {
    transform: scale(0.85) translateY(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
.login-modal-content h2 {
  font-size: 2rem;
  margin-bottom: 1.2rem;
  color: #2563eb;
}
.login-modal-content input {
  width: 80%;
  font-size: 1.2rem;
  padding: 1.1rem 1.2rem;
  border-radius: 1.5rem;
  border: 2px solid #e0e7ef;
  margin: 1.2rem 0 1.5rem 0;
  outline: none;
  box-shadow: 0 2px 12px #2563eb11;
  transition: border 0.2s, box-shadow 0.2s;
}
.login-modal-content input:focus {
  border: 2px solid #2563eb;
  box-shadow: 0 0 0 2px #2563eb33;
}
.login-modal-content button {
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
.login-modal-content button:active {
  transform: scale(0.97);
}
.login-error {
  color: #fff;
  background: #ef4444;
  border-radius: 1rem;
  padding: 0.5rem 1.2rem;
  margin-top: 1.2rem;
  font-weight: bold;
  box-shadow: 0 2px 8px #ef444422;
  display: inline-block;
}
</style>
