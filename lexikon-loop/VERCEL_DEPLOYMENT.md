# 🚀 Vercel Deployment Guide

## 📋 Übersicht

Diese Anleitung zeigt, wie du die Lexikon-Loop Multiplayer-App auf Vercel deployst.

## 🔧 Vorbereitung

### 1. Externer WebSocket-Service einrichten

Da Vercel keine persistenten WebSocket-Server unterstützt, benötigst du einen externen Service:

#### Option A: Heroku (Empfohlen)

```bash
# 1. Heroku CLI installieren
# 2. Neues Projekt erstellen
heroku create your-socket-service

# 3. Server deployen
git push heroku main

# 4. URL notieren
# https://your-socket-service.herokuapp.com
```

#### Option B: Railway

```bash
# 1. Railway Account erstellen
# 2. GitHub Repository verbinden
# 3. Environment Variables setzen
# 4. Deploy
```

#### Option C: Render

```bash
# 1. Render Account erstellen
# 2. Web Service erstellen
# 3. GitHub Repository verbinden
# 4. Deploy
```

### 2. Environment Variables setzen

In deinem Vercel-Projekt:

```bash
# Vercel CLI
vercel env add SOCKET_URL
# Wert: https://your-socket-service.herokuapp.com

# Oder über Vercel Dashboard
# Settings → Environment Variables
```

### 3. Server für externen Service anpassen

Erstelle eine separate `package.json` für den Server:

```json
{
  "name": "lexikon-loop-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": "18.x"
  }
}
```

## 🚀 Deployment-Schritte

### 1. Vercel CLI installieren

```bash
npm i -g vercel
```

### 2. Projekt verknüpfen

```bash
vercel
```

### 3. Environment Variables setzen

```bash
vercel env add SOCKET_URL
# https://your-socket-service.herokuapp.com
```

### 4. Deploy

```bash
vercel --prod
```

## 🔧 Konfiguration

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "SOCKET_URL": "https://your-socket-service.herokuapp.com"
  }
}
```

### Environment Variables

```bash
# Production
SOCKET_URL=https://your-socket-service.herokuapp.com

# Development
SOCKET_URL_DEV=http://localhost:3001
```

## 🎯 Deployment-Optionen

### Option 1: Vercel + Heroku (Empfohlen)

- **Frontend**: Vercel (statisch)
- **Backend**: Heroku (WebSocket-Server)
- **Vorteile**: Einfach, kostenlos, skalierbar

### Option 2: Vercel + Railway

- **Frontend**: Vercel
- **Backend**: Railway
- **Vorteile**: Schnell, modern, gute Performance

### Option 3: Vercel + Render

- **Frontend**: Vercel
- **Backend**: Render
- **Vorteile**: Einfach, zuverlässig

## 🔍 Testing

### 1. Local Testing

```bash
# Terminal 1: Server
npm run server

# Terminal 2: Client
npm run dev

# Terminal 3: Vercel Preview
vercel
```

### 2. Production Testing

```bash
# Deploy
vercel --prod

# Test Multiplayer
# 1. Host starten
# 2. QR-Code scannen
# 3. Verbindung testen
```

## 🚨 Troubleshooting

### Problem: Socket-Verbindung fehlschlägt

```javascript
// Lösung: CORS konfigurieren
// server.js
const io = socketIo(server, {
  cors: {
    origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});
```

### Problem: Environment Variables nicht verfügbar

```javascript
// Lösung: Fallback verwenden
const socketUrl =
  process.env.SOCKET_URL || 'https://your-socket-service.herokuapp.com';
```

### Problem: Build-Fehler

```bash
# Lösung: Dependencies prüfen
npm install
npm run build
```

## 📊 Monitoring

### Vercel Analytics

- **Deployments**: Automatische Builds
- **Performance**: Core Web Vitals
- **Errors**: Error Tracking

### Server Monitoring

```bash
# Heroku Logs
heroku logs --tail

# Railway Logs
railway logs

# Render Logs
# Dashboard → Logs
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Nächste Schritte

### Geplante Verbesserungen

- [ ] WebRTC für P2P-Verbindungen
- [ ] Redis für Skalierung
- [ ] Load Balancing
- [ ] CDN-Integration
- [ ] Analytics Dashboard

### Performance-Optimierungen

- [ ] Code Splitting
- [ ] Lazy Loading
- [ ] Service Worker
- [ ] PWA-Features

---

**Viel Erfolg beim Deployment! 🚀✨**

## 🎯 **Render-Deployment starten**:

### **1. Render Account erstellen**

- **Gehe zu**: https://render.com
- **"Get Started" klicken**
- **Mit GitHub einloggen** (empfohlen)
- **Account erstellen**

### **2. Web Service erstellen**

1. **Dashboard öffnen**
2. **"New" → "Web Service"**
3. **GitHub Repository verbinden**
4. **Repository auswählen**: `deepsoul/lexikon-loop-server`
5. **Konfiguration**:
   - **Name**: `lexikon-loop-server`
   - **Root Directory**: `.` (da wir im Server-Ordner sind)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### **3. Environment Variables setzen**

1. **Service erstellen**
2. **"Environment" Tab**
3. **Variables hinzufügen**:
   ```
   NODE_ENV=production
   PORT=3001
   ```

### **4. Deploy starten**

1. **"Create Web Service" klicken**
2. **Deployment abwarten** (2-3 Minuten)
3. **URL notieren** (z.B. `https://lexikon-loop-server.onrender.com`)

## 🔍 **Nach dem Deployment testen**:

### **1. Server testen**

```bash
# Render URL öffnen
https://lexikon-loop-server.onrender.com/health

# Sollte zurückgeben:
{
  "status": "ok",
  "rooms": 0,
  "connections": 0
}
```

### **2. Vercel konfigurieren**

1. **Vercel Dashboard öffnen**
2. **Project Settings → Environment Variables**
3. **Variable hinzufügen**:
   ```
   Name: SOCKET_URL
   Value: https://lexikon-loop-server.onrender.com
   ```

### **3. Multiplayer testen**

1. **Vercel App öffnen**
2. **"🏠 Als Host starten"**
3. **QR-Code scannen**
4. **Verbindung prüfen**

## 📊 **Monitoring während des Deployments**:

### **Render Dashboard**:

- **Deployments**: Automatische Builds
- **Logs**: Echtzeit-Logs
- **Metrics**: Performance-Daten

### **Health Check**:

```bash
curl https://lexikon-loop-server.onrender.com/health
```

## 🚨 **Falls Probleme auftreten**:

### **Problem: Build fehlschlägt**

- **Lösung**: Dependencies sind korrekt in `package.json`
- **Lösung**: `render.yaml` ist konfiguriert

### **Problem: Server startet nicht**

- **Lösung**: Logs in Render Dashboard prüfen
- **Lösung**: Environment Variables prüfen

### **Problem: CORS-Fehler**

- **Lösung**: CORS ist in `server.js` konfiguriert
- **Lösung**: Vercel-Domains sind erlaubt

### **Problem: Socket-Verbindung fehlschlägt**

- **Lösung**: `SOCKET_URL` in Vercel prüfen
- **Lösung**: Render-URL ist korrekt

## 🎯 **Erwartetes Ergebnis**:

### **✅ Nach erfolgreichem Deployment**:

- **Render-URL**: `https://lexikon-loop-server.onrender.com`
- **Health Check**: Funktioniert
- **Vercel-Integration**: Socket-URL gesetzt
- **Multiplayer**: Vollständig funktionsfähig

**Starte jetzt das Render-Deployment und lass mich wissen, wenn du die URL hast! 🚀✨**
