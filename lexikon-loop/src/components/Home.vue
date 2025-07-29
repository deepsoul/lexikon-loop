<template>
  <div class="home-container">
    <div class="main-wrapper">
      <header class="main-header">
        <router-link to="/" class="logo-link">
          <Logo />
        </router-link>
        <button class="play-btn" @click="router.push('/lets-play')">
          Jetzt online ausprobieren
        </button>
      </header>

      <section class="card">
        <h2>📦 Spielmaterial</h2>
        <ul>
          <li>
            <span class="icon">🎲</span> 1 Spezialwürfel mit den Seiten:
            <strong>Stadt</strong>, <strong>Land</strong>,
            <strong>Fluss</strong>, <strong>Name</strong>,
            <strong>Tier</strong>,
            <strong>JACKPOT!</strong>
          </li>
          <li><span class="icon">✏️</span> Stift und Papier für Punkte</li>
          <li>
            <span class="icon">⏲️</span> Timer (Smartphone oder Sanduhr,
            optional)
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>🎯 Spielziel</h2>
        <p>
          Sammle durch cleveres Wortfinden die meisten Punkte! Kette Begriffe
          aneinander: Der nächste Begriff muss mit dem letzten Buchstaben des
          vorherigen beginnen.
        </p>
        <div class="badges flex flex-col">
          <span class="badge">👥 2-6 Spieler</span>
          <span class="badge">🎂 Ab 10 Jahren</span>
          <span class="badge">⏱ 20-40 Minuten</span>
        </div>
      </section>

      <section class="card">
        <h2>📜 Spielablauf</h2>
        <ol>
          <li>
            <strong>Startspieler würfelt</strong>
            <ul class="me-5">
              <li>
                <span class="symbol">🔸</span> Bei
                <strong>Stadt/Land/Fluss/Name/Tier</strong>: Nenne ein passendes
                Beispiel (z.B. Land → "Deutschland")
              </li>
              <li>
                <span class="symbol">🎰</span> Bei <strong>JACKPOT!</strong>:
                Wähle frei eine Kategorie und einen Anfangsbuchstaben (z.B. "Für
                den Jackpot nehme ich TIER mit Q → 'Quokka'")
              </li>
            </ul>
          </li>
          <li>
            <strong>Nächster Spieler</strong>
            <ul>
              <li>
                Finde einen Begriff für die gewürfelte Kategorie, der mit dem
                <strong>letzten Buchstaben</strong> des vorherigen Wortes
                beginnt
              </li>
              <li>
                Beispiel: Vorher "Deutschland" → Neuer Begriff muss mit
                <strong>D</strong> starten (z.B. Fluss → "Donau")
              </li>
            </ul>
          </li>
          <li>
            <strong>Runden-Ende</strong>
            <ul>
              <li>Sobald alle Spieler an der Reihe waren, endet die Runde</li>
              <li>
                Der nächste Spieler beginnt eine neue Runde mit einem neuen Wurf
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section class="card jackpot">
        <h2>✨ Punkte sammeln</h2>
        <table class="points-table">
          <thead>
            <tr>
              <th>Aktion</th>
              <th>Punkte</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Korrekte Antwort</td>
              <td>+1</td>
            </tr>
            <tr>
              <td>Antwort auf JACKPOT!-Wurf</td>
              <td>+2</td>
            </tr>
            <tr>
              <td>Begriff endet auf Q, X, Y, Ä, Ö, Ü, ß</td>
              <td>+1 Zusatzpunkt</td>
            </tr>
            <tr>
              <td>Kettenbruch-Bonus*</td>
              <td>+1</td>
            </tr>
          </tbody>
        </table>
        <p class="table-note">
          <small
            >* Wenn niemand nach 30 Sekunden einen Begriff nennen kann, erhält
            der letzte erfolgreiche Spieler 1 Extrapunkt</small
          >
        </p>
      </section>

      <section class="card">
        <h2>⚠️ Wichtige Regeln</h2>
        <p><strong>Buchstaben-Ketten:</strong></p>
        <ul>
          <li>
            Endet ein Wort auf <strong>ß</strong> → Nächstes Wort beginnt mit
            <strong>S</strong> (Beispiel: "Straße" → "Erft")
          </li>
          <li>
            Endet auf <strong>-tion, -ung</strong> etc. → Nimm den letzten
            <strong>aussprechbaren</strong> Buchstaben (Beispiel: "Lösung" →
            "Gabel")
          </li>
          <li>
            Umlaute werden normalisiert: <strong>Ä = A, Ö = O, Ü = U</strong>
          </li>
        </ul>
        <p><strong>Gültige Begriffe:</strong></p>
        <ul>
          <li>Keine Fantasiewörter! Bei Streit: Mehrheitsentscheid</li>
          <li>Zeitlimit: Max. 30 Sekunden pro Zug (sonst Punktabzug)</li>
        </ul>
      </section>

      <section class="card">
        <h2>🔍 Beispielrunde</h2>
        <table class="example-table">
          <thead>
            <tr>
              <th>Spieler</th>
              <th>Würfelergebnis</th>
              <th>Begriff</th>
              <th>Kette</th>
              <th>Punkte*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Anna</td>
              <td>🎰 JACKPOT! (wählt Tier)</td>
              <td>"Quokka"</td>
              <td>–</td>
              <td>+2</td>
            </tr>
            <tr>
              <td>Ben</td>
              <td>Land</td>
              <td>"Albanien"</td>
              <td>Q→A</td>
              <td>+1</td>
            </tr>
            <tr>
              <td>Clara</td>
              <td>Stadt</td>
              <td>"Nairobi"</td>
              <td>A→N</td>
              <td>+1</td>
            </tr>
            <tr>
              <td>David</td>
              <td>Name</td>
              <td>"Iris"</td>
              <td>N→I</td>
              <td>+1 (+1 für I-Endung!)</td>
            </tr>
          </tbody>
        </table>
        <p class="table-note">
          <small>* Mit Bonusmodul "Seltene Endbuchstaben"</small>
        </p>
      </section>

      <section class="tip-box">
        <h2>💡 Tipps für flüssiges Spielen</h2>
        <ul>
          <li>
            Nutzt die <strong>JACKPOT!</strong>-Runden strategisch, um
            schwierige Buchstaben zu setzen!
          </li>
          <li>
            Bei Blockaden: Einfach neuen Buchstaben würfeln und weitermachen
          </li>
          <li>Spielt mit oder ohne Zeitdruck - je nach Gruppe!</li>
          <li>
            Schwierigkeitsgrad anpassbar: Für Fortgeschrittene nur Hauptstädte
            oder wissenschaftliche Tiernamen
          </li>
        </ul>
      </section>

      <section class="card">
        <h2>🏆 Spielende</h2>
        <p>
          Nach vereinbarten Runden (z.B. 5 Runden pro Spieler) gewinnt der
          Spieler mit den meisten Punkten! Bei Gleichstand entscheidet eine
          Blitzrunde mit JACKPOT!-Würfen.
        </p>
      </section>
      <section>
        <div class="pdf-link-wrapper">
          <a
            href="/assets/Lexikon-Loop-Anleitung.pdf"
            target="_blank"
            rel="noopener"
            class="pdf-link"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="3"
                y="3"
                width="16"
                height="16"
                rx="3"
                stroke="#2563eb"
                stroke-width="2"
              />
              <path
                d="M7 8h5M7 11h8M7 14h8"
                stroke="#2563eb"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Anleitung als PDF öffnen
          </a>
        </div>
        <div class="shop-link-wrapper">
          <a href="/shop" class="shop-link">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect
                x="3"
                y="6"
                width="16"
                height="13"
                rx="4"
                stroke="#2563eb"
                stroke-width="2"
              />
              <rect
                x="7"
                y="3"
                width="8"
                height="6"
                rx="2"
                fill="#fbbf24"
                stroke="#2563eb"
                stroke-width="2"
              />
              <circle cx="8" cy="17" r="1.2" fill="#2563eb" />
              <circle cx="14" cy="17" r="1.2" fill="#2563eb" />
            </svg>
            Würfel & Zubehör kaufen
          </a>
          <button
            class="icons-link-btn"
            @click="router.push('/icons')"
            title="Alle Icons anzeigen"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle
                cx="11"
                cy="11"
                r="10"
                stroke="#2563eb"
                stroke-width="2"
              />
              <path
                d="M7 11h8M11 7v8"
                stroke="#2563eb"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span class="icons-link-text">Icons</span>
          </button>
        </div>
      </section>
      <footer class="main-footer">
        <p>Viel Spaß beim kreativen Wortketten-Bilden! 🚀✏️</p>
        <p class="text-[8px]">© Boris Horn - 2025</p>
      </footer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useRouter} from 'vue-router';
