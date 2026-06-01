function galleryPlaceholderHtml(title) {
  return `
    <div class="gallery-placeholder absolute inset-0 bg-gradient-to-br from-brand-blue-soft via-brand-blue/30 to-white flex flex-col items-center justify-center p-4 text-center">
      <svg class="w-10 h-10 sm:w-12 sm:h-12 text-brand-blue-deep/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span class="text-[10px] sm:text-xs font-bold text-brand-blue-deep leading-tight">${title}</span>
    </div>`;
}

function createGalleryCard(item, index) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gallery-card group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2';
  btn.dataset.index = String(index);
  btn.dataset.src = item.src;
  btn.dataset.title = item.title;
  btn.setAttribute('aria-label', item.title + ' — povečaj sliko');

  btn.innerHTML = `
    <img src="${item.src}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    ${galleryPlaceholderHtml(item.title)}
    <div class="gallery-overlay absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/50 transition-all duration-300 flex items-end justify-center p-4 pointer-events-none">
      <span class="gallery-title translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white text-sm sm:text-base font-bold text-center drop-shadow-lg">${item.title}</span>
    </div>
    <div class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-brand-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none" aria-hidden="true">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
    </div>
  `;

  const img = btn.querySelector('img');
  const placeholder = btn.querySelector('.gallery-placeholder');
  img.addEventListener('error', () => {
    img.classList.add('hidden');
    placeholder?.classList.remove('hidden');
  });
  img.addEventListener('load', () => {
    if (img.naturalWidth > 0) placeholder.classList.add('hidden');
  });
  if (img.complete && img.naturalWidth > 0) placeholder.classList.add('hidden');

  return btn;
}

function initGalleryGrid(containerId, items, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { limit, gridClass = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4', staggerReveal = true } = options;
  const list = limit ? items.slice(0, limit) : items;

  container.className = gridClass;
  container.innerHTML = '';
  list.forEach((item, i) => {
    const globalIndex = items.indexOf(item);
    const card = createGalleryCard(item, globalIndex >= 0 ? globalIndex : i);
    if (staggerReveal) {
      card.classList.add('scroll-reveal');
      card.style.transitionDelay = `${i * 90}ms`;
    }
    container.appendChild(card);
  });

}

function initLightbox(showMoreLink) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  const lightboxMore = document.getElementById('lightbox-more');
  const closeBtn = document.getElementById('lightbox-close');

  if (lightboxMore) {
    lightboxMore.classList.toggle('hidden', !showMoreLink);
  }

  function openLightbox(src, title) {
    lightboxCaption.textContent = title;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    const testImg = new Image();
    testImg.onload = () => {
      lightboxImg.src = src;
      lightboxImg.alt = title;
      lightboxImg.classList.remove('hidden');
      if (lightboxPlaceholder) lightboxPlaceholder.classList.add('hidden');
    };
    testImg.onerror = () => {
      lightboxImg.classList.add('hidden');
      if (lightboxPlaceholder) {
        lightboxPlaceholder.classList.remove('hidden');
        lightboxPlaceholder.querySelector('p').textContent = title;
      }
    };
    testImg.src = src;
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxImg.classList.add('hidden');
    if (lightboxPlaceholder) lightboxPlaceholder.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card) return;
    openLightbox(card.dataset.src, card.dataset.title);
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  return { openLightbox, closeLightbox };
}
