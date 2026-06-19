const fs = require('fs');

const projects = JSON.parse(fs.readFileSync('projects_preview.json', 'utf8'));

// Group all images by category
const categoryImages = {
  'klima': [],
  'prezracevanje': [],
  'ogrevanje-vodovod': []
};

projects.forEach(p => {
  if (categoryImages[p.category]) {
    categoryImages[p.category].push(...p.images);
  }
});

const getNewGalleryHtml = (cat, titleText) => {
  const images = categoryImages[cat];
  const imagesStr = JSON.stringify(images).replace(/'/g, "&#39;");
  const cover = images[0];
  const count = images.length;
  
  return `<div class="flex justify-center">
          <button type="button" class="gallery-card lightbox-item group relative w-full max-w-3xl aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 scroll-reveal" 
            data-src="${cover}" data-title="${titleText}" data-images='${imagesStr}'>
            <img src="${cover}" alt="${titleText}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="absolute inset-0 bg-brand-black/40 group-hover:bg-brand-black/60 transition-all duration-300 flex flex-col items-center justify-center pointer-events-none p-4">
              <svg class="w-12 h-12 text-white mb-3 opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span class="text-white text-xl sm:text-3xl font-extrabold tracking-wide drop-shadow-md text-center">
                Odpri celotno galerijo
              </span>
              <span class="mt-2 text-white/80 text-sm font-medium bg-brand-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                ${count} fotografij
              </span>
            </div>
          </button>
        </div>`;
};

const pages = [
  { file: 'klimatske-naprave.html', cat: 'klima', title: 'Galerija klimatskih naprav' },
  { file: 'prezracevanje.html', cat: 'prezracevanje', title: 'Galerija prezračevanja' },
  { file: 'ogrevanje-vodovod.html', cat: 'ogrevanje-vodovod', title: 'Galerija ogrevanja in vodovoda' }
];

pages.forEach(p => {
  let html = fs.readFileSync(p.file, 'utf8');
  
  // We need to replace the grid block under "Naše delo v sliki"
  // The block starts with <div class="grid sm:grid-cols-3... and ends 3 buttons later.
  // We can use a regex that finds the "Naše delo v sliki" header and replaces the next grid container.
  
  const searchPattern = /(<h2 class="text-2xl sm:text-3xl font-extrabold text-brand-black">Naše delo v sliki<\/h2>\s*<p class="text-gray-500 text-sm mt-1">Kliknite na sliko za povečavo\.<\/p>\s*<\/div>\s*)<div class="grid sm:grid-cols-3 gap-6 lg:gap-8"[\s\S]*?<\/button>\s*<\/div>/;
  
  html = html.replace(searchPattern, `$1${getNewGalleryHtml(p.cat, p.title)}`);
  
  fs.writeFileSync(p.file, html);
  console.log('Updated ' + p.file);
});