import Logo from './Logo.vue';
const router = useRouter();
</script>

<style lang="scss" scoped>
body,
p,
.card,
.main,
.footer {
  font-family: 'Lora', serif;
}
.btn,
.chip,
.subtitle {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e3eaff 100%);
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  overflow-x: hidden;
}
.main-wrapper {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  padding: 3.2rem 1.2rem 2.7rem 1.2rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(60, 80, 180, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  justify-content: flex-start;
  gap: 2.2rem;
  box-sizing: border-box;
}
.main-header {
  text-align: center;
  margin-bottom: 2.2rem;
  padding: 2.2rem 1rem 1.5rem;
  color: #2563eb;
  background: #fff;
}
.main-header h1 {
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: 0.01em;
  margin-bottom: 0.2em;
  color: #1a1a2a;
  font-family: 'Poppins', 'Segoe UI', Arial, Helvetica, sans-serif;
}
.card,
.tip-box {
  width: 100%;
  max-width: 700px;
  background: #fff;
  color: #23243a;
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
.card:hover {
  box-shadow: 0 6px 24px rgba(60, 80, 180, 0.13);
}
.badge,
.jackpot-badge {
  color: #fff;
  background: linear-gradient(90deg, #2563eb 60%, #fbbf24 100%);
  border-radius: 1.2em;
  font-size: 0.98em;
  font-weight: 600;
  padding: 0.3em 1.1em;
  margin: 0.2em 0.5em 0.2em 0;
  box-shadow: 0 2px 8px #2563eb22;
  display: inline-block;
}
.points-table,
.example-table {
  width: 100%;
  min-width: 0;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.2rem 0 0.5rem 0;
  background: #fff;
  border-radius: 14px;
  overflow-x: auto;
  box-shadow: 0 1px 4px rgba(60, 80, 180, 0.06);
  font-size: 0.97em;
  box-sizing: border-box;
  display: block;
  max-width: 100%;
}
.points-table table,
.example-table table {
  min-width: 400px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}
.points-table th,
.example-table th {
  background: #e3eaff;
  color: #2575fc;
  font-weight: 700;
  padding: 0.7em 0.6em;
  font-size: 1em;
  border-bottom: 2px solid #d1d9f0;
}
.points-table td,
.example-table td {
  padding: 0.7em 0.6em;
  font-size: 0.97em;
  border-bottom: 1px solid #e6e6e6;
  color: #23243a;
}
.points-table tr:last-child td,
.example-table tr:last-child td {
  border-bottom: none;
}
.tip-box {
  background: linear-gradient(90deg, #e6f7ee 0%, #e3f9ff 100%);
  border-left: 6px solid #2ecc71;
  color: #23243a;
  font-size: 0.99rem;
}
.main-footer {
  color: #555;
  font-size: 0.98rem;
  background: none;
  box-shadow: none;
  margin-top: 2.5rem;
  padding-bottom: 0.7em;
}
.play-btn {
  display: block;
  margin: 3.5rem auto 0 auto;
  padding: 1.3rem 2.7rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #2563eb 60%, #fbbf24 100%);
  background-size: 200% 100%;
  border: none;
  border-radius: 2rem;
  box-shadow: 0 4px 24px #2563eb33, 0 0 0 0 #fbbf2444;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
  animation: gradient-shift 3s ease-in-out infinite;
}
.play-btn:active {
  transform: scale(0.97);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.pdf-link-wrapper {
  display: flex;
  justify-content: center;
  margin: 2.5rem 0 1.5rem 0;
}
.pdf-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #f1f5f9;
  border: 1.5px solid #2563eb;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  color: #2563eb;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 2px 8px #2563eb11;
  transition: background 0.2s, box-shadow 0.2s;
}
.pdf-link:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb22;
}
.shop-link-wrapper {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 1.5rem 0;
}

.icons-link-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f1f5f9;
  border: 1.5px solid #2563eb;
  border-radius: 1.5rem;
  padding: 0.4rem 1.1rem 0.4rem 0.7rem;
  color: #2563eb;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px #2563eb11;
  transition: background 0.2s, box-shadow 0.2s;
}

.icons-link-btn:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb22;
}

.icons-link-text {
  font-size: 1rem;
  font-weight: 500;
}
.shop-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #f1f5f9;
  border: 1.5px solid #2563eb;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  color: #2563eb;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 2px 8px #2563eb11;
  transition: background 0.2s, box-shadow 0.2s;
}
.shop-link:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px #2563eb22;
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
@media (max-width: 700px) {
  .main-wrapper {
    max-width: 100%;
    width: 100%;
    padding: 1.2rem 0.7rem 2.5rem 0.7rem;
    gap: 1.7rem;
    border-radius: 18px;
    box-sizing: border-box;
  }
  .main-header {
    padding: 1.3rem 0.7rem 1.1rem 0.7rem;
    border-radius: 14px;
  }
  .main-header h1 {
    font-size: 1.45rem;
  }
  .card,
  .tip-box {
    max-width: 100%;
    width: 100%;
    padding: 1.2rem 0.8rem 1.1rem 0.8rem;
    border-radius: 14px;
    font-size: 0.98rem;
    box-sizing: border-box;
  }
  .points-table,
  .example-table {
    font-size: 0.95em;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow-x: auto;
  }
  .main-footer {
    font-size: 0.95rem;
    margin-top: 1.2rem;
  }
  .play-btn {
    font-size: 1.08rem;
    padding: 1.1rem 1.7rem;
    margin-top: 2.2rem;
  }
}
@media (max-width: 430px) {
  .main-wrapper {
    max-width: 100%;
    width: 100%;
    padding: 0.7rem 0rem 1.2rem 0rem;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .main-header {
    padding: 0.8rem 0.3rem 0.7rem 0.3rem;
    border-radius: 8px;
  }
  .main-header h1 {
    font-size: 1.1rem;
  }
  .card,
  .tip-box {
    max-width: 100%;
    width: 100%;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
    border-radius: 8px;
    font-size: 0.95rem;
    box-sizing: border-box;
  }
  .main-footer {
    font-size: 0.93rem;
    margin-top: 0.7rem;
    padding: 1rem;
  }
  .play-btn {
    font-size: 0.98rem;
    padding: 0.8rem 1.1rem;
    margin-top: 1.2rem;
  }
}
</style>
