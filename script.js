// Variables globales
let currentSlide = 0;
let slides = [];
let carouselInterval;

// Función para inicializar la aplicación
function init() {
    // Obtener elementos del DOM
    const welcomeBtn = document.getElementById('welcomeBtn');
    const welcomePage = document.getElementById('welcomePage');
    const mainPage = document.getElementById('mainPage');
    
    // Event listener para el botón de bienvenida
    welcomeBtn.addEventListener('click', function() {
        showMainPage(welcomePage, mainPage);
    });
    
    // Inicializar el carrusel pero no iniciarlo hasta que se muestre la página principal
    slides = document.querySelectorAll('.carousel-slide');
}


function showMainPage(welcomePage, mainPage) {
    // Agregar efecto de transición
    welcomePage.style.transform = 'translateX(-100%)';
    welcomePage.style.transition = 'transform 0.8s ease-in-out';
    
    setTimeout(() => {
        welcomePage.style.display = 'none';
        mainPage.style.display = 'block';
        
        // Iniciar el carrusel después de mostrar la página principal
        startCarousel();
        
        // Crear efectos especiales
        createFloatingHearts();
        
        // Intentar reproducir música de fondo
        playBackgroundMusic();
    }, 800);
}

// Función para iniciar el carrusel automático
function startCarousel() {
    // Asegurarse de que la primera imagen esté activa
    showSlide(currentSlide);
    
    // Cambiar imagen cada 1 segundo
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 1000);
}

// Función para mostrar una slide específica
function showSlide(n) {
    // Ocultar todas las slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Mostrar la slide actual
    if (slides[n]) {
        slides[n].classList.add('active');
    }
}

// Función para ir a la siguiente slide
function nextSlide() {
    currentSlide++;
    
    // Si llegamos al final, volver al principio
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    
    showSlide(currentSlide);
}

// Función para crear corazones flotantes adicionales
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '🌹'];
    
    // Crear corazones adicionales dinámicamente
    setInterval(() => {
        if (document.querySelectorAll('.floating-hearts .dynamic-heart').length < 3) {
            const heart = document.createElement('span');
            heart.className = 'heart dynamic-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.animationDuration = (2 + Math.random() * 3) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            
            heartsContainer.appendChild(heart);
            
            // Remover el corazón después de un tiempo
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 6000);
        }
    }, 2000);
}

// Función para crear efectos de brillo en la página de bienvenida
function createSparkles() {
    const welcomePage = document.querySelector('.welcome-page');
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1';
        
        welcomePage.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }, 500);
}

// Función para pausar/reanudar el carrusel cuando la ventana pierde/gana foco
function handleVisibilityChange() {
    if (document.hidden) {
        // Pausar el carrusel cuando la pestaña no está visible
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    } else {
        // Reanudar el carrusel cuando la pestaña vuelve a ser visible
        if (document.getElementById('mainPage').style.display === 'block') {
            startCarousel();
        }
    }
}

// Event listeners adicionales
document.addEventListener('visibilitychange', handleVisibilityChange);

// Event listener para teclas (funcionalidad extra)
document.addEventListener('keydown', function(e) {
    // Si estamos en la página principal, permitir navegación manual con las flechas
    if (document.getElementById('mainPage').style.display === 'block') {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            showSlide(currentSlide);
        } else if (e.key === ' ') {
            // Pausa/reanuda con espacebar
            e.preventDefault();
            if (carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = null;
            } else {
                startCarousel();
            }
        }
    }
});

// Soporte para gestos táctiles en móviles
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (touchEndX < touchStartX - 50) {
        // Swipe izquierda - siguiente imagen
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe derecha - imagen anterior
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }
}

// Event listeners para touch
document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

// Detectar orientación del dispositivo
function handleOrientationChange() {
    setTimeout(() => {
        // Reajustar elementos después del cambio de orientación
        if (window.innerHeight < window.innerWidth && window.innerWidth <= 768) {
            // Modo landscape en móvil/tablet
            document.body.classList.add('landscape-mobile');
        } else {
            document.body.classList.remove('landscape-mobile');
        }
    }, 100);
}

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);

