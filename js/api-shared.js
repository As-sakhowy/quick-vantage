
// ========================================
// SHARED API - Cross-page persistence
// This runs on BOTH index.html and dashboard.html
// ========================================

class SharedAPI {
  constructor() {
    this.salesData = [];
    this.investmentsData = [];
    this.usersData = [];
    this.initialized = false;
    this.initPromise = this.init();
    
    // Create auth namespace for compatibility
    this.auth = {
      signup: (data) => this.signup(data),
      signin: (email, password) => this.signin(email, password),
      logout: () => this.logout()
    };
  }

  // Initialize - load JSON data once and cache in sessionStorage
  async init() {
    if (this.initialized) return;
    
    try {
      console.log('API: Starting initialization...');
      
      // Always check for stored users first (from signup)
      const storedUsers = JSON.parse(sessionStorage.getItem('qv_users') || 'null');
      
      // Check if data is already cached
      const cached = sessionStorage.getItem('qv_api_cache');
      if (cached) {
        const cache = JSON.parse(cached);
        this.salesData = cache.sales || [];
        this.investmentsData = cache.investments || [];
        
        // Use stored users if available, otherwise use cached
        this.usersData = storedUsers || cache.users || [];
        
        this.initialized = true;
        console.log('API: Loaded from cache', {
          users: this.usersData.length,
          sales: this.salesData.length,
          investments: this.investmentsData.length
        });
        return;
      }

      console.log('API: Fetching fresh data...');
      
      // Fetch fresh data
      const [salesResp, investmentsResp, usersResp] = await Promise.all([
        fetch('./data/sales.json'),
        fetch('./data/investments.json'),
        fetch('./data/users.json')
      ]);

      if (!salesResp.ok || !investmentsResp.ok || !usersResp.ok) {
        throw new Error('Failed to fetch data files');
      }

      const sales = await salesResp.json();
      const investments = await investmentsResp.json();
      const users = await usersResp.json();

      this.salesData = sales.sales || sales || [];
      this.investmentsData = investments.investments || investments || [];
      
      // Use stored users from signup if available, otherwise use data file
      if (storedUsers) {
        this.usersData = storedUsers;
        console.log('API: Using stored users from sessionStorage', storedUsers.map(u => u.email));
      } else {
        this.usersData = users.users || users || [];
        console.log('API: Using users from data file', this.usersData.map(u => u.email));
      }

      // Cache the data
      sessionStorage.setItem('qv_api_cache', JSON.stringify({
        sales: this.salesData,
        investments: this.investmentsData,
        users: this.usersData,
        timestamp: Date.now()
      }));

      this.initialized = true;
      console.log('API: Initialization complete', {
        users: this.usersData.length,
        sales: this.salesData.length,
        investments: this.investmentsData.length
      });
    } catch (error) {
      console.error('API: Error during initialization', error);
      this.initialized = false;
      throw error;
    }
  }

  async ensureInit() {
    if (!this.initialized) {
      console.log('API: Waiting for initialization...');
      await this.initPromise;
      console.log('API: Ready');
    }
  }

  // ========================================
  // AUTHENTICATION ENDPOINTS
  // ========================================

