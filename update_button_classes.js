const fs = require('fs');

const pages = ['klimatske-naprave.html', 'prezracevanje.html', 'ogrevanje-vodovod.html'];

pages.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  
  // Replace the single gallery button's class and add data attribute
  html = html.replace(/class="gallery-card lightbox-item group relative w-full max-w-3xl/g, 'class="gallery-card grid-modal-trigger group relative w-full max-w-3xl" data-open-grid="true"');
  
  fs.writeFileSync(file, html);
  console.log('Updated ' + file);
});
