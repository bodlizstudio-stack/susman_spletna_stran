const fs = require('fs');

let html = fs.readFileSync('galerija.html', 'utf8');

// Replace the filter and full gallery div with static 3 images
const staticGalleryHtml = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        <div class="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img src="susman slike/klime/enostavna_zlita_z_okoljem.jpg" alt="Montaža klim" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img src="susman slike/prezračevanje/IMG_7392.jpeg" alt="Prezračevanje" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img src="susman slike/ogrevanje in vodovod/talno_gretje.jpg" alt="Ogrevanje in vodovod" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
`;

// Remove filter div and gallery-full div
const regex = /<div id="gallery-filter"[\s\S]*?<div id="gallery-full"[^>]*><\/div>/;
html = html.replace(regex, staticGalleryHtml);

// Remove the text "Izberite kategorijo — klimatske naprave ali prezračevanje. Kliknite za povečavo."
html = html.replace('Izberite kategorijo — klimatske naprave ali prezračevanje. Kliknite za povečavo.', 'Naši izvedeni projekti.');

// Remove the script initialization
html = html.replace(/initGalleryCategoryFilter\([\s\S]*?\}\);/g, '');
html = html.replace(/initLightbox\(false\);/g, '');

// Also remove the "count fotografij"
html = html.replace(/<span id="gallery-count"><\/span> fotografij ·/, '');

fs.writeFileSync('galerija.html', html);
console.log('Fixed galerija.html to be fully static with 3 images');
