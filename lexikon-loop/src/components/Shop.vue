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

<style lang="scss">
.shop-container {
  max-width: 900px;
  margin: 2.5rem auto 3.5rem auto;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(60, 80, 180, 0.1);
  padding: 3.2rem 1.2rem 2.7rem 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  justify-content: flex-start;
  gap: 2.2rem;
  box-sizing: border-box;
}
.shop-title {
  font-size: 2.1rem;
  color: var(--color-primary);
  font-weight: 800;
  margin-bottom: 2.2rem;
}
.shop-product-card,
.shop-order-form {
  width: 100%;
  max-width: 700px;
  background: #fff;
  color: var(--color-text);
  border-radius: 22px;
  box-shadow: 0 2px 12px rgba(60, 80, 180, 0.07);
  margin-bottom: 0.7rem;
  padding: 2.1rem 1.5rem 1.7rem 1.5rem;
  text-align: left;
  position: relative;
  transition: box-shadow 0.2s;
  font-size: 1.01rem;
  line-height: 1.7;
  box-sizing: border-box;
  overflow-x: auto;
  max-width: 100%;
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
  color: var(--color-primary);
  margin-bottom: 0.7rem;
}
.shop-includes {
  list-style: disc inside;
  margin-bottom: 0.7rem;
  font-size: 1.01rem;
  color: var(--color-text);
}
.shop-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-accent);
  margin-bottom: 0.2rem;
}
.shop-plus {
  color: var(--color-primary);
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
  border-radius: 22px;
  padding: 2.1rem 1.5rem 1.7rem 1.5rem;
  box-shadow: 0 2px 12px rgba(60, 80, 180, 0.07);
}
.shop-order-form h3 {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 1.2rem;
}
.shop-address,
.shop-email {
  width: 100%;
  border-radius: 0.7rem;
  border: 1.5px solid var(--color-primary);
  padding: 0.7rem 1rem;
  margin-bottom: 1.1rem;
  font-size: 1rem;
  resize: vertical;
}
.shop-pay-methods {
  margin: 1.2rem 0 1.2rem 0;
}
.shop-pay-icons {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.5rem;
}
.shop-order-btn {
  display: block;
  margin: 2.2rem auto 0 auto;
  padding: 1.1rem 2.2rem;
  font-size: 1.15rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(
    90deg,
    var(--color-primary) 60%,
    var(--color-accent) 100%
  );
  border: none;
  border-radius: 2rem;
  box-shadow: 0 4px 24px var(--color-primary) 33, 0 0 0 0 var(--color-accent) 44;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
}
.shop-order-btn:active {
  transform: scale(0.97);
}
.shop-note {
  font-size: 0.98rem;
  color: #888;
  margin-top: 1.2rem;
  text-align: center;
}
@media (max-width: 700px) {
  .shop-container {
    max-width: 100%;
    width: 100%;
    padding: 1.2rem 0.7rem 2.5rem 0.7rem;
    gap: 1.7rem;
    border-radius: 18px;
    box-sizing: border-box;
  }
  .shop-product-card,
  .shop-order-form {
    max-width: 100%;
    width: 100%;
    padding: 1.2rem 0.8rem 1.1rem 0.8rem;
    border-radius: 14px;
    font-size: 0.98rem;
    box-sizing: border-box;
  }
  .shop-product-card {
    flex-direction: column;
    align-items: stretch;
    gap: 1.1rem;
  }
  .shop-product-img {
    justify-content: center;
    margin-bottom: 0.7rem;
  }
  .shop-product-img svg {
    width: 64px;
    height: 64px;
  }
  .shop-title {
    font-size: 1.45rem;
  }
  .shop-product-info h2 {
    font-size: 1.08rem;
  }
  .shop-includes {
    font-size: 0.97rem;
  }
  .shop-price {
    font-size: 1.08rem;
  }
  .shop-order-form h3 {
    font-size: 1.05rem;
  }
  .shop-address,
  .shop-email {
    font-size: 0.97rem;
    padding: 0.6rem 0.7rem;
    border-radius: 0.5rem;
  }
  .shop-order-btn {
    font-size: 1.01rem;
    padding: 0.9rem 1.3rem;
    border-radius: 1.2rem;
  }
  .shop-pay-icons svg {
    width: 26px;
    height: 26px;
  }
}
@media (max-width: 430px) {
  .shop-container {
    max-width: 100%;
    width: 100%;
    padding: 0.7rem 0rem 1.2rem 0rem;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .shop-product-card,
  .shop-order-form {
    max-width: 100%;
    width: 100%;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box;
  }
  .shop-title {
    font-size: 1.08rem;
  }
  .shop-product-info h2 {
    font-size: 0.97rem;
  }
  .shop-includes {
    font-size: 0.93rem;
  }
  .shop-price {
    font-size: 0.97rem;
  }
  .shop-order-form h3 {
    font-size: 0.97rem;
  }
  .shop-address,
  .shop-email {
    font-size: 0.93rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.3rem;
  }
  .shop-order-btn {
    font-size: 0.93rem;
    padding: 0.7rem 0.7rem;
    border-radius: 0.7rem;
  }
  .shop-pay-icons svg {
    width: 20px;
    height: 20px;
  }
}
</style>
