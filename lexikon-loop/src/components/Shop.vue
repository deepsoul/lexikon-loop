<template>
  <div class="shop-container">
    <router-link to="/" class="logo-link">
      <Logo />
    </router-link>
    <h1 class="shop-title">Lexikon-Loop: Würfel & Zubehör bestellen</h1>

    <!-- Produkt-Information -->
    <div class="shop-product-card">
      <div class="shop-product-img">
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

    <!-- Bestellformular -->
    <div class="shop-order-form">
      <h3>Bestellung per E-Mail</h3>
      <p class="form-description">
        Fülle das Formular aus und wir senden dir eine Bestätigung per E-Mail.
        Die Bezahlung erfolgt nach Erhalt der Bestätigung.
      </p>

      <form @submit.prevent="handleSubmit" @input="resetForm">
        <div class="form-group">
          <label for="name" class="form-label">
            Name * <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Vor- und Nachname"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">
            E-Mail-Adresse <span class="required">*</span>
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="deine@email.de"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label"> Telefonnummer </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="+49 123 456789"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="address" class="form-label">
            Lieferadresse <span class="required">*</span>
          </label>
          <textarea
            id="address"
            v-model="formData.address"
            placeholder="Straße, Hausnummer&#10;PLZ Ort&#10;Land"
            rows="4"
            required
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="message" class="form-label"> Nachricht (optional) </label>
          <textarea
            id="message"
            v-model="formData.message"
            placeholder="Zusätzliche Wünsche oder Anmerkungen..."
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Status-Nachrichten -->
        <div
          v-if="submitStatus !== 'idle'"
          class="status-message"
          :class="submitStatus"
        >
          {{ submitMessage }}
        </div>

        <button
          type="submit"
          class="shop-order-btn"
          :disabled="isSubmitting"
          :class="{submitting: isSubmitting}"
        >
          <span v-if="isSubmitting">Wird gesendet...</span>
          <span v-else>Bestellung senden</span>
        </button>
      </form>

      <div class="shop-note">
        <p>
          <strong>Hinweis:</strong> Nach dem Versenden der Bestellung erhältst
          du eine E-Mail-Bestätigung. Die Bezahlung erfolgt per Banküberweisung
          oder PayPal nach Erhalt der Bestätigung.
        </p>
      </div>
    </div>

    <!-- Zurück zur Startseite -->
    <button class="back-home-btn" @click="router.push('/')">
      Zurück zur Startseite
    </button>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {ref} from 'vue';
import emailjs from '@emailjs/browser';
import Logo from './Logo.vue';

const router = useRouter();

// Formular-Daten
const formData = ref({
  name: '',
  email: '',
  address: '',
  phone: '',
  message: '',
});

const isSubmitting = ref(false);
const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
const submitMessage = ref('');

// EmailJS Konfiguration
const EMAILJS_SERVICE_ID = 'service_936cf4s'; // Ersetze mit deiner Service ID
const EMAILJS_TEMPLATE_ID = 'template_d872bjs'; // Ersetze mit deiner Template ID
const EMAILJS_PUBLIC_KEY = '1caDskB4OK6Io6HxJ'; // Ersetze mit deinem Public Key

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // Validierung
  if (
    !formData.value.name ||
    !formData.value.email ||
    !formData.value.address
  ) {
    submitStatus.value = 'error';
    submitMessage.value = 'Bitte fülle alle Pflichtfelder aus.';
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = 'idle';
  submitMessage.value = '';

  try {
    const templateParams = {
      from_name: formData.value.name,
      from_email: formData.value.email,
      from_address: formData.value.address,
      from_phone: formData.value.phone,
      message: formData.value.message || 'Bestellung: Lexikon-Loop Würfel-Set',
      to_name: 'Lexikon-Loop Shop',
      reply_to: formData.value.email,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY,
    );

    submitStatus.value = 'success';
    submitMessage.value =
      'Bestellung erfolgreich versendet! Wir melden uns bald bei dir.';

    // Formular zurücksetzen
    formData.value = {
      name: '',
      email: '',
      address: '',
      phone: '',
      message: '',
    };
  } catch (error) {
    console.error('Email send error:', error);
    submitStatus.value = 'error';
    submitMessage.value =
      'Fehler beim Versenden. Bitte versuche es später erneut.';
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  submitStatus.value = 'idle';
  submitMessage.value = '';
};
</script>

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
}

