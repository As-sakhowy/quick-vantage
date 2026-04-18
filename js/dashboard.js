
// ========================================
// DASHBOARD LOGIC
// ========================================

// Check authentication on page load

// Toggle mobile menu dropdown
function toggleMobileMenu() {
    const dropdown = document.getElementById('mobileMenuDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const hamburger = document.getElementById('mobileMenuBtn');
    const dropdown = document.getElementById('mobileMenuDropdown');
    
    if (dropdown && hamburger && !hamburger.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is authenticated
  if (!AuthManager.isAuthenticated()) {
    window.location.href = './index.html';
    return;
  }

  // Display user info
  const user = AuthManager.getCurrentUser();
  document.getElementById('userName').textContent = user.firstName || 'User';
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('lastUpdate').textContent = new Date().toLocaleString();

  // Load portfolio summary
  await // Update navbar user info for both desktop and mobile
    const userName = AuthManager.getStoredUser()?.name || 'User';
    const userEmail = AuthManager.getStoredUser()?.email || '';
    
    // Update desktop navbar
    const desktopNameEl = document.getElementById('userName');
    const desktopEmailEl = document.getElementById('userEmail');
    if (desktopNameEl) desktopNameEl.textContent = userName;
    if (desktopEmailEl) desktopEmailEl.textContent = userEmail;
    
    // Update mobile navbar
    const mobileNameEl = document.getElementById('userNameMobile');
    const mobileEmailEl = document.getElementById('userEmailMobile');
    if (mobileNameEl) mobileNameEl.textContent = userName;
    if (mobileEmailEl) mobileEmailEl.textContent = userEmail;
    
    loadPortfolioSummary();

  // Load initial data
  await loadSales();
  await loadInvestments();
});

// ========================================
// TAB SWITCHING
// ========================================

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');

  // Mark button as active
  event.target.closest('.tab-btn').classList.add('active');
}

// ========================================
// PORTFOLIO SUMMARY
// ========================================

async function loadPortfolioSummary() {
  try {
    const user = AuthManager.getCurrentUser();
    const portfolio = await API.getPortfolioSummary(user.id);

    document.getElementById('totalInvested').textContent = 
      '$' + portfolio.totalInvested.toLocaleString();
    document.getElementById('totalReturns').textContent = 
      '$' + portfolio.totalReturnsReceived.toLocaleString();
    document.getElementById('activeInvestments').textContent = 
      portfolio.activeInvestments;
    document.getElementById('averageROI').textContent = 
      (portfolio.averageROI * 100).toFixed(1) + '%';
  } catch (error) {
    console.error('Error loading portfolio:', error);
  }
}

// ========================================
// SALES TAB
// ========================================

