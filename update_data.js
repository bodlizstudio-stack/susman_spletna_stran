const fs = require('fs');

const projects = JSON.parse(fs.readFileSync('projects_preview.json', 'utf8'));

const jsCode = `/** Kategorije galerije */
const GALLERY_CATEGORIES = [
  { id: 'klima', label: 'Klimatske naprave' },
  { id: 'prezracevanje', label: 'Prezračevanje' },
  { id: 'ogrevanje-vodovod', label: 'Ogrevanje in vodovod' }
];

/** Vse slike galerije */
const GALLERY_ITEMS = ${JSON.stringify(projects, null, 2)};

const GALLERY_PREVIEW_COUNT = 6;

function galleryItemsByCategory(category) {
  if (!category) return GALLERY_ITEMS;
  return GALLERY_ITEMS.filter((item) => item.category === category);
}
`;

fs.writeFileSync('gallery-data.js', jsCode);
console.log('Updated gallery-data.js');
