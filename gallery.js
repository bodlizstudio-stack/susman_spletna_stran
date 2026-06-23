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
  btn.className = 'gallery-card lightbox-item group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2';
  btn.dataset.index = String(index);
  btn.dataset.src = item.coverImage || item.src;
  if (item.images && item.images.length > 0) {
    btn.dataset.images = JSON.stringify(item.images);
  } else if (item.coverImage || item.src) {
    btn.dataset.images = JSON.stringify([item.coverImage || item.src]);
  }
  btn.dataset.title = item.title;
  btn.setAttribute('aria-label', item.title + ' — povečaj sliko');

  let multiImageIcon = '';
  if (item.images && item.images.length > 1) {
    multiImageIcon = `
      <div class="absolute top-3 left-3 bg-brand-black/70 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm pointer-events-none z-10">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        ${item.images.length}
      </div>
    `;
  }

  btn.innerHTML = `
    <img src="${item.coverImage || item.src}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    ${galleryPlaceholderHtml(item.title)}
    ${multiImageIcon}
    <div class="gallery-overlay absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/50 transition-all duration-300 flex items-end justify-center p-4 pointer-events-none">
      <span class="gallery-title translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white text-sm sm:text-base font-bold text-center drop-shadow-lg">${item.title}</span>
    </div>
    <div class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-brand-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none z-10" aria-hidden="true">
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

  const { limit, gridClass = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4', staggerReveal = false } = options;
  const list = limit ? items.slice(0, limit) : items;

  container.className = gridClass;
  container.dataset.lightboxGroup = containerId;
  container.innerHTML = '';
  list.forEach((item, i) => {
    const globalIndex = GALLERY_ITEMS.indexOf(item);
    const card = createGalleryCard(item, globalIndex >= 0 ? globalIndex : i);
    if (staggerReveal) {
      card.classList.add('scroll-reveal');
      card.style.transitionDelay = `${i * 90}ms`;
    }
    container.appendChild(card);
  });

  if (staggerReveal && typeof initScrollReveal === 'function') initScrollReveal();
}

function initGalleryCategoryFilter(filterId, gridId, options = {}) {
  const filterBar = document.getElementById(filterId);
  const grid = document.getElementById(gridId);
  if (!filterBar || !grid || typeof GALLERY_CATEGORIES === 'undefined') return;

  const { limit, gridClass, staggerReveal = false } = options;
  let active = GALLERY_CATEGORIES[0]?.id || 'klima';

  const btn = (cat, isActive) => `
    <button type="button" class="gallery-cat-btn px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold border transition-all whitespace-nowrap
      ${isActive
        ? 'bg-brand-blue-dark text-white border-brand-blue-dark shadow-md shadow-brand-blue/30'
        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-blue hover:text-brand-blue-deep'}"
      data-cat="${cat.id}">${cat.label}</button>`;

  filterBar.innerHTML = GALLERY_CATEGORIES.map((c) => btn(c, c.id === active)).join('');

  function render() {
    const items = galleryItemsByCategory(active);
    initGalleryGrid(gridId, items, { limit, gridClass, staggerReveal });
    const countEl = document.getElementById('gallery-count');
    if (countEl) countEl.textContent = items.length;
  }

  filterBar.addEventListener('click', (e) => {
    const target = e.target.closest('.gallery-cat-btn');
    if (!target) return;
    active = target.dataset.cat;
    filterBar.querySelectorAll('.gallery-cat-btn').forEach((b) => {
      const on = b.dataset.cat === active;
      b.classList.toggle('bg-brand-blue-dark', on);
      b.classList.toggle('text-white', on);
      b.classList.toggle('border-brand-blue-dark', on);
      b.classList.toggle('shadow-md', on);
      b.classList.toggle('bg-white', !on);
      b.classList.toggle('text-gray-700', !on);
      b.classList.toggle('border-gray-200', !on);
    });
    render();
  });

  render();
}

function getVisibleLightboxItems(root) {
  return [...root.querySelectorAll('.lightbox-item')].filter((el) => {
    if (el.classList.contains('hidden')) return false;
    const card = el.closest('.product-card');
    if (card && card.classList.contains('hidden')) return false;
    return true;
  });
}

function getLightboxGroupItems(trigger) {
  const group = trigger.closest('[data-lightbox-group]');
  const root = group || document;
  return getVisibleLightboxItems(root).map((el) => ({
    src: el.dataset.src || '',
    title: el.dataset.title || '',
  }));
}

function ensureLightboxNav(lightbox) {
  if (document.getElementById('lightbox-prev')) return;

  const navBtnClass =
    'absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.id = 'lightbox-prev';
  prev.className = navBtnClass + ' left-3 sm:left-6';
  prev.setAttribute('aria-label', 'Prejšnja slika');
  prev.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>';

  const next = document.createElement('button');
  next.type = 'button';
  next.id = 'lightbox-next';
  next.className = navBtnClass + ' right-3 sm:right-6';
  next.setAttribute('aria-label', 'Naslednja slika');
  next.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>';

  const counter = document.createElement('p');
  counter.id = 'lightbox-counter';
  counter.className = 'text-white/75 text-sm font-medium mt-2';

  lightbox.appendChild(prev);
  lightbox.appendChild(next);

  const caption = document.getElementById('lightbox-caption');
  if (caption) caption.insertAdjacentElement('afterend', counter);

  if (!document.getElementById('lightbox-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'lightbox-nav-styles';
    style.textContent = `
      #lightbox-prev[disabled], #lightbox-next[disabled] { opacity: 0.35; cursor: not-allowed; }
      .product-lightbox { cursor: zoom-in; }
      .product-lightbox:focus-visible { outline: 2px solid #5BA3C9; outline-offset: 2px; }
    `;
    document.head.appendChild(style);
  }
}

function initLightbox(showMoreLink) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  const lightboxMore = document.getElementById('lightbox-more');
  const closeBtn = document.getElementById('lightbox-close');

  ensureLightboxNav(lightbox);

  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const counterEl = document.getElementById('lightbox-counter');

  if (lightboxMore) {
    lightboxMore.classList.toggle('hidden', !showMoreLink);
  }

  let slides = [];
  let currentIndex = 0;

  function renderSlide() {
    const slide = slides[currentIndex];
    if (!slide) return;

    lightboxCaption.textContent = slide.title;

    if (counterEl) {
      counterEl.textContent = slides.length > 1 ? `${currentIndex + 1} / ${slides.length}` : '';
      counterEl.classList.toggle('hidden', slides.length <= 1);
    }

    if (prevBtn) prevBtn.disabled = slides.length <= 1;
    if (nextBtn) nextBtn.disabled = slides.length <= 1;

    if (!slide.src) {
      lightboxImg.classList.add('hidden');
      if (lightboxPlaceholder) {
        lightboxPlaceholder.classList.remove('hidden');
        const p = lightboxPlaceholder.querySelector('p');
        if (p) p.textContent = slide.title;
      }
      return;
    }

    const testImg = new Image();
    testImg.onload = () => {
      lightboxImg.src = slide.src;
      lightboxImg.alt = slide.title;
      lightboxImg.classList.remove('hidden');
      if (lightboxPlaceholder) lightboxPlaceholder.classList.add('hidden');
    };
    testImg.onerror = () => {
      lightboxImg.classList.add('hidden');
      if (lightboxPlaceholder) {
        lightboxPlaceholder.classList.remove('hidden');
        const p = lightboxPlaceholder.querySelector('p');
        if (p) p.textContent = slide.title;
      }
    };
    testImg.src = slide.src;
  }

  function openAtIndex(index) {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderSlide();
  }

  function openLightboxFromTrigger(trigger) {
    let imagesRaw = trigger.dataset.images;
    let imagesArr = [];
    if (imagesRaw) {
      try { imagesArr = JSON.parse(imagesRaw); } catch(e) {}
    }
    if (!imagesArr || !imagesArr.length) {
      imagesArr = [trigger.dataset.src];
    }
    
    slides = imagesArr.map((src) => ({
      src: src || '',
      title: trigger.dataset.title || '',
    }));
    
    if (!slides.length) return;
    let startIndex = parseInt(trigger.dataset.startIndex, 10);
    if (isNaN(startIndex)) startIndex = 0;
    openAtIndex(startIndex);
  }

  function step(delta) {
    if (slides.length <= 1) return;
    openAtIndex(currentIndex + delta);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxImg.classList.add('hidden');
    if (lightboxPlaceholder) lightboxPlaceholder.classList.add('hidden');
    const gridModal = document.getElementById('grid-modal');
    if (!gridModal || gridModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
    slides = [];
    currentIndex = 0;
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-item');
    if (!trigger) return;
    e.preventDefault();
    openLightboxFromTrigger(trigger);
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    step(-1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    step(1);
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  return { openLightbox: openLightboxFromTrigger, closeLightbox, openAtIndex };
}


function initGridModal() {
  if (document.getElementById('grid-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'grid-modal';
  modal.className = 'fixed inset-0 z-[90] flex-col bg-brand-black/95 backdrop-blur-md hidden';
  modal.innerHTML = `
    <div class="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
      <h3 id="grid-modal-title" class="text-white text-xl sm:text-2xl font-bold">Galerija</h3>
      <button type="button" id="grid-modal-close" class="p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors" aria-label="Zapri">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div id="grid-modal-content" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-7xl mx-auto"></div>
    </div>
  `;
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
    content.innerHTML = imagesArr.map((src, idx) => `
      <button type="button" class="lightbox-item aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-white transition-all focus:outline-none"
        data-src="${src}" 
        data-images='${imagesRaw}' 
        data-title="${title.textContent}"
        data-start-index="${idx}">
        <img src="${src}" alt="Slika ${idx+1}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy">
      </button>
    `).join('');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });
}

document.addEventListener('DOMContentLoaded', initGridModal);
