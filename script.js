/* ==========================================================================
   La Chatita Cafetería — Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Header Scroll Effect ──────────────────────────────────────────────
    const header = document.getElementById('header');
    const hero = document.getElementById('hero');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ── Hero Parallax & Zoom ──────────────────────────────────────────────
    const handleHeroParallax = () => {
        const scrollY = window.scrollY;
        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            const heroBg = hero.querySelector('.hero__bg-img');
            if (heroBg) {
                heroBg.style.transform = `scale(${1.05 - progress * 0.05}) translateY(${scrollY * 0.3}px)`;
            }
        }
    };

    window.addEventListener('scroll', handleHeroParallax, { passive: true });

    // Trigger hero visible state after a small delay
    setTimeout(() => {
        if (hero) hero.classList.add('visible');
    }, 100);

    // ── Intersection Observer: Animate on Scroll ──────────────────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(el => {
        animateObserver.observe(el);
    });

    // ── Mobile Menu ──────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link') : [];

    const toggleMobileMenu = () => {
        const isActive = hamburger.classList.contains('active');
        
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        document.body.style.overflow = isActive ? '' : 'hidden';
    };

    hamburger.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ── Menu Tabs ────────────────────────────────────────────────────────
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('menu__tab--active'));
            tab.classList.add('menu__tab--active');
            
            // Show target category with animation
            menuCategories.forEach(cat => {
                if (cat.dataset.category === targetTab) {
                    cat.classList.add('menu__category--active');
                    // Re-trigger animation
                    cat.style.animation = 'none';
                    cat.offsetHeight; // Force reflow
                    cat.style.animation = '';
                } else {
                    cat.classList.remove('menu__category--active');
                }
            });
        });
    });

    // ── WhatsApp Form ────────────────────────────────────────────────────
    const whatsappForm = document.getElementById('whatsappForm');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value.trim();
            const pedido = document.getElementById('pedido').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre) {
                document.getElementById('nombre').focus();
                return;
            }
            
            // Build WhatsApp message
            let whatsappMessage = `Hola! Soy ${nombre}.`;
            
            if (pedido) {
                whatsappMessage += ` Quiero pedir: ${pedido}.`;
            }
            
            if (mensaje) {
                whatsappMessage += ` ${mensaje}`;
            }
            
            whatsappMessage += ' (Mensaje desde la web)';
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Open WhatsApp
            const whatsappUrl = `https://wa.me/5491123004181?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Reset form
            whatsappForm.reset();
        });
    }

    // ── Smooth Scroll for Anchor Links ────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Gallery Image Lazy Load Enhancement ───────────────────────────────
    const galleryItems = document.querySelectorAll('.galeria__item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        galleryItems.forEach(img => imageObserver.observe(img));
    }

    // ── Keyboard Navigation: Escape closes mobile menu ────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.focus();
        }
    });

    // ── Active Nav Link Highlight on Scroll ───────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const highlightNavLink = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ── Performance: Reduce animations if user prefers ────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.animate-in').forEach(el => {
            el.classList.add('visible');
            el.style.transition = 'none';
        });
        
        if (hero) hero.classList.add('visible');
    }

});