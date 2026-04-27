// --- STATE MANAGEMENT ---
// Load initial investment from localStorage or default to baseline
let totalInvested = parseFloat(localStorage.getItem('qv_total_invested')) || 125000;

document.addEventListener("DOMContentLoaded", async () => {
    updatePortfolioUI();
    initTabs();
    initLogout();
    setupMobileMenu();
    await loadAndRender();
});

function updatePortfolioUI() {
    const display = document.getElementById('totalInvestedDisplay'); // Ensure this ID is in HTML
    if (display) {
        display.textContent = `$${totalInvested.toLocaleString()}`;
    }
    localStorage.setItem('qv_total_invested', totalInvested);
}

// --- MODAL POPULATING ---
window.openPropertyDetails = (id) => {
    const property = propertyData.find(p => p.id === id);
    if (!property) return;

    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-detail-wrapper">
            <h2>${property.title}</h2>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.city}</p>
            <hr>
            <div class="specs-grid">
                <span><i class="fas fa-bed"></i> 4 Bedrooms</span>
                <span><i class="fas fa-bath"></i> 3 Bathrooms</span>
                <span><i class="fas fa-ruler-combined"></i> 2,500 sqft</span>
            </div>
            <div class="financial-info">
                <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
                <p><strong>Est. Monthly Rent:</strong> $${(property.price * 0.005).toLocaleString()}</p>
            </div>
            <p class="description">Beautiful ${property.type} property located in the heart of ${property.city}. Perfect for long-term appreciation.</p>
            <div class="modal-actions">
                <button class="cta-button primary" onclick="alert('Contacting Agent...')">Contact Seller</button>
                <button class="cta-button secondary" onclick="alert('Added to Favorites')">Save Property</button>
            </div>
        </div>
    `;
    modal.classList.add('active');
};

window.closeDetailModal = () => {
    document.getElementById('detailModal').classList.remove('active');
};

// --- INVESTMENT LOGIC ---
window.handleInvest = (id) => {
    const property = propertyData.find(p => p.id === id);
    const minInvest = 5000; // Minimum requirement
    
    const amount = prompt(`Enter investment amount for ${property.title} (Minimum: $${minInvest}):`);
    
    if (amount === null) return; // User cancelled

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < minInvest) {
        alert(`Invalid amount. Please enter at least $${minInvest}.`);
    } else {
        totalInvested += numAmount;
        updatePortfolioUI();
        alert(`Successfully invested $${numAmount.toLocaleString()} in ${property.title}!`);
    }
};

// --- UPDATED RENDERING ---
function renderSales(filters = {}) {
    const container = document.getElementById("salesContainer");
    if (!container) return;

    const filtered = propertyData.filter(p => p.category === 'sales'); // Apply existing filters logic here...

    container.innerHTML = filtered.map(p => `
        <div class="listing-card">
            <div class="listing-body">
                <h3>${p.title}</h3>
                <p>${p.city}</p>
                <div class="price">$${p.price.toLocaleString()}</div>
                <button class="btn-view" onclick="openPropertyDetails(${p.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

function renderInvestments() {
    const container = document.getElementById("investmentsContainer");
    const filtered = propertyData.filter(p => p.category === 'invest');

    container.innerHTML = filtered.map(p => `
        <div class="listing-card">
            <div class="listing-body">
                <h3>${p.title}</h3>
                <p>ROI: ${(p.roi * 100).toFixed(1)}%</p>
                <button class="btn-view" onclick="handleInvest(${p.id})">Invest Now</button>
            </div>
        </div>
    `).join('');
}
let propertyData = [];





function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Update buttons
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Update content
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

function setupMobileMenu() {
  window.toggleMobileMenu = () => {
    const menu = document.getElementById("mobileMenuDropdown");
    menu.classList.toggle("active");
  };
}

function initLogout() {
  // Select all logout buttons (desktop and mobile)
  const logoutButtons = document.querySelectorAll(".logout-btn");
  logoutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Logging out...");
      window.location.href = "../index.html";
    });
  });
}