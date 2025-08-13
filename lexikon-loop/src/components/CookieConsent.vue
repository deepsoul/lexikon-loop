<template>
  <div v-if="showConsent" class="cookie-consent-overlay">
    <div class="cookie-consent-modal">
      <div class="cookie-consent-header">
        <h3>🍪 Cookie-Einstellungen</h3>
        <p>
          Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu
          verbessern.
        </p>
      </div>

      <div class="cookie-consent-content">
        <div class="cookie-option">
          <div class="cookie-option-header">
            <label class="cookie-switch">
              <input
                type="checkbox"
                v-model="analyticsConsent"
                :disabled="true"
                checked
              />
              <span class="slider"></span>
            </label>
            <div class="cookie-option-text">
              <strong>Notwendige Cookies</strong>
              <span>Für die Grundfunktionen der Website (immer aktiv)</span>
            </div>
          </div>
        </div>

        <div class="cookie-option">
          <div class="cookie-option-header">
            <label class="cookie-switch">
              <input type="checkbox" v-model="analyticsConsent" />
              <span class="slider"></span>
            </label>
            <div class="cookie-option-text">
              <strong>Analytics Cookies</strong>
              <span
                >Helfen uns zu verstehen, wie Besucher unsere Website
                nutzen</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="cookie-consent-footer">
        <button @click="acceptAll" class="btn-accept-all">
          Alle akzeptieren
        </button>
        <button @click="acceptSelected" class="btn-accept-selected">
          Auswahl speichern
        </button>
        <button @click="rejectAll" class="btn-reject-all">Alle ablehnen</button>
      </div>

      <div class="cookie-consent-links">
        <a href="/datenschutz" target="_blank" class="privacy-link">
          Datenschutzerklärung
        </a>
        <a href="/impressum" target="_blank" class="imprint-link">
          Impressum
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieConsent',
  data() {
    return {
      showConsent: false,
      analyticsConsent: false,
    };
  },
  mounted() {
    // Prüfe, ob bereits eine Entscheidung getroffen wurde
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      this.showConsent = true;
    } else {
      this.loadAnalyticsIfConsented();
    }
  },
  methods: {
    acceptAll() {
      this.analyticsConsent = true;
      this.saveConsent();
    },

    acceptSelected() {
      this.saveConsent();
    },

    rejectAll() {
      this.analyticsConsent = false;
      this.saveConsent();
    },

    saveConsent() {
      const consent = {
        analytics: this.analyticsConsent,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('cookie_consent', JSON.stringify(consent));
      this.showConsent = false;

      if (this.analyticsConsent) {
        this.loadAnalytics();
      }
    },

    loadAnalyticsIfConsented() {
      const consent = localStorage.getItem('cookie_consent');
      if (consent) {
        const consentData = JSON.parse(consent);
        if (consentData.analytics) {
          this.loadAnalytics();
        }
      }
    },

    loadAnalytics() {
      // Google Analytics laden, falls noch nicht geladen
      if (typeof gtag === 'undefined') {
        this.loadGoogleAnalyticsScript();
      }
    },

    loadGoogleAnalyticsScript() {
      // Google Analytics Script dynamisch laden
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-29041E9VFN';
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-29041E9VFN');

        // Cookie-Consent Event senden
        gtag('event', 'cookie_consent_given', {
          event_category: 'engagement',
          event_label: 'analytics_cookies_accepted',
        });
      };
    },
  },
};
</script>

<style scoped>
.cookie-consent-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.cookie-consent-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cookie-consent-header {
  text-align: center;
  margin-bottom: 24px;
}

.cookie-consent-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.cookie-consent-header p {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.cookie-consent-content {
  margin-bottom: 24px;
}

.cookie-option {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.cookie-option:last-child {
  border-bottom: none;
}

.cookie-option-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.cookie-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  flex-shrink: 0;
}

.cookie-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:disabled + .slider {
  background-color: #9ca3af;
  cursor: not-allowed;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.cookie-option-text {
  flex: 1;
}

.cookie-option-text strong {
  display: block;
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 4px;
}

.cookie-option-text span {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
}

.cookie-consent-footer {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-accept-all,
.btn-accept-selected,
.btn-reject-all {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 120px;
}

.btn-accept-all {
  background: #3b82f6;
  color: white;
}

.btn-accept-all:hover {
  background: #2563eb;
}

.btn-accept-selected {
  background: #10b981;
  color: white;
}

.btn-accept-selected:hover {
  background: #059669;
}

.btn-reject-all {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-reject-all:hover {
  background: #e5e7eb;
}

.cookie-consent-links {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.cookie-consent-links a {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  margin: 0 12px;
  transition: color 0.2s;
}

.cookie-consent-links a:hover {
  color: #3b82f6;
}

/* Responsive Design */
@media (max-width: 640px) {
  .cookie-consent-modal {
    padding: 24px;
    margin: 20px;
  }

  .cookie-consent-footer {
    flex-direction: column;
  }

  .btn-accept-all,
  .btn-accept-selected,
  .btn-reject-all {
    width: 100%;
  }

  .cookie-consent-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cookie-consent-links a {
    margin: 0;
  }
}
</style>
