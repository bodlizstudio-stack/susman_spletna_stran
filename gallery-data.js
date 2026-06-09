/** Kategorije galerije */
const GALLERY_CATEGORIES = [
  { id: 'all', label: 'Vse' },
  { id: 'klima', label: 'Klimatske naprave' },
  { id: 'prezracevanje', label: 'Prezračevanje' },
];

/** Vse slike galerije — dodajte datoteke v mapo galerija/ ali posodobite poti src */
const GALLERY_ITEMS = [
  { src: 'IMG_9474.jpg', title: 'Montaža split klime — stanovanje', category: 'klima' },
  { src: 'galerija/02-notranja.jpg', title: 'Montaža — notranja enota', category: 'klima' },
  { src: 'galerija/03-zunanja.jpg', title: 'Montaža — zunanja enota', category: 'klima' },
  { src: 'galerija/04-servis.jpg', title: 'Servis klimatske naprave', category: 'klima' },
  { src: 'galerija/05-pisarna.jpg', title: 'Montaža — pisarna', category: 'klima' },
  { src: 'galerija/06-hisa.jpg', title: 'Montaža — eno in dvostanovanjska hiša', category: 'klima' },
  { src: 'galerija/07-dvosed.jpg', title: 'Montaža — dve notranji enoti', category: 'klima' },
  { src: 'galerija/08-kanal.jpg', title: 'Montaža — kanalni sistem', category: 'klima' },
  { src: 'galerija/09-prezracevanje.jpg', title: 'Prezračevanje — rekuperator', category: 'prezracevanje' },
  { src: 'galerija/10-stanovanje2.jpg', title: 'Montaža — spalnica', category: 'klima' },
  { src: 'galerija/11-dnevna.jpg', title: 'Montaža — dnevna soba', category: 'klima' },
  { src: 'galerija/12-servis2.jpg', title: 'Letni servis in čiščenje', category: 'klima' },
  { src: 'galerija/13-rekuperator.jpg', title: 'Centralni rekuperator — vgradnja', category: 'prezracevanje' },
  { src: 'galerija/14-decentral.jpg', title: 'Decentralno prezračevanje — stena', category: 'prezracevanje' },
  { src: 'galerija/15-kanali.jpg', title: 'Prezračevanje — kanalski razvod', category: 'prezracevanje' },
];

const GALLERY_PREVIEW_COUNT = 6;

function galleryItemsByCategory(category) {
  if (!category || category === 'all') return GALLERY_ITEMS;
  return GALLERY_ITEMS.filter((item) => item.category === category);
}
