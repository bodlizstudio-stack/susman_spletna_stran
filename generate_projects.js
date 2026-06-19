const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'susman slike');

const categories = {
  'klime': 'klima',
  'ogrevanje in vodovod': 'ogrevanje-vodovod',
  'prezračevanje': 'prezracevanje'
};

const defaultTitles = {
  'klima': 'Montaža klimatske naprave',
  'ogrevanje-vodovod': 'Strojne inštalacije',
  'prezracevanje': 'Montaža prezračevalnega sistema'
};

const projects = [];
let projectId = 1;

for (const [folder, catId] of Object.entries(categories)) {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) continue;

  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  
  // Group by base name. 
  // e.g. "Montaža stenske klimatske naprave Gree (2).jpg" -> base "Montaža stenske klimatske naprave Gree"
  // "Montaža stenske klimatske naprave Sinclair1.jpg" -> base "Montaža stenske klimatske naprave Sinclair"
  // "FullSizeRender_(13).jpg" -> base "FullSizeRender" or we put them in separate if they look unrelated? The prompt says "vsaka druga znamka ali druga lokacija naj bo ločena kartica". FullSizeRender are probably separate. So we won't group FullSizeRender unless numbers are sequential? Actually, better to make each FullSizeRender its own project with a default title.
  
  const groups = {};

  files.forEach(file => {
    let name = path.basename(file, path.extname(file));
    let isFullSize = name.startsWith('FullSizeRender') || name.startsWith('IMG_') || name.startsWith('image');
    
    let baseName = name;
    if (!isFullSize) {
      // Remove trailing numbers, spaces, or (2), (3) etc.
      baseName = name.replace(/\s*\(\d+\)$/, '').replace(/\d+$/, '').trim();
    } else {
      // Each is its own project
      baseName = name;
    }

    if (!groups[baseName]) {
      groups[baseName] = [];
    }
    groups[baseName].push(file);
  });

  for (const [baseName, imgs] of Object.entries(groups)) {
    let isFullSize = baseName.startsWith('FullSizeRender') || baseName.startsWith('IMG_') || baseName.startsWith('image');
    
    let title = baseName;
    if (isFullSize) {
      title = defaultTitles[catId];
    } else {
      // Clean up title format
      title = title.replace(/_/g, ' ');
      // capitalize first letter
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
    // Custom overrides based on prompt rules
    if (title.toLowerCase().includes('ecodan')) {
      title = 'Montaža zunanje enote toplotne črpalke Mitsubishi Electric Ecodan';
    } else if (title.toLowerCase().includes('lg') && title.toLowerCase().includes('toplotna')) {
      title = 'Montaža toplotne črpalke LG Therma V';
    }

    const relPaths = imgs.map(i => `susman slike/${folder}/${i}`);
    
    projects.push({
      id: `proj-${projectId++}`,
      title: title,
      category: catId,
      coverImage: relPaths[0],
      images: relPaths,
      alt: title
    });
  }
}

fs.writeFileSync('projects_preview.json', JSON.stringify(projects, null, 2));
console.log('Generated projects_preview.json with ' + projects.length + ' projects.');