// Función para optimizar rendimiento en móviles
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar velocidad del carrusel según el dispositivo
function getCarouselSpeed() {
    return isMobile() ? 1500 : 1000; // Más lento en móviles para mejor experiencia
}

// Función mejorada para iniciar el carrusel
function startCarousel() {
    // Limpiar intervalo anterior si existe
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    // Asegurarse de que la primera imagen esté activa
    showSlide(currentSlide);
    
    // Cambiar imagen con velocidad adaptativa
    carouselInterval = setInterval(() => {
        nextSlide();
    }, getCarouselSpeed());
}

// Función para reproducir música de fondo con Spotify
let isSpotifyVisible = false;
let spotifyTrackId = ''; // Aquí pondrás el ID de tu canción de Spotify

function initSpotifyMusic() {
    // Ejemplo de ID para "I Don't Want to Set the World on Fire"
    // Tendrás que buscar la canción en Spotify y obtener su ID
    // spotifyTrackId = '4uLU6hMCjMI75M1A2tKUQC'; // Ejemplo
    
    console.log('Sistema de música Spotify inicializado');
}

function showSpotifyPlayer(trackId) {
    if (!trackId) {
        alert('Por favor, agrega el ID de la canción de Spotify en el código JavaScript');
        return;
    }
    
    const spotifyContainer = document.getElementById('spotifyContainer');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    // URL del embed de Spotify
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    
    spotifyPlayer.src = embedUrl;
    spotifyContainer.style.display = 'block';
    isSpotifyVisible = true;
    
    
    spotifyContainer.style.opacity = '0';
    spotifyContainer.style.transform = 'translateX(-50%) translateY(20px)';
    
    setTimeout(() => {
        spotifyContainer.style.transition = 'all 0.5s ease';
        spotifyContainer.style.opacity = '1';
        spotifyContainer.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
}

function hideSpotifyPlayer() {
    const spotifyContainer = document.getElementById('spotifyContainer');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    
    spotifyContainer.style.transition = 'all 0.5s ease';
    spotifyContainer.style.opacity = '0';
    spotifyContainer.style.transform = 'translateX(-50%) translateY(20px)';
    
    setTimeout(() => {
        spotifyContainer.style.display = 'none';
        spotifyPlayer.src = '';
        isSpotifyVisible = false;
    }, 500);
}

function toggleSpotifyPlayer() {
    if (isSpotifyVisible) {
        hideSpotifyPlayer();
    } else {
        const trackId = spotifyTrackId || prompt('Ingresa el ID de Spotify de la canción "I Don\'t Want to Set the World on Fire":');
        if (trackId) {
            spotifyTrackId = trackId;
            showSpotifyPlayer(trackId);
        }
    }
}

function showMusicButton() {
    const musicButton = document.createElement('button');
    musicButton.innerHTML = '🎵 Spotify Music';
    musicButton.className = 'music-control-btn';
    musicButton.onclick = toggleSpotifyPlayer;
    
    // Agregar el botón a la página principal
    const mainPage = document.getElementById('mainPage');
    mainPage.appendChild(musicButton);
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    init();
    createSparkles();
    initBackgroundMusic(); // Inicializar la música
    
    // Mensaje de console para el desarrollador
    console.log('¡Feliz cumpleaños mamá! 🎉❤️');
    console.log('Controles adicionales:');
    console.log('- Flecha derecha: siguiente foto');
    console.log('- Flecha izquierda: foto anterior');
    console.log('- Espacebar: pausar/reanudar carrusel');
    console.log('- Música de fondo disponible');
});

// Función para optimizar el rendimiento
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar el redimensionado de ventana
window.addEventListener('resize', debounce(function() {
    // Reajustar elementos si es necesario
    console.log('Ventana redimensionada');
}, 250));