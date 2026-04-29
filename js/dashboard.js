
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
  console.log("window.API:", window.API);
});

document.addEventListener("DOMContentLoaded", async() => {
  // 1. HAMBURGER MENU
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
})

// --- STATE MANAGEMENT ---
// Load from localStorage or use the $125,000 default from your HTML
let totalInvested = parseFloat(localStorage.getItem('qv_total_invested')) || 125000;

document.addEventListener("DOMContentLoaded", async () => {
    // Initial UI Setup
    await initUser(); // NEW: Fetch user info
    updatePortfolioUI();
    initTabs();
    initLogout();
    setupMobileMenu();
    
    // Set timestamp
    const lastUpdate = document.getElementById('lastUpdate');
    if(lastUpdate) lastUpdate.textContent = new Date().toLocaleDateString();

    // Load Data
    await loadAndRender();
});

function updatePortfolioUI() {
    const display = document.getElementById('totalInvestedDisplay');
    if (display) {
        display.textContent = `$${totalInvested.toLocaleString()}`;
        display.style.display = "block"; // Ensure it's visible
    }
    localStorage.setItem('qv_total_invested', totalInvested);
}

// --- MODAL POPULATING (Sales Detail View) ---
window.openPropertyDetails = (id) => {
  const property = propertyData.find(p => p.id === id);
  if (!property) return;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h2>${property.title}</h2>
    <p><strong>Location:</strong> ${property.city}</p>
    <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
    <p><strong>ROI:</strong> ${(property.roi * 100).toFixed(1)}%</p>
    <hr>
    <p>Additional details about this ${property.type} property would go here...</p>
  `;
  
  document.getElementById("detailModal").classList.add("active");
};

window.closeDetailModal = () => {
  document.getElementById("detailModal").classList.remove("active");
};


// --- INVESTMENT INTERACTION (Simulation) ---
window.handleInvest = (id) => {
    const property = propertyData.find(p => p.id === id);
    const minInvestment = 5000;
    
    const amount = prompt(`How much would you like to invest in ${property.title}?\n(Minimum Investment: $${minInvestment})`);
    
    if (amount === null) return; // User cancelled

    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));

    if (isNaN(numAmount) || numAmount < minInvestment) {
        alert(`Error: Minimum investment is $${minInvestment}. Please enter a valid number.`);
    } else {
        totalInvested += numAmount;
        updatePortfolioUI();
        alert(`Success! You have added $${numAmount.toLocaleString()} to your portfolio for ${property.title}.`);
    }
};

// --- UPDATED RENDERING FUNCTIONS ---
let propertyData = [];
async function loadAndRender() {
    propertyData = [
        { id: 1, title: "Lekki Apartment", city: "Lagos",image: "https://example.com/lekki.jpg", type: "residential", price: 500000, category: "sales" },
        { id: 2, title: "Commercial Plaza", city: "Abuja",image: "https://example.com/lekki.jpg", type: "commercial", price: 2000000, category: "invest", roi: 0.12, status: 60 },
        { id: 3, title: "Ibadan Warehouse", city: "Ibadan",image: "https://example.com/lekki.jpg", type: "industrial", price: 850000, category: "sales" },
        { id: 4, title: "VI Suites", city: "Lagos",image: "https://example.com/lekki.jpg",  type: "residential", price: 150000, category: "invest", roi: 0.15, status: 45 },
    { 
      id: 5, 
      title: "Lekki Apartment", 
      city: "Lagos", 
      image: "https://example.com/lekki.jpg", // Add this
      type: "residential", 
      price: 500000, 
      category: "sales" 
    },
    { 
      id: 6, 
      title: "Lekki Apartment", 
      city: "Lagos", 
      image: "https://example.com/lekki.jpg", // Add this
      type: "residential", 
      price: 500000, 
      category: "sales" 
    },
    { 
      id: 7, 
      title: "Lekki Apartment", 
      city: "Lagos", 
      image: "https://example.com/lekki.jpg", // Add this
      type: "residential", 
      price: 500000, 
      category: "sales" 
    }
    ];
    renderSales();
    renderInvestments();
}

function renderSales() {
    const container = document.getElementById("salesContainer");
    const filtered = propertyData.filter(p => p.category === 'sales');
    container.innerHTML = `<div class="listings-grid">` + filtered.map(p => `
        <div class="listing-card">
            <div class="listing-image"></div>
            <div class="listing-body">
                <h3 class="listing-title">${p.title}</h3>
                <div class="listing-location"><i class="fas fa-map-marker-alt"></i> ${p.city}</div>
                <div class="listing-price">$${p.price.toLocaleString()}</div>
                <button class="btn-view" onclick="openPropertyDetails(${p.id})">View Details</button>
            </div>
        </div>`).join('') + `</div>`;
}

function renderInvestments() {
    const container = document.getElementById("investmentsContainer");
    const filtered = propertyData.filter(p => p.category === 'invest');
    container.innerHTML = `<div class="listings-grid">` + filtered.map(p => `
        <div class="listing-card">
            <div class="listing-body">
                <h3 class="listing-title">${p.title}</h3>
                <div class="listing-meta">
                    <div class="meta-item"><label>ROI</label><div class="value">${p.roi * 100}%</div></div>
                    <div class="meta-item"><label>Funded</label><div class="value">${p.status}%</div></div>
                </div>
                <button class="btn-view" onclick="handleInvest(${p.id})">Invest Now</button>
            </div>
        </div>`).join('') + `</div>`;
}

// --- UTILITIES (Logout, Tabs, Menu) ---
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn, .tab-content").forEach(el => el.classList.remove("active"));
            btn.classList.add("active");
            const target = btn.getAttribute("data-tab");
            document.getElementById(target).classList.add("active");
        });
    });
}

// Add this to your dashboard.js
async function initUser() {
  if (!window.API?.auth) {
    console.error("API/auth is missing");
    return;
  }

  const user = await window.API.auth.getUser();

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("userName").textContent = user.email.split("@")[0];
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userNameMobile").textContent = user.email.split("@")[0];
  document.getElementById("userEmailMobile").textContent = user.email;
}

function initLogout() {
    document.querySelectorAll(".logout-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if(confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('qv_session'); // Mock session clear
                window.location.href = "../index.html";
            }
        });
    });
}

// Add this to your dashboard.js
window.toggleMobileMenu = function() {
  const menu = document.getElementById("mobileMenuDropdown");
  if (menu) {
    menu.classList.toggle("active");
  }
};

window.renderSales = renderSales; // So the 'Filter' button works
window.filterInvestments = renderInvestments; // Match the onclick in your HTML