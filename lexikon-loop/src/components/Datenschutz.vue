<template>
  <div class="datenschutz-container">
    <div class="datenschutz-content">
      <h1>Datenschutzerklärung</h1>

      <section class="section">
        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <div class="contact-info">
          <p><strong>Name:</strong> [Ihr Name]</p>
          <p><strong>Adresse:</strong> [Ihre Adresse]</p>
          <p><strong>E-Mail:</strong> [Ihre E-Mail]</p>
          <p><strong>Telefon:</strong> [Ihre Telefonnummer]</p>
        </div>
      </section>

      <section class="section">
        <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
        <p>
          Bei Ihrem Besuch auf unserer Website werden automatisch Informationen
          allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles)
          umfassen etwa die Art des Webbrowsers, das verwendete Betriebssystem,
          den Domainnamen Ihres Internet-Service-Providers und Ähnliches.
        </p>
        <p>
          Hierbei handelt es sich ausschließlich um Informationen, welche keine
          Rückschlüsse auf Ihre Person zulassen.
        </p>
      </section>

      <section class="section">
        <h2>3. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr
          Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei,
          unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
        </p>

        <h3>3.1 Notwendige Cookies</h3>
        <p>
          Einige Cookies sind für den Betrieb der Website technisch notwendig.
          Diese können nicht abgelehnt werden, da sie für die Grundfunktionen
          der Website erforderlich sind.
        </p>

        <h3>3.2 Analytics Cookies (Google Analytics)</h3>
        <p>
          Wir verwenden Google Analytics, um die Nutzung unserer Website zu
          analysieren und zu verstehen. Google Analytics verwendet Cookies, um
          Informationen über Ihre Nutzung der Website zu sammeln.
        </p>
        <p>
          <strong>Verwendete Cookies:</strong>
        </p>
        <ul>
          <li>
            <strong>_ga:</strong> Wird verwendet, um Benutzer zu unterscheiden
            (Ablauf: 2 Jahre)
          </li>
          <li>
            <strong>_gid:</strong> Wird verwendet, um Benutzer zu unterscheiden
            (Ablauf: 24 Stunden)
          </li>
          <li>
            <strong>_gat:</strong> Wird verwendet, um die Anforderungsrate zu
            drosseln (Ablauf: 1 Minute)
          </li>
        </ul>
        <p>
          Sie können die Verwendung von Analytics-Cookies über unseren
          Cookie-Consent-Dialog jederzeit aktivieren oder deaktivieren.
        </p>
      </section>

      <section class="section">
        <h2>4. Google Analytics</h2>
        <p>
          Diese Website nutzt Google Analytics, einen Webanalysedienst der
          Google Inc. ("Google"). Google Analytics verwendet Cookies, um die
          Nutzung der Website zu analysieren.
        </p>
        <p>
          Die durch den Cookie erzeugten Informationen über Ihre Nutzung dieser
          Website werden in der Regel an einen Server von Google in den USA
          übertragen und dort gespeichert.
        </p>
        <p>
          <strong>Zweck der Datenverarbeitung:</strong> Analyse der
          Website-Nutzung zur Verbesserung unseres Angebots
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
          (Einwilligung)
        </p>
        <p><strong>Speicherdauer:</strong> 26 Monate</p>
      </section>

      <section class="section">
        <h2>5. Ihre Rechte</h2>
        <p>
          Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
        </p>
        <ul>
          <li>
            <strong>Auskunftsrecht:</strong> Sie können Auskunft über die zu
            Ihrer Person gespeicherten Daten verlangen
          </li>
          <li>
            <strong>Berichtigungsrecht:</strong> Sie können die Berichtigung
            falscher Daten verlangen
          </li>
          <li>
            <strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten
            verlangen
          </li>
          <li>
            <strong>Einschränkungsrecht:</strong> Sie können die Einschränkung
            der Verarbeitung verlangen
          </li>
          <li>
            <strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung
            widersprechen
          </li>
          <li>
            <strong>Datenübertragbarkeit:</strong> Sie können Ihre Daten in
            einem strukturierten Format erhalten
          </li>
        </ul>
      </section>

      <section class="section">
        <h2>6. Kontakt</h2>
        <p>
          Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer
          personenbezogenen Daten wenden Sie sich bitte an:
        </p>
        <div class="contact-info">
          <p><strong>E-Mail:</strong> [datenschutz@ihre-domain.de]</p>
          <p><strong>Telefon:</strong> [Ihre Telefonnummer]</p>
        </div>
      </section>

      <section class="section">
        <h2>7. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
          stets den aktuellen rechtlichen Anforderungen entspricht oder um
          Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
        </p>
        <p><strong>Stand:</strong> [Aktuelles Datum]</p>
      </section>

      <div class="back-button">
        <button @click="$router.go(-1)" class="btn-back">← Zurück</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Datenschutz',
  mounted() {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
.datenschutz-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.datenschutz-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 3px solid #3b82f6;
  padding-bottom: 1rem;
}

.section {
  margin-bottom: 2rem;
}

h2 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 4px solid #3b82f6;
}

h3 {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem 0;
}

p {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1rem;
  text-align: justify;
}

ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

li {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.contact-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.back-button {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn-back {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-back:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .datenschutz-container {
    padding: 10px;
  }

  .datenschutz-content {
    padding: 24px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.25rem;
  }

  h3 {
    font-size: 1.1rem;
  }
}
</style>