async function loadSales() {
  try {
    const container = document.getElementById('salesContainer');
    container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading properties...</p></div>';

    const sales = await API.getSales();

    if (sales.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-home"></i>
          <h3>No properties found</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="listings-grid">`+
      sales.map(sale => createSalesCard(sale)).join('') +
      `</div>`;
  } catch (error) {
    console.error('Error loading sales:', error);
    document.getElementById('salesContainer').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error loading properties</h3>
        <p>` + error.message + `</p>
      </div>
    `;
  }
}

function createSalesCard(sale) {
  return `
    <div class="listing-card" onclick="showSaleDetail('` + sale.id + `')">
      <img src="` + sale.images[0] + `" alt="` + sale.title + `" class="listing-image">
      <div class="listing-body">
        <div class="listing-title">` + sale.title + `</div>
        <div class="listing-location">
          <i class="fas fa-map-marker-alt"></i>
          ` + sale.location.city + `, ` + sale.location.state + `
        </div>
        <div class="listing-meta">
          <div class="meta-item">
            <label>Type</label>
            <div class="value" style="text-transform: capitalize;">` + sale.type + `</div>
          </div>
          <div class="meta-item">
            <label>Status</label>
            <div class="value" style="text-transform: capitalize; color: var(--success-color);">` + sale.status + `</div>
          </div>
        </div>
        <div class="listing-price">$` + sale.price.toLocaleString() + `</div>
        <div class="listing-actions">
          <button class="btn-view">View Details</button>
          <button class="btn-wishlist"><i class="far fa-heart"></i></button>
        </div>
      </div>
    </div>
  `;
}

function filterSales() {
  const filters = {
    city: document.getElementById('salesCityFilter').value,
    type: document.getElementById('salesTypeFilter').value,
    maxPrice: parseFloat(document.getElementById('salesPriceFilter').value) || null
  };

  // Remove null values
  Object.keys(filters).forEach(k => (filters[k] === null || filters[k] === '') && delete filters[k]);

  loadSalesWithFilters(filters);
}

async function loadSalesWithFilters(filters) {
  try {
    const container = document.getElementById('salesContainer');
    container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Searching...</p></div>';

    const sales = await API.getSales(filters);

    if (sales.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No properties match your filters</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="listings-grid">`+
      sales.map(sale => createSalesCard(sale)).join('') +
      `</div>`;
  } catch (error) {
    console.error('Error filtering sales:', error);
  }
}

async function showSaleDetail(saleId) {
  try {
    const sale = await API.getSaleById(saleId);

    const html = `
      <h2>` + sale.title + `</h2>
      <p style="color: var(--text-light); margin: 1rem 0;">
        <i class="fas fa-map-marker-alt"></i> 
        ` + sale.location.address + `
      </p>

      <div style="margin: 1.5rem 0;">
        <img src="` + sale.images[0] + `" alt="` + sale.title + `" style="width: 100%; border-radius: 0.5rem; margin-bottom: 1rem;">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
        <div>
          <label style="color: var(--text-light); font-size: 0.9rem;">Bedrooms</label>
          <div style="font-size: 1.3rem; font-weight: 600;">` + sale.features.bedrooms + `</div>
        </div>
        <div>
          <label style="color: var(--text-light); font-size: 0.9rem;">Bathrooms</label>
          <div style="font-size: 1.3rem; font-weight: 600;">` + sale.features.bathrooms + `</div>
        </div>
        <div>
          <label style="color: var(--text-light); font-size: 0.9rem;">Square Feet</label>
          <div style="font-size: 1.3rem; font-weight: 600;">` + sale.features.squareFeet.toLocaleString() + `</div>
        </div>
        <div>
          <label style="color: var(--text-light); font-size: 0.9rem;">Year Built</label>
          <div style="font-size: 1.3rem; font-weight: 600;">` + sale.features.yearBuilt + `</div>
        </div>
      </div>

      <div style="margin: 1.5rem 0; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
        <h3 style="margin-bottom: 0.5rem;">Price: <span style="color: var(--primary-color);">$` + sale.price.toLocaleString() + `</span></h3>
        <p style="color: var(--text-light); font-size: 0.9rem;">
          HOA Fees: $` + sale.financials.hoaFees + `/month | 
          Est. Rental: $` + sale.financials.estimatedRentalIncome + `/month
        </p>
      </div>

      <div style="margin: 1.5rem 0;">
        <h4>Description</h4>
        <p style="color: var(--text-light); line-height: 1.6;">` + sale.description + `</p>
      </div>

      <div style="margin: 1.5rem 0;">
        <h4>Contact Seller</h4>
        <p>` + sale.seller.name + `</p>
        <p style="color: var(--text-light);">
          <i class="fas fa-envelope"></i> ` + sale.seller.email + `<br>
          <i class="fas fa-phone"></i> ` + sale.seller.phone + `
        </p>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button class="cta-button primary" style="flex: 1; padding: 0.75rem;">
          <i class="fas fa-envelope"></i> Contact Seller
        </button>
        <button class="cta-button secondary" style="flex: 1; padding: 0.75rem;">
          <i class="fas fa-heart"></i> Save Property
        </button>
      </div>
    `;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailModal').classList.add('active');
  } catch (error) {
    console.error('Error loading sale detail:', error);
    alert('Error loading property details');
  }
}



// ========================================
// INVESTMENTS TAB
// ========================================

async function loadInvestments() {
  try {
    const container = document.getElementById('investmentsContainer');
    container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading opportunities...</p></div>';

    const investments = await API.getInvestments();

    if (investments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-chart-line"></i>
          <h3>No investment opportunities found</h3>
          <p>Check back soon for new deals</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="listings-grid">`+
      investments.map(inv => createInvestmentCard(inv)).join('') +
      `</div>`;
  } catch (error) {
    console.error('Error loading investments:', error);
  }
}

function createInvestmentCard(investment) {
  return `
    <div class="listing-card" onclick="showInvestmentDetail('` + investment.id + `')">
      <div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); height: 200px; display: flex; align-items: center; justify-content: center; color: white;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">` + (investment.financialMetrics.roi * 100).toFixed(1) + `%</div>
          <div style="font-size: 0.9rem;">Expected ROI</div>
        </div>
      </div>
      <div class="listing-body">
        <div class="listing-title">` + investment.title + `</div>
        <div class="listing-location">
          <i class="fas fa-map-marker-alt"></i>
          ` + investment.location.city + `
        </div>
        <div class="listing-meta">
          <div class="meta-item">
            <label>Cap Rate</label>
            <div class="value">` + (investment.financialMetrics.capRate * 100).toFixed(1) + `%</div>
          </div>
          <div class="meta-item">
            <label>Funded</label>
            <div class="value">` + investment.fundingStructure.fundingPercentage.toFixed(0) + `%</div>
          </div>
        </div>
        <div class="listing-price">$` + investment.investmentAmount.toLocaleString() + `</div>
        <div class="listing-actions">
          <button class="btn-view">View Details</button>
          <button class="btn-wishlist"><i class="far fa-star"></i></button>
        </div>
      </div>
    </div>
  `;
}

function filterInvestments() {
  const filters = {
    city: document.getElementById('investCityFilter').value,
    type: document.getElementById('investTypeFilter').value,
    minROI: parseFloat(document.getElementById('investROIFilter').value) || null
  };

  // Remove null/empty values
  Object.keys(filters).forEach(k => (filters[k] === null || filters[k] === '') && delete filters[k]);

  loadInvestmentsWithFilters(filters);
}

async function loadInvestmentsWithFilters(filters) {
  try {
    const container = document.getElementById('investmentsContainer');
    container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Searching...</p></div>';

    const investments = await API.getInvestments(filters);

    if (investments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No investments match your criteria</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="listings-grid">`+
      investments.map(inv => createInvestmentCard(inv)).join('') +
      `</div>`;
  } catch (error) {
    console.error('Error filtering investments:', error);
  }
}

async function showInvestmentDetail(investmentId) {
  try {
    const investment = await API.getInvestmentById(investmentId);

    const html = `
      <h2>` + investment.title + `</h2>
      <p style="color: var(--text-light); margin: 1rem 0;">
        <i class="fas fa-map-marker-alt"></i> 
        ` + investment.location.city + `, ` + investment.location.state + `
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
        <div style="padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border-left: 4px solid var(--success-color);">
          <label style="color: var(--text-light); font-size: 0.9rem;">Expected ROI</label>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--success-color);">` + (investment.financialMetrics.roi * 100).toFixed(1) + `%</div>
        </div>
        <div style="padding: 1rem; background: #f0fdf4; border-radius: 0.5rem; border-left: 4px solid var(--primary-color);">
          <label style="color: var(--text-light); font-size: 0.9rem;">Cap Rate</label>
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary-color);">` + (investment.financialMetrics.capRate * 100).toFixed(1) + `%</div>
        </div>
      </div>

      <div style="margin: 1.5rem 0; padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
        <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">Investment Amount: <span style="color: var(--accent-dark);">$` + investment.investmentAmount.toLocaleString() + `</span></h3>
        <p style="color: var(--text-light); font-size: 0.9rem;">
          Minimum: $` + investment.minimumInvestment.toLocaleString() + ` | 
          Raised: $` + investment.fundingStructure.amountRaised.toLocaleString() + ` (` + investment.fundingStructure.fundingPercentage.toFixed(0) + `%)
        </p>
      </div>

      <div style="margin: 1.5rem 0;">
        <h4>Description</h4>
        <p style="color: var(--text-light); line-height: 1.6;">` + investment.description + `</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
        <div>
          <h5 style="color: var(--text-dark); font-size: 0.9rem; margin-bottom: 0.5rem;">MONTHLY RENTAL</h5>
          <div style="font-size: 1.3rem; font-weight: 600; color: var(--success-color);">$` + investment.financialMetrics.monthlyRentalIncome.toLocaleString() + `</div>
        </div>
        <div>
          <h5 style="color: var(--text-dark); font-size: 0.9rem; margin-bottom: 0.5rem;">ANNUAL NOI</h5>
          <div style="font-size: 1.3rem; font-weight: 600;">$` + investment.financialMetrics.noi.toLocaleString() + `</div>
        </div>
        <div>
          <h5 style="color: var(--text-dark); font-size: 0.9rem; margin-bottom: 0.5rem;">OCCUPANCY</h5>
          <div style="font-size: 1.3rem; font-weight: 600;">` + (investment.propertyDetails.occupancyRate * 100).toFixed(0) + `%</div>
        </div>
        <div>
          <h5 style="color: var(--text-dark); font-size: 0.9rem; margin-bottom: 0.5rem;">UNITS</h5>
          <div style="font-size: 1.3rem; font-weight: 600;">` + investment.propertyDetails.units + `</div>
        </div>
      </div>

      <div style="margin: 1.5rem 0; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
        <h4>Manager</h4>
        <p style="font-weight: 600;">` + investment.manager.name + `</p>
        <p style="color: var(--text-light); font-size: 0.9rem;">
          Experience: ` + investment.manager.experience + ` | Success Rate: ` + (investment.manager.successRate * 100).toFixed(0) + `%
        </p>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button class="cta-button primary" style="flex: 1; padding: 0.75rem;" onclick="investNow('` + investment.id + `')">
          <i class="fas fa-dollar-sign"></i> Invest Now
        </button>
        <button class="cta-button secondary" style="flex: 1; padding: 0.75rem;">
          <i class="fas fa-star"></i> Save Deal
        </button>
      </div>
    `;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailModal').classList.add('active');
  } catch (error) {
    console.error('Error loading investment detail:', error);
    alert('Error loading investment details');
  }
}

function investNow(investmentId) {
  const amount = prompt('Enter investment amount (USD):');
  if (!amount) return;

  API.invest(investmentId, parseFloat(amount))
    .then(result => {
      alert('Investment of $' + amount + ' submitted successfully!\n\nConfirmation ID: ' + result.id);
      closeDetailModal();
    })
    .catch(error => {
      alert('Error: ' + error.message);
    });
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    console.log('Logging out...');
    // Clear API cache and auth data
    if (window.API && window.API.logout) {
      window.API.logout();
    } else if (window.AuthManager) {
      window.AuthManager.logout();
    }
    // Redirect to home page
    window.location.href = './index.html';
  }
}
