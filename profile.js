// ═══════════════════════════════════════════════
// CYBERDECK TERMINAL OS - JavaScript
// ═══════════════════════════════════════════════

// ── BOOT SEQUENCE ──
function runBootSequence() {
    const bootScreen = document.getElementById('bootScreen');
    const bootContent = document.getElementById('bootContent');
    if (!bootScreen || !bootContent) return;

    const lines = [
        { text: '[    0.000] sychus@portfolio ~ $ ./start.sh', delay: 0 },
        { text: '[    0.142] Loading modules.................. OK', delay: 300 },
        { text: '[    0.287] Initializing render engine....... OK', delay: 500 },
        { text: '[    0.455] Mounting /dev/portfolio.......... OK', delay: 700 },
        { text: '[    0.612] Connecting to network........... OK', delay: 900 },
        { text: '[    0.789] Starting hugo.service........... OK', delay: 1100 },
        { text: '[    0.934] System ready.', delay: 1400 },
        { text: '', delay: 1600 },
        { text: '> Welcome to hugo.dev v18.0', delay: 1700 },
    ];

    lines.forEach(({ text, delay }) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.textContent = text;
            line.style.animationDelay = '0s';
            bootContent.appendChild(line);
            // Auto-scroll
            bootContent.scrollTop = bootContent.scrollHeight;
        }, delay);
    });

    // Fade out boot screen
    setTimeout(() => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 800);
    }, 2400);
}

// ── CONSTELLATION BACKGROUND ──
function initConstellation() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let nodes = [];
    const maxNodes = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;

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
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
            });
        }
    }

    function getAccentColor() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        return isDark ? { r: 0, g: 255, b: 159 } : { r: 5, g: 150, b: 105 };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getAccentColor();

        // Update & draw nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Wrap around
            if (node.x < 0) node.x = canvas.width;
            if (node.x > canvas.width) node.x = 0;
            if (node.y < 0) node.y = canvas.height;
            if (node.y > canvas.height) node.y = 0;

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createNodes();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });
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

// ── NAV TIME DISPLAY ──
function updateNavTime() {
    const el = document.getElementById('navTime');
    if (!el) return;

    function update() {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    update();
    setInterval(update, 1000);
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
        { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    // Content sections
    document.querySelectorAll('.content-section').forEach(el => observer.observe(el));

    // Git entries with staggered delay
    document.querySelectorAll('.git-entry').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });

    // Stat cards
    const statObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Animate counter
                    const counter = entry.target.querySelector('.counter');
                    if (counter) animateCounter(counter);
                    statObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

    // Skill bars
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll('.skill-bar-item').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.05}s`;
        skillObserver.observe(el);
    });
}

// ── COUNTER ANIMATION ──
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start = performance.now();

    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(step);
}

// ── ACTIVE NAV TAB TRACKING ──
function initNavTracking() {
    const sections = document.querySelectorAll('section[id]');
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
        { threshold: 0.3, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))}px 0px -50% 0px` }
    );

    sections.forEach(section => observer.observe(section));
}

// ── VIM STATUS BAR ──
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

                if (pct === 0) {
                    pctEl.textContent = 'Top';
                } else if (pct >= 99) {
                    pctEl.textContent = 'Bot';
                } else {
                    pctEl.textContent = pct + '%';
                }

                // Approximate "line number" based on scroll
                const line = Math.floor(scrollTop / 20) + 1;
                posEl.textContent = line + ':1';

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ── SMOOTH SCROLL FOR NAV TABS ──
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

