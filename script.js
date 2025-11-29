// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Pricing Toggle
const pricingToggle = document.querySelector('.pricing-toggle input');
const priceAmounts = document.querySelectorAll('.amount');

if (pricingToggle && priceAmounts.length) {
    pricingToggle.addEventListener('change', () => {
        if (pricingToggle.checked) {
            // Annual pricing (20% discount)
            priceAmounts[0].textContent = '$15';
            priceAmounts[1].textContent = '$39';
            priceAmounts[2].textContent = '$79';
        } else {
            // Monthly pricing
            priceAmounts[0].textContent = '$19';
            priceAmounts[1].textContent = '$49';
            priceAmounts[2].textContent = '$99';
        }
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .pricing-card, .testimonial-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
document.querySelectorAll('.feature-card, .step, .pricing-card, .testimonial-card').forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Trigger animation on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Dark Mode Toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
darkModeToggle.className = 'dark-mode-toggle';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Add dark mode styles dynamically
const darkModeStyles = `
.dark-mode {
    --dark: #F8FAFC;
    --light: #1E293B;
    --white: #1E293B;
    --black: #F8FAFC;
    --gray: #94A3B8;
    --light-gray: #334155;
}

.dark-mode .header {
    background-color: rgba(30, 41, 59, 0.95);
}

.dark-mode .hero {
    background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
}

.dark-mode .features {
    background-color: #0F172A;
}

.dark-mode .how-it-works {
    background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
}

.dark-mode .pricing {
    background-color: #0F172A;
}

.dark-mode .testimonials {
    background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
}

.dark-mode .footer {
    background-color: #020617;
}

.dark-mode .feature-card,
.dark-mode .step,
.dark-mode .pricing-card,
.dark-mode .testimonial-card {
    background: #1E293B;
}

.dark-mode .nav-links a,
.dark-mode .testimonial-author h4 {
    color: #F8FAFC;
}

.dark-mode .nav-links a:hover {
    color: #C7D2FE;
}

.dark-mode .btn-outline {
    border-color: #C7D2FE;
    color: #C7D2FE;
}

.dark-mode .btn-outline:hover {
    background-color: rgba(199, 210, 254, 0.2);
}

.dark-mode .section-description,
.dark-mode .feature-card p,
.dark-mode .step p,
.dark-mode .pricing-card p,
.dark-mode .testimonial-text,
.dark-mode .testimonial-author p,
.dark-mode .footer,
.dark-mode .footer-column p {
    color: #CBD5E1;
}

.dark-mode .stat p,
.dark-mode .pricing-features li i.fa-times {
    color: #94A3B8;
}

.dark-mode .popular-badge {
    background: #6366F1;
}

.dark-mode .floating-card {
    background: #334155;
}

.dark-mode .dashboard-mockup {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.dark-mode .hero::before {
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%);
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

// Add dark mode toggle styles
const darkModeToggleStyles = `
.dark-mode-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: var(--transition);
}

.dark-mode-toggle:hover {
    transform: scale(1.1);
}
`;

const darkModeToggleStyleElement = document.createElement('style');
darkModeToggleStyleElement.textContent = darkModeToggleStyles;
document.head.appendChild(darkModeToggleStyleElement);