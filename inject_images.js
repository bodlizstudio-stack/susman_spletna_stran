const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// We need to inject a tiny style for hiding scrollbars if not present
if (!html.includes('.hide-scrollbar')) {
  html = html.replace('</head>', `
  <style>
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>`);
}

const folders = fs.readdirSync('slike izdelkov', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// We will use regex to find each product card and replace the placeholder.
// The regex finds the placeholder block and the subsequent <h3> to know which product it is.

const cardRegex = /<!-- PLACEHOLDER ZA SLIKO -->\s*<div class="relative w-full aspect-video[^>]*>[\s\S]*?<\/div>\s*<div class="p-6 flex flex-col flex-1">\s*<h3 class="[^"]*">(.*?)<\/h3>/g;

html = html.replace(cardRegex, (match, titleHtml) => {
  // Extract the product name from title (before the "—" or " - ")
  const productNameMatch = titleHtml.split(/—|-/)[0].trim();
  
  // Find matching folder
  const folderName = folders.find(f => productNameMatch.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(productNameMatch.toLowerCase()));
  
  if (folderName) {
    const images = fs.readdirSync(path.join('slike izdelkov', folderName))
      .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
    
    if (images.length > 0) {
      let sliderHtml = `<div class="relative w-full aspect-[4/3] sm:aspect-video bg-white border-b border-gray-100 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar group/slider">`;
      
      images.forEach((img, idx) => {
        // use object-contain so we don't crop product images, usually they have white bg
        sliderHtml += `
          <div class="snap-center shrink-0 w-full h-full relative flex items-center justify-center p-4">
            <img src="slike izdelkov/${folderName}/${img}" alt="${productNameMatch} slika ${idx + 1}" class="w-full h-full object-contain hover:scale-105 transition-transform duration-500" loading="lazy">
          </div>`;
      });
      
      sliderHtml += `</div>`;
      
      // Add small indicator dots if multiple images
      if (images.length > 1) {
        sliderHtml += `
        <div class="absolute top-2 right-2 bg-brand-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 backdrop-blur-sm pointer-events-none">
          1 / ${images.length} 
          <span class="ml-1 opacity-70">(podrsaj)</span>
        </div>`;
        // Let's add a small script or just rely on CSS scroll snap and the hint.
      }
      
      return `<!-- SLIKE -->
            <div class="relative">
              ${sliderHtml}
            </div>
            <div class="p-6 flex flex-col flex-1">
              <h3 class="text-xl font-bold text-brand-black mb-3 leading-tight">${titleHtml}</h3>`;
    }
  }
  
  return match; // return unmodified if folder or images not found
});

fs.writeFileSync('klimatske-naprave.html', html);
console.log('Images successfully injected!');
