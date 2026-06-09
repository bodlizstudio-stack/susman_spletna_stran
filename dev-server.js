/* ───────────────────────────────────────────────────────────────
   PRO-S — preprost lokalni razvojni strežnik (brez odvisnosti)
   - streže statične datoteke (HTML, JS, CSS, slike ...)
   - obdela POST /api/send-email prek obstoječe funkcije v api/send-email.js
   Zagon:  node dev-server.js   (privzeto port 3000)
   ─────────────────────────────────────────────────────────────── */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// API funkcija (Vercel-slog). Ovijemo res, da podpira res.status().json()
const sendEmail = require('./api/send-email.js');

function handleApi(req, res) {
  let raw = '';
  req.on('data', (chunk) => (raw += chunk));
  req.on('end', () => {
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch {
      req.body = {};
    }
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (obj) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(obj));
      return res;
    };
    Promise.resolve(sendEmail(req, res)).catch((err) => {
      console.error('API napaka:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ success: false, message: 'Strežniška napaka.' }));
      }
    });
  });
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  let filePath = path.join(ROOT, urlPath);
  // Varnost: ne dovoli izhoda iz korenske mape
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end('<h1>404 — Stran ni najdena</h1><p><a href="/">Nazaj na domov</a></p>');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/send-email')) {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end('Method Not Allowed');
    }
    return handleApi(req, res);
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`PRO-S dev strežnik teče → http://localhost:${PORT}`);
});
