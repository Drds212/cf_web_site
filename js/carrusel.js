/**
 * CIP SISTEM — Carrusel de Distribuidores (Rediseñado)
 * Robusto: maneja resize, touch y auto-slide limpio.
 */
(function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextBtn = document.querySelector('.carousel-button.next');
  const prevBtn = document.querySelector('.carousel-button.prev');

  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width;
  let autoTimer = null;

  /* ----- Helpers ----- */
  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width;
  }

  function moveTo(index) {
    slideWidth = getSlideWidth();
    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  }

  function next() { moveTo(currentIndex + 1); }
  function prev() { moveTo(currentIndex - 1); }

  /* ----- Auto-slide ----- */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* ----- Events ----- */
  nextBtn && nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  /* Recalcula ancho al hacer resize (importante en mobile) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => moveTo(currentIndex), 150);
  });

  /* Touch/swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    startAuto();
  });

  /* Pausa al hacer hover */
  track.closest('.carousel-container') && track.closest('.carousel-container').addEventListener('mouseenter', stopAuto);
  track.closest('.carousel-container') && track.closest('.carousel-container').addEventListener('mouseleave', startAuto);

  /* ----- Init ----- */
  track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
  moveTo(0);
  startAuto();
})();