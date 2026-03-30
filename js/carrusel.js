/**
 * CIP SISTEM — Carrusel de Distribuidores
 * Robusto: maneja resize, touch y auto-slide limpio.
 */
(function () {
  var container = document.querySelector('.carousel-container');
  var track = document.querySelector('.carousel-track');
  if (!track) return;

  var slides = Array.from(track.children);
  var nextBtn = document.querySelector('.carousel-button.next');
  var prevBtn = document.querySelector('.carousel-button.prev');

  var currentIndex = 0;
  var autoTimer = null;

  /* ----- Helpers ----- */
  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width;
  }

  function moveTo(index) {
    var slideWidth = getSlideWidth();
    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-currentIndex * slideWidth) + 'px)';
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
  if (nextBtn) nextBtn.addEventListener('click', function() { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', function() { prev(); startAuto(); });

  /* Recalcula ancho al hacer resize */
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() { moveTo(currentIndex); }, 150);
  });

  /* Touch/swipe */
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) { next(); } else { prev(); }
    }
    startAuto();
  });

  /* Pausa al hacer hover */
  if (container) {
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);
  }

  /* ----- Init ----- */
  track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
  moveTo(0);
  startAuto();
})();