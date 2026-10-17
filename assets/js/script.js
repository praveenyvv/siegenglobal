let slideIndex = 0;
let slideTimer = null;

// DOM Initialization
document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('show');
            const isOpen = navMenu.classList.contains('show');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('show');
                mobileMenuBtn.textContent = '☰';
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                mobileMenuBtn.textContent = '☰';
            });
        });

        // Close menu on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 860) {
                navMenu.classList.remove('show');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }

    // 2. Slideshow Setup
    initSlideshow();

    // 3. Lightbox Setup for Gallery Pages
    initLightbox();

    // 4. Enquiry Form Handling
    initEnquiryForm();
});

// Smooth Scrolling for anchor links with header offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
            e.preventDefault();
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 72;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slideshow
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    // Show first slide immediately
    slides.forEach((s, idx) => {
        if (idx === 0) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    slideIndex = 0;
    startSlideTimer();
}

function startSlideTimer() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 4000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
}

// Lightbox for Gallery Pages
let currentGalleryIndex = 0;
let galleryImagesList = [];

function initLightbox() {
    const galleryCards = document.querySelectorAll('.gallery-card img, .gallery img');
    if (!galleryCards.length) return;

    galleryImagesList = Array.from(galleryCards);
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCap = document.getElementById('lightboxCaption');

    if (!lightbox) return;

    galleryImagesList.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentGalleryIndex = index;
            updateLightbox();
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support
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
    lightboxImg.alt = currentImg.alt || 'Tooling Image';
    if (lightboxCap) {
        lightboxCap.textContent = currentImg.alt || '';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
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

// Enquiry Form Handler
function initEnquiryForm() {
    const form = document.getElementById('enquiryForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('enqName')?.value || '';
        const phone = document.getElementById('enqPhone')?.value || '';
        const email = document.getElementById('enqEmail')?.value || '';
        const service = document.getElementById('enqService')?.value || 'Tooling Enquiry';
        const message = document.getElementById('enqMessage')?.value || '';

        const fullMessage = `Hello Siegen Global,%0A%0AMy Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ARequirement: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message)}`;
        
        // Open WhatsApp directly with populated message
        window.open(`https://wa.me/919133555686?text=${fullMessage}`, '_blank');
        
        alert('Thank you! Redirecting you to WhatsApp to connect directly with our engineering team.');
        form.reset();
    });
}
