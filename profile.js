// ===================================
// TERMINAL TYPING ANIMATION
// ===================================

const terminalCommands = [
    'whoami',
    'cat about.md',
    'ls -la projects/',
    'git status',
    'npm run dev'
];

let currentCommandIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeTerminalText() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) {
        // Retry after a short delay if element not found
        setTimeout(typeTerminalText, 100);
        return;
    }
    
    const currentCommand = terminalCommands[currentCommandIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentCommand.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentCommand.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && currentCharIndex === currentCommand.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentCommandIndex = (currentCommandIndex + 1) % terminalCommands.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeTerminalText, typingSpeed);
}

// ===================================
// PARTICLES ANIMATION
// ===================================

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Create stars (8-12 stars)
    const starCount = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'particle star';
        star.setAttribute('data-type', 'star');
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size (subtle but visible)
        const size = Math.random() * 2 + 1.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Random animation delay
        star.style.animationDelay = Math.random() * 10 + 's';
        star.style.animationDuration = (Math.random() * 4 + 3) + 's';
        
        particlesContainer.appendChild(star);
    }
    
    // Create planets (3-5 planets)
    const planetCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < planetCount; i++) {
        const planet = document.createElement('div');
        planet.className = 'particle planet';
        planet.setAttribute('data-type', 'planet');
        
        // Random position
        planet.style.left = Math.random() * 100 + '%';
        planet.style.top = Math.random() * 100 + '%';
        
        // Random size (larger but still subtle)
        const size = Math.random() * 4 + 3;
        planet.style.width = size + 'px';
        planet.style.height = size + 'px';
        
        // Random animation delay
        planet.style.animationDelay = Math.random() * 15 + 's';
        planet.style.animationDuration = (Math.random() * 20 + 15) + 's';
        
        particlesContainer.appendChild(planet);
    }
}

// ===================================
// COMET ANIMATION (Single comet every 4 seconds)
// ===================================

function createComet() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Remove any existing comet
    const existingComet = particlesContainer.querySelector('.comet');
    if (existingComet) {
        existingComet.remove();
    }
    
    // Create new comet
    const comet = document.createElement('div');
    comet.className = 'particle comet';
    comet.setAttribute('data-type', 'comet');
    
    // Random starting position (from top-left area, can vary)
    const startX = Math.random() * 40; // 0-40% from left
    const startY = Math.random() * 30; // 0-30% from top
    comet.style.left = startX + '%';
    comet.style.top = startY + '%';
    
    // Animation duration (2-3 seconds)
    comet.style.animationDuration = (Math.random() * 1 + 2) + 's';
    
    particlesContainer.appendChild(comet);
    
    // Remove comet after animation completes
    setTimeout(() => {
        if (comet.parentNode) {
            comet.remove();
        }
    }, 3000);
}

function startCometInterval() {
    // Create first comet immediately
    createComet();
    
    // Then create a new comet every 4 seconds
    setInterval(() => {
        createComet();
    }, 4000);
}

// ===================================
// THEME MANAGEMENT
// ===================================

function getInitialTheme() {
    // Always default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // Default to dark mode
    return 'dark';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle?.querySelector('i');
    
    if (icon) {
        if (theme === 'dark') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// PARALLAX EFFECT
// ===================================

function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero section
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroSection.style.opacity = 1 - (scrolled / 500);
                }
                
                // Parallax for terminal
                const terminal = document.querySelector('.terminal-container');
                if (terminal && scrolled < 500) {
                    terminal.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ===================================
// LOAD LINKEDIN PROFILE IMAGE
// ===================================

function loadLinkedInProfileImage() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;
    
    // Try multiple possible image paths and formats
    const possiblePaths = [
        'assets/hugo.jpeg',
        'assets/hugo.jpg',
        'assets/hugo.png',
        'assets/profile.jpg',
        'assets/profile.jpeg',
        'assets/profile.png',
        'profile.jpg',
        'profile.jpeg',
        'profile.png',
        'images/profile.jpg',
        'images/profile.jpeg',
        'images/profile.png',
        'foto.jpg',
        'foto.jpeg',
        'foto.png'
    ];
    
    let currentPathIndex = 0;
    
    function tryNextPath() {
        if (currentPathIndex >= possiblePaths.length) {
            // If no image found, create placeholder
            createProfilePlaceholder();
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            profileImage.src = possiblePaths[currentPathIndex];
            console.log('✅ Foto de perfil cargada:', possiblePaths[currentPathIndex]);
        };
        
        img.onerror = function() {
            currentPathIndex++;
            tryNextPath();
        };
        
        img.src = possiblePaths[currentPathIndex];
    }
    
    tryNextPath();
}

function createProfilePlaceholder() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;
    
    // Create a canvas for the placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Draw circular gradient background
    const centerX = 150;
    const centerY = 150;
    const radius = 150;
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(0.5, '#0891b2');
    gradient.addColorStop(1, '#10b981');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw initials "HHF"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HHF', centerX, centerY);
    
    // Convert to data URL and set as image source
    const dataUrl = canvas.toDataURL('image/png');
    profileImage.src = dataUrl;
    
    console.log('💡 Tip: Descarga tu foto de LinkedIn y guárdala como "profile.jpg" en la raíz del proyecto para que se cargue automáticamente.');
}

// ===================================
// PROFILE IMAGE INTERACTION
// ===================================

function initProfileImageInteraction() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;
    
    profileImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    profileImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Click to change image (placeholder for future feature)
    profileImage.addEventListener('click', function() {
        // Could add a modal or image gallery here
        console.log('Profile image clicked - future feature');
    });
}

// ===================================
// SKILL TAGS ANIMATION
// ===================================

function initSkillTagsAnimation() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
        
        tag.addEventListener('mouseenter', function() {
            const randomRotation = (Math.random() - 0.5) * 10;
            this.style.transform = `translateY(-3px) rotate(${randomRotation}deg) scale(1.05)`;
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ===================================
// CURSOR TRAIL EFFECT (OPTIONAL)
// ===================================

function initCursorTrail() {
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(129, 140, 248, 0.5) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursorTrail);
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX - 10 + 'px';
        cursorTrail.style.top = trailY - 10 + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// ===================================
// EASTER EGG: KONAMI CODE
// ===================================

function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    // Create matrix rain effect
    const matrixContainer = document.createElement('div');
    matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.3;
    `;
    document.body.appendChild(matrixContainer);
    
    const chars = '01';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            top: -100px;
            left: ${i * 20}px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: #818cf8;
            animation: matrixRain ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        column.textContent = chars[Math.floor(Math.random() * chars.length)];
        matrixContainer.appendChild(column);
    }
    
    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrixRain {
            to {
                top: 100vh;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after 5 seconds
    setTimeout(() => {
        matrixContainer.remove();
        style.remove();
    }, 5000);
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

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

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Developer Profile loaded successfully!');
    
    // Initialize theme
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Start terminal typing animation
    setTimeout(() => {
        typeTerminalText();
    }, 1000);
    
    // Create particles
    createParticles();
    
    // Start comet animation
    startCometInterval();
    
    // Load LinkedIn profile image
    loadLinkedInProfileImage();
    
    // Initialize features
    initScrollAnimations();
    initSmoothScroll();
    initParallax();
    initProfileImageInteraction();
    initSkillTagsAnimation();
    initKonamiCode();
    
    // Optional: Uncomment to enable cursor trail
    // initCursorTrail();
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
    
    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}