// ── INTERACTIVE TERMINAL ──
function initTerminal() {
    const drawer = document.getElementById('terminalDrawer');
    const handle = document.getElementById('drawerHandle');
    const input = document.getElementById('drawerInput');
    const output = document.getElementById('drawerOutput');

    if (!drawer || !handle || !input || !output) return;

    // Start collapsed
    drawer.classList.add('collapsed');

    handle.addEventListener('click', () => {
        drawer.classList.toggle('collapsed');
        if (!drawer.classList.contains('collapsed')) {
            setTimeout(() => input.focus(), 300);
        }
    });

    // All available commands for autocomplete
    const allCommands = ['help', 'about', 'skills', 'contact', 'cv', 'whoami', 'ls', 'date', 'uname', 'clear', 'theme', 'exit', 'pwd', 'neofetch'];
    // Sections for "cd" autocomplete
    const allSections = ['about', 'journey', 'skills', 'projects', 'contact', 'hero'];
    // Command history
    const commandHistory = [];
    let historyIndex = -1;
    // Tab completion state
    let tabMatches = [];
    let tabIndex = -1;
    let lastTabInput = '';

    input.addEventListener('keydown', (e) => {
        // ── TAB AUTOCOMPLETE ──
        if (e.key === 'Tab') {
            e.preventDefault();
            const currentInput = input.value.trim().toLowerCase();

            // Reset tab cycle if input changed since last tab
            if (currentInput !== lastTabInput || tabMatches.length === 0) {
                tabMatches = [];
                tabIndex = -1;

                if (currentInput.startsWith('cd ')) {
                    // Autocomplete sections for "cd"
                    const partial = currentInput.replace('cd ', '').replace('./', '').replace('~/', '');
                    tabMatches = allSections
                        .filter(s => s.startsWith(partial))
                        .map(s => 'cd ' + s);
                } else {
                    // Autocomplete commands
                    tabMatches = allCommands.filter(c => c.startsWith(currentInput));
                }
            }

            if (tabMatches.length === 0) return;

            if (tabMatches.length === 1) {
                // Single match: complete it
                input.value = tabMatches[0];
                lastTabInput = input.value;
            } else {
                // Multiple matches: cycle through them
                tabIndex = (tabIndex + 1) % tabMatches.length;
                input.value = tabMatches[tabIndex];
                lastTabInput = input.value;

                // Show all options on first tab press
                if (tabIndex === 0) {
                    addLine(`<span style="color: var(--text-muted)">${tabMatches.join('  ')}</span>`);
                }
            }
            return;
        }

        // Reset tab state on any other key
        if (e.key !== 'Tab') {
            tabMatches = [];
            tabIndex = -1;
        }

        // ── ARROW UP/DOWN: COMMAND HISTORY ──
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
            }
            input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            // Move cursor to end
            setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
            return;
        }

        // ── ENTER: EXECUTE COMMAND ──
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';
            historyIndex = -1;

            // Echo command
            addLine(`<span style="color: var(--accent-green); font-weight: 600">hugo@dev:~$</span> ${escapeHtml(cmd)}`);

            if (cmd) {
                // Add to history (avoid duplicating last command)
                if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== cmd) {
                    commandHistory.push(cmd);
                }
                processCommand(cmd);
            }
        }
    });

    function addLine(html) {
        const line = document.createElement('div');
        line.className = 'drawer-line';
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function processCommand(cmd) {
        const commands = {
            help: () => {
                addLine('Available commands:');
                addLine('  <span style="color: var(--accent-cyan)">about</span>     - About me');
                addLine('  <span style="color: var(--accent-cyan)">skills</span>    - List my skills');
                addLine('  <span style="color: var(--accent-cyan)">contact</span>   - Contact info');
                addLine('  <span style="color: var(--accent-cyan)">cv</span>        - Open full CV');
                addLine('  <span style="color: var(--accent-cyan)">whoami</span>    - Who am I');
                addLine('  <span style="color: var(--accent-cyan)">ls</span>        - List sections');
                addLine('  <span style="color: var(--accent-cyan)">date</span>      - Current date');
                addLine('  <span style="color: var(--accent-cyan)">uname</span>     - System info');
                addLine('  <span style="color: var(--accent-cyan)">clear</span>     - Clear terminal');
                addLine('  <span style="color: var(--accent-cyan)">theme</span>     - Toggle theme');
                addLine('  <span style="color: var(--accent-cyan)">exit</span>      - Close terminal');
            },
            about: () => {
                addLine('Hugo Héctor Fernández');
                addLine('Senior Software Engineer with 18+ years of experience.');
                addLine('Specialized in Health Informatics for the last 11 years.');
                addLine('Currently Tech Lead at Blackthorn.');
            },
            whoami: () => {
                addLine('hugo - Senior Software Engineer');
            },
            skills: () => {
                addLine('Languages: JavaScript, TypeScript, HTML5, CSS3, SQL');
                addLine('Frameworks: Angular, Node.js, Express, Redux, Tailwind');
                addLine('Databases: MongoDB, PostgreSQL, MySQL, Firebase');
                addLine('Tools: Git, Docker, AWS, Jira, VS Code');
            },
            contact: () => {
                addLine('Email: hugofernandeznqn@gmail.com');
                addLine('Phone: +54 299-427-1675');
                addLine('LinkedIn: linkedin.com/in/hhfernandez');
                addLine('GitHub: github.com/sychus');
            },
            cv: () => {
                addLine('Opening CV...');
                setTimeout(() => window.location.href = 'cv.html', 500);
            },
            ls: () => {
                addLine('<span style="color: var(--accent-cyan)">about/</span>  <span style="color: var(--accent-cyan)">journey/</span>  <span style="color: var(--accent-cyan)">skills/</span>  <span style="color: var(--accent-cyan)">projects/</span>  <span style="color: var(--accent-cyan)">contact/</span>');
            },
            clear: () => {
                output.innerHTML = '';
            },
            date: () => {
                addLine(new Date().toString());
            },
            uname: () => {
                addLine('HugoOS 18.0.0 LTS (Full Stack) x86_64 TypeScript/JavaScript');
            },
            theme: () => {
                toggleTheme();
                const t = document.documentElement.getAttribute('data-theme');
                addLine(`Theme switched to ${t} mode.`);
            },
            exit: () => {
                drawer.classList.add('collapsed');
            },
            pwd: () => {
                addLine('/home/hugo/portfolio');
            },
            neofetch: () => {
                addLine('Run neofetch on the main page ;)');
            },
        };

        // Check for sudo
        if (cmd.startsWith('sudo')) {
            addLine('<span style="color: var(--accent-red)">Permission denied. Nice try though.</span>');
            return;
        }

        // Check for cd
        if (cmd.startsWith('cd ')) {
            const section = cmd.replace('cd ', '').replace('./', '').replace('~/', '');
            const target = document.getElementById(section);
            if (target) {
                addLine(`Navigating to ${section}...`);
                setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
            } else {
                addLine(`<span style="color: var(--accent-red)">cd: no such directory: ${escapeHtml(section)}</span>`);
            }
            return;
        }

        if (commands[cmd]) {
            commands[cmd]();
        } else {
            addLine(`<span style="color: var(--accent-red)">command not found: ${escapeHtml(cmd)}</span>`);
            addLine('Type <span style="color: var(--accent-cyan)">help</span> for available commands.');
        }
    }
}

