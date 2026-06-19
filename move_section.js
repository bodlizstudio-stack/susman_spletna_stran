const fs = require('fs');

let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

const ponudbaStart = '<!-- PONUDBA NAPRAV -->';
const ponudbaEnd = '    <!-- GALERIJA SLIK -->'; // next section
const storitveStart = '    <!-- STORITVE IN POSTOPEK -->';

const startIndex = html.indexOf(ponudbaStart);
const endIndex = html.indexOf(ponudbaEnd);

if (startIndex !== -1 && endIndex !== -1) {
  let ponudbaSection = html.slice(startIndex, endIndex);
  
  // Remove the section from its current place
  html = html.slice(0, startIndex) + html.slice(endIndex);
  
  // Shrink the grid (make it 3 in a row instead of 2)
  ponudbaSection = ponudbaSection.replace(
    '<div class="grid lg:grid-cols-2 gap-6 lg:gap-8">',
    '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">'
  );
  
  // Adjust card image height aspect ratio slightly from aspect-[4/3] to aspect-video to fit better when smaller?
  // User said "mau pomanjšaj okvirčke ne velik" (make the frames a bit smaller, not huge).
  // With 3 in a row, they are automatically smaller!
  
  // Insert it right before STORITVE IN POSTOPEK
  html = html.replace(storitveStart, ponudbaSection + '\n' + storitveStart);
  
  fs.writeFileSync('klimatske-naprave.html', html);
  console.log('Section moved and grid updated.');
} else {
  console.log('Could not find markers.');
}
