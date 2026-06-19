const fs = require('fs');
let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// The ACs that need swapping (1-indexed): 2, 3, 4, 6, 8.
// We can find all products by looking for <!-- SLIKE --> and their corresponding <h3> tags.

const sections = html.split('<!-- SLIKE -->');
// sections[0] is everything before the first product.
// sections[1..8] are the products.

[2, 3, 4, 6, 8].forEach(index => {
  let section = sections[index];
  
  // A section has:
  // <div class="relative w-full aspect-[4/3] sm:aspect-video bg-white border-b border-gray-100 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar group/slider">
  //   <div class="snap-center ..."> ... </div>
  //   <div class="snap-center ..."> ... </div>
  //   ...
  // </div>
  
  // We need to swap the first two <div class="snap-center ..."> blocks.
  const snapRegex = /<div class="snap-center shrink-0 w-full h-full relative flex items-center justify-center p-4">[\s\S]*?<\/div>/g;
  
  const snaps = [...section.matchAll(snapRegex)];
  
  if (snaps.length >= 2) {
    const snap1 = snaps[0][0];
    const snap2 = snaps[1][0];
    
    // Replace snap1 with a placeholder, snap2 with snap1, then placeholder with snap2
    section = section.replace(snap1, '@@SNAP1_PLACEHOLDER@@');
    section = section.replace(snap2, snap1);
    section = section.replace('@@SNAP1_PLACEHOLDER@@', snap2);
    
    sections[index] = section;
  }
});

html = sections.join('<!-- SLIKE -->');
fs.writeFileSync('klimatske-naprave.html', html);
console.log('Swapped images successfully!');
