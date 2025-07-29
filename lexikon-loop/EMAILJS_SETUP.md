# EmailJS Setup für Lexikon-Loop Shop

## 📧 EmailJS Konfiguration

Das Shop-Formular ist mit EmailJS integriert. Folge diesen Schritten, um es funktionsfähig zu machen:

### 1. EmailJS Account erstellen

1. Gehe zu [emailjs.com](https://www.emailjs.com/)
2. Erstelle einen kostenlosen Account
3. Bestätige deine E-Mail-Adresse

### 2. Email Service einrichten

1. Gehe zu "Email Services" im Dashboard
2. Klicke auf "Add New Service"
3. Wähle "Gmail" oder "Outlook" aus
4. Verbinde dein E-Mail-Konto
5. Notiere die **Service ID** (z.B. `service_abc123`)

### 3. Email Template erstellen

1. Gehe zu "Email Templates" im Dashboard
2. Klicke auf "Create New Template"
3. Erstelle ein Template mit folgendem Inhalt:

```html
Neue Bestellung: Lexikon-Loop Würfel-Set Name: {{from_name}} E-Mail:
{{from_email}} Telefon: {{from_phone}} Adresse: {{from_address}} Nachricht:
{{message}} --- Gesendet über Lexikon-Loop Shop
```

4. Speichere das Template und notiere die **Template ID** (z.B. `template_xyz789`)

### 4. Public Key finden

1. Gehe zu "Account" → "API Keys"
2. Kopiere deinen **Public Key** (z.B. `user_def456`)

### 5. Konfiguration in Shop.vue aktualisieren

Ersetze in `src/components/Shop.vue` die Platzhalter:

```javascript
// EmailJS Konfiguration
const EMAILJS_SERVICE_ID = 'service_abc123'; // Deine Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Deine Template ID
const EMAILJS_PUBLIC_KEY = 'user_def456'; // Dein Public Key
```

### 6. Testen

1. Starte die Entwicklungsumgebung: `npm run dev`
2. Gehe zum Shop: `/shop`
3. Fülle das Formular aus und teste den Versand

## 🔧 Zusätzliche Konfiguration

### Automatische Antwort an Kunden

Erstelle ein zweites Template für automatische Bestätigungen:

```html
Bestätigung: Lexikon-Loop Bestellung Hallo {{from_name}}, vielen Dank für deine
Bestellung des Lexikon-Loop Würfel-Sets! Bestelldetails: - Lexikon-Loop
Würfel-Set: 14,99€ - Versand: 5,99€ - Gesamt: 20,98€ Wir werden uns innerhalb
von 24 Stunden mit den Zahlungsdetails melden. Liebe Grüße, Lexikon-Loop Team
```

### Sicherheit

- EmailJS ist sicher und verschlüsselt
- Keine sensiblen Daten werden gespeichert
- Alle E-Mails gehen über dein verifiziertes E-Mail-Konto

## 📱 Responsive Design

Das Formular ist bereits für alle Geräte optimiert:

- Desktop: Vollständige Ansicht
- Tablet: Angepasste Größen
- Mobile: Touch-freundliche Buttons

## 🎨 Customization

Du kannst das Design anpassen:

- Farben in `src/components/Shop.vue` ändern
- Formular-Felder hinzufügen/entfernen
- Validierung erweitern
- Erfolgs-/Fehlermeldungen anpassen

## 🚀 Deployment

Nach der Konfiguration funktioniert das Formular auch im Live-Betrieb auf deiner Website!
