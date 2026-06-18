// Vercel Serverless Function - api/send-email.js
const nodemailer = require('nodemailer');

// Preprost in-memory Rate Limiting (velja znotraj življenjske dobe ene serverless instance)
const rateLimit = new Map();
const RATE_LIMIT_MAX = 5; // Maks 5 sporočil na IP
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // v 15 minutah

// Helper za osnovni XSS escape pri izpisu v HTML emailu
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metoda ni dovoljena.' });
  }

  // Preverjanje rate-limita
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const userRate = rateLimit.get(ip) || { count: 0, lastReset: now };

  if (now - userRate.lastReset > RATE_LIMIT_WINDOW_MS) {
    userRate.count = 0;
    userRate.lastReset = now;
  }

  if (userRate.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ success: false, message: 'Preveč poskusov. Poskusite znova kasneje.' });
  }

  userRate.count++;
  rateLimit.set(ip, userRate);

  try {
    const { name, email, phone, category, message, website, pageUrl } = req.body;

    // 1. Validacija
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Polja ime, e-pošta in sporočilo so obvezna.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Vnesen e-poštni naslov ni veljaven.' });
    }

    // 2. Detekcija honeypot-a (če je bot izpolnil skrito polje website)
    if (website && website.trim() !== '') {
      // Navidezno vrnemo success, a dejansko ne pošljemo emaila (Bot protection)
      return res.status(200).json({ success: true, message: 'Hvala! Vaše povpraševanje je bilo uspešno poslano.' });
    }

    // 3. Povezava s SMTP strežnikom
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mcp-12.controlpanel.si',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const receiverEmail = process.env.CONTACT_TO || 'info@pro-s.si';
    const senderEmail = process.env.CONTACT_FROM || process.env.SMTP_USER || 'info@pro-s.si';

    const currentDateTime = new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' });
    const sourceUrl = pageUrl || 'Neznano';

    // 4. Pošiljanje e-pošte
    const mailOptions = {
      from: `"PRO-S spletna stran" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `Novo povpraševanje iz spletne strani PRO-S`,
      text: `Dobili ste novo povpraševanje iz spletne strani PRO-S!\n\nIme in priimek: ${name}\nE-pošta: ${email}\nTelefon: ${phone || '/'}\nKategorija: ${category || '/'}\nStran/URL: ${sourceUrl}\nDatum in čas oddaje: ${currentDateTime}\n\nSporočilo:\n${message}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #3B82B5;">Dobili ste novo povpraševanje!</h2>
          <p>Prek spletnega obrazca PRO-S ste prejeli novo sporočilo.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Ime in priimek:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>E-pošta:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Telefon:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(phone || '/')}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Kategorija:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(category || '/')}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Stran/URL:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="${escapeHtml(sourceUrl)}">${escapeHtml(sourceUrl)}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Datum oddaje:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${currentDateTime}</td></tr>
          </table>
          <h3 style="margin-top: 20px;">Sporočilo:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Hvala! Vaše povpraševanje je bilo uspešno poslano.' });
  } catch (error) {
    console.error('API Error:', error);
    // Vrnemo generično napako, da stranki ne izdamo občutljivih podatkov ali stack tracov
    return res.status(500).json({ success: false, message: 'Prišlo je do napake na strežniku. Sporočila trenutno ni bilo mogoče poslati.' });
  }
};
