// ========================================
// MOBILE MENU TOGGLE WITH ANIMATIONS
// ========================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when window is resized (desktop view)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when a link is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// NAVBAR SHADOW ON SCROLL
// ========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ========================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards, testimonial cards, and pricing cards
document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .property-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// CTA BUTTON INTERACTIONS
// ========================================

const ctaButtons = document.querySelectorAll('.cta-button');

ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        if (!this.closest('.modal')) {
            this.style.transform = 'translateY(-2px)';
        }
    });

    button.addEventListener('mouseleave', function() {
        if (!this.closest('.modal')) {
            this.style.transform = 'translateY(0)';
        }
    });

    button.addEventListener('click', function(e) {
        // Add ripple effect
        if (e.clientX === 0 && e.clientY === 0) return; // Skip if triggered by keyboard
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// PRICING CARD HIGHLIGHT
// ========================================

const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        pricingCards.forEach(c => c.style.opacity = '0.6');
        this.style.opacity = '1';
    });

    card.addEventListener('mouseleave', function() {
        pricingCards.forEach(c => c.style.opacity = '1');
    });
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-color, #1ab5a3);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        display: none;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(26, 181, 163, 0.3);
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(26, 181, 163, 0.4)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(26, 181, 163, 0.3)';
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createScrollToTopButton);
} else {
    createScrollToTopButton();
}

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-color, #1ab5a3);
        font-weight: 700;
        border-bottom: 2px solid var(--primary-color, #1ab5a3);
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
} else {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
}

// ========================================
// NEWSLETTER FORM SUBMISSION
// ========================================

const newsletterForm = document.getElementById('newsletterForm');
const formMessage = document.getElementById('formMessage');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('.newsletter-input').value;
        formMessage.textContent = 'Subscribing...';
        formMessage.className = '';

        try {
            setTimeout(() => {
                formMessage.textContent = '✓ Successfully subscribed! Check your email.';
                formMessage.classList.add('success');
                newsletterForm.reset();
                
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = '';
                }, 5000);
            }, 800);
        } catch (error) {
            formMessage.textContent = '✗ Error subscribing. Please try again.';
            formMessage.classList.add('error');
            console.error('Newsletter error:', error);
        }
    });
}

// ========================================
// MODAL MANAGEMENT
// ========================================

const modals = {
    signup: document.getElementById('signupModal'),
    signin: document.getElementById('signinModal'),
    property: document.getElementById('propertyModal'),
    pricing: document.getElementById('pricingModal'),
    success: document.getElementById('successModal'),

};

// Open modal
function openModal(modalName) {
    if (modals[modalName]) {
        modals[modalName].classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalName) {
    if (modals[modalName]) {
        modals[modalName].classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close all modals
function closeAllModals() {
    Object.keys(modals).forEach(key => closeModal(key));
}

// Close modal on background click
Object.keys(modals).forEach(key => {
    if (modals[key]) {
        modals[key].addEventListener('click', (e) => {
            if (e.target === modals[key]) {
                closeModal(key);
            }
        });
    }
});

// Close modal on X button click
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// ========================================
// SIGN UP / SIGN IN FLOWS
// ========================================

// Sign In buttons (in navbar)
document.querySelectorAll('.cta-button.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signin');
    });
});

// "Start Free Trial" - Hero section
document.querySelectorAll('.hero .cta-button.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });
});

// "Get Started Free" - Value prop section
document.querySelectorAll('.value-prop .cta-button.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });
});

// "Start Your Free Trial Today" - CTA section
document.querySelectorAll('.cta-section .cta-button.primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });
});

// Watch Demo button
document.querySelectorAll('.hero .cta-button.secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('demo');
    });
});

// Sign up / Sign in form switch
document.getElementById('signinLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signup');
    openModal('signin');
});

document.getElementById('signupLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signin');
    openModal('signup');
});

// Handle signup form
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Signup:', Object.fromEntries(formData));
    
    closeModal('signup');
    showSuccessModal('Account Created!', 'Welcome to Quick Vantage! Check your email to verify your account.');
    
    e.target.reset();
});

