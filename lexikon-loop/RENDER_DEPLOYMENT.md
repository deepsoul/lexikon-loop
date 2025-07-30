# 🚀 Render Deployment Guide

## 📋 **Schritt-für-Schritt Anleitung**

### **1. Render Account erstellen**

1. **Gehe zu**: https://render.com
2. **"Get Started" klicken**
3. **Mit GitHub einloggen** (empfohlen)
4. **Account erstellen**

### **2. Web Service erstellen**

1. **Dashboard öffnen**
2. **"New" → "Web Service"**
3. **GitHub Repository verbinden**
4. **Repository auswählen**: `lexikon-loop`
5. **Konfiguration**:
   - **Name**: `lexikon-loop-server`
   - **Root Directory**: `lexikon-loop-server`
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

### **5. Vercel konfigurieren**

1. **Vercel Dashboard öffnen**
2. **Project Settings → Environment Variables**
3. **Variable hinzufügen**:
   ```
   Name: SOCKET_URL
   Value: https://lexikon-loop-server.onrender.com
   ```

## 🔧 **Technische Details**

### **Render-Konfiguration**:

```yaml
# render.yaml (optional)
services:
  - type: web
    name: lexikon-loop-server
    env: node
    buildCommand: npm install
    startCommand: npm start
    rootDir: lexikon-loop-server
```

### **Server-Konfiguration**:

```javascript
// server.js
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS für Render
const io = socketIo(server, {
  cors: {
    origin: [
      'https://lexikon-loop.vercel.app',
      'https://lexikon-loop-git-main.vercel.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
```

## 🎯 **Deployment-Schritte**

### **1. Repository vorbereiten**

```bash
# Im lexikon-loop-server Ordner
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### **2. Render Dashboard**

1. **"New Web Service"**
2. **GitHub Repository verbinden**
3. **Konfiguration**:
   - **Name**: `lexikon-loop-server`
   - **Root Directory**: `lexikon-loop-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### **3. Environment Variables**

```bash
NODE_ENV=production
PORT=3001
```

### **4. Deploy**

1. **"Create Web Service"**
2. **Deployment abwarten**
3. **URL kopieren**

### **5. Vercel konfigurieren**

```bash
# Vercel CLI
vercel env add SOCKET_URL
# Wert: https://lexikon-loop-server.onrender.com

# Oder Vercel Dashboard
# Settings → Environment Variables
```

## 🔍 **Testing**

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

### **2. Multiplayer testen**

1. **Vercel App öffnen**
2. **"🏠 Als Host starten"**
3. **QR-Code scannen**
4. **Verbindung prüfen**

## 🚨 **Troubleshooting**

### **Problem: Build fehlschlägt**

```bash
# Lösung: Dependencies prüfen
cd lexikon-loop-server
npm install
npm start
```

### **Problem: Server startet nicht**

```bash
# Lösung: Logs prüfen
# Render Dashboard → Logs
```

### **Problem: CORS-Fehler**

```javascript
// Lösung: CORS-Origin hinzufügen
origin: ['https://your-vercel-app.vercel.app', 'http://localhost:5173'];
```

### **Problem: Socket-Verbindung fehlschlägt**

```bash
# Lösung: Environment Variable prüfen
# Vercel Dashboard → Environment Variables
# SOCKET_URL = https://lexikon-loop-server.onrender.com
```

## 📊 **Monitoring**

### **Render Dashboard**:

- **Deployments**: Automatische Builds
- **Logs**: Echtzeit-Logs
- **Metrics**: Performance-Daten

### **Health Check**:

```bash
curl https://lexikon-loop-server.onrender.com/health
```

## 🎯 **Vorteile von Render**

### **✅ Kostenlos**:

- **750 Stunden/Monat** kostenlos
- **Automatisches Sleep** nach Inaktivität
- **Keine Kreditkarte** erforderlich

### **✅ Einfach**:

- **Web-Interface** statt CLI
- **GitHub-Integration**
- **Automatisches HTTPS**

### **✅ Zuverlässig**:

- **99.9% Uptime**
- **Automatische Deployments**
- **Gute Dokumentation**

## 🚀 **Nächste Schritte**

### **1. Render Account erstellen**

### **2. Web Service konfigurieren**

### **3. Deploy starten**

### **4. Vercel Environment Variable setzen**

### **5. Multiplayer testen**

---

**Viel Erfolg beim Render-Deployment! 🚀✨**
