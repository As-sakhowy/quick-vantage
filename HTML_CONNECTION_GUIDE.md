
# HTML CONNECTION GUIDE - QUICK TEST

## What Was Fixed

Two HTML files are now fully connected with working authentication flow:

1. **index.html** (Landing page)
   - Sign-up and Sign-in modals
   - Now calls API when forms are submitted
   - Redirects to dashboard.html on success

2. **dashboard.html** (User dashboard)
   - Loads after authentication
   - Shows portfolio summary
   - Two tabs: Sales & Investment Opportunities
   - Protected by authentication check

## Updated Files

1. **index.html**
   - Added 3 script includes before closing body:
     * js/auth.js (authentication manager)
     * js/api-local.js (mock API with data)
     * script.js (landing page logic)

2. **script.js**
   - Updated signup form handler to call API.auth.signup()
   - Updated signin form handler to call API.auth.signin()
   - Both now redirect to dashboard.html on success

## Test Steps

### Test 1: Sign Up Flow
1. Open index.html in browser
2. Click "Get Started Free"
3. Fill in the form:
   - Full Name: John Doe
   - Email: test@example.com
   - Phone: +234-123-456-7890
   - Password: Password123
   - Confirm: Password123
4. Click "Create Account"
5. Expected: Redirects to dashboard.html showing portfolio

### Test 2: Sign In Flow
1. Open index.html in browser
2. Click "Sign In" (or the sign in link)
3. Fill in the form:
   - Email: investor@example.com (from data/users.json)
   - Password: password123
4. Click "Sign In"
5. Expected: Redirects to dashboard.html showing portfolio

### Test 3: Dashboard Features
Once on dashboard, test:
- Portfolio Summary: Shows Total Invested, Returns, Active Investments
- Sales Tab: Shows 2 properties with filters (city, type, price)
- Investment Tab: Shows 3 opportunities with filters (city, type, ROI)
- Click on any card to see details in modal
- Click "Invest Now" to submit investment (validates minimum $5,000)
- Click Logout to return to index.html

## Data for Testing

### Test Users
- Email: investor@example.com
- Password: password123
(or create new account with any email)

### Test Properties (Sales Tab)
1. Modern 3-Bedroom Apartment - Lagos - $120,000
2. Commercial Office Space - Ibadan - $85,000

### Test Investments (Investment Tab)
1. Multi-Family Rental - Ibadan - 8% ROI
2. Commercial Mall - Lagos - 9.5% ROI
3. Industrial Warehouse - Lagos - 8.5% ROI

## Troubleshooting

### Issue: "API not loaded yet" error
**Cause**: Scripts are loading out of order
**Fix**: Clear browser cache and reload
- Windows: Ctrl + Shift + Delete, clear cache
- Then refresh page

### Issue: Redirect doesn't work
**Cause**: Check browser console for errors (F12)
**Check**: 
- All JSON files exist (data/users.json, etc.)
- All JS files exist (js/auth.js, js/api-local.js)
- No JavaScript errors in console

### Issue: Dashboard shows blank
**Cause**: Authentication token not being set properly
**Check**:
- Open browser DevTools (F12)
- Go to Application > LocalStorage
- Look for 'quickVantageUser' and 'quickVantageToken'
- Should contain user data and JWT token

## How It Works (Technical)

1. **Authentication Flow**
   - User submits form on index.html
   - script.js captures submission
   - Calls API.auth.signup() or API.auth.signin()
   - AuthManager stores user + JWT token in localStorage
   - Redirects to dashboard.html

2. **Persistence**
   - JWT token saved to localStorage
   - dashboard.html reads token from localStorage
   - Dashboard checks if user is authenticated
   - If not authenticated, redirects back to index.html

3. **Data Flow**
   - JSON files store mock data (users, sales, investments)
   - LocalAPI class reads from JSON files
   - dashboard.js calls API methods to fetch data
   - Data rendered in HTML templates

## Next Steps After Testing

1. **Phase 2**: Replace JSON with real database (Supabase)
   - Create api-supabase.js with same interface
   - Update script tags to load api-supabase.js instead

2. **Phase 3**: Add real authentication
   - Replace mock JWT with real auth service
   - Add email verification
   - Add password reset

3. **Phase 4**: Advanced features
   - Payment processing (Stripe/Paystack)
   - Email notifications
   - Document uploads
   - Financial modeling tools

## Files Modified

```
MODIFIED: index.html
  - Added js/auth.js include
  - Added js/api-local.js include
  
MODIFIED: script.js
  - Updated signupForm submission handler
  - Updated signinForm submission handler
  - Both now redirect to dashboard.html
```

## Files Unchanged

All other files remain unchanged and working:
- style.css (shared styling)
- logo.png (branding)
- images/ (property images)
- Other landing page elements

---
Status: HTML Integration Complete ✓
Test it now by opening index.html and clicking "Get Started Free"
