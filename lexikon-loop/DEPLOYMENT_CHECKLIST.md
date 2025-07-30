# ✅ Vercel Deployment Checklist

## 🔧 Vorbereitung

### [ ] 1. Externer WebSocket-Service einrichten

- [ ] Heroku Account erstellen
- [ ] Neues Heroku-Projekt erstellen
- [ ] Server deployen
- [ ] URL notieren (z.B. `https://your-socket-service.herokuapp.com`)

### [ ] 2. Vercel-Projekt vorbereiten

- [ ] Vercel CLI installieren: `npm i -g vercel`
- [ ] Projekt verknüpfen: `vercel`
- [ ] Environment Variables setzen

### [ ] 3. Environment Variables konfigurieren

```bash
# Vercel CLI
vercel env add SOCKET_URL
# Wert: https://your-socket-service.herokuapp.com

# Oder über Vercel Dashboard
# Settings → Environment Variables
```

## 🚀 Deployment-Schritte

### [ ] 1. Frontend deployen

```bash
# Build testen
npm run build

# Deploy
vercel --prod
```

### [ ] 2. Backend deployen

```bash
# Server-Ordner erstellen
mkdir lexikon-loop-server
cd lexikon-loop-server

# Server-Dateien kopieren
cp ../server.js .
cp ../server-package.json package.json

# Heroku deployen
heroku create your-socket-service
git init
git add .
git commit -m "Initial server deployment"
git push heroku main
```

### [ ] 3. Verbindung testen

- [ ] Frontend läuft auf Vercel
- [ ] Backend läuft auf Heroku
- [ ] Socket-Verbindung funktioniert
- [ ] Multiplayer-Spiel testen

## 🔍 Testing

### [ ] 1. Local Testing

```bash
# Terminal 1: Server
npm run server

# Terminal 2: Client
npm run dev

# Browser: http://localhost:5173
# Multiplayer testen
```

### [ ] 2. Production Testing

```bash
# Vercel URL öffnen
# https://your-app.vercel.app

# Multiplayer testen:
# 1. Host starten
# 2. QR-Code scannen
# 3. Verbindung prüfen
```

### [ ] 3. Cross-Platform Testing

- [ ] Desktop Browser (Chrome, Firefox, Safari)
- [ ] Mobile Browser (iOS Safari, Android Chrome)
- [ ] QR-Code-Scanning funktioniert
- [ ] WebSocket-Verbindung stabil

## 🚨 Troubleshooting

### [ ] Socket-Verbindung fehlschlägt

- [ ] CORS-Einstellungen prüfen
- [ ] Environment Variables prüfen
- [ ] Server-Logs checken: `heroku logs --tail`

### [ ] Build-Fehler

- [ ] Dependencies prüfen: `npm install`
- [ ] Build testen: `npm run build`
- [ ] Vercel-Logs prüfen

### [ ] QR-Code funktioniert nicht

- [ ] HTTPS erforderlich für Kamera
- [ ] Browser-Berechtigungen prüfen
- [ ] QR-Code-Library installiert

## 📊 Monitoring

### [ ] Vercel Analytics

- [ ] Deployments erfolgreich
- [ ] Performance-Metriken
- [ ] Error-Tracking aktiv

### [ ] Server Monitoring

- [ ] Heroku Logs überwachen
- [ ] Connection-Counts prüfen
- [ ] Error-Rates überwachen

## 🔄 CI/CD

### [ ] GitHub Actions (Optional)

- [ ] Vercel Token generieren
- [ ] GitHub Secrets setzen
- [ ] Workflow erstellen
- [ ] Automatisches Deployment testen

## 🎯 Finale Checkliste

### [ ] Funktionalität

- [ ] ✅ Single Player funktioniert
- [ ] ✅ Multiplayer Host starten
- [ ] ✅ QR-Code generieren
- [ ] ✅ Client beitreten
- [ ] ✅ Echtzeit-Synchronisation
- [ ] ✅ Spiel-Aktionen teilen
- [ ] ✅ Verbindung trennen

### [ ] Performance

- [ ] ✅ Ladezeiten akzeptabel
- [ ] ✅ WebSocket-Verbindung stabil
- [ ] ✅ Mobile Performance gut
- [ ] ✅ Cross-Browser kompatibel

### [ ] Security

- [ ] ✅ CORS korrekt konfiguriert
- [ ] ✅ Environment Variables sicher
- [ ] ✅ Keine sensiblen Daten im Code

### [ ] User Experience

- [ ] ✅ Responsive Design
- [ ] ✅ Intuitive Bedienung
- [ ] ✅ Fehlerbehandlung
- [ ] ✅ Loading-States

## 🚀 Go-Live Checkliste

### [ ] Finale Tests

- [ ] ✅ Production-URL testen
- [ ] ✅ Multiplayer-Spiel komplett durchspielen
- [ ] ✅ Mobile-Geräte testen
- [ ] ✅ Verschiedene Browser testen

### [ ] Dokumentation

- [ ] ✅ README aktualisiert
- [ ] ✅ Deployment-Guide erstellt
- [ ] ✅ Troubleshooting dokumentiert

### [ ] Monitoring

- [ ] ✅ Analytics aktiviert
- [ ] ✅ Error-Tracking konfiguriert
- [ ] ✅ Performance-Monitoring

---

**🎉 Deployment erfolgreich! 🚀✨**

**Nächste Schritte:**

1. Multiplayer-Spiel mit Freunden testen
2. Feedback sammeln
3. Features erweitern
4. Performance optimieren
