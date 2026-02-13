// ═══════════════════════════════════════════════
// CYBERDECK TERMINAL OS - CV JavaScript
// Matches portfolio visual language
// ═══════════════════════════════════════════════

// ── CONSTELLATION BACKGROUND ──
function initConstellation() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    const maxNodes = window.innerWidth < 768 ? 25 : 45;
    const connectionDistance = 140;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < maxNodes; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.2 + 0.4,
            });
        }
    }

    function getColor() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        return isDark ? { r: 0, g: 255, b: 159 } : { r: 5, g: 150, b: 105 };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const c = getColor();

        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0) node.x = canvas.width;
            if (node.x > canvas.width) node.x = 0;
            if (node.y < 0) node.y = canvas.height;
            if (node.y > canvas.height) node.y = 0;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.35)`;
            ctx.fill();
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resize();
    createNodes();
    draw();
    window.addEventListener('resize', () => { resize(); createNodes(); });
}

// ── THEME MANAGEMENT ──
function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// ── NAV TIME ──
function updateNavTime() {
    const el = document.getElementById('navTime');
    if (!el) return;
    function tick() {
        el.textContent = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
    }
    tick();
    setInterval(tick, 1000);
}

// ── SCROLL ANIMATIONS ──
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.cv-section, .cv-header').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ── NAV TAB TRACKING ──
function initNavTracking() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const tabs = document.querySelectorAll('.nav-tab');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tabs.forEach(tab => {
                        tab.classList.toggle('active', tab.getAttribute('data-section') === id);
                    });
                }
            });
        },
        { threshold: 0.2, rootMargin: `-${42}px 0px -50% 0px` }
    );

    sections.forEach(s => observer.observe(s));
}

// ── VIM BAR ──
function initVimBar() {
    const pctEl = document.getElementById('vimPct');
    const posEl = document.getElementById('vimPos');
    if (!pctEl || !posEl) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

                pctEl.textContent = pct === 0 ? 'Top' : pct >= 99 ? 'Bot' : pct + '%';
                posEl.textContent = (Math.floor(scrollTop / 20) + 1) + ':1';
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ── SMOOTH SCROLL ──
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── SKILL TAG HOVER ──
function initSkillHover() {
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            const r = (Math.random() - 0.5) * 6;
            this.style.transform = `translateY(-2px) rotate(${r}deg) scale(1.05)`;
        });
        tag.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// ── PRINT HANDLER ──
function initPrintHandler() {
    window.addEventListener('beforeprint', () => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-print-theme', current);
        document.documentElement.setAttribute('data-theme', 'light');
    });

    window.addEventListener('afterprint', () => {
        const original = document.documentElement.getAttribute('data-print-theme');
        if (original) {
            document.documentElement.setAttribute('data-theme', original);
            document.documentElement.removeAttribute('data-print-theme');
        }
    });
}

// ── KEYBOARD SHORTCUTS ──
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
}

// ── REDUCED MOTION CHECK ──
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ═══════════════════════════════
// INITIALIZATION
// ═══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getInitialTheme());
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    if (!prefersReducedMotion()) {
        initConstellation();
    }

    updateNavTime();
    initScrollAnimations();
    initNavTracking();
    initVimBar();
    initSmoothScroll();
    initSkillHover();
    initPrintHandler();
    initKeyboardShortcuts();

    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
