const fs = require('fs');

const products = [
  {
    title: 'Mitsubishi Electric AY35 — stenska klimatska naprava',
    desc: 'Mitsubishi Electric AY35 je kakovostna stenska klimatska naprava za učinkovito hlajenje in ogrevanje bivalnih prostorov. Odlikuje jo eleganten bel dizajn, zelo tiho delovanje, visoka energijska učinkovitost ter napreden sistem filtracije zraka Plasma Quad Plus. Primerna je za stanovanja, hiše, pisarne in manjše poslovne prostore.',
    features: [
      'Energijski razred: A+++ / A++',
      'Moč hlajenja: 3,5 kW',
      'Moč ogrevanja: 4,0 kW',
      'Hladilno sredstvo: R32',
      'Zelo tiho delovanje, do 18 dB(A)',
      'Vgrajen Wi-Fi nadzor MELCloud',
      'Plasma Quad Plus filter',
      'Self Clean funkcija',
      'Dual Barrier Coating zaščita',
      'Tedenski časovnik'
    ],
    officialModel: 'Mitsubishi Electric MSZ-AY serija',
    link: 'https://mitsubishielectric.it/en/products-solutions/air-conditioning'
  },
  {
    title: 'Mitsubishi Electric HR35 — stenska klimatska naprava',
    desc: 'Mitsubishi Electric HR35 je zanesljiva in cenovno ugodnejša stenska klimatska naprava za hlajenje in ogrevanje prostorov. Enota ima kompakten dizajn, tiho delovanje in varčno inverter tehnologijo, zato je primerna za vsakodnevno uporabo v stanovanjih, hišah in manjših pisarnah.',
    features: [
      'Energijski razred: A++ / A+',
      'Moč hlajenja: 3,4 kW',
      'Moč ogrevanja: 3,6 kW',
      'Hladilno sredstvo: R32',
      'Invertersko delovanje',
      'Kompaktna notranja enota',
      'Tiho delovanje',
      'Enostavno upravljanje z daljinskim upravljalnikom',
      'Možnost Wi-Fi upravljanja, odvisno od izvedbe modela',
      'Primerna izbira za osnovno in zanesljivo klimatizacijo'
    ],
    officialModel: 'Mitsubishi Electric MSZ-HR serija',
    link: 'https://mitsubishielectric.it/en/products-solutions/air-conditioning'
  },
  {
    title: 'Mitsubishi Electric SLZ-M35 — kasetna klimatska naprava',
    desc: 'Mitsubishi Electric SLZ-M35 je kompaktna kasetna klimatska naprava, primerna za vgradnjo v spuščen strop. Zaradi štirismernega izpiha zraka omogoča enakomerno razporeditev temperature po prostoru. Odlična je za pisarne, poslovne prostore, lokale in prostore, kjer stenska montaža ni najboljša rešitev.',
    features: [
      'Tip naprave: kasetna klimatska naprava',
      'Moč hlajenja: 3,5 kW',
      'Moč ogrevanja: 4,0 kW',
      'Hladilno sredstvo: R32',
      'Štirismerni izpih zraka',
      'Kompaktna izvedba za spuščen strop',
      'Tiho delovanje',
      'Možnost 3D i-see senzorja',
      'Vgrajena kondenzna črpalka',
      'Primerna za pisarne in poslovne prostore'
    ],
    officialModel: 'Mitsubishi Electric SLZ-M35',
    link: 'https://mitsubishielectric.it/en/products-solutions/air-conditioning'
  },
  {
    title: 'Sinclair Keyon 12BIK — stenska klimatska naprava',
    desc: 'Sinclair Keyon 12BIK je stenska split klimatska naprava za hlajenje in ogrevanje manjših do srednje velikih prostorov. Enota ima moderen bel dizajn, skrit prikazovalnik, funkcijo I FEEL in možnost udobnega upravljanja. Primerna je za stanovanja, apartmaje, sobe in manjše pisarne.',
    features: [
      'Energijski razred: A++ / A++ pri starejši 12BIK izvedbi (oz. A++ / A+ pri modelu 12BIK2)',
      'Moč hlajenja: 3,2 kW',
      'Moč ogrevanja: 3,4 kW',
      'Hladilno sredstvo: R32',
      'Skrit prikazovalnik',
      'Funkcija I FEEL',
      'Izpust kondenza v obe smeri',
      '8 °C temperiranje',
      'Plazma generator',
      'Wi-Fi, odvisno od izvedbe oziroma paketa'
    ],
    officialModel: 'Sinclair SIH + SOH-12BIK',
    link: 'https://www.sinclair-solutions.com/en/products/residential-air-conditioners/wall-mounted-units/keyon/sih-12bik.html'
  },
  {
    title: 'Sinclair Keyon 18BIK — stenska klimatska naprava',
    desc: 'Sinclair Keyon 18BIK je zmogljivejša stenska klimatska naprava za večje prostore. Namenjena je učinkovitemu hlajenju in ogrevanju stanovanjskih ali poslovnih prostorov, kjer je potrebna večja moč. Ponuja skrit prikazovalnik, funkcijo I FEEL, izpust kondenza na obe strani in prijetno upravljanje.',
    features: [
      'Energijski razred: A++ / A+',
      'Moč hlajenja: 4,6 kW',
      'Moč ogrevanja: 5,2 kW',
      'Hladilno sredstvo: R32',
      'Skrit prikazovalnik',
      'Funkcija I FEEL',
      'Izpust kondenza v obe smeri',
      'Primerna za večje dnevne prostore, pisarne in poslovne prostore',
      'Invertersko delovanje',
      'Možnost Wi-Fi upravljanja, odvisno od izvedbe'
    ],
    officialModel: 'Sinclair SIH + SOH-18BIK',
    link: 'https://www.sinclair-solutions.com/en/products/residential-air-conditioners/wall-mounted-units/keyon/sih-18bik.html'
  },
  {
    title: 'Sinclair Marvin 12BIM — stenska klimatska naprava',
    desc: 'Sinclair Marvin 12BIM je sodobna stenska klimatska naprava z visoko energijsko učinkovitostjo in elegantnim dizajnom. Primerna je za hlajenje in ogrevanje stanovanj, sob, apartmajev in manjših poslovnih prostorov. Odlikujejo jo tiho delovanje, funkcija I FEEL, skrit prikazovalnik in udobno nastavljanje ogrevanja.',
    features: [
      'Energijski razred: A+++ / A++',
      'Moč hlajenja: 3,5 kW',
      'Moč ogrevanja: 3,8 kW',
      'Hladilno sredstvo: R32',
      'Skrit prikazovalnik',
      'Funkcija I FEEL',
      'Odvajanje kondenza na obe strani',
      'Nastavljiv razpon ogrevanja',
      'Tiho in varčno delovanje',
      'Primerna za manjše in srednje velike prostore'
    ],
    officialModel: 'Sinclair SIH + SOH-12BIM',
    link: 'https://www.sinclair-solutions.com/en/products/residential-air-conditioners/wall-mounted-units/marvin/'
  },
  {
    title: 'Sinclair Marvin 18BIM — stenska klimatska naprava',
    desc: 'Sinclair Marvin 18BIM je zmogljiva stenska klimatska naprava za večje prostore, kjer je potrebna učinkovita klimatizacija skozi vse leto. Omogoča hlajenje in ogrevanje, ima skrit prikazovalnik, funkcijo I FEEL ter visoko energijsko učinkovitost. Primerna je za večje dnevne sobe, pisarne, apartmaje in poslovne prostore.',
    features: [
      'Energijski razred: A+++ / A++',
      'Moč hlajenja: 5,3 kW',
      'Moč ogrevanja: 5,4 kW',
      'Hladilno sredstvo: R32',
      'Skrit prikazovalnik',
      'Funkcija I FEEL',
      'Odvajanje kondenza na obe strani',
      'Invertersko delovanje',
      'Primerna za večje prostore',
      'Varčno hlajenje in ogrevanje'
    ],
    officialModel: 'Sinclair SIH + SOH-18BIM',
    link: 'https://www.sinclair-solutions.com/en/products/residential-air-conditioners/wall-mounted-units/marvin/'
  },
  {
    title: 'Sinclair ASC-12BI — kasetna klimatska naprava',
    desc: 'Sinclair ASC-12BI je kasetna klimatska naprava za vgradnjo v spuščen strop. Zaradi diskretne montaže in enakomerne razporeditve zraka je primerna za pisarne, lokale, poslovne prostore in druge objekte, kjer je pomembna funkcionalna in estetska rešitev klimatizacije.',
    features: [
      'Tip naprave: kasetna klimatska naprava',
      'Energijski razred: A+ / A+',
      'Moč hlajenja: 3,5 kW',
      'Moč ogrevanja: 4,0 kW',
      'DC inverter tehnologija',
      'Funkcija samodejnega ponovnega zagona',
      'Primerna za spuščen strop',
      'Enakomerna razporeditev zraka po prostoru',
      'Primerna za pisarne, lokale in poslovne prostore'
    ],
    officialModel: 'Sinclair ASC-12BI',
    link: 'https://www.sinclair-solutions.com/en/products/commercial-air-conditioners/cassette-units/asc-12bi.html'
  }
];

