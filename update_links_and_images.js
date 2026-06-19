const fs = require('fs');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

const links = [
  'https://les.mitsubishielectric.it/en/products/residential_350/air-conditioning_351/wall-mounted_354/msz-ay_4069.html',
  'https://les.mitsubishielectric.it/en/products/residential_350/air-conditioning_351/wall-mounted_354/msz-hr_4036.html',
  'https://les.mitsubishielectric.it/en/products/commercial_358/indoor-units_359/cassettes_515/slz-m_3113.html',
  'https://www.sinclair-solutions.com/sl/arhiv/stenske-klima-naprave-arhiv/9273-sih-soh-12bik.html',
  'https://www.sinclair-solutions.com/sl/produkti/stenske-klima-naprave/serija-keyon/9274-sih-soh-18bik.html',
  'https://www.sinclair-solutions.com/sl/produkti/stenske-klima-naprave/serija-marvin/13418-sih-soh-12bim.html',
  'https://www.sinclair-solutions.com/sl/produkti/stenske-klima-naprave/serija-marvin/13419-sih-soh-18bim.html',
  'https://www.sinclair-solutions.com/sl/arhiv/uni-split-kasetne-enote-units-arhiv/7266-asc-12bi.html'
];

let sections = html.split('<!-- SLIKE -->');

// 1. Swap first and third image for the 3rd AC (index 3)
let ac3 = sections[3];
const snapRegex = /<div class="snap-center shrink-0 w-full h-full relative flex items-center justify-center p-4">[\s\S]*?<\/div>/g;
const snaps = [...ac3.matchAll(snapRegex)];

if (snaps.length >= 3) {
  const snap1 = snaps[0][0];
  const snap3 = snaps[2][0];
  
  // Swap them
  ac3 = ac3.replace(snap1, '@@SNAP1_PLACEHOLDER@@');
  ac3 = ac3.replace(snap3, snap1);
  ac3 = ac3.replace('@@SNAP1_PLACEHOLDER@@', snap3);
  
  sections[3] = ac3;
} else {
  console.log('WARNING: 3rd AC does not have 3 images!');
}

// 2. Update links for all 8 ACs
for (let i = 1; i <= 8; i++) {
  if (sections[i]) {
    sections[i] = sections[i].replace(/<a href="[^"]*" target="_blank" rel="noopener noreferrer"/, `<a href="${links[i - 1]}" target="_blank" rel="noopener noreferrer"`);
  }
}

html = sections.join('<!-- SLIKE -->');
fs.writeFileSync('klimatske-naprave.html', html);
console.log('Images swapped and links updated successfully!');
