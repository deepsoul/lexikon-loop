import QRCode from 'qrcode';
import fs from 'fs';

async function generateQRCode(url, filename) {
  try {
    await QRCode.toFile(filename, url, {
      color: {
        dark: '#2563eb', // Blau wie das Lexikon-Loop Design
        light: '#ffffff',
      },
      width: 300,
      margin: 2,
    });
    console.log(`✅ QR-Code für ${url} wurde als ${filename} gespeichert`);
  } catch (err) {
    console.error(`❌ Fehler beim Generieren des QR-Codes für ${url}:`, err);
  }
}

async function generateAllQRCodes() {
  console.log('🎲 Generiere QR-Codes für Lexikon-Loop...\n');

  // QR-Code für die Hauptseite
  await generateQRCode(
    'https://lexikon-loop.de/',
    'qr-code-lexikon-loop-home.png',
  );

  // QR-Code für die Anleitung
  await generateQRCode(
    'https://lexikon-loop.de/assets/Lexikon-Loop-Anleitung.pdf',
    'qr-code-lexikon-loop-anleitung.png',
  );

  console.log('\n🎉 Alle QR-Codes wurden erfolgreich generiert!');
}

generateAllQRCodes();
