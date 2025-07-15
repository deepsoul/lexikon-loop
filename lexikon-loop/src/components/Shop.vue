<script lang="ts" setup>
import {useRouter} from 'vue-router';
import Logo from './Logo.vue';
const router = useRouter();
</script>
<template>
  <div class="shop-container">
    <Logo />
    <h1 class="shop-title">Lexikon-Loop: Würfel & Zubehör kaufen</h1>
    <div class="shop-product-card">
      <div class="shop-product-img">
        <!-- Platzhalter für Würfelbild -->
        <svg width="90" height="90" viewBox="0 0 100 100">
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="18"
            fill="#f8fafc"
            stroke="#2563eb"
            stroke-width="4"
          />
          <text
            x="50"
            y="55"
            text-anchor="middle"
            font-size="32"
            fill="#2563eb"
            font-family="Segoe UI, Poppins, sans-serif"
          >
            🎲
          </text>
        </svg>
      </div>
      <div class="shop-product-info">
        <h2>Lexikon-Loop Würfel-Set</h2>
        <ul class="shop-includes">
          <li>1 Spezialwürfel (Stadt, Land, Fluss, Name, Tier, JACKPOT!)</li>
          <li>1 Anleitung (gedruckt)</li>
          <li>1 Punkteblock</li>
          <li>1 Stift</li>
          <li>Schachtel/Beutel</li>
        </ul>
        <div class="shop-price">
          14,99&nbsp;€ <span class="shop-plus">+</span> 5,99&nbsp;€ Versand
        </div>
        <div class="shop-shipping">Lieferzeit: 2–4 Werktage</div>
      </div>
    </div>
    <div class="shop-order-form">
      <h3>Jetzt bestellen</h3>
      <form @submit.prevent>
        <label>
          Deine Adresse (Versand):<br />
          <textarea
            placeholder="Name, Straße, PLZ Ort"
            rows="3"
            required
            class="shop-address"
          ></textarea>
        </label>
        <label>
          E-Mail für Bestätigung:<br />
          <input
            type="email"
            placeholder="deine@email.de"
            required
            class="shop-email"
          />
        </label>
        <div class="shop-pay-methods">
          <span>Zahlungsmethode:</span>
          <div class="shop-pay-icons">
            <span title="PayPal"
              ><svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#fff" />
                <text
                  x="16"
                  y="22"
                  text-anchor="middle"
                  font-size="18"
                  fill="#2563eb"
                >
                  PP
                </text>
              </svg></span
            >
            <span title="Apple Pay"
              ><svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#fff" />
                <text
                  x="16"
                  y="22"
                  text-anchor="middle"
                  font-size="18"
                  fill="#111"
                >
                  
                </text>
              </svg></span
            >
            <span title="Kreditkarte"
              ><svg width="32" height="32" viewBox="0 0 32 32">
                <rect
                  x="4"
                  y="8"
                  width="24"
                  height="16"
                  rx="4"
                  fill="#fbbf24"
                  stroke="#2563eb"
                  stroke-width="2"
                />
                <rect x="8" y="20" width="8" height="2" fill="#2563eb" /></svg
            ></span>
            <span title="Google Pay"
              ><svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#fff" />
                <text
                  x="16"
                  y="22"
                  text-anchor="middle"
                  font-size="18"
                  fill="#34a853"
                >
                  G
                </text>
              </svg></span
            >
            <span title="SEPA"
              ><svg width="32" height="32" viewBox="0 0 32 32">
                <rect
                  x="4"
                  y="8"
                  width="24"
                  height="16"
                  rx="4"
                  fill="#e0e7ef"
                  stroke="#2563eb"
                  stroke-width="2"
                />
                <text
                  x="16"
                  y="22"
                  text-anchor="middle"
                  font-size="13"
                  fill="#2563eb"
                >
                  SEPA
                </text>
              </svg></span
            >
          </div>
        </div>
        <button class="shop-order-btn" type="submit">Jetzt kaufen</button>
      </form>
      <div class="shop-note">
        (Dies ist ein Demo-Shop. Adresse & Zahlung sind Platzhalter.)
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  max-width: 540px;
  margin: 2.5rem auto 3.5rem auto;
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px #2563eb11;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  text-align: center;
}
.shop-title {
  font-size: 2.1rem;
  color: #2563eb;
  font-weight: 800;
  margin-bottom: 2.2rem;
}
.shop-product-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.2rem;
}
.shop-product-img {
  flex: 0 0 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.shop-product-info {
  text-align: left;
}
.shop-product-info h2 {
  font-size: 1.3rem;
  color: #2563eb;
  margin-bottom: 0.7rem;
}
.shop-includes {
  list-style: disc inside;
  margin-bottom: 0.7rem;
  font-size: 1.01rem;
  color: #1e293b;
}
.shop-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 0.2rem;
}
.shop-plus {
  color: #2563eb;
  font-size: 1.1rem;
  font-weight: 600;
}
.shop-shipping {
  font-size: 0.98rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}
.shop-order-form {
  margin-top: 2.5rem;
  background: #f8fafc;
  border-radius: 1.5rem;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  box-shadow: 0 2px 12px #2563eb11;
}
.shop-order-form h3 {
  font-size: 1.2rem;
  color: #2563eb;
  margin-bottom: 1.2rem;
}
.shop-address {
  width: 100%;
  border-radius: 0.7rem;
  border: 1.5px solid #2563eb33;
  padding: 0.7rem 1rem;
  margin-bottom: 1.1rem;
  font-size: 1rem;
  resize: vertical;
}
.shop-email {
  width: 100%;
  border-radius: 0.7rem;
  border: 1.5px solid #2563eb33;
  padding: 0.7rem 1rem;
  margin-bottom: 1.1rem;
  font-size: 1rem;
}
.shop-pay-methods {
  margin-bottom: 1.2rem;
  text-align: left;
}
.shop-pay-icons {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.5rem;
}
.shop-order-btn {
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
  margin-top: 0.7rem;
}
.shop-order-btn:active {
  transform: scale(0.97);
}
.shop-note {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 1.2rem;
}
</style>
