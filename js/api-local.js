
// ========================================
// LOCAL API - Testing Phase
// Reads from JSON files
// ========================================

class LocalAPI {
  constructor() {
    this.salesData = [];
    this.investmentsData = [];
    this.usersData = [];
    this.initialized = false;
    this.initPromise = this.init();
  }

  // Initialize - load JSON data
  async init() {
    if (this.initialized) return;
    
    try {
      const [salesResp, investmentsResp, usersResp] = await Promise.all([
        fetch('./data/sales.json'),
        fetch('./data/investments.json'),
        fetch('./data/users.json')
      ]);

      const sales = await salesResp.json();
      const investments = await investmentsResp.json();
      const users = await usersResp.json();

      this.salesData = sales.sales || sales || [];
      this.investmentsData = investments.investments || investments || [];
      this.usersData = users.users || users || [];

      this.initialized = true;
      console.log('API initialized with local data');
      console.log('Users:', this.usersData.length, 'Sales:', this.salesData.length, 'Investments:', this.investmentsData.length);
    } catch (error) {
      console.error('Error loading data:', error);
      this.initialized = false;
      throw error;
    }
  }

  // Ensure API is initialized before any operation
  async ensureInit() {
    if (!this.initialized) {
      await this.initPromise;
    }
  }

  // ========================================
  // AUTHENTICATION ENDPOINTS
  // ========================================

  async signup(data) {
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

          this.usersData.push(newUser);
          console.log('User signed up:', newUser.email);

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
          console.error('Signup error:', error);
          reject(error);
        }
      }, 500);
    });
  }

  async signin(email, password) {
    await this.ensureInit();
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const user = this.usersData.find(u => u.email === email);

          if (user) {
            console.log('User signed in:', email);
            
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                          btoa(JSON.stringify({ id: user.id, email: user.email })) +
                          '.mock_' + Date.now();

            if (window.AuthManager) {
              window.AuthManager.setUser(user);
              window.AuthManager.setToken(token);
            }

            resolve({ user, token });
          } else {
            console.warn('Sign in failed: user not found');
            reject(new Error('Invalid email or password'));
          }
        } catch (error) {
          console.error('Signin error:', error);
          reject(error);
        }
      }, 500);
    });
  }

  async logout() {
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

// Initialize API
const API = new LocalAPI();

window.API = API;
