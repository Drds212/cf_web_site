/**
 * CIP SISTEM — Carrusel de Distribuidores
 * Corregido para móvil: espera layout pintado antes de calcular anchos.
 */
(function () {
  function init() {
    var container = document.querySelector('.carousel-container');
    var track     = document.querySelector('.carousel-track');
    if (!track) return;

    var slides  = Array.from(track.children);
    var nextBtn = document.querySelector('.carousel-button.next');
    var prevBtn = document.querySelector('.carousel-button.prev');
    var current = 0;
    var timer   = null;

    function slideWidth() {
      // Tres fallbacks para garantizar un valor real en cualquier dispositivo
      return slides[0].getBoundingClientRect().width
          || slides[0].offsetWidth
          || (container ? container.offsetWidth : 280);
    }

    function goTo(index) {
      current = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-current * slideWidth()) + 'px)';
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() { stopAuto(); timer = setInterval(next, 4000); }
    function stopAuto()  { clearInterval(timer); timer = null; }

    // Botones
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

    // Recalcular al rotar / redimensionar
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { goTo(current); }, 150);
    });

    // Swipe táctil
    var touchX = 0;
    track.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
      startAuto();
    });

    // Pausa al hacer hover (desktop)
    if (container) {
      container.addEventListener('mouseenter', stopAuto);
      container.addEventListener('mouseleave', startAuto);
    }

    // Aplicar transición DESPUÉS del primer posicionado para evitar salto
    goTo(0);
    requestAnimationFrame(function () {
      track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
      startAuto();
    });
  }

  // Esperar a que el DOM esté listo y el layout calculado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(function () { requestAnimationFrame(init); });
    });
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(init); });
  }
})();