// Handle signin form
document.getElementById('signinForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Signin:', Object.fromEntries(formData));
    
    closeModal('signin');
    showSuccessModal('Signed In!', 'Welcome back! You are now signed in to your account.');
    
    e.target.reset();
});

// ========================================
// PROPERTY DETAILS FLOWS
// ========================================

const propertyData = {
    'Modern Apartment Complex': {
        image: './images/1.jpg',
        location: 'New York, NY',
        price: '$450,000',
        roi: '8.5%',
        capRate: '6.2%',
        type: 'Multi-Family',
        status: 'Featured',
        description: 'Modern apartment complex in a thriving neighborhood with strong rental demand and excellent appreciation potential.'
    },
    'Commercial Office Space': {
        image: './images/2.jpg',
        location: 'Los Angeles, CA',
        price: '$650,000',
        roi: '9.2%',
        capRate: '7.1%',
        type: 'Commercial',
        status: 'Hot Deal',
        description: 'Prime commercial office space with long-term tenant leases and stable income stream.'
    },
    'Single Family Home': {
        image: './images/3.jpg',
        location: 'Austin, TX',
        price: '$325,000',
        roi: '7.8%',
        capRate: '5.9%',
        type: 'Residential',
        status: 'Pre-Completion',
        description: 'Beautiful single family home in a growing neighborhood ready for investment.'
    },
    'Retail Shopping Center': {
        image: './images/4.jpg',
        location: 'Miami, FL',
        price: '$850,000',
        roi: '10.1%',
        capRate: '8.3%',
        type: 'Retail',
        status: 'Off-Market',
        description: 'Prime retail shopping center with excellent tenant mix and high occupancy rates.'
    },
    'Industrial Warehouse': {
        image: './images/5.jpg',
        location: 'Chicago, IL',
        price: '$520,000',
        roi: '8.9%',
        capRate: '6.8%',
        type: 'Industrial',
        status: 'Featured',
        description: 'Strategic industrial warehouse location with strong logistics demand.'
    },
    'Luxury Resort Property': {
        image: './images/27.jpg',
        location: 'Denver, CO',
        price: '$1,200,000',
        roi: '11.5%',
        capRate: '9.2%',
        type: 'Hospitality',
        status: 'Hot Deal',
        description: 'Luxury resort property with exceptional amenities and strong market position.'
    }
};

// Handle View Details buttons
document.querySelectorAll('.property-card .cta-button.secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const propertyTitle = btn.closest('.property-card').querySelector('h3').textContent;
        const property = propertyData[propertyTitle] || propertyData['Modern Apartment Complex'];
        
        // Populate modal
        document.getElementById('propertyTitle').textContent = propertyTitle;
        document.getElementById('propertyLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.location}`;
        document.getElementById('propertyImage').src = property.image;
        document.getElementById('propertyPrice').textContent = property.price;
        document.getElementById('propertyROI').textContent = property.roi;
        document.getElementById('propertyCapRate').textContent = property.capRate;
        document.getElementById('propertyTypeDetail').textContent = property.type;
        document.getElementById('propertyType').textContent = property.type;
        document.getElementById('propertyStatus').textContent = property.status;
        document.getElementById('propertyDescription').textContent = property.description;
        
        openModal('property');
    });
});

// Handle property modal actions
document.getElementById('contactPropertyBtn')?.addEventListener('click', () => {
    closeModal('property');
    showSuccessModal('Request Sent!', 'Our team will contact you soon with more information about this property.');
});

document.getElementById('scheduleViewBtn')?.addEventListener('click', () => {
    closeModal('property');
    showSuccessModal('Tour Scheduled!', 'A representative will contact you to confirm your property tour.');
});

// ========================================
// PRICING PLAN FLOWS
// ========================================

const planData = {
    'Starter': {
        price: '$99',
        description: 'Perfect for individual investors'
    },
    'Professional': {
        price: '$299',
        description: 'Most popular for growing teams'
    },
    'Enterprise': {
        price: 'Custom',
        description: 'For large organizations and funds'
    }
};

