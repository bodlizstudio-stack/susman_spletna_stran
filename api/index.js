/**
 * Root Server serving beautiful Landing Page at / and Nelti Portfolij + APIs on port 5000
 * Serves as Vercel Serverless Function in /api/index.js
 */
const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const session = require('express-session');
const multer = require('multer');

// Root is one level up because index.js is inside the /api/ folder
const ROOT = path.join(__dirname, '..');
const NELTI_ROOT = path.join(ROOT, 'portfolij-nelti');
const PORT = Number(process.env.PORT) || 5000;

const app = express();

const uploadRoot = path.join(NELTI_ROOT, 'uploads');
const contactUploads = path.join(NELTI_ROOT, 'uploads', 'contact');
const messagesDir = path.join(NELTI_ROOT, 'contact_messages');

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

// Legacy .php URLs → .html redirects inside portfolij nelti directory (if they occur relative)
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
        delete require.cache[require.resolve('../portfolij-nelti/products.json')];
        const products = require('../portfolij-nelti/products.json');
        res.json(products);
    } catch (e) {
        res.json([]);
    }
});

// ——— Contact ———
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
        const rel = path.relative(NELTI_ROOT, req.file.path).split(path.sep).join('/');
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
        delete require.cache[require.resolve('../portfolij-nelti/products.json')];
        const products = require('../portfolij-nelti/products.json');
        res.json(products);
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
            imagePath = path.relative(NELTI_ROOT, req.file.path).split(path.sep).join('/');
        }

        let products = [];
        try {
            const raw = await fs.readFile(path.join(NELTI_ROOT, 'products.json'), 'utf8');
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

        try {
            await fs.writeFile(path.join(NELTI_ROOT, 'products.json'), JSON.stringify(products, null, 4), 'utf8');
            res.json({ ok: true, message: 'PRODUCT ADDED' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ ok: false, error: 'Could not write products file (possibly read-only filesystem).' });
        }
    }
);

app.post('/api/admin/products/delete', requireAuth, async (req, res) => {
    const deleteId = String(req.body.product_id || '').trim();
    if (!deleteId) return res.status(400).json({ ok: false });

    let products = [];
    try {
        const raw = await fs.readFile(path.join(NELTI_ROOT, 'products.json'), 'utf8');
        products = JSON.parse(raw);
    } catch {
        products = [];
    }

    products = products.filter((p) => p.id !== deleteId);
    
    try {
        await fs.writeFile(path.join(NELTI_ROOT, 'products.json'), JSON.stringify(products, null, 4), 'utf8');
        res.json({ ok: true, message: 'PRODUCT DELETED' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: 'Could not write products file (possibly read-only filesystem).' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

/** Short URLs → *.html redirects for Nelti subpages */
const HTML_PAGES = [
    'contact',
    'checkout',
    'admin',
    'configurator',
    'configurator_mobile',
];
HTML_PAGES.forEach((name) => {
    // If accessed as /portfolij-nelti/contact -> redirect to /portfolij-nelti/contact.html
    app.get(`/portfolij-nelti/${name}`, (req, res) => {
        res.redirect(302, `/portfolij-nelti/${name}.html`);
    });
    app.get(`/portfolij-nelti/${name}.html`, (req, res, next) => {
        next();
    });
});

// Serve the whole root directory statically so that root index.html/styles.css and portfolij nelti/ folder are naturally served.
app.use(express.static(ROOT));

// Specifically serve uploads inside portfolij nelti folder if it is requested from Nelti pages relatively
app.use('/uploads', express.static(path.join(NELTI_ROOT, 'uploads')));

ensureDirs()
    .then(() => {
        if (require.main === module || !process.env.VERCEL) {
            const HOST = process.env.HOST || '0.0.0.0';
            const server = app.listen(PORT, HOST, () => {
                console.log(`Landing Page: http://localhost:${PORT}/`);
                console.log(`Nelti Shop: http://localhost:${PORT}/portfolij-nelti/`);
            });
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.error(`Port ${PORT} is already in use. Close the other app or run: set PORT=5001&&npm start`);
                } else {
                    console.error(err);
                }
                process.exit(1);
            });
        }
    })
    .catch((err) => {
        console.error(err);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    });

module.exports = app;
