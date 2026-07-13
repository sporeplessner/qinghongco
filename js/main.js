/* ==========================================================================
   Qinghongco - Main JavaScript
   Core interactions: nav, scroll reveals, counters, forms, cookie banner
   ========================================================================== */

(function () {
    'use strict';

    /* ========== Navigation ========== */

    const nav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    // Scroll state for nav
    function updateNav() {
        if (!nav) return;
        if (window.scrollY > 32) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // Mobile toggle
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navList.classList.toggle('open');
            document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navList.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ========== Scroll Reveal (Intersection Observer) ========== */

    const revealSelectors = '.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .data-viz, .loading-bar';

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll(revealSelectors).forEach(el => {
        revealObserver.observe(el);
    });

    /* ========== Counter Animation ========== */

    function animateCounter(el) {
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const isFloat = !Number.isInteger(target);

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.firstChild.textContent = isFloat
                ? current.toFixed(1)
                : Math.floor(current).toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.firstChild.textContent = isFloat
                    ? target.toFixed(1)
                    : Math.round(target).toLocaleString();
            }
        }
        requestAnimationFrame(step);
    }

    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ========== Tabs ========== */

    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const buttons = tabGroup.querySelectorAll('.tab-btn');
        const panels = tabGroup.querySelectorAll('.tab-panel');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                buttons.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = tabGroup.querySelector(`#${target}`);
                if (panel) panel.classList.add('active');
            });
        });
    });

    /* ========== Hover Glow Effect (mouse follow) ========== */

    document.querySelectorAll('.hover-glow').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty('--mouse-x', x + '%');
            el.style.setProperty('--mouse-y', y + '%');
        });
    });

    /* ========== Contact Form ========== */

    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = contactForm.querySelector('.form-status');
            const submit = contactForm.querySelector('button[type="submit"]');

            // Simulate submission
            submit.disabled = true;
            submit.textContent = 'SENDING...';

            setTimeout(() => {
                if (status) {
                    status.classList.add('success');
                    status.textContent = '✓ Thank you! Your message has been received. We will respond within 1-2 business days.';
                }
                contactForm.reset();
                submit.disabled = false;
                submit.innerHTML = 'Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

                setTimeout(() => {
                    if (status) status.classList.remove('success');
                }, 6000);
            }, 1100);
        });
    }

    /* ========== Cookie Banner ========== */

    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieKey = 'qinghongco_cookie_consent';

    if (cookieBanner) {
        if (!localStorage.getItem(cookieKey)) {
            setTimeout(() => cookieBanner.classList.add('show'), 1500);
        }

        cookieBanner.querySelectorAll('[data-cookie]').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.cookie;
                localStorage.setItem(cookieKey, choice);
                cookieBanner.classList.remove('show');
            });
        });
    }

    /* ========== Active nav link based on current path ========== */

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* ========== Page entrance animation ========== */

    document.body.classList.add('page-transition');

    /* ========== Smooth scroll for anchor links ========== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = anchor.getAttribute('href');
            if (target === '#' || target.length < 2) return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ========== Parallax on hero blobs ========== */

    const blobs = document.querySelectorAll('.blob');
    if (blobs.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            blobs.forEach((blob, i) => {
                const factor = i % 2 === 0 ? 0.15 : -0.1;
                blob.style.transform = `translate3d(0, ${scrolled * factor}px, 0)`;
            });
        }, { passive: true });
    }

    /* ========== Marquee duplication for infinite scroll ========== */

    document.querySelectorAll('.marquee-track').forEach(track => {
        track.innerHTML = track.innerHTML + track.innerHTML;
    });

    /* ========== Console signature ========== */

    console.log('%c Qinghongco.com ', 'background:#e82127;color:#fff;padding:4px 8px;border-radius:3px;font-weight:bold;');
    console.log('%c Engineered with care · Bristol, UK ', 'color:#999;font-style:italic;');

})();