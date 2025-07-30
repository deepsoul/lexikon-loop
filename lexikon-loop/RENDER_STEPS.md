# 🚀 Render Deployment - Schritt-für-Schritt

## ✅ **Vorbereitung abgeschlossen**

### **GitHub Repository**:

```
https://github.com/deepsoul/lexikon-loop-server
```

### **Server-Struktur**:

```
lexikon-loop-server/
├── server.js          # WebSocket-Server
├── package.json       # Dependencies
├── render.yaml        # Render-Konfiguration
└── .git/             # Git-Repository
```

## 🎯 **Render Deployment-Schritte**

### **1. Render Account erstellen**

1. **Gehe zu**: https://render.com
2. **"Get Started" klicken**
3. **Mit GitHub einloggen**
4. **Account erstellen**

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

### **5. Vercel konfigurieren**

1. **Vercel Dashboard öffnen**
2. **Project Settings → Environment Variables**
3. **Variable hinzufügen**:
   ```
   Name: SOCKET_URL
   Value: https://lexikon-loop-server.onrender.com
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

## 📊 **Monitoring**

### **Render Dashboard**:

- **Deployments**: Automatische Builds
- **Logs**: Echtzeit-Logs
- **Metrics**: Performance-Daten

### **Health Check**:

```bash
curl https://lexikon-loop-server.onrender.com/health
```

## 🎯 **Vorteile dieser Lösung**

### **✅ Saubere Trennung**:

- **Frontend**: `deepsoul/lexikon-loop` (Vercel)
- **Backend**: `deepsoul/lexikon-loop-server` (Render)

### **✅ Einfaches Deployment**:

- **Automatische Deployments** bei Git-Push
- **Separate Logs** für Frontend und Backend
- **Unabhängige Skalierung**

### **✅ Kostenlos**:

- **Render**: 750 Stunden/Monat kostenlos
- **Vercel**: Kostenlos für kleine Projekte
- **Keine Kreditkarte** erforderlich

## 🚀 **Nächste Schritte**

### **1. Render Account erstellen**

### **2. Web Service konfigurieren**

### **3. Deploy starten**

### **4. Vercel Environment Variable setzen**

### **5. Multiplayer testen**

---

**Viel Erfolg beim Render-Deployment! 🚀✨**
