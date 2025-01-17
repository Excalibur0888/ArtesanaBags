// Slider functionality
const slider = {
    currentSlide: 0,
    images: null,
    dots: null,
    prevBtn: null,
    nextBtn: null,

    init() {
        this.images = document.querySelectorAll('.slider__image');
        this.dots = document.querySelectorAll('.slider__dot');
        this.prevBtn = document.querySelector('.slider__arrow--prev');
        this.nextBtn = document.querySelector('.slider__arrow--next');

        if (!this.images.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.changeSlide(-1));
        this.nextBtn?.addEventListener('click', () => this.changeSlide(1));

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    },

    changeSlide(direction) {
        this.images[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        this.currentSlide = (this.currentSlide + direction + this.images.length) % this.images.length;

        this.images[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    },

    goToSlide(index) {
        if (index === this.currentSlide) return;

        this.images[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        this.images[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
};

// Initialize slider on page load
document.addEventListener('DOMContentLoaded', () => {
    slider.init();
});

// Header scroll effect
const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    // Burger Menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    
    if (burger && nav) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = header.offsetHeight;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.feature, .product, .hero__content, .hero__image').forEach(element => {
    observer.observe(element);
});

// Form validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        
        // Basic validation
        for (const [key, value] of formData.entries()) {
            const input = form.querySelector(`[name="${key}"]`);
            const errorElement = input.nextElementSibling;
            
            if (input.hasAttribute('required') && !value.trim()) {
                isValid = false;
                input.classList.add('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = 'Este campo é obrigatório';
                }
            } else if (input.type === 'email' && !isValidEmail(value)) {
                isValid = false;
                input.classList.add('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = 'Email inválido';
                }
            } else {
                input.classList.remove('error');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = '';
                }
            }
        }
        
        if (isValid) {
            // Here you would typically send the form data to your server
            console.log('Form submitted:', Object.fromEntries(formData));
            form.reset();
            showSuccessMessage(form);
        }
    });
});

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Success message helper
function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = 'Mensagem enviada com sucesso!';
    
    form.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
});

// Customize Bag
const customize = {
    init() {
        this.preview = document.querySelector('.customize__preview');
        this.bag = document.querySelector('.customize__bag');
        this.images = document.querySelectorAll('.customize__image');
        this.prevBtn = document.querySelector('.customize__prev');
        this.nextBtn = document.querySelector('.customize__next');
        this.zoomIn = document.querySelector('.customize__zoom-in');
        this.zoomOut = document.querySelector('.customize__zoom-out');
        
        if (!this.preview) return;
        
        this.currentSlide = 0;
        this.scale = 1;
        
        this.bindEvents();
    },
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.changeSlide(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.changeSlide(1));
        }
        
        if (this.zoomIn) {
            this.zoomIn.addEventListener('click', () => this.zoom(0.1));
        }
        
        if (this.zoomOut) {
            this.zoomOut.addEventListener('click', () => this.zoom(-0.1));
        }
    },
    
    changeSlide(direction) {
        this.images[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide + direction + this.images.length) % this.images.length;
        
        this.images[this.currentSlide].classList.add('active');
        
        // Сбрасываем масштаб при смене слайда
        this.scale = 1;
        this.images.forEach(image => {
            image.style.transform = `scale(${this.scale})`;
        });
    },
    
    zoom(delta) {
        this.scale = Math.min(Math.max(0.5, this.scale + delta), 2);
        this.images[this.currentSlide].style.transform = `scale(${this.scale})`;
    }
};

// Инициализируем функционал при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    customize.init();
});