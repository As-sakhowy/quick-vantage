
// ========================================
// INITIALIZATION HELPER
// Ensures proper loading order
// ========================================

// Make sure AuthManager exists before API tries to use it
if (typeof AuthManager === 'undefined') {
  console.error('AuthManager not loaded! Check script order.');
}

console.log('AuthManager available:', typeof window.AuthManager !== 'undefined');
