# 🎲 Lexikon-Loop - Multiplayer Wortketten-Spiel

Ein digitales Wortketten-Spiel mit **Multiplayer-Funktionalität** über WebSockets und QR-Code-Verbindung.

## 🚀 Schnellstart

### 1. Setup (einmalig)

```bash
npm run setup
```

### 2. Spiel und Server starten

```bash
npm start
```

Das startet **automatisch**:

- 🎮 **Frontend** (Vue.js) auf `http://localhost:5173`
- 🔌 **WebSocket Server** auf `http://localhost:3000`

## 📋 Verfügbare Befehle

```bash
# Komplettes Setup (Frontend + Server Dependencies)
npm run setup

# Spiel und Server parallel starten
npm start

# Nur Frontend starten
npm run dev

# Nur Server starten
npm run server

# Server Dependencies installieren
npm run server:install

# Build für Production
npm run build

# Production Preview
npm run preview
```

## 🎮 Multiplayer-Funktionen

### Host-Modus

1. **"Als Host starten"** klicken
2. **QR-Code** wird generiert
3. **Spieler scannen** QR-Code oder nutzen Host-ID
4. **Alle verbinden** sich automatisch

### Client-Modus

1. **QR-Code scannen** oder Host-ID eingeben
2. **Spielername** eingeben
3. **Automatische Weiterleitung** zum Spiel

## 🎯 Spielmechanik

### Neue Validierung

- **REST-API entfernt** (zu fehleranfällig)
- **Manuelle Validierung** mit zwei Buttons:
  - ✅ **"Wort genehmigen"** → +1 Punkt
  - ❌ **"Wort ablehnen"** → -1 Punkt
- **Automatischer Spielerwechsel** nach Validierung

### Spielablauf

1. **Spieler würfelt** → Kategorie + Buchstabe
2. **Spieler spricht** → Wort wird erkannt
3. **Host validiert** → ✅ Genehmigen oder ❌ Ablehnen
4. **Punkte werden vergeben/abgezogen**
5. **Nächster Spieler** ist automatisch dran

## 🏗️ Projektstruktur

```
lexikon-loop/
├── src/                    # Vue.js Frontend
│   ├── components/         # Vue Komponenten
│   │   ├── LetsPlay.vue   # Hauptspiel-Komponente
│   │   └── JoinGame.vue   # Multiplayer-Beitritt
│   ├── utils/             # Utilities
│   │   └── socket.js      # WebSocket Utilities
│   └── router.js          # Vue Router
├── lexikon-loop-server/   # WebSocket Server
│   ├── server.js          # Socket.IO Server
│   └── package.json       # Server Dependencies
├── api/                   # Vercel API Routes
│   └── socket-config.js   # Socket URL Config
└── package.json           # Frontend Dependencies
```

## 🔧 Technologie-Stack

### Frontend

- **Vue.js 3** - Reactivity & Components
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Socket.IO Client** - WebSocket Communication
- **QRCode** - QR Code Generation
- **HTML5-QRCode** - QR Code Scanning

### Backend

- **Node.js** - Runtime
- **Express** - HTTP Server
- **Socket.IO** - WebSocket Server
- **CORS** - Cross-Origin Support

## 🌐 Deployment

### Frontend (Vercel)

- **Automatisches Deployment** via GitHub
- **HTTPS** und **CDN** inklusive
- **Preview Deployments** für Branches

### Backend (Render)

- **WebSocket Server** auf Render.com
- **Automatische SSL** Konfiguration
- **CORS** für Vercel Domains

## 🐛 Debugging

### Multiplayer-Probleme

1. **Browser Console** öffnen
2. **WebSocket Events** überwachen
3. **Server Logs** auf Render prüfen

### Häufige Probleme

- **QR-Code nicht generiert** → Browser Console prüfen
- **Verbindung fehlgeschlagen** → Server Status prüfen
- **Spieler nicht synchronisiert** → WebSocket Events prüfen

## 📱 Mobile Support

- **iOS & Android** kompatibel
- **QR-Code Scanning** direkt im Browser
- **Touch-optimierte UI**
- **Responsive Design**

## 🎨 Features

- **Real-time Multiplayer** über WebSockets
- **QR-Code Verbindung** für einfache Teilnahme
- **Sprach-Eingabe** mit Browser Speech API
- **Manuelle Wort-Validierung** mit Punktevergabe
- **Prominente Spieler-Reihenfolge** Anzeige
- **Automatischer Spielerwechsel**
- **Verwendete Wörter Liste** verhindert Duplikate
- **Mobile & Desktop optimiert**

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

---

**Viel Spaß beim Spielen! 🎲✨**
