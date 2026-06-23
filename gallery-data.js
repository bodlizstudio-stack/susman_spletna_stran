/** Kategorije galerije */
const GALLERY_CATEGORIES = [
  { id: 'klima', label: 'Klimatske naprave' },
  { id: 'prezracevanje', label: 'Prezračevanje' },
  { id: 'ogrevanje-vodovod', label: 'Ogrevanje in vodovod' }
];

/** Vse slike galerije */
const GALLERY_ITEMS = [
  {
    "id": "proj-1",
    "title": "Enostavna zlita z okoljem",
    "category": "klima",
    "coverImage": "susman slike/klime/enostavna_zlita_z_okoljem.jpg",
    "images": [
      "susman slike/klime/enostavna_zlita_z_okoljem.jpg"
    ],
    "alt": "Enostavna zlita z okoljem"
  },
  {
    "id": "proj-2",
    "title": "Montaža klimatske naprave",
    "category": "klima",
    "coverImage": "susman slike/klime/FullSizeRender_(13).jpg",
    "images": [
      "susman slike/klime/FullSizeRender_(13).jpg"
    ],
    "alt": "Montaža klimatske naprave"
  },
  {
    "id": "proj-13",
    "title": "Montaža klimatske naprave",
    "category": "klima",
    "coverImage": "susman slike/klime/IMG_1944.jpg",
    "images": [
      "susman slike/klime/IMG_1944.jpg"
    ],
    "alt": "Montaža klimatske naprave"
  },
  {
    "id": "proj-16",
    "title": "Klima daikin",
    "category": "klima",
    "coverImage": "susman slike/klime/klima_daikin.jpg",
    "images": [
      "susman slike/klime/klima_daikin.jpg"
    ],
    "alt": "Klima daikin"
  },
  {
    "id": "proj-17",
    "title": "Klima dnevna soba",
    "category": "klima",
    "coverImage": "susman slike/klime/klima_dnevna_soba.jpg",
    "images": [
      "susman slike/klime/klima_dnevna_soba.jpg"
    ],
    "alt": "Klima dnevna soba"
  },
  {
    "id": "proj-19",
    "title": "Mitsubish klima",
    "category": "klima",
    "coverImage": "susman slike/klime/mitsubish_klima.jpg",
    "images": [
      "susman slike/klime/mitsubish_klima.jpg"
    ],
    "alt": "Mitsubish klima"
  },
  {
    "id": "proj-20",
    "title": "Montaža kasetne klimatske naprave",
    "category": "klima",
    "coverImage": "susman slike/klime/Montaža kasetne klimatske naprave.jpg",
    "images": [
      "susman slike/klime/Montaža kasetne klimatske naprave.jpg"
    ],
    "alt": "Montaža kasetne klimatske naprave"
  },
  {
    "id": "proj-21",
    "title": "Montaža stenske klimatske naprave Cooper & Hunter",
    "category": "klima",
    "coverImage": "susman slike/klime/Montaža stenske klimatske naprave Cooper & Hunter.jpg",
    "images": [
      "susman slike/klime/Montaža stenske klimatske naprave Cooper & Hunter.jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Cooper & Hunter3.jpg"
    ],
    "alt": "Montaža stenske klimatske naprave Cooper & Hunter"
  },
  {
    "id": "proj-22",
    "title": "Montaža stenske klimatske naprave Gree",
    "category": "klima",
    "coverImage": "susman slike/klime/Montaža stenske klimatske naprave Gree (2).jpg",
    "images": [
      "susman slike/klime/Montaža stenske klimatske naprave Gree (2).jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Gree.jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Gree1.jpg"
    ],
    "alt": "Montaža stenske klimatske naprave Gree"
  },
  {
    "id": "proj-23",
    "title": "Montaža stenske klimatske naprave Mitsubishi Electric",
    "category": "klima",
    "coverImage": "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric (2).jpg",
    "images": [
      "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric (2).jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric (3).jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric.jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric5.jpg",
      "susman slike/klime/Montaža stenske klimatske naprave Mitsubishi Electric6.jpg"
    ],
    "alt": "Montaža stenske klimatske naprave Mitsubishi Electric"
  },
  {
    "id": "proj-52",
    "title": "Montaža prezračevalnega sistema",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/FullSizeRender_(30).jpg",
    "images": [
      "susman slike/prezračevanje/FullSizeRender_(30).jpg"
    ],
    "alt": "Montaža prezračevalnega sistema"
  },
  {
    "id": "proj-53",
    "title": "Montaža prezračevalnega sistema",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/FullSizeRender_(42).jpg",
    "images": [
      "susman slike/prezračevanje/FullSizeRender_(42).jpg"
    ],
    "alt": "Montaža prezračevalnega sistema"
  },
  {
    "id": "proj-54",
    "title": "Montaža prezračevalnega sistema",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/FullSizeRender_(6).jpg",
    "images": [
      "susman slike/prezračevanje/FullSizeRender_(6).jpg"
    ],
    "alt": "Montaža prezračevalnega sistema"
  },
  {
    "id": "proj-55",
    "title": "Montaža prezračevalnega sistema",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/FullSizeRender_(9).jpg",
    "images": [
      "susman slike/prezračevanje/FullSizeRender_(9).jpg"
    ],
    "alt": "Montaža prezračevalnega sistema"
  },
  {
    "id": "proj-56",
    "title": "Montaža  prezračevanja v spuščenem stropu",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža  prezračevanja v spuščenem stropu.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža  prezračevanja v spuščenem stropu.jpg"
    ],
    "alt": "Montaža  prezračevanja v spuščenem stropu"
  },
  {
    "id": "proj-57",
    "title": "Montaža prezračevalnega razvoda v spuščenem stropu",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža prezračevalnega razvoda v spuščenem stropu.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža prezračevalnega razvoda v spuščenem stropu.jpg"
    ],
    "alt": "Montaža prezračevalnega razvoda v spuščenem stropu"
  },
  {
    "id": "proj-58",
    "title": "Montaža prezračevalnega razvoda v stropu",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža prezračevalnega razvoda v stropu.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža prezračevalnega razvoda v stropu.jpg",
      "susman slike/prezračevanje/Montaža prezračevalnega razvoda v stropu1.jpg",
      "susman slike/prezračevanje/Montaža prezračevalnega razvoda v stropu2.jpg"
    ],
    "alt": "Montaža prezračevalnega razvoda v stropu"
  },
  {
    "id": "proj-59",
    "title": "Montaža prezračevalnega razvoda v tehničnem prostoru",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža prezračevalnega razvoda v tehničnem prostoru.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža prezračevalnega razvoda v tehničnem prostoru.jpg"
    ],
    "alt": "Montaža prezračevalnega razvoda v tehničnem prostoru"
  },
  {
    "id": "proj-60",
    "title": "Montaža prezračevalnih cevi v steni",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža prezračevalnih cevi v steni.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža prezračevalnih cevi v steni.jpg"
    ],
    "alt": "Montaža prezračevalnih cevi v steni"
  },
  {
    "id": "proj-61",
    "title": "Montaža prezračevalnih kanalov",
    "category": "prezracevanje",
    "coverImage": "susman slike/prezračevanje/Montaža prezračevalnih kanalov.jpg",
    "images": [
      "susman slike/prezračevanje/Montaža prezračevalnih kanalov.jpg"
    ],
    "alt": "Montaža prezračevalnih kanalov"
  },
  {
    "id": "proj-41",
    "title": "Strojne inštalacije",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/FullSizeRender_(14).jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/FullSizeRender_(14).jpg"
    ],
    "alt": "Strojne inštalacije"
  },
  {
    "id": "proj-42",
    "title": "Strojne inštalacije",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/FullSizeRender_(39).jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/FullSizeRender_(39).jpg"
    ],
    "alt": "Strojne inštalacije"
  },
  {
    "id": "proj-43",
    "title": "Strojne inštalacije",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/image000001.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/image000001.jpg"
    ],
    "alt": "Strojne inštalacije"
  },
  {
    "id": "proj-44",
    "title": "Montaža bojlerja s priklopom ogrevalnega sistema",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/Montaža bojlerja s priklopom ogrevalnega sistema.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/Montaža bojlerja s priklopom ogrevalnega sistema.jpg"
    ],
    "alt": "Montaža bojlerja s priklopom ogrevalnega sistema"
  },
  {
    "id": "proj-45",
    "title": "Montaža zunanje enote toplotne črpalke Mitsubishi Electric Ecodan",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/Montaža notranje enote toplotne črpalke Mitsubishi Ecodan.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/Montaža notranje enote toplotne črpalke Mitsubishi Ecodan.jpg"
    ],
    "alt": "Montaža zunanje enote toplotne črpalke Mitsubishi Electric Ecodan"
  },
  {
    "id": "proj-46",
    "title": "Montaža zunanje enote toplotne črpalke Mitsubishi Electric Ecodan",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/Montaža zunanje enote Mitsubishi Electric Ecodan.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/Montaža zunanje enote Mitsubishi Electric Ecodan.jpg"
    ],
    "alt": "Montaža zunanje enote toplotne črpalke Mitsubishi Electric Ecodan"
  },
  {
    "id": "proj-47",
    "title": "Ogrevanje in vodovod montaža",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/ogrevanje_in_vodovod_montaža.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/ogrevanje_in_vodovod_montaža.jpg"
    ],
    "alt": "Ogrevanje in vodovod montaža"
  },
  {
    "id": "proj-48",
    "title": "Razvod talnega ogrevanja",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/Razvod talnega ogrevanja.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/Razvod talnega ogrevanja.jpg"
    ],
    "alt": "Razvod talnega ogrevanja"
  },
  {
    "id": "proj-49",
    "title": "Schneider Electric SM AirSeT razdelilni blok",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/Schneider Electric SM AirSeT razdelilni blok.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/Schneider Electric SM AirSeT razdelilni blok.jpg"
    ],
    "alt": "Schneider Electric SM AirSeT razdelilni blok"
  },
  {
    "id": "proj-50",
    "title": "Talno gretje",
    "category": "ogrevanje-vodovod",
    "coverImage": "susman slike/ogrevanje in vodovod/talno_gretje.jpg",
    "images": [
      "susman slike/ogrevanje in vodovod/talno_gretje.jpg"
    ],
    "alt": "Talno gretje"
  }
];

const GALLERY_PREVIEW_COUNT = 6;

function galleryItemsByCategory(category) {
  if (!category) return GALLERY_ITEMS;
  return GALLERY_ITEMS.filter((item) => item.category === category);
}
