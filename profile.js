/* ================================================================
   HUGO H. FERNÁNDEZ — PORTFOLIO JS
   Ultra-modern · dark-default · cursor spotlight
   ================================================================ */

(() => {
    'use strict';

    const STORAGE = {
        LANG: 'hhf.lang',
        THEME: 'hhf.theme'
    };

    /* ====== I18N ====== */
    const initLanguage = () => {
        const stored = localStorage.getItem(STORAGE.LANG);
        const browser = (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
        setLanguage(stored || browser);

        const toggle = document.getElementById('langToggle');
        if (!toggle) return;

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('lang');
            setLanguage(current === 'es' ? 'en' : 'es');
        });
    };

    const setLanguage = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem(STORAGE.LANG, lang);
        document.querySelectorAll('.lang-opt').forEach((el) => {
            el.classList.toggle('lang-current', el.dataset.langOpt === lang);
        });
    };

    /* ====== THEME ====== */
    const initTheme = () => {
        const stored = localStorage.getItem(STORAGE.THEME);
        setTheme(stored || 'dark');

        const btn = document.getElementById('themeToggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE.THEME, theme);

        const icon = document.getElementById('themeIcon');
        if (!icon) return;

        icon.innerHTML = theme === 'dark'
            ? '<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"></line>'
            : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>';
    };

    /* ====== CURSOR SPOTLIGHT ====== */
    const initSpotlight = () => {
        const el = document.getElementById('spotlight');
        if (!el) return;
        if (window.matchMedia('(hover: none)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 3;
        let currentX = targetX;
        let currentY = targetY;
        let visible = false;
        let rafId = null;

        const render = () => {
            currentX += (targetX - currentX) * 0.18;
            currentY += (targetY - currentY) * 0.18;
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            rafId = requestAnimationFrame(render);
        };

        window.addEventListener('pointermove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!visible) {
                el.classList.add('visible');
                visible = true;
            }
        }, { passive: true });

        document.addEventListener('pointerleave', () => {
            el.classList.remove('visible');
            visible = false;
        });

        rafId = requestAnimationFrame(render);
    };

    /* ====== HERO TYPING ROTATOR ====== */
    const initTyping = () => {
        const el = document.getElementById('typingText');
        if (!el) return;

        const phrases = [
            'Senior Software Engineer',
            'Tech Lead @ Blackthorn',
            'Healthcare Informatics',
            'TypeScript · Angular · Node.js',
            'Clean Architecture · HL7 FHIR',
            'Available for consulting'
        ];

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.textContent = phrases[0];
            return;
        }

        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        const tick = () => {
            const current = phrases[phraseIdx];
            if (!deleting) {
                charIdx++;
                el.textContent = current.slice(0, charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
                setTimeout(tick, 55);
            } else {
                charIdx--;
                el.textContent = current.slice(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    setTimeout(tick, 380);
                    return;
                }
                setTimeout(tick, 28);
            }
        };
        tick();
    };

    /* ====== NAV ====== */
    const initNav = () => {
        const nav = document.getElementById('topNav');
        const links = Array.from(document.querySelectorAll('.nav-link'));
        if (!nav) return;

        let last = false;
        const onScroll = () => {
            const scrolled = window.scrollY > 8;
            if (scrolled !== last) {
                nav.classList.toggle('scrolled', scrolled);
                last = scrolled;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        const sections = links
            .map((link) => {
                const id = link.getAttribute('href')?.replace('#', '');
                const section = id ? document.getElementById(id) : null;
                return section ? { link, section } : null;
            })
            .filter(Boolean);

        if (!sections.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const match = sections.find(({ section }) => section === entry.target);
                if (!match) return;
                links.forEach((l) => l.classList.remove('active'));
                match.link.classList.add('active');
            });
        }, {
            rootMargin: '-45% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(({ section }) => observer.observe(section));
    };

    /* ====== MOBILE MENU ====== */
    const initMenu = () => {
        const toggle = document.getElementById('menuToggle');
        const center = document.getElementById('navCenter');
        if (!toggle || !center) return;

        toggle.addEventListener('click', () => {
            const isOpen = center.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        center.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                center.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    };

    /* ====== FEATURED RECOMMENDATION ROTATOR ====== */
    const FEATURED_RECOS = [
        {
            initials: 'FZ',
            name: 'Fernando Zamperin',
            role: 'IT Swiss Knife Expert',
            en: 'He\'s a <em>swiss knife</em> of programming and architecture — he thinks about the solution technically, but also about culture, business and the company as a whole.',
            es: 'Es una <em>navaja suiza</em> de la programación y la arquitectura — piensa la solución técnicamente, pero también la cultura, el negocio y la empresa como un todo.'
        },
        {
            initials: 'FB',
            name: 'Franco Bianucci',
            role: 'Sr. QA Automation · Outcoding',
            en: 'Hugo is the kind of senior developer every team hopes for. Deep technical knowledge, strong architectural thinking, and a natural leadership presence. <em>He is a natural dev lead</em>, whether formally assigned or not.',
            es: 'Hugo es el tipo de senior developer que todo equipo desea. Conocimiento técnico profundo, pensamiento arquitectónico fuerte y presencia natural de liderazgo. <em>Es un dev lead natural</em>, esté o no formalmente asignado como tal.'
        },
        {
            initials: 'FU',
            name: 'Federico Uribe',
            role: 'Software Engineer · Epicor',
            en: 'Hugo is an <em>ideal candidate</em> for any company looking for a leader, technical expert, or highly committed senior developer. He proved to be a successful leader, guiding teams through challenging times such as the pandemic.',
            es: 'Hugo es el <em>candidato ideal</em> para cualquier empresa que busque un líder, un experto técnico o un senior developer altamente comprometido. Demostró ser un líder exitoso guiando equipos en tiempos complejos como la pandemia.'
        },
        {
            initials: 'JC',
            name: 'Javier Carrion',
            role: 'Software Engineer · GDG Central Florida',
            en: 'Hugo is a perfect example of a skilled developer — focused, reliable, and goal-oriented. A multi-talented individual that <em>brings the best out of the team</em>.',
            es: 'Hugo es un ejemplo perfecto de un developer skilled — enfocado, confiable y orientado a resultados. Un individuo multi-talentoso que <em>saca lo mejor del equipo</em>.'
        },
        {
            initials: 'JN',
            name: 'Joaquín Noguera Velazquez',
            role: 'Software Engineer · Blackthorn.io',
            en: 'I am fortunate to call Hugo my teammate at Blackthorn. He demonstrates a strong commitment to our team — <em>any team would be lucky to have Hugo</em>.',
            es: 'Tengo la suerte de llamar a Hugo mi compañero en Blackthorn. Demuestra un compromiso fuerte con el equipo — <em>cualquier equipo tendría suerte de tenerlo</em>.'
        },
        {
            initials: 'CC',
            name: 'Carolina Celeste',
            role: 'Software Engineer · Backend',
            en: 'Hugo is a strong software engineer with an impressive track record. He has a <em>natural talent for inspiring and motivating</em> his team, consistently fostering a positive and collaborative environment.',
            es: 'Hugo es un software engineer sólido con un track record impresionante. Tiene un <em>talento natural para inspirar y motivar</em> a su equipo, fomentando un entorno positivo y colaborativo.'
        }
    ];

    const initFeaturedRotator = () => {
        const featured = document.getElementById('recoFeatured');
        if (!featured) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const quoteEl = featured.querySelector('.reco-featured-quote');
        const avatarEl = featured.querySelector('.reco-author-avatar');
        const nameEl = featured.querySelector('.reco-author-name');
        const roleEl = featured.querySelector('.reco-author-role');
        if (!quoteEl || !avatarEl || !nameEl || !roleEl) return;

        let idx = 0;
        let timer = null;
        let paused = false;

        const render = () => {
            const r = FEATURED_RECOS[idx];
            quoteEl.innerHTML =
                '<span data-lang-en>' + r.en + '</span>' +
                '<span data-lang-es>' + r.es + '</span>';
            avatarEl.textContent = r.initials;
            nameEl.textContent = r.name;
            roleEl.textContent = r.role;
        };

        const advance = () => {
            if (paused) { scheduleNext(); return; }
            featured.classList.add('fading');
            window.setTimeout(() => {
                idx = (idx + 1) % FEATURED_RECOS.length;
                render();
                featured.classList.remove('fading');
            }, 420);
            scheduleNext();
        };

        const scheduleNext = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(advance, 7000);
        };

        featured.addEventListener('pointerenter', () => { paused = true; });
        featured.addEventListener('pointerleave', () => { paused = false; });

        scheduleNext();
    };

    /* ====== RECOMMENDATIONS MARQUEE ====== */
    const initRecoMarquee = () => {
        const track = document.getElementById('recoTrack');
        if (!track) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        /* Clone once so the -50% keyframe lands seamlessly on the duplicate set */
        const originals = Array.from(track.children);
        originals.forEach((card) => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, [tabindex]').forEach((el) => {
                el.setAttribute('tabindex', '-1');
            });
            track.appendChild(clone);
        });
    };

    /* ====== SCROLL REVEAL ====== */
    const initReveal = () => {
        const items = document.querySelectorAll('.reveal');
        if (!items.length || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach((el) => observer.observe(el));
    };

    /* ====== FOOTER YEAR ====== */
    const initFooterYear = () => {
        const el = document.getElementById('footerYear');
        if (el) el.textContent = String(new Date().getFullYear());
    };

    /* ====== INIT ====== */
    document.addEventListener('DOMContentLoaded', () => {
        initLanguage();
        initTheme();
        initSpotlight();
        initTyping();
        initNav();
        initMenu();
        initRecoMarquee();
        initFeaturedRotator();
        initReveal();
        initFooterYear();
    });
})();