// Handle Choose Plan buttons
document.querySelectorAll('.pricing-card .cta-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const planName = btn.closest('.pricing-card').querySelector('h3').textContent;
        const plan = planData[planName];
        
        document.getElementById('planName').textContent = planName + ' Plan';
        document.getElementById('planDescription').textContent = plan.description;
        document.getElementById('planPrice').textContent = plan.price;
        
        openModal('pricing');
    });
});

// Handle pricing form
document.getElementById('planForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Plan:', Object.fromEntries(formData));
    
    const planName = document.getElementById('planName').textContent;
    closeModal('pricing');
    showSuccessModal('Plan Selected!', `You've selected the ${planName}. Your 14-day free trial starts now!`);
    
    e.target.reset();
});

// ========================================
// SUCCESS MODAL
// ========================================

function showSuccessModal(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    openModal('success');
}

document.getElementById('successCloseBtn')?.addEventListener('click', () => {
    closeAllModals();
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

console.log('All modals and forms initialized successfully');

// ========================================
// AUTHENTICATION MANAGER
// ========================================

class AuthManager {
    constructor() {
        this.storageKey = 'quickVantageUser';
        this.currentUser = this.loadUser();
    }

    // Check if user is logged in
    isAuthenticated() {
        try {
            return this.currentUser !== null && this.currentUser !== undefined;
        } catch (e) {
            console.error('Error checking authentication:', e);
            return false;
        }
    }

    // Get current user
    getCurrentUser() {
        try {
            return this.currentUser;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    // Sign up new user
    signUp(userData) {
        try {
            // Validate required fields
            if (!userData.fullName || !userData.email || !userData.phone || !userData.password) {
                throw new Error('All fields are required');
            }

            const user = {
                id: this.generateId(),
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            // Store in localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;

            return user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    // Sign in existing user
    signIn(email, password) {
        try {
            // Validate inputs
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Simulate backend validation
            const user = {
                id: this.generateId(),
                email: email,
                lastLogin: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;

            return user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    // Sign out user
    signOut() {
        try {
            localStorage.removeItem(this.storageKey);
            this.currentUser = null;
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Load user from storage
    loadUser() {
        try {
            const userJson = localStorage.getItem(this.storageKey);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    // Generate unique ID
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Create global instance
const auth = new AuthManager();

// ========================================
// PROPERTY DETAILS AUTHENTICATION FLOW
// ========================================

// Handle View Details buttons with authentication check
document.querySelectorAll('.property-card .cta-button.secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!auth.isAuthenticated()) {
            showNotification('Please sign in to view property details', 'info');
            closeAllModals();
            openModal('signin');
            return;
        }

        // User is authenticated - redirect to listings with specific property
        const propertyTitle = btn.closest('.property-card').querySelector('h3').textContent;
        localStorage.setItem('scrollToProperty', propertyTitle);
        window.location.href = 'listings.html';
    });
});

// ========================================
// ENHANCED SIGN UP / SIGN IN FLOWS
// ========================================

// Sign up form submission
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate passwords match
        if (userData.password !== userData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Sign up user
        const user = auth.signUp(userData);
        console.log('User signed up:', user);
        
        // Close signup modal
        const signupModal = document.getElementById('signupModal');
        if (signupModal) {
            signupModal.classList.remove('active');
        }
        
        // Show success modal
        document.getElementById('successTitle').textContent = 'Account Created!';
        document.getElementById('successMessage').textContent = `Welcome ${user.fullName}! Redirecting to properties...`;
        document.getElementById('successModal').classList.add('active');
        
        this.reset();

        // Wait 2 seconds then redirect
        setTimeout(() => {
            console.log('Redirecting to listings.html');
            window.location.href = 'listings.html';
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Error creating account: ' + error.message, 'error');
    }
});

// Sign in form submission
document.getElementById('signinForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validate email and password
        if (!email || !password) {
            showNotification('Please enter email and password', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Sign in user
        const user = auth.signIn(email, password);
        console.log('User signed in:', user);
        
        // Close signin modal
        const signinModal = document.getElementById('signinModal');
        if (signinModal) {
            signinModal.classList.remove('active');
        }
        
        // Show success modal
        document.getElementById('successTitle').textContent = 'Signed In!';
        document.getElementById('successMessage').textContent = 'Welcome! Redirecting to your properties...';
        document.getElementById('successModal').classList.add('active');
        
        this.reset();

        // Wait 2 seconds then redirect
        setTimeout(() => {
            console.log('Redirecting to listings.html');
            window.location.href = 'listings.html';
        }, 2000);

    } catch (error) {
        console.error('Signin error:', error);
        showNotification('Error signing in: ' + error.message, 'error');
    }
});

// Sign up / Sign in modal switching
const signinLink = document.getElementById('signinLink');
const signupLink = document.getElementById('signupLink');

if (signinLink) {
    signinLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('signup');
        setTimeout(() => openModal('signin'), 300);
    });
}

if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('signin');
        setTimeout(() => openModal('signup'), 300);
    });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ========================================
// PREVENT CHROME EXTENSION CONFLICTS
// ========================================

if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
            sendResponse({ success: true });
        } catch (error) {
            // Silently handle
        }
        return true;
    });
}

// ========================================
// AUTHENTICATION MANAGER
// ========================================

class AuthManager {
    constructor() {
        this.storageKey = 'quickVantageUser';
        this.currentUser = this.loadUser();
    }

    isAuthenticated() {
        try {
            return this.currentUser !== null && this.currentUser !== undefined;
        } catch (e) {
            console.error('Error checking authentication:', e);
            return false;
        }
    }

    getCurrentUser() {
        try {
            return this.currentUser;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }

    signUp(userData) {
        try {
            if (!userData.fullName || !userData.email || !userData.phone || !userData.password) {
                throw new Error('All fields are required');
            }

            const user = {
                id: this.generateId(),
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    signIn(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const user = {
                id: this.generateId(),
                email: email,
                lastLogin: new Date().toISOString()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    signOut() {
        try {
            localStorage.removeItem(this.storageKey);
            this.currentUser = null;
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    loadUser() {
        try {
            const userJson = localStorage.getItem(this.storageKey);
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

const auth = new AuthManager();

// ========================================
// SIGN UP / SIGN IN FLOWS - FIXED
// ========================================

document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        if (userData.password !== userData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const user = auth.signUp(userData);
        console.log('User signed up:', user);
        
        // Close signup modal
        const signupModal = document.getElementById('signupModal');
        if (signupModal) {
            signupModal.classList.remove('active');
        }
        
        // Show success modal
        document.getElementById('successTitle').textContent = 'Account Created!';
        document.getElementById('successMessage').textContent = `Welcome ${user.fullName}! Redirecting to properties...`;
        document.getElementById('successModal').classList.add('active');
        
        this.reset();

        // Wait 2 seconds then redirect
        setTimeout(() => {
            console.log('Redirecting to listings.html');
            window.location.href = 'listings.html';
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Error creating account: ' + error.message, 'error');
    }
});

document.getElementById('signinForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            showNotification('Please enter email and password', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const user = auth.signIn(email, password);
        console.log('User signed in:', user);
        
        // Close signin modal
        const signinModal = document.getElementById('signinModal');
        if (signinModal) {
            signinModal.classList.remove('active');
        }
        
        // Show success modal
        document.getElementById('successTitle').textContent = 'Signed In!';
        document.getElementById('successMessage').textContent = 'Welcome! Redirecting to your properties...';
        document.getElementById('successModal').classList.add('active');
        
        this.reset();

        // Wait 2 seconds then redirect
        setTimeout(() => {
            console.log('Redirecting to listings.html');
            window.location.href = 'listings.html';
        }, 2000);

    } catch (error) {
        console.error('Signin error:', error);
        showNotification('Error signing in: ' + error.message, 'error');
    }
});