const fs = require('fs');
let html = fs.readFileSync('klimatske-naprave.html', 'utf8');

// The folder is "Slike izdelkov", not "slike izdelkov". Linux is case-sensitive!
html = html.replace(/slike izdelkov\//g, 'Slike izdelkov/');

fs.writeFileSync('klimatske-naprave.html', html);
console.log('Fixed case sensitivity for Slike izdelkov in klimatske-naprave.html');
