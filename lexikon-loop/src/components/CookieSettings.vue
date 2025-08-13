<template>
  <div class="cookie-settings">
    <button
      @click="showSettings = true"
      class="cookie-settings-btn"
      title="Cookie-Einstellungen ändern"
    >
      🍪
    </button>

    <div v-if="showSettings" class="cookie-settings-modal">
      <div class="cookie-settings-content">
        <div class="cookie-settings-header">
          <h4>Cookie-Einstellungen</h4>
          <button @click="showSettings = false" class="close-btn">×</button>
        </div>

        <div class="cookie-settings-body">
          <div class="cookie-option">
            <label class="cookie-switch">
              <input type="checkbox" v-model="analyticsConsent" />
              <span class="slider"></span>
            </label>
            <span>Analytics Cookies</span>
          </div>

          <div class="cookie-info">
            <p>
              Analytics Cookies helfen uns zu verstehen, wie Besucher unsere
              Website nutzen.
            </p>
            <p v-if="analyticsConsent" class="status-active">
              ✅ Analytics aktiv
            </p>
            <p v-else class="status-inactive">❌ Analytics deaktiviert</p>
          </div>
        </div>

        <div class="cookie-settings-footer">
          <button @click="saveSettings" class="save-btn">Speichern</button>
          <button @click="showSettings = false" class="cancel-btn">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieSettings',
  data() {
    return {
      showSettings: false,
      analyticsConsent: false,
    };
  },
  mounted() {
    this.loadCurrentSettings();
  },
  methods: {
    loadCurrentSettings() {
      const consent = localStorage.getItem('cookie_consent');
      if (consent) {
        const consentData = JSON.parse(consent);
        this.analyticsConsent = consentData.analytics;
      }
    },

    saveSettings() {
      const consent = {
        analytics: this.analyticsConsent,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('cookie_consent', JSON.stringify(consent));

      if (this.analyticsConsent) {
        this.loadAnalytics();
      }

      this.showSettings = false;
    },

    loadAnalytics() {
      if (typeof gtag === 'undefined') {
        this.loadGoogleAnalyticsScript();
      }
    },

    loadGoogleAnalyticsScript() {
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
      };
    },
  },
};
</script>

<style scoped>
.cookie-settings {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.cookie-settings-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.cookie-settings-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.cookie-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.cookie-settings-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.cookie-settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cookie-settings-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.cookie-option {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.cookie-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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

input:checked + .slider:before {
  transform: translateX(20px);
}

.cookie-info {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.cookie-info p {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.4;
}

.cookie-info p:last-child {
  margin-bottom: 0;
}

.status-active {
  color: #059669 !important;
  font-weight: 600;
}

.status-inactive {
  color: #dc2626 !important;
  font-weight: 600;
}

.cookie-settings-footer {
  display: flex;
  gap: 12px;
}

.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.save-btn {
  background: #3b82f6;
  color: white;
}

.save-btn:hover {
  background: #2563eb;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .cookie-settings {
    bottom: 10px;
    right: 10px;
  }

  .cookie-settings-content {
    margin: 20px;
    padding: 20px;
  }
}
</style>
