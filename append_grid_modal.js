const fs = require('fs');

const appendCode = `

function initGridModal() {
  if (document.getElementById('grid-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'grid-modal';
  modal.className = 'fixed inset-0 z-[90] flex-col bg-brand-black/95 backdrop-blur-md hidden';
  modal.innerHTML = \`
    <div class="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
      <h3 id="grid-modal-title" class="text-white text-xl sm:text-2xl font-bold">Galerija</h3>
      <button type="button" id="grid-modal-close" class="p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors" aria-label="Zapri">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div id="grid-modal-content" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto"></div>
    </div>
  \`;
  document.body.appendChild(modal);

  const closeBtn = document.getElementById('grid-modal-close');
  const content = document.getElementById('grid-modal-content');
  const title = document.getElementById('grid-modal-title');

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.grid-modal-trigger');
    if (!trigger) return;
    e.preventDefault();
    
    const imagesRaw = trigger.dataset.images;
    let imagesArr = [];
    if (imagesRaw) {
      try { imagesArr = JSON.parse(imagesRaw); } catch(err) {}
    }
    if (!imagesArr || !imagesArr.length) return;
    
    title.textContent = trigger.dataset.title || 'Galerija';
    
    // Generate grid items
    content.innerHTML = imagesArr.map((src, idx) => \`
      <button type="button" class="lightbox-item aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-white transition-all focus:outline-none"
        data-src="\${src}" 
        data-images='\${imagesRaw}' 
        data-title="\${title.textContent}"
        data-start-index="\${idx}">
        <img src="\${src}" alt="Slika \${idx+1}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy">
      </button>
    \`).join('');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
}

document.addEventListener('DOMContentLoaded', initGridModal);
`;

fs.appendFileSync('gallery.js', appendCode);
console.log('Appended to gallery.js');
