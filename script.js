// ===================================
// THEME MANAGEMENT
// ===================================

// Get theme from localStorage or system preference
function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    return 'light';
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button icon
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('fade-in'); // Remove initial class
        observer.observe(section);
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// SKILL TAGS ANIMATION
// ===================================

function initSkillAnimations() {
    const skills = document.querySelectorAll('.skill');
    
    skills.forEach((skill, index) => {
        // Add staggered animation delay
        skill.style.animationDelay = `${index * 0.05}s`;
        
        // Add random subtle rotation on hover
        skill.addEventListener('mouseenter', function() {
            const randomRotation = (Math.random() - 0.5) * 10;
            this.style.transform = `translateY(-3px) scale(1.05) rotate(${randomRotation}deg)`;
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ===================================
// PARALLAX EFFECT ON SCROLL
// ===================================

function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const header = document.querySelector('.header');
                
                if (header) {
                    // Subtle parallax effect on header
                    header.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ===================================
// PRINT FUNCTIONALITY
// ===================================

function initPrintHandler() {
    // Before print: ensure light theme for better printing
    window.addEventListener('beforeprint', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-print-theme', currentTheme);
        document.documentElement.setAttribute('data-theme', 'light');
    });
    
    // After print: restore original theme
    window.addEventListener('afterprint', () => {
        const originalTheme = document.documentElement.getAttribute('data-print-theme');
        if (originalTheme) {
            document.documentElement.setAttribute('data-theme', originalTheme);
            document.documentElement.removeAttribute('data-print-theme');
        }
    });
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
    // Add rainbow animation to name
    const name = document.querySelector('.name');
    if (name) {
        name.style.animation = 'rainbow 2s linear infinite';
        
        // Add keyframe animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove after 5 seconds
        setTimeout(() => {
            name.style.animation = '';
        }, 5000);
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for performance
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
    console.log('🚀 Modern CV loaded successfully!');
    
    // Initialize theme
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize features
    initScrollAnimations();
    initSmoothScroll();
    initSkillAnimations();
    initParallax();
    initPrintHandler();
    initKonamiCode();
    
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

// Keyboard navigation for theme toggle
document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Alt + P to print
    if (e.altKey && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}