// ── PROFILE IMAGE FALLBACK ──
function initProfileImage() {
    const img = document.getElementById('profileImage');
    if (!img) return;

    img.addEventListener('error', () => {
        // Create canvas placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 300, 300);
        grad.addColorStop(0, '#00ff9f');
        grad.addColorStop(1, '#00d4ff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 300, 300);

        // Initials
        ctx.fillStyle = '#06060e';
        ctx.font = 'bold 80px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('HHF', 150, 150);

        img.src = canvas.toDataURL('image/png');
    });
}

// ── KEYBOARD SHORTCUTS ──
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt+T = toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }

        // Backtick = toggle terminal
        if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const active = document.activeElement;
            // Only toggle if not typing in an input
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
            e.preventDefault();
            const drawer = document.getElementById('terminalDrawer');
            if (drawer) {
                drawer.classList.toggle('collapsed');
                if (!drawer.classList.contains('collapsed')) {
                    setTimeout(() => document.getElementById('drawerInput')?.focus(), 300);
                }
            }
        }
    });
}

// ── KONAMI CODE EASTER EGG ──
function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === code[index]) {
            index++;
            if (index === code.length) {
                activateMatrixRain();
                index = 0;
            }
        } else {
            index = 0;
        }
    });
}

function activateMatrixRain() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;';
    document.body.appendChild(container);

    const cols = Math.floor(window.innerWidth / 20);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    for (let i = 0; i < cols; i++) {
        const col = document.createElement('div');
        const char = chars[Math.floor(Math.random() * chars.length)];
        col.textContent = char;
        col.style.cssText = `
            position:absolute;
            top:-20px;
            left:${i * 20}px;
            font-family:var(--font-mono);
            font-size:14px;
            color:#00ff9f;
            opacity:0.6;
            animation:matrixFall ${Math.random() * 2 + 1.5}s linear ${Math.random() * 2}s infinite;
        `;
        container.appendChild(col);
    }

    const style = document.createElement('style');
    style.textContent = '@keyframes matrixFall{from{top:-20px;opacity:0.6}to{top:100vh;opacity:0}}';
    document.head.appendChild(style);

    setTimeout(() => {
        container.remove();
        style.remove();
    }, 6000);
}

// ── REDUCED MOTION CHECK ──
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ═══════════════════════════════
// INITIALIZATION
// ═══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    // Theme first
    setTheme(getInitialTheme());
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // Boot sequence
    if (!prefersReducedMotion()) {
        runBootSequence();
    } else {
        const boot = document.getElementById('bootScreen');
        if (boot) boot.style.display = 'none';
    }

    // Init all features
    if (!prefersReducedMotion()) {
        initConstellation();
    }
    updateNavTime();
    initScrollAnimations();
    initNavTracking();
    initVimBar();
    initSmoothScroll();
    initTerminal();
    initProfileImage();
    initKeyboardShortcuts();
    initKonamiCode();

    // System theme listener
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
