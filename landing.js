document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const menuIcon = mobileMenuToggle.querySelector('i');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navActions.classList.toggle('active');
        
        // Toggle icon between list and x
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.nav-links a, .nav-actions a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navActions.classList.remove('active');
                menuIcon.classList.remove('ph-x');
                menuIcon.classList.add('ph-list');
            }
        });
    });

    // 2. Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible if you only want it to animate once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
