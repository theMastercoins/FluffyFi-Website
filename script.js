
// Smooth scrolling and navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.remove('active');
        // Update hamburger icon
        updateMobileMenuIcon();
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('active');
    updateMobileMenuIcon();
}

function updateMobileMenuIcon() {
    const toggle = document.querySelector('.mobile-menu-toggle i');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenu.classList.contains('active')) {
        toggle.className = 'fas fa-times';
    } else {
        toggle.className = 'fas fa-bars';
    }
}

// Active navigation highlighting
function updateActiveNavLink() {
    const sections = ['hero', 'countdown', 'stats', 'nfts', 'community', 'highlights', 'joinus'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section;
            }
        }
    });
    
    navLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        const sectionMap = {
            'countdown': 'countdown',
            'stats': 'stats',
            'nfts': 'nfts',
            'community': 'community',
            'highlights': 'highlights'
        };
        
        if (sectionMap[linkText] === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Fetch real-time stats from API
async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            telegram: { handle: "fluffyfi_world", followers: 1387, label: "Members" },
            twitter: { handle: "@fi_fluffy", followers: 386, label: "Followers" },
            instagram: { handle: "@fluffyfi_world", followers: 169, label: "Followers" },
            discord: { handle: "FluffyFi Server", followers: 241, label: "Members" }
        };
    }
}

// Update stats with real data
async function updateStatsWithRealData() {
    const stats = await fetchStats();
    
    const statElements = [
        { element: document.querySelector('[data-stat="twitter"] .stat-number'), target: stats.twitter.followers },
        { element: document.querySelector('[data-stat="telegram"] .stat-number'), target: stats.telegram.followers },
        { element: document.querySelector('[data-stat="discord"] .stat-number'), target: stats.discord.followers },
        { element: document.querySelector('[data-stat="instagram"] .stat-number'), target: stats.instagram.followers }
    ];
    
    statElements.forEach(({ element, target }, index) => {
        if (element) {
            element.setAttribute('data-target', target);
            setTimeout(() => animateCounter(element, target), index * 200);
        }
    });
}

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate stats counters when stats section comes into view
                if (entry.target.id === 'stats') {
                    updateStatsWithRealData();
                }
                
                // Only observe once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Countdown timer
function startCountdown() {
    const targetDate = new Date('2025-08-30T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Format days with question mark (only show last digit)
            const formatDays = (value) => {
                const str = value.toString();
                return str.length === 1 ? `?${str}` : 
                       str.length === 2 ? `?${str[1]}` : 
                       `??${str[str.length - 1]}`;
            };
            
            // Update countdown display - only days hidden with ?
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = formatDays(days);
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
        } else {
            // Countdown finished
            const countdownElements = ['days', 'hours', 'minutes', 'seconds'];
            countdownElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = '00';
            });
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Parallax effect for hero background
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const clouds = document.querySelectorAll('.cloud-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            clouds.forEach((cloud, index) => {
                const speed = 0.2 + (index * 0.1);
                cloud.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

// Add hover effects to cards
function initHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .nft-card, .community-card, .highlight-card, .social-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.style.transform + ' scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.style.transform.replace(' scale(1.02)', '');
        });
    });
}

// Add floating animation to hero logo
function initFloatingAnimation() {
    const heroLogo = document.querySelector('.hero-logo img');
    if (heroLogo) {
        let floatDirection = 1;
        let rotation = 0;
        
        setInterval(() => {
            rotation += floatDirection * 0.5;
            if (rotation >= 5) floatDirection = -1;
            if (rotation <= -5) floatDirection = 1;
            
            heroLogo.style.transform = `translateY(-25px) rotate(${rotation}deg)`;
        }, 100);
    }
}

// Add glowing text effect to hero title
function initTextGlowEffect() {
    const heroTitle = document.querySelector('.hero-title-2');
    if (heroTitle) {
        let glowIntensity = 0;
        let glowDirection = 1;
        
        setInterval(() => {
            glowIntensity += glowDirection * 2;
            if (glowIntensity >= 100) glowDirection = -1;
            if (glowIntensity <= 0) glowDirection = 1;
            
            const opacity = glowIntensity / 100 * 0.5;
            heroTitle.style.textShadow = `0 0 20px rgba(255, 159, 67, ${opacity})`;
        }, 50);
    }
}

// Add click animation to buttons
function initButtonAnimations() {
    const buttons = document.querySelectorAll('button, .community-btn, .social-card');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            ripple.style.pointerEvents = 'none';
            
            if (button.style.position !== 'relative') {
                button.style.position = 'relative';
            }
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add scroll-based fade animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll('section, .stat-card, .nft-card, .community-card, .highlight-card, .social-card');
    elementsToAnimate.forEach(element => {
        fadeObserver.observe(element);
    });
}

// Add loading animation
function initLoadingAnimations() {
    // Stagger card animations
    const animatedElements = document.querySelectorAll('.stat-card, .nft-card, .highlight-card, .social-card');
    
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start countdown timer
    startCountdown();
    
    // Initialize intersection observer for animations
    createIntersectionObserver();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize floating animations
    initFloatingAnimation();
    
    // Initialize text glow effect
    initTextGlowEffect();
    
    // Initialize button animations
    initButtonAnimations();
    
    // Initialize loading animations
    initLoadingAnimations();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Listen for scroll events to update active nav
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Listen for resize events
    window.addEventListener('resize', () => {
        // Close mobile menu on resize
        const mobileMenu = document.getElementById('mobile-menu');
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            updateMobileMenuIcon();
        }
    });
    
    console.log('FluffyFi website loaded successfully! 🐱✨');
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.code === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s ease-in-out infinite';
            setTimeout(() => {
                document.body.style.animation = '';
                window.konamiProgress = 0;
            }, 10000);
            
            // Add rainbow animation
            if (!document.getElementById('rainbow-styles')) {
                const style = document.createElement('style');
                style.id = 'rainbow-styles';
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    } else {
        window.konamiProgress = 0;
    }
});

// Add click counter for logo
let logoClicks = 0;
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-logo, .hero-logo img, .footer-logo')) {
        logoClicks++;
        if (logoClicks >= 10) {
            alert('🐱 You found the secret! Meow meow! 🐱');
            logoClicks = 0;
        }
    }
});
