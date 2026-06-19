/** Fade in / fade out ob scrollanju po strani */
function initScrollReveal(selector = '.scroll-reveal') {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll(selector);

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
  );

  elements.forEach((el) => observer.observe(el));
  return observer;
}
