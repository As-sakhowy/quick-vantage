// ========================================
// AUTHENTICATION CHECK - RUNS FIRST
// ========================================

// Check if auth object exists and user is authenticated
function checkAuthentication() {
    if (typeof auth === 'undefined') {
        console.error('Auth object not found. Redirecting to login.');
        window.location.href = './index.html';
        return false;
    }

    if (!auth.isAuthenticated()) {
        console.log('User not authenticated. Redirecting to login.');
        window.location.href = './index.html';
        return false;
    }

    console.log('User authenticated. Initializing listings page.');
    return true;
}

// Check auth immediately when page loads
if (!checkAuthentication()) {
    // Stop execution if not authenticated
    throw new Error('User not authenticated');
}

// ========================================
// LISTINGS PAGE FUNCTIONALITY
// ========================================

// Property data
const allProperties = {
    sales: [
        {
            id: 1,
            title: 'Modern Apartment Complex',
            location: 'New York, NY',
            price: '$450,000',
            roi: '8.5%',
            capRate: '6.2%',
            type: 'Multi-Family',
            status: 'Featured',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop',
            description: 'Modern apartment complex in a thriving neighborhood with strong rental demand.',
            features: ['Modern architecture', 'Strong tenant base', 'Low vacancy rates', 'High market demand']
        },
        {
            id: 2,
            title: 'Single Family Home',
            location: 'Austin, TX',
            price: '$325,000',
            roi: '7.8%',
            capRate: '5.9%',
            type: 'Residential',
            status: 'Pre-Completion',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
            description: 'Beautiful single family home in a growing neighborhood ready for investment.'
        }
    ],
    investment: [
        {
            id: 3,
            title: 'Commercial Office Space',
            location: 'Los Angeles, CA',
            price: '$650,000',
            roi: '9.2%',
            capRate: '7.1%',
            type: 'Commercial',
            status: 'Hot Deal',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
            description: 'Prime commercial office space with long-term tenant leases and stable income.'
        },
        {
            id: 4,
            title: 'Retail Shopping Center',
            location: 'Miami, FL',
            price: '$850,000',
            roi: '10.1%',
            capRate: '8.3%',
            type: 'Retail',
            status: 'Off-Market',
            image: './images/10.jpg',
            description: 'Prime retail shopping center with excellent tenant mix and high occupancy rates.'
        },
        {
            id: 5,
            title: 'Industrial Warehouse',
            location: 'Chicago, IL',
            price: '$520,000',
            roi: '8.9%',
            capRate: '6.8%',
            type: 'Industrial',
            status: 'Featured',
            image: './images/1.jpg',
            description: 'Strategic industrial warehouse location with strong logistics demand.'
        },
        {
            id: 6,
            title: 'Luxury Resort Property',
            location: 'Denver, CO',
            price: '$1,200,000',
            roi: '11.5%',
            capRate: '9.2%',
            type: 'Hospitality',
            status: 'Hot Deal',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
            description: 'Luxury resort property with exceptional amenities and strong market position.'
        }
    ]
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page (auth is already checked in window.load)
    initializeListingsPage();
    renderProperties('sales');
    setupTabNavigation();
    setupFilters();
    setupLogout();
});

// ========================================
// INITIALIZE PAGE
// ========================================

function initializeListingsPage() {
    const user = auth.getCurrentUser();
    const userName = user.fullName || user.email || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    
    // Update user info
    document.getElementById('userName').textContent = userName;
    document.getElementById('userEmail').textContent = user.email || 'user@quickvantage.com';
    document.getElementById('userAvatar').textContent = userInitial;
    document.getElementById('userAvatar').style.background = getAvatarColor(userInitial);
}

function getAvatarColor(initial) {
    const colors = ['#1ab5a3', '#0d9488', '#2dd4bf', '#fbbf24', '#f59e0b'];
    return colors[initial.charCodeAt(0) % colors.length];
}

// ========================================
// RENDER PROPERTIES
// ========================================

