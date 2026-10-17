let slideIndex = 0;
let scrollAmount = 0;
const scrollStep = 270;

// Mobile menu functionality & DOM initialization
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('show');
            }
        });

        // Close menu when window is resized beyond mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('show');
            }
        });
    }

    // Initialize slideshow if present
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        showSlides();
    }

    // Initialize lightbox if gallery is present
    initLightbox();
});

// Add smooth scrolling to all in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const extraPadding = 20;
            
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - extraPadding;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slideshow
function showSlides() {
    const slides = document.querySelectorAll(".slide");
    if (!slides.length) return;
    
    slides.forEach(slide => {
        slide.style.display = "none";
        slide.classList.remove('active');
    });

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add('active');
    
    setTimeout(showSlides, 3500);
}

// Services Carousel
function slideLeft() {
    const servicesContainer = document.querySelector('.services');
    if (!servicesContainer) return;
    scrollAmount -= scrollStep;
    if (scrollAmount < 0) {
        scrollAmount = 0;
    }
    servicesContainer.style.transform = `translateX(-${scrollAmount}px)`;
}

function slideRight() {
    const servicesContainer = document.querySelector('.services');
    if (!servicesContainer) return;
    const maxScroll = servicesContainer.scrollWidth - servicesContainer.clientWidth;
    scrollAmount += scrollStep;
    if (scrollAmount > maxScroll) {
        scrollAmount = maxScroll;
    }
    servicesContainer.style.transform = `translateX(-${scrollAmount}px)`;
}

// Lightbox for Gallery Pages
let currentGalleryIndex = 0;
let galleryImagesList = [];

function initLightbox() {
    const galleryImages = document.querySelectorAll('.gallery img, .gallery-card img');
    if (!galleryImages.length) return;

    galleryImagesList = Array.from(galleryImages);
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCap = document.getElementById('lightboxCaption');

    if (!lightbox) return;

    galleryImagesList.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentGalleryIndex = index;
            updateLightbox();
            lightbox.classList.add('show');
        });
    });

    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

function updateLightbox() {
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCap = document.getElementById('lightboxCaption');
    if (!lightboxImg || !galleryImagesList[currentGalleryIndex]) return;

    const currentImg = galleryImagesList[currentGalleryIndex];
    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt || 'Gallery Image';
    if (lightboxCap) {
        lightboxCap.textContent = currentImg.alt || '';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
    }
}

function prevImage() {
    if (!galleryImagesList.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
    updateLightbox();
}

function nextImage() {
    if (!galleryImagesList.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImagesList.length;
    updateLightbox();
}
