<script setup>
// Keine Logik nötig
</script>

<template>
  <div class="main-wrapper">
    <header class="main-header">
      <h1>Lexikon-Loop</h1>
      <h3>das Buchstaben-Ketten-Würfelspiel</h3>
      <div class="subtitle">
        Stadt · Land · Fluss · Name · Tier ·
        <span class="jackpot-badge">JACKPOT!</span>
      </div>
    </header>

    <section class="card">
      <h2>📦 Spielmaterial</h2>
      <ul>
        <li>
          <span class="icon">🎲</span> 1 Spezialwürfel mit den Seiten:
          <strong>Stadt</strong>, <strong>Land</strong>, <strong>Fluss</strong>,
          <strong>Name</strong>, <strong>Tier</strong>,
          <strong>JACKPOT!</strong>
        </li>
        <li><span class="icon">✏️</span> Stift und Papier für Punkte</li>
        <li>
          <span class="icon">⏲️</span> Timer (Smartphone oder Sanduhr, optional)
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
      <div class="badges">
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
          <ul>
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
            <li>Würfelt erneut</li>
            <li>
              Finde einen Begriff für die gewürfelte Kategorie, der mit dem
              <strong>letzten Buchstaben</strong> des vorherigen Wortes beginnt
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
          >* Wenn niemand nach 30 Sekunden einen Begriff nennen kann, erhält der
          letzte erfolgreiche Spieler 1 Extrapunkt</small
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
          Nutzt die <strong>JACKPOT!</strong>-Runden strategisch, um schwierige
          Buchstaben zu setzen!
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
        Nach vereinbarten Runden (z.B. 5 Runden pro Spieler) gewinnt der Spieler
        mit den meisten Punkten! Bei Gleichstand entscheidet eine Blitzrunde mit
        JACKPOT!-Würfen.
      </p>
    </section>

    <footer class="main-footer">
      <p>Viel Spaß beim kreativen Wortketten-Bildung! 🚀✏️</p>
      <p>Spielregeln © Boris Horn, 2025</p>
      <p>Druckempfehlung: Auf festem Papier (120-160 g/m²) ausdrucken</p>
    </footer>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
