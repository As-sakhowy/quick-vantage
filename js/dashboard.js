document.addEventListener("DOMContentLoaded", async () => {
  await initUser();
  initTabs();
  initLogout();
  await loadAndRender();
});

let propertyData = [];

async function initUser() {
  const user = await window.API.auth.getUser();
  if (!user) {
    window.location.href = "../index.html";
    return;
  }
  document.getElementById("userName").textContent = user.email.split("@")[0];
  document.getElementById("welcomeText").textContent = `Welcome, ${user.email.split("@")[0]}`;
}

async function loadAndRender() {
  // Use mock data if DB is empty; otherwise use window.API.properties.fetchAll()
  propertyData = [
    { id: 1, title: "Lekki Apartment", city: "Lagos", type: "residential", price: 500000, category: "sales", roi: 0.08, status: 100 },
    { id: 2, title: "Commercial Plaza", city: "Abuja", type: "commercial", price: 2000000, category: "invest", roi: 0.12, status: 60 }
  ];
  renderAll();
}

window.filterSales = () => {
  const city = document.getElementById("salesCityFilter").value;
  const maxPrice = document.getElementById("salesPriceFilter").value;
  renderAll('sales', { city, maxPrice: maxPrice ? parseInt(maxPrice) : Infinity });
};

window.filterInvestments = () => {
  const roi = document.getElementById("investROIFilter").value;
  renderAll('invest', { minROI: roi ? parseFloat(roi) : 0 });
};

function renderAll(tab = 'both', filters = {}) {
  if (tab === 'both' || tab === 'sales') {
    const container = document.getElementById("salesContainer");
    const filtered = propertyData.filter(p => p.category === 'sales' && 
      (!filters.city || p.city === filters.city) && 
      (!filters.maxPrice || p.price <= filters.maxPrice));
    
    container.innerHTML = filtered.map(p => `
      <div class="property-card">
        <h3>${p.title}</h3>
        <p>${p.city} | $${p.price.toLocaleString()}</p>
        <button class="cta-button primary" onclick="alert('Contacting...')">Contact Seller</button>
        <button class="cta-button secondary">❤️ Favorite</button>
      </div>`).join('');
  }

  if (tab === 'both' || tab === 'invest') {
    const container = document.getElementById("investmentsContainer");
    const filtered = propertyData.filter(p => p.category === 'invest' && 
      (!filters.minROI || p.roi >= filters.minROI));

    container.innerHTML = filtered.map(p => `
      <div class="property-card">
        <h3>${p.title}</h3>
        <div class="metrics">ROI: ${p.roi * 100}% | Funding: ${p.status}%</div>
        <div class="progress-bar"><div style="width:${p.status}%"></div></div>
        <button class="cta-button primary">Submit Investment</button>
      </div>`).join('');
  }
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn, .tab-content").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function initLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", () => window.API.auth.logout());
}