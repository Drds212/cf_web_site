const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const slideWidth = slides[0].getBoundingClientRect().width;

let currentIndex = 0;

function updateCarousel() {
    const newTransform = -currentIndex * slideWidth;
    track.style.transform = `translateX(${newTransform}px)`;
}

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length; // Ciclo a la siguiente imagen
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Ciclo a la imagen anterior
    updateCarousel();
});

// Función para pasar a la siguiente imagen automáticamente
function autoSlide() {
    currentIndex = (currentIndex + 1) % slides.length; // Ciclo a la siguiente imagen
    updateCarousel();
}

// Iniciar el carrusel automático cada 3 segundos
setInterval(autoSlide, 4000); // Cambia de imagen cada 3 segundos

