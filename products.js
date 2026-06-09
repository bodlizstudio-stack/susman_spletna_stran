/* ────────────────────────────────────────────────────────────
   PRO-S — Skupni podatki o napravah + prikaz kataloga / filtra / detajla
   Uporabljeno na: klimatske-naprave.html, prezracevanje.html,
   izdelek.html in v kontaktnem obrazcu (index.html).
   ──────────────────────────────────────────────────────────── */

/* DDV stopnji:
   - Z montažo (montaža na stanovanjskem objektu) -> nižja stopnja 9,5 %
   - Brez montaže (zgolj dobava naprave)          -> splošna stopnja 22 %  */
const VAT_INSTALL = 0.095;
const VAT_DEVICE  = 0.22;

const PRODUCTS = [
  /* ───────────── KLIMATSKE NAPRAVE ───────────── */
  {
    id: 'mitsubishi-msz-ap25vg',
    category: 'klima',
    brand: 'Mitsubishi',
    series: 'Mitsubishi Electric',
    name: 'MSZ-AP25VG',
    power: '2,5 kW',
    area: 'do 25 m²',
    energy: 'A+++ / A++',
    short: 'Inverter split klima 2,5 kW, tiho delovanje in WiFi pripravljenost.',
    description: 'Zanesljiva stenska split klimatska naprava serije AP z energijskim razredom A+++ pri hlajenju. Tiho delovanje, napredno filtriranje zraka in možnost WiFi nadzora jo delajo idealno za spalnice in dnevne prostore do 25 m².',
    features: ['Energijski razred A+++ / A++', 'WiFi nadzor (opcijsko)', 'Tiho delovanje od 19 dB', 'Primerno do 25 m²'],
    priceNet: 899,
    installNet: 250,
    wifiOption: true,
    wifiAddonNet: 85,
    badge: '',
  },
  {
    id: 'mitsubishi-msz-ln35vg',
    category: 'klima',
    brand: 'Mitsubishi',
    series: 'Mitsubishi Electric',
    name: 'MSZ-LN35VG',
    power: '3,5 kW',
    area: 'do 35 m²',
    energy: 'A+++ / A+++',
    short: 'Premium dizajnerska klima 3,5 kW z vgrajenim WiFi in čiščenjem zraka.',
    description: 'Vrhunska serija Premium (LN) združuje izjemen dizajn in najvišjo učinkovitost A+++ pri hlajenju in ogrevanju. Vgrajen WiFi, plazma filter za čist zrak in 3D senzor za enakomerno razporeditev temperature po prostoru do 35 m².',
    features: ['Energijski razred A+++ / A+++', 'Vgrajen WiFi', 'Plazma filtracija zraka', 'Primerno do 35 m²'],
    priceNet: 1290,
    installNet: 280,
    badge: 'Priljubljeno',
  },
  {
    id: 'fujitsu-asyg09kpca',
    category: 'klima',
    brand: 'Fujitsu',
    series: 'Fujitsu General',
    name: 'ASYG09KPCA',
    power: '2,5 kW',
    area: 'do 25 m²',
    energy: 'A++ / A+',
    short: 'Zanesljiva inverter klima 2,5 kW z odličnim razmerjem cena–kakovost.',
    description: 'Serija KP japonskega proizvajalca Fujitsu ponuja tiho in stabilno delovanje, funkcijo samodejnega sušenja izparilnika ter human senzor za varčevanje z energijo. Odlična izbira za prostore do 25 m².',
    features: ['Energijski razred A++ / A+', 'Samodejno sušenje izparilnika', 'Human senzor gibanja', 'Primerno do 25 m²'],
    priceNet: 749,
    installNet: 250,
    badge: '',
  },
  {
    id: 'fujitsu-asyg12kpca',
    category: 'klima',
    brand: 'Fujitsu',
    series: 'Fujitsu General',
    name: 'ASYG12KPCA',
    power: '3,4 kW',
    area: 'do 35 m²',
    energy: 'A++ / A+',
    short: 'Močnejša inverter klima 3,4 kW za večje prostore in dnevne sobe.',
    description: 'Zmogljiva različica serije KP s 3,4 kW hladilne moči, primerna za večje dnevne prostore do 35 m². WiFi pripravljenost (opcijski modul), tiho delovanje in zanesljiva Fujitsu tehnologija.',
    features: ['Energijski razred A++ / A+', 'WiFi pripravljenost', 'Tiho nočno delovanje', 'Primerno do 35 m²'],
    priceNet: 949,
    installNet: 270,
    badge: '',
  },
  {
    id: 'daikin-ftxm25a',
    category: 'klima',
    brand: 'Daikin',
    series: 'Daikin Perfera',
    name: 'FTXM25A / RXM25A',
    power: '2,5 kW',
    area: 'do 30 m²',
    energy: 'A+++ / A+++',
    short: 'Perfera serija s Coanda tokom zraka in aplikacijo Onecta.',
    description: 'Daikin Perfera je ena najtišjih klimatskih naprav na trgu z razredom A+++ pri hlajenju in ogrevanju. Coanda učinek usmerja zrak ob strop za enakomerno udobje, upravljanje pa poteka prek aplikacije Onecta.',
    features: ['Energijski razred A+++ / A+++', 'WiFi + aplikacija Onecta', 'Coanda tok zraka', 'Primerno do 30 m²'],
    priceNet: 1090,
    installNet: 260,
    badge: '',
  },
  {
    id: 'gree-pular',
    category: 'klima',
    brand: 'Gree',
    series: 'Gree Pular',
    name: 'Pular Series 12K',
    power: '3,5 kW',
    area: 'do 22 m²',
    energy: 'A++ / A+',
    short: 'Ugodna inverter klima z I-Feel funkcijo in samočistilnim filtrom.',
    description: 'Gree Pular ponuja odlično razmerje med ceno in kakovostjo. Inverter tehnologija, funkcija I-Feel (merjenje temperature pri daljinskem upravljalniku) in samočistilni filter zagotavljajo udobje brez visokih stroškov.',
    features: ['Energijski razred A++ / A+', 'Funkcija I-Feel', 'Samočistilni filter', 'Primerno do 22 m²'],
    priceNet: 649,
    installNet: 240,
    badge: '',
  },

  /* ───────────── PREZRAČEVANJE ───────────── */
  {
    id: 'mitsubishi-lossnay-vl100',
    category: 'prezracevanje',
    brand: 'Mitsubishi',
    series: 'Mitsubishi Lossnay',
    name: 'VL-100EU5-E',
    power: '105 m³/h',
    area: 'do 40 m²',
    energy: 'do 75 % rekuperacija',
    short: 'Decentralni rekuperator za en prostor z do 75 % vračanja toplote.',
    description: 'Kompaktna decentralna prezračevalna enota Lossnay za vgradnjo skozi steno. Zagotavlja stalen dotok svežega zraka in odvod izrabljenega ob hkratnem vračanju do 75 % toplote — brez ohlajanja prostora pozimi. Idealna za posamezne sobe in pisarne.',
    features: ['Rekuperacija toplote do 75 %', 'Pretok zraka 105 m³/h', 'Tiho delovanje', 'Enostavna decentralna vgradnja'],
    priceNet: 690,
    installNet: 200,
    badge: '',
  },
  {
    id: 'mitsubishi-lossnay-lgh15',
    category: 'prezracevanje',
    brand: 'Mitsubishi',
    series: 'Mitsubishi Lossnay',
    name: 'LGH-15RVX-E',
    power: '150 m³/h',
    area: 'do 120 m²',
    energy: 'do 80 % rekuperacija',
    short: 'Centralni rekuperator za stanovanje ali hišo s kanalskim razvodom.',
    description: 'Centralna prezračevalna naprava z rekuperacijo Lossnay za celotno stanovanje ali manjšo hišo. Visok izkoristek vračanja toplote (do 80 %), nizka poraba energije in zmogljiv prenosnik toplote za zdravo bivalno okolje skozi vse leto.',
    features: ['Rekuperacija toplote do 80 %', 'Pretok zraka 150 m³/h', 'Centralni kanalski sistem', 'Primerno do 120 m²'],
    priceNet: 2190,
    installNet: 600,
    badge: 'Priljubljeno',
  },
  {
    id: 'helios-kwl-ec220',
    category: 'prezracevanje',
    brand: 'Helios',
    series: 'Helios KWL',
    name: 'KWL EC 220',
    power: '220 m³/h',
    area: 'do 160 m²',
    energy: 'do 90 % rekuperacija',
    short: 'Centralna rekuperacijska enota nemške kakovosti z visokim izkoristkom.',
    description: 'Helios KWL EC 220 je centralna prezračevalna naprava z izjemno učinkovito rekuperacijo toplote (do 90 %). Energijsko varčni EC ventilatorji, zmogljivi filtri in tiho delovanje jo delajo odlično izbiro za nizkoenergijske in pasivne objekte.',
    features: ['Rekuperacija toplote do 90 %', 'Pretok zraka 220 m³/h', 'Energijsko varčni EC ventilatorji', 'Primerno do 160 m²'],
    priceNet: 1890,
    installNet: 550,
    badge: '',
  },
  {
    id: 'prana-150',
    category: 'prezracevanje',
    brand: 'Prana',
    series: 'Prana Recuperators',
    name: 'Prana 150',
    power: '105 m³/h',
    area: 'do 50 m²',
    energy: 'do 87 % rekuperacija',
    short: 'Decentralni rekuperator brez kanalov, primeren za obnove.',
    description: 'Prana 150 je decentralna prezračevalna naprava z bakrenim prenosnikom toplote in visokim izkoristkom rekuperacije. Vgradi se skozi zunanjo steno brez kanalskega razvoda, kar je idealno za obnove obstoječih prostorov.',
    features: ['Rekuperacija toplote do 87 %', 'Pretok zraka do 105 m³/h', 'Brez kanalskega razvoda', 'Primerno do 50 m²'],
    priceNet: 520,
    installNet: 180,
    badge: '',
  },
];

