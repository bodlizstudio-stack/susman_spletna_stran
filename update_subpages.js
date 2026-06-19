const fs = require('fs');

const createImgWrapper = (images, title) => {
  const imagesStr = JSON.stringify(images).replace(/'/g, "&#39;");
  const count = images.length;
  
  return `<div class="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 cursor-pointer lightbox-item group"
                 data-src="${images[0]}"
                 data-images='${imagesStr}'
                 data-title="${title}">
              <img src="${images[0]}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
              <div class="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-all duration-300"></div>
              <div class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-brand-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
              </div>
              <div class="absolute top-3 left-3 bg-brand-black/70 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                ${count}
              </div>
            </div>`;
};

const map = {
  'klimatske-naprave.html': [
    {
      title: 'Montaža klimatskih naprav',
      images: [
        "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric (3).jpg", 
        "susman slike/klime/Montaža stenske klimatske naprave Gree (2).jpg", 
        "susman slike/klime/Montaža zunanje enote Cooper & Hunter (2).jpg"
      ]
    },
    {
      title: 'Servis klimatskih naprav',
      images: [
        "susman slike/klime/Servis_klime.jpg",
        "susman slike/klime/FullSizeRender_(43).jpg",
        "susman slike/klime/FullSizeRender_(44).jpg"
      ]
    },
    {
      title: 'Svetovanje pri izbiri',
      images: [
        "susman slike/klime/klima_dnevna_soba.jpg", 
        "susman slike/klime/mitsubish_klima.jpg", 
        "susman slike/klime/enostavna_zlita_z_okoljem.jpg"
      ]
    }
  ],
  'prezracevanje.html': [
    {
      title: 'Montaža prezračevalnih sistemov',
      images: [
        "susman slike/prezračevanje/Montaža prezračevalnega razvoda v spuščenem stropu.jpg", 
        "susman slike/prezračevanje/Montaža prezračevalnih kanalov.jpg"
      ]
    },
    {
      title: 'Lokalno in centralno prezračevanje',
      images: [
        "susman slike/prezračevanje/prezračevanje_hiše.jpg", 
        "susman slike/prezračevanje/prezračevanje_hiše2.jpg"
      ]
    },
    {
      title: 'Servis in čiščenje',
      images: [
        "susman slike/prezračevanje/FullSizeRender_(30).jpg", 
        "susman slike/prezračevanje/FullSizeRender_(42).jpg"
      ]
    }
  ],
  'ogrevanje-vodovod.html': [
    {
      title: 'Toplotne črpalke',
      images: [
        "susman slike/ogrevanje in vodovod/toplotna_črpalkaLG2.jpg", 
        "susman slike/ogrevanje in vodovod/Montaža notranje enote toplotne črpalke Mitsubishi Ecodan.jpg"
      ]
    },
    {
      title: 'Talno ogrevanje',
      images: [
        "susman slike/ogrevanje in vodovod/talno_gretje.jpg", 
        "susman slike/ogrevanje in vodovod/Razvod talnega ogrevanja.jpg"
      ]
    },
    {
      title: 'Strojne inštalacije in vodovod',
      images: [
        "susman slike/ogrevanje in vodovod/ogrevanje_in_vodovod_montaža.jpg", 
        "susman slike/ogrevanje in vodovod/Montaža bojlerja s priklopom ogrevalnega sistema.jpg"
      ]
    }
  ]
};

for (const [file, items] of Object.entries(map)) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Also change the card style to fit the image better
  html = html.replace(/<div class="scroll-reveal bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow/g, '<div class="scroll-reveal bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col');
  
  // Find all service cards which have <div class="w-12 h-12 bg-brand-blue-soft text-brand-blue-deep rounded-2xl flex items-center justify-center mb-6">
  // We will replace this div block (and its inner SVG) with our new image wrapper
  
  const iconRegex = /<div class="w-12 h-12 bg-brand-blue-soft text-brand-blue-deep rounded-2xl flex items-center justify-center mb-6">[\s\S]*?<\/div>\s*<h2/g;
  
  let itemIndex = 0;
  html = html.replace(iconRegex, (match) => {
    if (itemIndex >= items.length) return match;
    const replacement = createImgWrapper(items[itemIndex].images, items[itemIndex].title) + '\n            <h2';
    itemIndex++;
    return replacement;
  });

  fs.writeFileSync(file, html);
  console.log('Updated ' + file);
}
