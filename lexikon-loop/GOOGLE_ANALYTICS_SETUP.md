# Google Analytics Setup für Lexikon Loop

## 🎯 Übersicht

Diese Anleitung zeigt dir, wie du Google Analytics 4 (GA4) in dein Lexikon Loop Projekt einbindest, um Besucherzahlen zu tracken und zu analysieren.

## 📋 Voraussetzungen

- Google-Konto
- Zugriff auf deine Website
- Bereitschaft, Tracking-Code einzubinden

## 🚀 Schritt-für-Schritt Anleitung

### 1. Google Analytics Konto erstellen

#### 1.1 Konto einrichten

1. Gehe zu [analytics.google.com](https://analytics.google.com)
2. Melde dich mit deinem Google-Konto an
3. Klicke auf **"Konto erstellen"**
4. Gib einen Kontonamen ein: **"Lexikon Loop"**
5. Wähle deine Datenfreigabe-Einstellungen (empfohlen: Standard)
6. Klicke auf **"Weiter"**

#### 1.2 Property erstellen

1. Gib einen Property-Namen ein: **"Lexikon Loop Website"**
2. Wähle deine Zeitzone: **"Europe/Berlin"**
3. Wähle deine Währung: **"EUR"**
4. Klicke auf **"Weiter"**

#### 1.3 Business-Informationen

1. Wähle deine Branche: **"Spiele"**
2. Wähle deine Business-Ziele:
   - ✅ Traffic generieren
   - ✅ Nutzerengagement steigern
   - ✅ Conversion-Tracking
3. Klicke auf **"Erstellen"**

### 2. Tracking-Code konfigurieren

#### 2.1 Measurement ID kopieren

1. Nach der Erstellung wirst du zu deiner Property weitergeleitet
2. Kopiere deine **Measurement ID** (Format: G-XXXXXXXXXX)
3. Diese ID ersetzt `GA_MEASUREMENT_ID` in deinem Code

#### 2.2 Code in dein Projekt einbinden

Der Google Analytics Code ist bereits in deiner `index.html` eingebunden. Du musst nur:

1. Öffne `index.html`
2. Ersetze `GA_MEASUREMENT_ID` mit deiner echten Measurement ID
3. Beispiel: `gtag('config', 'G-ABC123DEF4');`

### 3. Erweiterte Tracking-Funktionen

#### 3.1 Custom Events für Spiele-Aktionen

Füge diese Events in deine Vue-Komponenten ein:

```javascript
// Spiel gestartet
gtag('event', 'game_started', {
  game_name: 'Lexikon Loop',
  player_count: playerCount,
});

// Spiel beendet
gtag('event', 'game_completed', {
  game_name: 'Lexikon Loop',
  duration: gameDuration,
  score: finalScore,
});

// Würfel geworfen
gtag('event', 'dice_rolled', {
  dice_type: diceType,
  letter: rolledLetter,
});
```

#### 3.2 E-Commerce Tracking (falls Shop)

```javascript
// Produkt angesehen
gtag('event', 'view_item', {
  currency: 'EUR',
  value: productPrice,
  items: [
    {
      item_id: productId,
      item_name: productName,
      price: productPrice,
    },
  ],
});
```

### 4. Datenschutz und DSGVO

#### 4.1 Cookie-Banner einrichten

Erstelle eine Cookie-Einwilligung, bevor Analytics lädt:

```javascript
// Cookie-Consent prüfen
if (localStorage.getItem('analytics_consent') === 'true') {
  // Google Analytics laden
  loadGoogleAnalytics();
} else {
  // Cookie-Banner anzeigen
  showCookieBanner();
}
```

#### 4.2 Datenschutzerklärung aktualisieren

Füge diese Informationen in deine Datenschutzerklärung ein:

- Verwendung von Google Analytics
- Zweck der Datenerhebung
- Möglichkeit zur Deaktivierung
- Link zu Google's Datenschutzrichtlinien

### 5. Dashboard und Berichte einrichten

#### 5.1 Standard-Berichte

Nach dem Setup hast du automatisch Zugriff auf:

- **Echtzeit**: Aktuelle Besucher
- **Berichte**: Tägliche, wöchentliche, monatliche Statistiken
- **Zielgruppe**: Demografie, Interessen, Geräte
- **Akquisition**: Woher kommen deine Besucher
- **Verhalten**: Welche Seiten werden besucht

#### 5.2 Custom Dashboard erstellen

1. Gehe zu **"Berichte"** → **"Dashboards"**
2. Klicke auf **"Dashboard erstellen"**
3. Füge wichtige Metriken hinzu:
   - Besucher pro Tag
   - Seitenaufrufe
   - Durchschnittliche Sitzungsdauer
   - Absprungrate
   - Top-Seiten

### 6. Wichtige Metriken für Lexikon Loop

#### 6.1 Engagement-Metriken

- **Sitzungsdauer**: Wie lange spielen Besucher?
- **Seiten pro Sitzung**: Welche Bereiche werden erkundet?
- **Absprungrate**: Verlassen Besucher sofort die Startseite?

#### 6.2 Spiele-spezifische Metriken

- **Spiel-Starts**: Wie oft wird ein Spiel begonnen?
- **Spiel-Vervollständigung**: Wie viele Spiele werden zu Ende gespielt?
- **Wiederkehrende Besucher**: Kommen Spieler zurück?

### 7. Testing und Validierung

#### 7.1 Google Analytics Debugger

1. Installiere die Chrome-Erweiterung "Google Analytics Debugger"
2. Öffne deine Website
3. Prüfe die Konsole auf Tracking-Events

#### 7.2 Real-Time Berichte

1. Gehe zu **"Echtzeit"** → **"Übersicht"**
2. Öffne deine Website in einem anderen Tab
3. Prüfe, ob der Besuch angezeigt wird

### 8. Häufige Probleme und Lösungen

#### 8.1 Keine Daten in GA4

- Prüfe, ob der Tracking-Code korrekt eingebunden ist
- Warte 24-48 Stunden für erste Daten
- Prüfe Browser-Console auf JavaScript-Fehler

#### 8.2 DSGVO-Verstöße vermeiden

- Cookie-Banner vor Analytics-Laden
- Opt-out Möglichkeit anbieten
- Datenschutzerklärung aktuell halten

## 🔧 Nächste Schritte

1. **Google Analytics Konto erstellen** (15 Min)
2. **Measurement ID in Code einfügen** (5 Min)
3. **Custom Events für Spiele hinzufügen** (30 Min)
4. **Cookie-Banner implementieren** (45 Min)
5. **Dashboard einrichten** (20 Min)

## 📚 Nützliche Links

- [Google Analytics Hilfe](https://support.google.com/analytics/)
- [GA4 Events Guide](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [DSGVO-konforme Analytics](https://www.datenschutz.org/google-analytics-dsgvo/)

## 💡 Tipps

- **Starte klein**: Beginne mit den Standard-Berichten
- **Regelmäßig prüfen**: Schaue dir die Daten wöchentlich an
- **A/B-Tests**: Teste verschiedene Spiele-Features
- **Mobile-First**: Achte besonders auf mobile Nutzer
- **Datenschutz**: Halte deine DSGVO-Compliance aktuell

---

**Zeitaufwand**: 2-3 Stunden für komplette Einrichtung
**Kosten**: Kostenlos (Google Analytics 4)
**ROI**: Besseres Verständnis deiner Nutzer und Optimierungspotential