  async signup(data) {
    console.log('API: signup() called with:', data.email);
    await this.ensureInit();
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newUser = {
            id: 'user_' + Date.now(),
            email: data.email,
            firstName: data.firstName || data.fullName?.split(' ')[0] || 'User',
            lastName: data.lastName || data.fullName?.split(' ').slice(1).join(' ') || '',
            phone: data.phone || '',
            password: data.password,
            createdAt: new Date().toISOString(),
            investmentProfile: {
              riskTolerance: 'moderate',
              investmentCapacity: 0,
              preferredLocations: [],
              preferredAssetTypes: []
            }
          };

          // Add to users data
          this.usersData.push(newUser);
          
          // Save to sessionStorage so dashboard sees it
          sessionStorage.setItem('qv_users', JSON.stringify(this.usersData));
          console.log('API: User created:', newUser.email);

          // Generate mock JWT token
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                        btoa(JSON.stringify({ id: newUser.id, email: newUser.email })) +
                        '.mock_' + Date.now();

          if (window.AuthManager) {
            window.AuthManager.setUser(newUser);
            window.AuthManager.setToken(token);
          }

          resolve({ user: newUser, token });
        } catch (error) {
          console.error('API: Signup error:', error);
          reject(error);
        }
      }, 500);
    });
  }

  async signin(email, password) {
    console.log('API: signin() called with email:', email);
    await this.ensureInit();
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          console.log('API: Looking for user:', email, 'in', this.usersData.map(u => u.email));
          const user = this.usersData.find(u => u.email === email);

          if (user) {
            console.log('API: User found, signing in:', email);
            
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                          btoa(JSON.stringify({ id: user.id, email: user.email })) +
                          '.mock_' + Date.now();

            if (window.AuthManager) {
              window.AuthManager.setUser(user);
              window.AuthManager.setToken(token);
            }

            resolve({ user, token });
          } else {
            console.warn('API: Sign in failed - user not found');
            reject(new Error('Invalid email or password'));
          }
        } catch (error) {
          console.error('API: Signin error:', error);
          reject(error);
        }
      }, 500);
    });
  }

  async logout() {
    console.log('API: logout() called');
    // Clear session data
    sessionStorage.removeItem('qv_api_cache');
    sessionStorage.removeItem('qv_users');
    
    if (window.AuthManager) {
      window.AuthManager.logout();
    }
  }

  // ========================================
  // SALES ENDPOINTS
  // ========================================

  async getSales(filters = {}) {
    await this.ensureInit();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = this.salesData;

        if (filters.city) {
          results = results.filter(s => 
            s.location?.city?.toLowerCase().includes(filters.city.toLowerCase())
          );
        }

        if (filters.type) {
          results = results.filter(s => 
            s.type?.toLowerCase().includes(filters.type.toLowerCase())
          );
        }

        if (filters.maxPrice) {
          results = results.filter(s => {
            const price = typeof s.price === 'string' 
              ? parseInt(s.price.replace(/[^0-9]/g, '')) 
              : s.price;
            return price <= filters.maxPrice;
          });
        }

        resolve(results);
      }, 300);
    });
  }

  async getSaleById(id) {
    await this.ensureInit();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.salesData.find(s => s.id === id));
      }, 200);
    });
  }

  // ========================================
  // INVESTMENT ENDPOINTS
  // ========================================

  async getInvestments(filters = {}) {
    await this.ensureInit();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = this.investmentsData;

        if (filters.city) {
          results = results.filter(i => 
            i.propertyDetails?.location?.city?.toLowerCase().includes(filters.city.toLowerCase())
          );
        }

        if (filters.type) {
          results = results.filter(i => 
            i.type?.toLowerCase().includes(filters.type.toLowerCase())
          );
        }

        if (filters.minROI) {
          const minVal = parseFloat(filters.minROI);
          results = results.filter(i => {
            const roi = i.financialMetrics?.roi || 0;
            return roi >= minVal;
          });
        }

        resolve(results);
      }, 300);
    });
  }

  async getInvestmentById(id) {
    await this.ensureInit();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.investmentsData.find(i => i.id === id));
      }, 200);
    });
  }

  async invest(investmentId, amount) {
    await this.ensureInit();
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const investment = this.investmentsData.find(i => i.id === investmentId);
        if (!investment) {
          reject(new Error('Investment not found'));
          return;
        }

        const minInvestment = investment.minimumInvestment || 5000;
        if (amount < minInvestment) {
          reject(new Error(`Minimum investment is $${minInvestment}`));
          return;
        }

        resolve({
          success: true,
          investmentId,
          amount,
          confirmationId: 'INV_' + Date.now(),
          message: 'Investment successful!'
        });
      }, 600);
    });
  }

  // ========================================
  // PORTFOLIO ENDPOINTS
  // ========================================

  async getPortfolioSummary(userId) {
    await this.ensureInit();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary = {
          userId: userId,
          totalInvested: 125000,
          totalReturnsReceived: 8500,
          activeInvestments: 3,
          completedInvestments: 2,
          averageROI: 0.082,
          diversification: {
            residential: 0.60,
            commercial: 0.30,
            industrial: 0.10
          },
          projectedReturns: {
            next_3_months: 2500,
            next_6_months: 5000,
            next_12_months: 10000
          }
        };

        resolve(summary);
      }, 300);
    });
  }
}

// Create global API instance
const API = new SharedAPI();

// Start initialization immediately
API.init().then(() => {
  console.log('API initialization complete');
}).catch(err => {
  console.error('API initialization failed:', err);
});

// Export to window
window.API = API;
