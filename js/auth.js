
// ========================================
// AUTHENTICATION MODULE
// ========================================

class AuthManager {
  constructor() {
    this.user = this.getStoredUser();
    this.token = this.getStoredToken();
  }

  // Store user data
  setUser(userData) {
    this.user = userData;
    localStorage.setItem('qv_user', JSON.stringify(userData));
  }

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem('qv_user');
    return user ? JSON.parse(user) : null;
  }

  // Store JWT token
  setToken(token) {
    this.token = token;
    localStorage.setItem('qv_token', token);
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('qv_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.user && this.token);
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Logout
  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('qv_user');
    localStorage.removeItem('qv_token');
    window.location.href = './index.html';
  }

  // Validate token (simple check for testing)
  isValidToken() {
    return !!this.token && this.token.length > 10;
  }
}

// Export as global
window.AuthManager = new AuthManager();
