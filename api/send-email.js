// nodemailer naložimo leno (le, če uporabljamo Gmail SMTP pot),
// da deluje tudi brez nameščenih odvisnosti (npr. lokalni razvoj, Resend pot).

// ─────────────────────────────────────────────
//  Pomožna funkcija – e-mail za LASTNIKA (admin)
// ─────────────────────────────────────────────
function isSpecificDevice(device) {
  return device && device !== 'general' && device !== 'Splošno povpraševanje';
}

function buildAdminEmail({ name, email, phone, category, device, service, wifi, message }) {
  const deviceLabel = isSpecificDevice(device) ? device : 'Splošno povpraševanje';
  const categoryLabel = category || 'Splošno povpraševanje';
  const serviceLabel = service || '—';
  const wifiLabel = wifi || '—';

  return `<!DOCTYPE html>
<html lang="sl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novo povpraševanje – PRO-S</title>
</head>
<body style="margin:0;padding:0;background:#f0f8fc;font-family:'Inter',Arial,sans-serif;color:#1a1d23;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8fc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(91,163,201,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#1a2a38 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:#A5D1E8;border-radius:12px;padding:10px 22px;margin-bottom:18px;">
                <span style="font-size:15px;font-weight:800;letter-spacing:3px;color:#0a0a0a;text-transform:uppercase;">PRO-S</span>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                Dobili ste novo povpraševanje!
              </h1>
              <p style="margin:10px 0 0;font-size:14px;color:#A5D1E8;font-weight:500;">
                Stranka je izpolnila kontaktni obrazec na vaši spletni strani.
              </p>
            </td>
          </tr>

          <!-- Alert badge -->
          <tr>
            <td style="padding:24px 40px 0;">
              <div style="background:#E8F4FA;border-left:4px solid #3B82B5;border-radius:8px;padding:14px 18px;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#3B82B5;text-transform:uppercase;letter-spacing:1px;">
                  📩 Novo povpraševanje – odgovorite čim prej
                </p>
              </div>
            </td>
          </tr>

          <!-- Contact details -->
          <tr>
            <td style="padding:28px 40px 0;">
              <h2 style="margin:0 0 18px;font-size:16px;font-weight:700;color:#0a0a0a;border-bottom:2px solid #E8F4FA;padding-bottom:12px;">
                Podatki stranke
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;width:38%;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">Ime in priimek</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:15px;font-weight:600;color:#0a0a0a;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">E-pošta</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <a href="mailto:${email}" style="font-size:15px;font-weight:600;color:#3B82B5;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">Telefon</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <a href="tel:${phone}" style="font-size:15px;font-weight:600;color:#3B82B5;text-decoration:none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">Kategorija</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:15px;font-weight:600;color:#0a0a0a;">${categoryLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">Naprava</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:15px;font-weight:600;color:#0a0a0a;">${deviceLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">Vrsta storitve</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;">
                    <span style="font-size:15px;font-weight:600;color:#0a0a0a;">${serviceLabel}</span>
                  </td>
                </tr>
                ${wifi ? `<tr>
                  <td style="padding:10px 0;">
                    <span style="font-size:12px;font-weight:700;color:#5BA3C9;text-transform:uppercase;letter-spacing:0.8px;">WiFi</span>
                  </td>
                  <td style="padding:10px 0;">
                    <span style="font-size:15px;font-weight:600;color:#0a0a0a;">${wifiLabel}</span>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 14px;font-size:16px;font-weight:700;color:#0a0a0a;">
                Sporočilo stranke
              </h2>
              <div style="background:#f8fbfd;border-radius:12px;padding:18px 20px;border:1px solid #E8F4FA;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:#1a1d23;white-space:pre-line;">${message || 'Stranka ni napisala sporočila.'}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:30px 40px 0;text-align:center;">
              <a href="mailto:${email}" style="display:inline-block;background:#A5D1E8;color:#0a0a0a;font-weight:800;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
                Odgovori stranki
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 40px;text-align:center;border-top:1px solid #E8F4FA;margin-top:32px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                To sporočilo je bilo samodejno generirano s spletne strani <strong style="color:#0a0a0a;">PRO-S</strong>.<br/>
                Hlajenje · Ogrevanje · Prezračevanje
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─────────────────────────────────────────────
//  Pomožna funkcija – e-mail za STRANKO (hvala)
// ─────────────────────────────────────────────
function buildClientEmail({ name, device }) {
  const deviceLabel = isSpecificDevice(device) ? device : null;

  return `<!DOCTYPE html>
<html lang="sl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hvala za vaše povpraševanje – PRO-S</title>
</head>
<body style="margin:0;padding:0;background:#f0f8fc;font-family:'Inter',Arial,sans-serif;color:#1a1d23;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f8fc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(91,163,201,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a0a0a 0%,#1a2a38 100%);padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-block;background:#A5D1E8;border-radius:12px;padding:10px 22px;margin-bottom:20px;">
                <span style="font-size:15px;font-weight:800;letter-spacing:3px;color:#0a0a0a;text-transform:uppercase;">PRO-S</span>
              </div>
              <div style="font-size:40px;margin-bottom:14px;">✅</div>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                Hvala za vaše povpraševanje!
              </h1>
              <p style="margin:12px 0 0;font-size:15px;color:#A5D1E8;font-weight:500;line-height:1.6;">
                Vaše sporočilo smo prejeli.<br/>Odgovorimo v najkrajšem možnem času.
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0;font-size:16px;color:#1a1d23;line-height:1.7;">
                Pozdravljeni, <strong style="color:#0a0a0a;">${name}</strong>,
              </p>
              <p style="margin:14px 0 0;font-size:15px;color:#374151;line-height:1.8;">
                zahvaljujemo se vam za vaše povpraševanje${deviceLabel ? ` za <strong>${deviceLabel}</strong>` : ''}. Vaše sporočilo smo uspešno prejeli in ga bomo pregledali v čim krajšem času.
              </p>
              <p style="margin:14px 0 0;font-size:15px;color:#374151;line-height:1.8;">
                Potrudili se bomo, da vam <strong style="color:#0a0a0a;">odgovorimo v najkrajšem možnem času</strong> z neobvezujočo in prilagojeno ponudbo.
              </p>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="background:#E8F4FA;border-radius:14px;padding:22px 24px;">
                <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#3B82B5;text-transform:uppercase;letter-spacing:1px;">
                  Kaj vas čaka?
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:7px 0;vertical-align:top;width:28px;">
                      <span style="font-size:16px;">📞</span>
                    </td>
                    <td style="padding:7px 0;">
                      <span style="font-size:14px;color:#1a1d23;">Pokličemo vas ali odgovorimo po e-pošti</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:7px 0;vertical-align:top;">
                      <span style="font-size:16px;">📋</span>
                    </td>
                    <td style="padding:7px 0;">
                      <span style="font-size:14px;color:#1a1d23;">Pripravimo vam neobvezujočo ponudbo</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:7px 0;vertical-align:top;">
                      <span style="font-size:16px;">🔧</span>
                    </td>
                    <td style="padding:7px 0;">
                      <span style="font-size:14px;color:#1a1d23;">Strokovna montaža v dogovorjenem terminu</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Contact info -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0;font-size:14px;color:#6b7280;">
                Če imate kakšno vprašanje, nas pokličite na
                <a href="tel:+38640123456" style="color:#3B82B5;font-weight:600;text-decoration:none;">040 123 456</a>
                ali nam pišite na
                <a href="mailto:info@pro-s.si" style="color:#3B82B5;font-weight:600;text-decoration:none;">info@pro-s.si</a>.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0;font-size:15px;color:#1a1d23;line-height:1.7;">
                Lep pozdrav,<br/>
                <strong style="color:#0a0a0a;">Ekipa PRO-S</strong><br/>
                <span style="font-size:13px;color:#6b7280;">Hlajenje · Ogrevanje · Prezračevanje</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:36px 40px;text-align:center;border-top:1px solid #E8F4FA;margin-top:32px;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                To je samodejno potrditveno sporočilo. Na ta e-mail ni treba odgovarjati.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2025 <strong style="color:#0a0a0a;">PRO-S</strong> · Slovenija
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ─────────────────────────────────────────────
//  Glavna Vercel Serverless funkcija
// ─────────────────────────────────────────────
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metoda ni dovoljena.' });
  }

  const { name, email, phone, category, device, service, wifi, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Manjkajo obvezna polja (ime, e-pošta ali telefon).' });
  }

  const adminHtml  = buildAdminEmail({ name, email, phone, category, device, service, wifi, message });
  const clientHtml = buildClientEmail({ name, device });

  // ── Resend ──────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const toEmail = process.env.RECEIVER_EMAIL || 'info@pro-s.si';

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      };

      // 1. Mail adminu
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: toEmail,
          reply_to: email,
          subject: `📩 Novo povpraševanje: ${name}`,
          html: adminHtml
        })
      });
      if (!adminRes.ok) throw new Error((await adminRes.json()).message);

      // 2. Hvala mail stranki
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Hvala za vaše povpraševanje – PRO-S',
          html: clientHtml
        })
      });

      return res.status(200).json({ success: true, message: 'Sporočili sta bili uspešno poslani!' });
    } catch (err) {
      console.error('Resend napaka:', err);
      return res.status(500).json({ success: false, message: 'Napaka pri pošiljanju (Resend).', error: err.message });
    }
  }

  // ── Gmail SMTP (nodemailer) ─────────────────
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const toEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

      // 1. Mail adminu
      await transporter.sendMail({
        from: `"PRO-S Spletna Stran" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        replyTo: email,
        subject: `📩 Novo povpraševanje: ${name}`,
        html: adminHtml
      });

      // 2. Hvala mail stranki
      await transporter.sendMail({
        from: `"PRO-S" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Hvala za vaše povpraševanje – PRO-S',
        html: clientHtml
      });

      return res.status(200).json({ success: true, message: 'Sporočili sta bili uspešno poslani!' });
    } catch (err) {
      console.error('SMTP napaka:', err);
      return res.status(500).json({ success: false, message: 'Napaka pri pošiljanju (SMTP).', error: err.message });
    }
  }

  // Nobena metoda ni konfigurirana
  return res.status(500).json({
    success: false,
    message: 'Okoljske spremenljivke za pošiljanje e-pošte niso nastavljene na Vercelu.'
  });
};
