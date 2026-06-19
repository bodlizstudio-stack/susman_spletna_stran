const fs = require('fs');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');
let sections = html.split('<!-- SLIKE -->');

// Re-generate slider for a given section index, folder name, and product name.
function regenSlider(index, folderName, productNameMatch, swap1and2) {
  const images = fs.readdirSync('slike izdelkov/' + folderName)
    .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i));
    
  if (images.length === 0) return;
  
  // Apply swap if requested
  if (swap1and2 && images.length >= 2) {
    const temp = images[0];
    images[0] = images[1];
    images[1] = temp;
  }
  
  let sliderHtml = `<div class="relative w-full aspect-[4/3] sm:aspect-video bg-white border-b border-gray-100 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar group/slider">`;
  
  images.forEach((img, idx) => {
    sliderHtml += `
          <div class="snap-center shrink-0 w-full h-full relative flex items-center justify-center p-4">
            <img src="slike izdelkov/${folderName}/${img}" alt="${productNameMatch} slika ${idx + 1}" class="w-full h-full object-contain hover:scale-105 transition-transform duration-500" loading="lazy">
          </div>`;
  });
  
  sliderHtml += `</div>`;
  
  if (images.length > 1) {
    sliderHtml += `
        <div class="absolute top-2 right-2 bg-brand-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 backdrop-blur-sm pointer-events-none">
          ${images.length} slike
        </div>
        <button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all text-brand-black focus:outline-none" aria-label="Prejšnja slika" onclick="const c=this.closest('.relative').querySelector('.overflow-x-auto'); c.scrollBy({left: -c.clientWidth, behavior: 'smooth'})">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all text-brand-black focus:outline-none" aria-label="Naslednja slika" onclick="const c=this.closest('.relative').querySelector('.overflow-x-auto'); c.scrollBy({left: c.clientWidth, behavior: 'smooth'})">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>`;
  }
  
  const replacement = `
            <div class="relative">
              ${sliderHtml}
            </div>`;
            
  // Find the `<div class="relative"> ... </div>` block in the section and replace it.
  // The block ends right before `<div class="p-6 flex flex-col flex-1">`
  const regex = /<div class="relative">[\s\S]*?(?=<div class="p-6 flex flex-col flex-1">)/;
  sections[index] = sections[index].replace(regex, replacement + '\n            ');
}

// 12BIK is AC 4. Folder: "Sinclair Keyon 12BIK". Name: "Sinclair Keyon 12BIK".
regenSlider(4, 'Sinclair Keyon 12BIK', 'Sinclair Keyon 12BIK', true);

// 12BI is AC 8 (Sinclair ASC-12BI). Folder: "Sinclair ASC-12BI". Name: "Sinclair ASC-12BI".
regenSlider(8, 'Sinclair ASC-12BI', 'Sinclair ASC-12BI', true);

html = sections.join('<!-- SLIKE -->');
fs.writeFileSync('klimatske-naprave.html', html);
console.log('Fixed 12BIK and ASC-12BI images successfully!');