const cardsHtml = products.map(p => `
          <div class="scroll-reveal bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group h-full">
            <!-- PLACEHOLDER ZA SLIKO -->
            <div class="relative w-full aspect-video bg-gray-50 flex flex-col items-center justify-center border-b border-gray-100">
              <svg class="w-12 h-12 text-gray-300 mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span class="text-sm font-medium text-gray-400">Slika tukaj (dodana kasneje)</span>
            </div>
            
            <div class="p-6 flex flex-col flex-1">
              <h3 class="text-xl font-bold text-brand-black mb-3 leading-tight">${p.title}</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">${p.desc}</p>
              
              <ul class="space-y-2 mb-6 flex-1">
                ${p.features.map(f => `
                <li class="flex items-start gap-2 text-sm text-gray-700">
                  <svg class="w-4 h-4 text-brand-blue-deep flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span>${f}</span>
                </li>`).join('')}
              </ul>
              
              <div class="mt-auto border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span class="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">${p.officialModel}</span>
                <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-brand-blue-deep bg-brand-blue-soft/50 hover:bg-brand-blue-soft rounded-lg transition-colors w-full sm:w-auto text-center">
                  Uradna stran
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>
          </div>
`).join('');

const sectionHtml = `
    <!-- PONUDBA NAPRAV -->
    <section class="relative py-12 md:py-16 bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 md:mb-14 scroll-reveal">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-brand-black">Naša ponudba naprav</h2>
          <p class="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">V naši ponudbi najdete kakovostne in preverjene klimatske naprave proizvajalcev Mitsubishi Electric in Sinclair. Spodaj so podrobneje predstavljeni naši najbolj iskani modeli.</p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-6 lg:gap-8">
${cardsHtml}
        </div>
      </div>
    </section>
`;

// Insert into klimatske-naprave.html
let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// The marker to insert before:
const marker = '<!-- GALERIJA SLIK -->';
html = html.replace(marker, sectionHtml + '\n    ' + marker);

fs.writeFileSync('klimatske-naprave.html', html);
console.log('Products successfully added to klimatske-naprave.html');