.shop-product-card:hover,
.shop-order-form:hover {
  box-shadow: 0 4px 20px rgba(60, 80, 180, 0.12);
}

.shop-product-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.shop-product-img {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid #e0e7ef;
}

.shop-product-info {
  flex: 1;
}

.shop-product-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.shop-includes {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.shop-includes li {
  padding: 0.3rem 0;
  font-size: 1rem;
  color: var(--color-text);
  position: relative;
  padding-left: 1.5rem;
}

.shop-includes li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22c55e;
  font-weight: bold;
}

.shop-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.shop-plus {
  color: #64748b;
  font-weight: 400;
}

.shop-shipping {
  font-size: 0.9rem;
  color: #64748b;
}

/* Formular Styles */
.form-description {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.required {
  color: #ef4444;
  font-weight: bold;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e7ef;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: #fff;
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Status Nachrichten */
.status-message {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.status-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Button Styles */
.shop-order-btn {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.shop-order-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.shop-order-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.shop-order-btn.submitting {
  background: linear-gradient(90deg, #64748b 60%, #94a3b8 100%);
}

.shop-note {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
}

.shop-note p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
}

/* Back Home Button */
.back-home-btn {
  display: block;
  margin: 2rem auto 0 auto;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
  background: #f1f5f9;
  border: 2px solid #2563eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.back-home-btn:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 700px) {
  .shop-container {
    margin: 0.5rem auto 0.5rem auto;
    max-width: 100%;
    width: 100%;
    padding: 1.2rem 0.7rem 2.5rem 0.7rem;
    gap: 1.7rem;
    border-radius: 18px;
    box-sizing: border-box;
  }

  .shop-title {
    font-size: 1.45rem;
    margin-bottom: 1.5rem;
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
    text-align: center;
    gap: 1rem;
  }

  .shop-product-img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }

  .shop-product-info h2 {
    font-size: 1.3rem;
  }

  .shop-includes li {
    font-size: 0.9rem;
  }

  .shop-price {
    font-size: 1.2rem;
  }

  .form-input,
  .form-textarea {
    font-size: 0.95rem;
    padding: 0.7rem 0.9rem;
  }

  .shop-order-btn {
    font-size: 1.08rem;
    padding: 1.1rem 1.7rem;
  }

  .back-home-btn {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
}

/* Logo Link */
.logo-link {
  display: block;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.logo-link:hover {
  transform: scale(1.02);
}

.logo-link:active {
  transform: scale(0.98);
}

@media (max-width: 430px) {
  .shop-container {
    max-width: 100%;
    width: 100%;
    padding: 0.7rem 0rem 1.2rem 0rem;
    border-radius: 10px;
    box-sizing: border-box;
  }

  .shop-title {
    font-size: 1.1rem;
    margin-bottom: 1rem;
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

  .shop-product-img {
    width: 80px;
    height: 80px;
  }

  .shop-product-info h2 {
    font-size: 1.2rem;
  }

  .shop-includes li {
    font-size: 0.85rem;
    padding-left: 1.2rem;
  }

  .shop-price {
    font-size: 1.1rem;
  }

  .form-input,
  .form-textarea {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }

  .shop-order-btn {
    font-size: 0.98rem;
    padding: 0.8rem 1.1rem;
  }

  .back-home-btn {
    font-size: 0.95rem;
    padding: 0.7rem 1.2rem;
  }
}
</style>
