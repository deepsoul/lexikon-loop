# 🎮 Lexikon-Loop Multiplayer Setup

## 🚀 Schnellstart

### 1. Server starten

```bash
npm run server
```

Der Multiplayer-Server läuft dann auf `http://localhost:3001`

### 2. Client starten

```bash
npm run dev
```

Die Web-App läuft dann auf `http://localhost:5173`

## 🔧 Multiplayer-Funktionen

### ✅ Echte WebSocket-Verbindung

- **Socket.IO Server**: Echtzeit-Kommunikation
- **Room-basiert**: Jeder Host erstellt einen Raum
- **Synchronisierte Spiele**: Alle Spieler sehen das gleiche

### ✅ Vollständige Spielsynchronisation

- **Würfel-Ergebnisse**: Werden an alle Spieler gesendet
- **Spieler-Züge**: Automatische Weitergabe
- **Punkte-Updates**: Sofortige Synchronisation
- **Sprach-Erkennung**: Ergebnisse werden geteilt
- **Timer-Synchronisation**: Alle Spieler haben den gleichen Timer

### ✅ Host-Funktionen

1. **"🏠 Als Host starten"** klicken
2. **QR-Code wird generiert** mit Raum-ID
3. **Andere Spieler scannen** den QR-Code
4. **Automatische Verbindung** aller Spieler

### ✅ Client-Funktionen

1. **QR-Code scannen** → Öffnet `/join?host=room_id`
2. **Spielername eingeben** → "Max", "Anna", etc.
3. **"🔗 Spiel beitreten"** klicken
4. **Automatischer Redirect** zu `/lets-play`
5. **Multiplayer-Status** wird angezeigt

## 🎯 WebSocket-Events

### 📤 Client → Server

- `joinRoom`: Spieler tritt Raum bei
- `rollDice`: Würfel wird geworfen
- `updateScore`: Punkte werden aktualisiert
- `switchPlayer`: Spieler-Wechsel
- `speechResult`: Sprach-Erkennung Ergebnis
- `timerUpdate`: Timer-Updates

### 📥 Server → Client

- `playerJoined`: Neuer Spieler beigetreten
- `diceRolled`: Würfel-Ergebnis
- `diceStopped`: Würfel-Animation beendet
- `scoreUpdated`: Punkte aktualisiert
- `playerTurnChanged`: Spieler-Zug gewechselt
- `speechRecognized`: Sprach-Erkennung geteilt
- `timerUpdated`: Timer synchronisiert
- `playerLeft`: Spieler verlassen

## 🔍 Debugging

### Server-Logs

```bash
npm run server
```

Zeigt:

- Verbindungen/Disconnect
- Raum-Erstellung/Löschung
- Event-Handling

### Client-Logs

Browser-Konsole zeigt:

- WebSocket-Verbindung
- Event-Empfang
- Spiel-Status

### Health Check

```bash
curl http://localhost:3001/health
```

Zeigt Server-Status und aktive Räume.

## 🛠️ Technische Details

### Server (server.js)

- **Express.js**: HTTP-Server
- **Socket.IO**: WebSocket-Bibliothek
- **CORS**: Cross-Origin-Unterstützung
- **Room-Management**: Spiel-Räume verwalten

### Client (LetsPlay.vue)

- **Socket.IO-Client**: WebSocket-Verbindung
- **Event-Handling**: Server-Events verarbeiten
- **State-Synchronisation**: Spiel-Status teilen
- **QR-Code-Integration**: Raum-Beitritt

### JoinGame.vue

- **URL-Parameter**: Host-ID aus URL extrahieren
- **localStorage**: Datenübertragung zum Hauptspiel
- **Responsive Design**: Mobile-optimiert

## 🎮 Spielablauf

### 1. Host startet Spiel

```
Host: QR-Code generieren → Raum erstellen → Warten auf Spieler
```

### 2. Clients beitreten

```
Client: QR-Code scannen → Spielername eingeben → Raum beitreten
```

### 3. Echtzeit-Spiel

```
Alle: Würfeln → Ergebnisse synchronisieren → Züge wechseln → Punkte teilen
```

### 4. Spiel beenden

```
Host/Client: Verbindung trennen → Raum löschen → Zurück zum Menü
```

## 🔧 Konfiguration

### Server-Port ändern

```javascript
// server.js
const PORT = process.env.PORT || 3001;
```

### Client-Server-URL ändern

```javascript
// LetsPlay.vue
socket = io('http://localhost:3001');
```

## 🚨 Fehlerbehebung

### Server startet nicht

- Port 3001 bereits belegt?
- Node.js installiert?
- Dependencies installiert?

### Client verbindet nicht

- Server läuft?
- CORS-Einstellungen korrekt?
- Firewall blockiert?

### QR-Code funktioniert nicht

- HTTPS erforderlich für Kamera?
- Browser-Berechtigungen?
- QR-Code-Library installiert?

## 🎯 Nächste Schritte

### Geplante Features

- [ ] Voice-Chat Integration
- [ ] Spiel-Historie
- [ ] Statistiken
- [ ] Turnier-Modus
- [ ] Custom-Kategorien

### Performance-Optimierungen

- [ ] WebRTC für P2P
- [ ] Redis für Skalierung
- [ ] Load Balancing
- [ ] CDN-Integration

---

**Viel Spaß beim Multiplayer-Spielen! 🎮✨**
