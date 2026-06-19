const fs = require('fs');
const files = ['index.html', 'klimatske-naprave.html', 'prezracevanje.html', 'ogrevanje-vodovod.html'];

files.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('overflow-x-hidden')) {
    html = html.replace('<body class="font-sans text-brand-ink bg-white antialiased">', '<body class="font-sans text-brand-ink bg-white antialiased overflow-x-hidden">');
    fs.writeFileSync(file, html);
  }
});

console.log('Mobile optimization (overflow-x-hidden) applied.');
