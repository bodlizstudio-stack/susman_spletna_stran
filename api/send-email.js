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

    // 5. Pošiljanje potrditvene e-pošte stranki
    const clientMailOptions = {
      from: `"PRO-S" <${senderEmail}>`,
      to: email,
      subject: `Hvala za povpraševanje! - PRO-S`,
      text: `Spoštovani ${name},\n\nHvala za vaše povpraševanje na spletni strani PRO-S. Vaše sporočilo smo uspešno prejeli in ga bomo v najkrajšem možnem času skrbno pregledali.\n\nPotrudili se bomo, da vam z ustreznim odgovorom ali ponudbo postrežemo kar najhitreje.\n\nLep pozdrav,\nEkipa PRO-S\nHlajenje · Ogrevanje · Prezračevanje`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f8fc; padding: 30px; border-radius: 15px; border: 1px solid #e0f2fe;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 14px; font-weight: bold; background-color: #A5D1E8; padding: 8px 16px; border-radius: 6px; color: #0a0a0a; text-transform: uppercase; letter-spacing: 2px;">PRO-S</span>
            </div>
            <h2 style="color: #0a0a0a; text-align: center; font-size: 22px; margin-bottom: 15px;">Hvala za vaše povpraševanje!</h2>
            <p style="color: #333; line-height: 1.6; font-size: 15px;">Pozdravljeni <strong>${escapeHtml(name)}</strong>,</p>
            <p style="color: #333; line-height: 1.6; font-size: 15px;">zahvaljujemo se vam za oddano povpraševanje prek naše spletne strani. Vaše sporočilo smo uspešno prejeli in zabeležili v naš sistem.</p>
            <div style="background-color: #E8F4FA; border-left: 4px solid #3B82B5; padding: 15px; border-radius: 5px; margin: 25px 0;">
              <p style="margin: 0; color: #3B82B5; font-weight: bold; font-size: 14px; text-transform: uppercase;">Kaj sledi?</p>
              <p style="margin: 8px 0 0 0; color: #333; font-size: 14px; line-height: 1.5;">Naša ekipa bo vaše povpraševanje podrobno pregledala. Potrudili se bomo, da vam odgovorimo v najkrajšem možnem času in za vas pripravimo najboljšo rešitev.</p>
            </div>
            <p style="color: #666; font-size: 13px; line-height: 1.5;">To je samodejno potrditveno sporočilo. Prosimo, ne odgovarjajte neposredno nanj. Če imate dodatna vprašanja, nas lahko pokličete na <a href="tel:+38651374829" style="color: #3B82B5; text-decoration: none; font-weight: bold;">051 374 829</a> ali nam pišite.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
            <p style="color: #1a1d23; font-size: 14px; margin: 0; line-height: 1.6;">
              Lep pozdrav,<br>
              <strong>Ekipa PRO-S</strong><br>
              <span style="color: #666; font-size: 12px;">Hlajenje · Ogrevanje · Prezračevanje</span>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(clientMailOptions);

    return res.status(200).json({ success: true, message: 'Hvala! Vaše povpraševanje je bilo uspešno poslano.' });
  } catch (error) {
    console.error('API Error:', error);
    // Vrnemo generično napako, da stranki ne izdamo občutljivih podatkov ali stack tracov
    return res.status(500).json({ success: false, message: 'Prišlo je do napake na strežniku. Sporočila trenutno ni bilo mogoče poslati.' });
  }
};
