/**
 * Static site + API (replaces PHP): port 5000
 */
const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const session = require('express-session');
const multer = require('multer');

const ROOT = __dirname;
/** Default 5000 — use `npm run reset` on Windows to free the port and restart. */
const PORT = Number(process.env.PORT) || 5000;

const app = express();

const uploadRoot = path.join(ROOT, 'uploads');
const contactUploads = path.join(ROOT, 'uploads', 'contact');
const messagesDir = path.join(ROOT, 'contact_messages');

async function ensureDirs() {
    await fs.mkdir(uploadRoot, { recursive: true });
    await fs.mkdir(contactUploads, { recursive: true });
    await fs.mkdir(messagesDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadRoot),
    filename: (req, file, cb) => {
        const safe = path.basename(file.originalname).replace(/[^\w.\-]/g, '_');
        cb(null, `${Date.now()}_${safe}`);
    },
});

const contactStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, contactUploads),
    filename: (req, file, cb) => {
        const safe = path.basename(file.originalname).replace(/[^\w.\-]/g, '_');
        cb(null, `${Date.now()}_${safe}`);
    },
});

const uploadProduct = multer({ storage });
const uploadContact = multer({ storage: contactStorage });

app.use(
    session({
        name: 'portfolio.sid',
        secret: process.env.SESSION_SECRET || 'portfolio-demo-local-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Legacy .php URLs → .html
app.use((req, res, next) => {
    if (req.path.endsWith('.php')) {
        return res.redirect(301, req.path.replace(/\.php$/i, '.html'));
    }
    next();
});

function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated === true) return next();
    return res.status(401).json({ error: 'Unauthorized' });
}

// ——— Products (public read) ———
app.get('/api/products', async (req, res) => {
    try {
        const raw = await fs.readFile(path.join(ROOT, 'products.json'), 'utf8');
        res.type('json').send(raw);
    } catch {
        res.json([]);
    }
});

// ——— Contact (same behaviour as PHP: save message; optional attachment) ———
app.post('/api/contact', uploadContact.single('attachment'), async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: 'Please fill in all required fields.' });
    }

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '') || 'contact';
    let text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${new Date().toISOString()}\n`;

    if (req.file) {
        const rel = path.relative(ROOT, req.file.path).split(path.sep).join('/');
        text += `Attachment: ${rel}\n`;
    }

    try {
        await fs.writeFile(path.join(messagesDir, `${stamp}_${safeName}.txt`), text, 'utf8');
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, error: 'Could not save message.' });
    }

    res.json({ ok: true });
});

// ——— Admin ———
app.post('/api/admin/login', (req, res) => {
    const username = req.body.username || '';
    const password = req.body.password || '';
    if (username === 'user' && password === 'user') {
        req.session.authenticated = true;
        return res.json({ ok: true });
    }
    res.status(401).json({ ok: false, error: 'INVALID CREDENTIALS' });
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});

app.get('/api/admin/me', (req, res) => {
    res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

app.get('/api/admin/products', requireAuth, async (req, res) => {
    try {
        const raw = await fs.readFile(path.join(ROOT, 'products.json'), 'utf8');
        res.type('json').send(raw);
    } catch {
        res.json([]);
    }
});

app.post(
    '/api/admin/products',
    requireAuth,
    uploadProduct.single('image'),
    async (req, res) => {
        const title = String(req.body.title || '').trim();
        const price = String(req.body.price || '').trim();
        const description = String(req.body.description || '').trim();

        if (!title || !price || !description) {
            return res.status(400).json({ ok: false, error: 'Missing fields' });
        }

        let imagePath = 'assets/img/blank_tshirt.png';
        if (req.file) {
            imagePath = path.relative(ROOT, req.file.path).split(path.sep).join('/');
        }

        let products = [];
        try {
            const raw = await fs.readFile(path.join(ROOT, 'products.json'), 'utf8');
            products = JSON.parse(raw);
        } catch {
            products = [];
        }

        products.push({
            id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
            title,
            price,
            description,
            image: imagePath,
        });

        await fs.writeFile(path.join(ROOT, 'products.json'), JSON.stringify(products, null, 4), 'utf8');
        res.json({ ok: true, message: 'PRODUCT ADDED' });
    }
);

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

/** Short URLs → *.html (so /contact works same as /contact.html) */
const HTML_PAGES = [
    'index',
    'contact',
    'checkout',
    'admin',
    'configurator',
    'configurator_mobile',
];
HTML_PAGES.forEach((name) => {
    app.get(`/${name}`, (req, res) => {
        const file = name === 'index' ? 'index.html' : `${name}.html`;
        res.redirect(302, `/${file}`);
    });
});

app.post('/api/admin/products/delete', requireAuth, async (req, res) => {
    const deleteId = String(req.body.product_id || '').trim();
    if (!deleteId) return res.status(400).json({ ok: false });

    let products = [];
    try {
        const raw = await fs.readFile(path.join(ROOT, 'products.json'), 'utf8');
        products = JSON.parse(raw);
    } catch {
        products = [];
    }

    products = products.filter((p) => p.id !== deleteId);
    await fs.writeFile(path.join(ROOT, 'products.json'), JSON.stringify(products, null, 4), 'utf8');
    res.json({ ok: true, message: 'PRODUCT DELETED' });
});

app.use(express.static(ROOT, { index: 'index.html' }));

ensureDirs()
    .then(() => {
        const HOST = process.env.HOST || '0.0.0.0';
        const server = app.listen(PORT, HOST, () => {
            console.log(`Portfolio site: http://localhost:${PORT}/  (bound on ${HOST})`);
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Close the other app or run: set PORT=5001&&npm start`);
            } else {
                console.error(err);
            }
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
