/* ================================================================
   HUGO H. FERNÁNDEZ — RESUME PAGE JS (cv.html)
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
        const initial = stored || browser;
        setLanguage(initial);

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
        const initial = stored || 'dark';
        setTheme(initial);

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

    /* ====== NAV SCROLLED STATE ====== */
    const initNav = () => {
        const nav = document.getElementById('topNav');
        if (!nav) return;

        let last = false;
        const onScroll = () => {
            const scrolled = window.scrollY > 12;
            if (scrolled !== last) {
                nav.classList.toggle('scrolled', scrolled);
                last = scrolled;
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    /* ====== PRINT ====== */
    const initPrint = () => {
        const btn = document.getElementById('printBtn');
        if (btn) {
            btn.addEventListener('click', () => window.print());
        }

        /* Auto-trigger print when opened with ?print=1 (from portfolio "Download CV") */
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('print') === '1') {
                window.addEventListener('load', () => {
                    setTimeout(() => window.print(), 600);
                });
            }
        } catch (e) {}
    };

    /* ====== INIT ====== */
    document.addEventListener('DOMContentLoaded', () => {
        initLanguage();
        initTheme();
        initNav();
        initPrint();
    });
})();
