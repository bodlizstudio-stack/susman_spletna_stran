const fs = require('fs');

const pages = ['klimatske-naprave.html', 'prezracevanje.html', 'ogrevanje-vodovod.html'];

pages.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  
  // The broken string is:
  // class="gallery-card grid-modal-trigger group relative w-full max-w-3xl" data-open-grid="true" aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 scroll-reveal"
  // We need to move the `"` from after `max-w-3xl` to the end after `scroll-reveal` and put `data-open-grid="true"` outside.
  
  const badPart = `class="gallery-card grid-modal-trigger group relative w-full max-w-3xl" data-open-grid="true" aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 scroll-reveal"`;
  
  const goodPart = `class="gallery-card grid-modal-trigger group relative w-full max-w-3xl aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 scroll-reveal" data-open-grid="true"`;
  
  html = html.replace(badPart, goodPart);
  
  fs.writeFileSync(file, html);
  console.log('Fixed ' + file);
});