function renderProperties(tab, filters = {}) {
    const properties = allProperties[tab] || [];
    const filteredProperties = filterProperties(properties, tab, filters);
    const gridId = tab === 'sales' ? 'salesGrid' : 'investmentGrid';
    const grid = document.getElementById(gridId);

    if (filteredProperties.length === 0) {
        grid.innerHTML = `
            <div class="listings-empty" style="grid-column: 1 / -1;">
                <i class="fas fa-inbox"></i>
                <h3>No properties found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProperties.map(prop => `
        <div class="property-card-listing">
            <div class="property-image-listing">
                <img src="${prop.image}" alt="${prop.title}">
                <span class="property-type-badge ${tab}">${tab.toUpperCase()}</span>
            </div>
            <div class="property-content-listing">
                <h3>${prop.title}</h3>
                <div class="property-location-listing">
                    <i class="fas fa-map-marker-alt"></i>
                    ${prop.location}
                </div>
                
                <div class="property-stats">
                    <div class="stat">
                        <span class="stat-label">Price</span>
                        <span class="stat-value">${prop.price}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">ROI</span>
                        <span class="stat-value">${prop.roi}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Cap Rate</span>
                        <span class="stat-value">${prop.capRate}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Type</span>
                        <span class="stat-value" style="text-transform: uppercase; font-size: 0.9rem;">${prop.type}</span>
                    </div>
                </div>

                <div class="property-actions">
                    <button class="btn-view" onclick="viewPropertyDetails(${prop.id}, '${tab}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn-save" onclick="saveProperty(${prop.id}, '${prop.title}')">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProperties(properties, tab, filters) {
    return properties.filter(prop => {
        if (tab === 'sales') {
            const locationFilter = filters.location || '';
            if (locationFilter && !prop.location.includes(locationFilter)) return false;
            return true;
        } else {
            const roiFilter = filters.roi || 0;
            const typeFilter = filters.type || '';
            
            const propROI = parseFloat(prop.roi);
            if (propROI < roiFilter) return false;
            if (typeFilter && prop.type !== typeFilter) return false;
            return true;
        }
    });
}

// ========================================
// TAB NAVIGATION
// ========================================

function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tab).classList.add('active');

            // Render properties
            renderProperties(tab);
        });
    });
}

// ========================================
// FILTERS
// ========================================

function setupFilters() {
    // Sales tab filters
    document.getElementById('locationFilter')?.addEventListener('change', () => {
        const location = document.getElementById('locationFilter').value;
        renderProperties('sales', { location });
    });

    document.getElementById('clearFilters')?.addEventListener('click', () => {
        document.getElementById('locationFilter').value = '';
        renderProperties('sales');
    });

    // Investment tab filters
    document.getElementById('roiFilter')?.addEventListener('input', () => {
        const roi = parseFloat(document.getElementById('roiFilter').value);
        const type = document.getElementById('typeFilter').value;
        renderProperties('investment', { roi, type });
    });

    document.getElementById('typeFilter')?.addEventListener('change', () => {
        const roi = parseFloat(document.getElementById('roiFilter').value);
        const type = document.getElementById('typeFilter').value;
        renderProperties('investment', { roi, type });
    });

    document.getElementById('clearFiltersInvestment')?.addEventListener('click', () => {
        document.getElementById('roiFilter').value = 5;
        document.getElementById('typeFilter').value = '';
        renderProperties('investment');
    });
}

// ========================================
// PROPERTY DETAILS
// ========================================

function viewPropertyDetails(propertyId, tab) {
    const property = allProperties[tab].find(p => p.id === propertyId);
    if (!property) return;

    // Populate modal
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.location}`;
    document.getElementById('propertyImage').src = property.image;
    document.getElementById('propertyPrice').textContent = property.price;
    document.getElementById('propertyROI').textContent = property.roi;
    document.getElementById('propertyCapRate').textContent = property.capRate;
    document.getElementById('propertyType').textContent = property.type;
    document.getElementById('propertyStatus').textContent = property.status;
    document.getElementById('propertyDescription').textContent = property.description;
    
    // Update features
    const featuresList = document.getElementById('propertyFeatures');
    featuresList.innerHTML = (property.features || []).map(f => `<li>${f}</li>`).join('');

    // Open modal
    document.getElementById('propertyModal').classList.add('active');
}

function saveProperty(propertyId, propertyTitle) {
    const user = auth.getCurrentUser();
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    
    const alreadySaved = savedProperties.some(p => p.id === propertyId);
    
    if (alreadySaved) {
        showNotification(`${propertyTitle} is already saved`, 'info');
        return;
    }

    savedProperties.push({ id: propertyId, title: propertyTitle, savedAt: new Date().toISOString() });
    localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
    
    showNotification(`${propertyTitle} saved to your list!`, 'success');
}

// ========================================
// LOGOUT
// ========================================

function setupLogout() {
    document.getElementById('logoutBtnTop')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            auth.signOut();
            showSuccessModal('Logged Out', 'You have been successfully logged out.');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });
}

// ========================================
// MODALS & NOTIFICATIONS
// ========================================

function showSuccessModal(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.add('active');
}

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

// Close modals
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    document.getElementById('successCloseBtn')?.addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    }
});