const fs = require('fs');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

const regex = /<div class="absolute top-2 right-2 bg-brand-black\/60 text-white text-\[10px\] font-bold px-2 py-1 rounded-full z-10 backdrop-blur-sm pointer-events-none">\s*1 \/ (\d+)\s*<span class="ml-1 opacity-70">\(podrsaj\)<\/span>\s*<\/div>/g;

html = html.replace(regex, (match, count) => {
  return `<div class="absolute top-2 right-2 bg-brand-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 backdrop-blur-sm pointer-events-none">
          ${count} slike
        </div>
        <button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all text-brand-black focus:outline-none" aria-label="Prejšnja slika" onclick="const c=this.closest('.relative').querySelector('.overflow-x-auto'); c.scrollBy({left: -c.clientWidth, behavior: 'smooth'})">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all text-brand-black focus:outline-none" aria-label="Naslednja slika" onclick="const c=this.closest('.relative').querySelector('.overflow-x-auto'); c.scrollBy({left: c.clientWidth, behavior: 'smooth'})">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>`;
});

fs.writeFileSync('klimatske-naprave.html', html);
console.log('Arrows added successfully!');
