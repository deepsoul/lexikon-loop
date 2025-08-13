<template>
  <div class="impressum-container">
    <div class="impressum-content">
      <h1>Impressum</h1>

      <section class="section">
        <h2>Angaben gemäß § 5 TMG</h2>
        <div class="contact-info">
          <p><strong>Name:</strong> [Ihr Name / Firmenname]</p>
          <p><strong>Adresse:</strong> [Ihre vollständige Adresse]</p>
          <p><strong>PLZ & Ort:</strong> [PLZ und Stadt]</p>
          <p><strong>Land:</strong> Deutschland</p>
        </div>
      </section>

      <section class="section">
        <h2>Kontakt</h2>
        <div class="contact-info">
          <p><strong>Telefon:</strong> [Ihre Telefonnummer]</p>
          <p><strong>E-Mail:</strong> [Ihre E-Mail-Adresse]</p>
          <p><strong>Website:</strong> [Ihre Website-URL]</p>
        </div>
      </section>

      <section class="section">
        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        </p>
        <div class="contact-info">
          <p><strong>USt-IdNr.:</strong> [Ihre USt-IdNr.]</p>
        </div>
        <p class="note">
          <em
            >Hinweis: Falls Sie keine USt-IdNr. haben, können Sie diesen
            Abschnitt entfernen.</em
          >
        </p>
      </section>

      <section class="section">
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <div class="contact-info">
          <p><strong>Name:</strong> [Ihr Name]</p>
          <p><strong>Adresse:</strong> [Ihre Adresse]</p>
        </div>
      </section>

      <section class="section">
        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
      </section>

      <section class="section">
        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          von entsprechenden Rechtsverletzungen werden wir diese Inhalte
          umgehend entfernen.
        </p>
      </section>

      <section class="section">
        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
          ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Links
          umgehend entfernen.
        </p>
      </section>

      <section class="section">
        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
          sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
          wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
          Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf
          eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
          entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </p>
      </section>

      <section class="section">
        <h2>Bildquellen</h2>
        <p>
          Die auf dieser Website verwendeten Bilder stammen aus folgenden
          Quellen:
        </p>
        <ul>
          <li>Eigene Grafiken und Illustrationen</li>
          <li>SVG-Icons: [Quelle angeben, falls verwendet]</li>
          <li>Fotos: [Quelle angeben, falls verwendet]</li>
        </ul>
      </section>

      <section class="section">
        <h2>Technische Umsetzung</h2>
        <p>Diese Website wurde mit modernen Webtechnologien entwickelt:</p>
        <ul>
          <li><strong>Frontend:</strong> Vue.js 3</li>
          <li>
            <strong>Styling:</strong> CSS3 mit Tailwind-ähnlichen Komponenten
          </li>
          <li><strong>Build-Tool:</strong> Vite</li>
          <li><strong>Hosting:</strong> [Ihr Hosting-Provider]</li>
        </ul>
      </section>

      <div class="back-button">
        <button @click="$router.go(-1)" class="btn-back">← Zurück</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Impressum',
  mounted() {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
.impressum-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
}

.impressum-content {
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
  border-bottom: 3px solid #ec4899;
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
  border-left: 4px solid #ec4899;
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
  background: #fdf2f8;
  border: 1px solid #fce7f3;
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

.note {
  font-style: italic;
  color: #6b7280;
  background: #fef3c7;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid #f59e0b;
}

a {
  color: #ec4899;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #be185d;
  text-decoration: underline;
}

.back-button {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn-back {
  background: #ec4899;
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
  background: #be185d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .impressum-container {
    padding: 10px;
  }

  .impressum-content {
    padding: 24px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.25rem;
  }
}
</style>
