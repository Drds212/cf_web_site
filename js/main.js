'use strict';

/* ---- Navbar scroll state ---- */
const navbar = document.getElementById('navbar');

let ticking = false;
function updateNav() {
  if (window.scrollY > 60) {
    navbar.classList.replace('transparent', 'solid');
  } else {
    navbar.classList.replace('solid', 'transparent');
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
}, { passive: true });
updateNav();


/* ---- Mobile menu ---- */
const burgerBtn   = document.getElementById('burgerBtn');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  burgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
burgerBtn.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);


/* ---- Reveal on scroll ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---- Email opener ---- */
function abrirCorreo(e, to) {
  e.preventDefault();
  const subject = encodeURIComponent('Solicitud de Cotizacion - CIP FLUID');
  const body    = encodeURIComponent(
    'Estimado equipo de CIP FLUID,\n\nMe gustaria solicitar una cotizacion para:\n\n- Producto/servicio:\n- Cantidad:\n- Detalles:\n\nDatos de contacto:\nNombre:\nTelefono:\nCorreo:\n\nSaludos,'
  );
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
  } else {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + subject + '&body=' + body, '_blank');
  }
}


/* ============================================================
   LIGHTBOX
============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxName  = document.getElementById('lightboxName');
const lightboxMat   = document.getElementById('lightboxMaterial');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBack  = document.getElementById('lightboxBackdrop');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

const prodCards = Array.from(document.querySelectorAll('.prod-card[data-img]'));
let currentIdx  = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const card = prodCards[idx];
  lightboxImg.src             = card.dataset.img;
  lightboxImg.alt             = card.dataset.name || '';
  lightboxName.textContent    = card.dataset.name || '';
  lightboxMat.innerHTML       = card.dataset.material || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() { openLightbox((currentIdx - 1 + prodCards.length) % prodCards.length); }
function showNext() { openLightbox((currentIdx + 1) % prodCards.length); }

prodCards.forEach((card, idx) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Ver imagen de ' + (card.dataset.name || 'producto'));
  card.addEventListener('click', () => openLightbox(idx));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBack.addEventListener('click',  closeLightbox);
lightboxPrev.addEventListener('click',  showPrev);
lightboxNext.addEventListener('click',  showNext);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
}, { passive: true });