/* ───────────── Pomožne funkcije ───────────── */
const CATEGORY_LABEL = {
  klima: 'Klimatske naprave',
  prezracevanje: 'Prezračevanje',
  ogrevanje: 'Ogrevanje in vodovod',
  splosno: 'Splošno povpraševanje',
};

const FORM_CAT_LABELS = {
  splosno: 'Splošno povpraševanje',
  klima: 'Klimatske naprave',
  prezracevanje: 'Prezračevanje',
  ogrevanje: 'Ogrevanje in vodovod',
};

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function productsByCategory(category) {
  return PRODUCTS.filter((p) => p.category === category);
}

function formatEUR(value) {
  return value.toLocaleString('sl-SI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

/* Cena z montažo (vključen 9,5 % DDV) — naprava + montaža */
function priceWithInstall(p) {
  return (p.priceNet + p.installNet) * (1 + VAT_INSTALL);
}

/* Cena brez montaže (vključen 22 % DDV) — zgolj naprava */
function priceWithoutInstall(p) {
  return p.priceNet * (1 + VAT_DEVICE);
}

/* "Od" cena za kartico (prikaže nižjo med obema variantama) */
function priceFrom(p) {
  return Math.min(priceWithInstall(p), priceWithoutInstall(p));
}

/* Učinkovita cena z opcijskim WiFi dodatkom */
function productWithWifi(p, wifi) {
  if (!p || !p.wifiOption || wifi !== 'da') return p;
  const addon = p.wifiAddonNet || 0;
  if (!addon) return p;
  return { ...p, priceNet: p.priceNet + addon };
}

function wifiLabel(wifi) {
  return wifi === 'da' ? 'z WiFi modulom' : 'brez WiFi modula';
}

/** Razčleni vrednost iz obrazca: "id" ali "id:da" / "id:ne" */
function parseDeviceOption(value) {
  if (!value) return { id: '', wifi: null };
  const parts = value.split(':');
  const id = parts[0];
  const w = parts[1];
  const wifi = w === 'da' ? 'da' : w === 'ne' ? 'ne' : null;
  return { id, wifi };
}

function deviceOptionLabel(p, wifi) {
  const base = p.brand + ' ' + p.name;
  if (wifi === 'da') return base + ' — z WiFi';
  if (wifi === 'ne') return base + ' — brez WiFi';
  return base;
}

function formDeviceOptionsHtml(items) {
  const opts = items.flatMap((p) => {
    if (p.wifiOption && p.category === 'klima') {
      return [
        `<option value="${p.id}:ne">${deviceOptionLabel(p, 'ne')}</option>`,
        `<option value="${p.id}:da">${deviceOptionLabel(p, 'da')}</option>`,
      ];
    }
    return [`<option value="${p.id}">${deviceOptionLabel(p, null)}</option>`];
  });
  return '<option value="">Še ne vem / svetujte mi</option>' + opts.join('');
}

/** V katalogu: izdelke z opcijo WiFi razdeli na dve kartici */
function expandCatalogVariants(items) {
  return items.flatMap((p) => {
    if (p.wifiOption && p.category === 'klima') {
      return [{ product: p, wifi: 'ne' }, { product: p, wifi: 'da' }];
    }
    return [{ product: p, wifi: null }];
  });
}

/* ───────────── SVG ilustracija naprave ───────────── */
function deviceSvg(p) {
  if (p.category === 'prezracevanje') {
    return `
      <svg viewBox="0 0 200 140" class="relative w-3/4 h-3/4" aria-hidden="true">
        <rect x="30" y="35" width="140" height="70" rx="12" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5"/>
        <circle cx="100" cy="70" r="26" fill="none" stroke="#0a0a0a" stroke-width="2.5"/>
        <g stroke="#5BA3C9" stroke-width="3" stroke-linecap="round" class="airflow-line">
          <path d="M100 70 L100 50" /><path d="M100 70 L118 60" /><path d="M100 70 L118 80" />
          <path d="M100 70 L100 90" /><path d="M100 70 L82 80" /><path d="M100 70 L82 60" />
        </g>
        <text x="100" y="125" text-anchor="middle" fill="#0a0a0a" font-family="Inter" font-weight="800" font-size="11">${p.brand.toUpperCase()}</text>
      </svg>`;
  }
  return `
    <svg viewBox="0 0 200 140" class="relative w-3/4 h-3/4" aria-hidden="true">
      <rect x="20" y="40" width="160" height="50" rx="10" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5"/>
      <rect x="20" y="40" width="160" height="16" rx="10" fill="#0a0a0a"/>
      <rect x="30" y="64" width="140" height="5" rx="2" fill="#e5e7eb"/>
      <rect x="30" y="74" width="140" height="5" rx="2" fill="#e5e7eb"/>
      <text x="100" y="52" text-anchor="middle" fill="#ffffff" font-family="Inter" font-weight="800" font-size="8">${p.brand.toUpperCase()}</text>
      <g fill="none" stroke="#5BA3C9" stroke-width="2.5" stroke-linecap="round" class="airflow-line">
        <path d="M40,105 Q70,115 100,105 T160,105"/>
        <path d="M50,120 Q80,130 110,120 T170,120" opacity="0.7"/>
      </g>
    </svg>`;
}

function productImageSlides(p) {
  const title = p.brand + ' ' + p.name;
  if (Array.isArray(p.images) && p.images.length) {
    return p.images.map((src) => ({ src, title }));
  }
  if (p.image) return [{ src: p.image, title }];
  return [{ src: '', title }];
}

/* ───────────── Kartica izdelka ───────────── */
function productCardHtml(p, index, wifi = null) {
  const priced = wifi === 'da' ? productWithWifi(p, 'da') : p;
  const wifiSuffix = wifi === 'da' ? ' — z WiFi' : wifi === 'ne' ? ' — brez WiFi' : '';
  const displayName = p.name + wifiSuffix;
  const detailHref = wifi ? `izdelek.html?id=${p.id}&wifi=${wifi}` : `izdelek.html?id=${p.id}`;
  const lightboxTitle = p.brand + ' ' + displayName;

  const badge = p.badge && wifi !== 'da'
    ? `<span class="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-black text-white rounded-md">${p.badge}</span>`
    : wifi === 'da'
      ? `<span class="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-brand-blue-deep text-white rounded-md">WiFi</span>`
      : '';
  const border = p.badge || wifi === 'da' ? 'border-2 border-brand-blue shadow-md' : 'border border-gray-100 shadow-sm';
  const features = p.features.slice(0, 3).map(
    (f) => `<li class="flex items-center gap-2"><span class="w-1 h-1 rounded-full bg-brand-blue-deep"></span>${f}</li>`
  ).join('');

  return `
    <article class="product-card scroll-reveal lift relative bg-white rounded-2xl ${border} overflow-hidden flex flex-col"
      data-brand="${p.brand}" data-id="${p.id}" data-wifi="${wifi || ''}" style="transition-delay: ${(index % 3) * 90}ms">
      ${badge}
      <button type="button" class="product-lightbox lightbox-item block w-full aspect-[4/3] bg-gradient-to-br from-brand-blue-soft to-white border-b border-gray-100 flex items-center justify-center relative overflow-hidden text-left"
        data-src="${p.image || ''}" data-title="${lightboxTitle}" aria-label="Povečaj sliko — ${lightboxTitle}">
        <div class="absolute inset-0 dot-grid opacity-30 pointer-events-none"></div>
        ${p.image
          ? `<img src="${p.image}" alt="${lightboxTitle}" class="absolute inset-0 w-full h-full object-contain p-4" loading="lazy" />`
          : deviceSvg(p)}
      </button>
      <div class="p-6 flex flex-col flex-1">
        <span class="text-xs font-bold text-brand-blue-deep uppercase tracking-wider mb-1">${p.series}</span>
        <h3 class="text-lg font-bold mb-2"><a href="${detailHref}" class="hover:text-brand-blue-deep transition-colors">${displayName}</a></h3>
        <p class="text-sm text-gray-600 mb-4 flex-1">${p.short}</p>
        <ul class="text-xs text-gray-600 space-y-1.5 mb-4">${features}</ul>
        <div class="mb-5">
          <span class="text-xs text-gray-500">že od</span>
          <span class="block text-xl font-extrabold text-brand-black">${formatEUR(priceFrom(priced))}</span>
          <span class="text-[11px] text-gray-400">z vključenim DDV</span>
        </div>
        <a href="${detailHref}" class="mt-auto w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-bold text-brand-black bg-brand-blue hover:bg-brand-blue-dark hover:text-white rounded-xl transition-colors">
          Opis in cena
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </article>`;
}

/* ───────────── Render kataloga + filter po znamkah ───────────── */
function initCatalog(category, gridId, filterId) {
  const grid = document.getElementById(gridId);
  const filterBar = document.getElementById(filterId);
  if (!grid) return;

  grid.dataset.lightboxGroup = gridId;

  const items = productsByCategory(category);
  const brands = [...new Set(items.map((p) => p.brand))];
  const variants = expandCatalogVariants(items);

  // Render kartice
  grid.innerHTML = variants.map((v, i) => productCardHtml(v.product, i, v.wifi)).join('');

  // Render filter gumbe (Vse + posamezne znamke)
  if (filterBar) {
    const btn = (label, value, active) => `
      <button type="button" class="brand-filter-btn px-5 py-2.5 rounded-full text-sm font-bold border transition-all
        ${active
          ? 'bg-brand-blue-dark text-white border-brand-blue-dark shadow-md shadow-brand-blue/30'
          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-blue hover:text-brand-blue-deep'}"
        data-filter="${value}">${label}</button>`;

    filterBar.innerHTML =
      btn('Vse znamke', 'all', true) + brands.map((b) => btn(b, b, false)).join('');

    filterBar.addEventListener('click', (e) => {
      const target = e.target.closest('.brand-filter-btn');
      if (!target) return;
      const filter = target.dataset.filter;

      // Posodobi aktivno stanje gumbov
      filterBar.querySelectorAll('.brand-filter-btn').forEach((b) => {
        const isActive = b === target;
        b.classList.toggle('bg-brand-blue-dark', isActive);
        b.classList.toggle('text-white', isActive);
        b.classList.toggle('border-brand-blue-dark', isActive);
        b.classList.toggle('shadow-md', isActive);
        b.classList.toggle('bg-white', !isActive);
        b.classList.toggle('text-gray-700', !isActive);
        b.classList.toggle('border-gray-200', !isActive);
      });

      // Filtriraj kartice
      let visible = 0;
      grid.querySelectorAll('.product-card').forEach((card) => {
        const match = filter === 'all' || card.dataset.brand === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      const empty = document.getElementById('catalog-empty');
      if (empty) empty.classList.toggle('hidden', visible > 0);
    });
  }

  if (typeof initScrollReveal === 'function') initScrollReveal();
}

/* ───────────── Predogled na domači strani (3 izdelki) ───────────── */
function initHomePreview(gridId, category, limit = 3) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.dataset.lightboxGroup = gridId;
  const items = productsByCategory(category).slice(0, limit);
  grid.innerHTML = items.map((p, i) => productCardHtml(p, i)).join('');
  if (typeof initScrollReveal === 'function') initScrollReveal('.scroll-reveal');
}
