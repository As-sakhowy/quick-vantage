# Quick Vantage - Phase 1 Testing Checklist

## Pre-Test Verification

- [x] All files created
- [x] No syntax errors in JavaScript
- [x] JSON data files valid
- [x] Authentication module ready
- [x] API module ready
- [x] Dashboard HTML complete

## User Sign-Up Flow

Test: User clicks "Get Started Free" on landing page

Steps:
1. [ ] Click "Get Started Free" button on index.html
2. [ ] Sign-up modal opens
3. [ ] Fill in:
      - Full Name: "John Investor"
      - Email: "john@example.com"
      - Phone: "+2349120903603"
      - Password: "Password123"
4. [ ] Click "Create Account"
5. [ ] Should redirect to dashboard.html
6. [ ] User name should display in top right

Expected Result: User sees dashboard with portfolio summary

---

## User Sign-In Flow

Test: Returning user signs in

Prerequisites: Complete sign-up test first

Steps:
1. [ ] Logout (click Logout button)
2. [ ] Redirected to index.html
3. [ ] Click "Sign In" button
4. [ ] Sign-in modal opens
5. [ ] Enter:
      - Email: "john@example.com"
      - Password: "Password123"
6. [ ] Click "Sign In"
7. [ ] Should redirect to dashboard.html

Expected Result: User sees dashboard with portfolio summary

---

## Dashboard - Portfolio Summary

Test: Portfolio cards display correctly

On Dashboard:
1. [ ] Total Invested shows: $125,000
2. [ ] Total Returns shows: $8,500
3. [ ] Active Investments shows: 3
4. [ ] Average ROI shows: 8.2%
5. [ ] Last updated timestamp is current

---

## Dashboard - Sales Tab

Test: Sales listings display and filter correctly

Steps:
1. [ ] Sales tab is active by default
2. [ ] Two property cards visible
3. [ ] Card 1: "Modern 3-Bedroom Apartment" - $120,000
4. [ ] Card 2: "Commercial Office Space" - $85,000
5. [ ] Each card shows: title, location, type, status, price

Filtering - City:
1. [ ] Enter "Lagos" in City filter
2. [ ] Click Filter
3. [ ] Should show 1 card (Lagos property)
4. [ ] Clear filter and try "Ibadan"
5. [ ] Should show 1 card (Ibadan property)

Filtering - Type:
1. [ ] Select "Residential" type
2. [ ] Click Filter
3. [ ] Should show 1 card
4. [ ] Try "Commercial"
5. [ ] Should show 1 card

Filtering - Price:
1. [ ] Enter "100000" in Max Price
2. [ ] Click Filter
3. [ ] Should show 1 card (under $100k)

---

## Dashboard - Sales Detail Modal

Test: Click on sales card opens detailed view

Steps:
1. [ ] Clear all filters
2. [ ] Click on "Modern 3-Bedroom Apartment" card
3. [ ] Modal opens showing full details
4. [ ] Details include:
      - [ ] Title
      - [ ] Address
      - [ ] Image
      - [ ] Bedrooms: 3
      - [ ] Bathrooms: 2
      - [ ] Square Feet: 2,500
      - [ ] Year Built: 2023
      - [ ] Price: $120,000
      - [ ] HOA Fees: $300/month
      - [ ] Est. Rental: $1,500/month
      - [ ] Description
      - [ ] Seller info (name, email, phone)
      - [ ] Contact Seller button
      - [ ] Save Property button
5. [ ] Click close button (X)
6. [ ] Modal closes

---

## Dashboard - Investment Tab

Test: Investment opportunities display correctly

Steps:
1. [ ] Click "Investment Opportunities" tab
2. [ ] Three investment cards visible
3. [ ] Card 1: "Multi-Family Rental Property - Ibadan"
      - [ ] Shows 8% ROI
      - [ ] Shows 63.3% funded
4. [ ] Card 2: "Commercial Mall Complex - Lagos"
      - [ ] Shows 9.5% ROI
      - [ ] Shows 70% funded
5. [ ] Card 3: "Industrial Warehouse Park - Lagos"
      - [ ] Shows 8.5% ROI
      - [ ] Shows 90% funded

---

## Dashboard - Investment Filtering

Test: Filter investments by criteria

Filter - City "Lagos":
1. [ ] Enter "Lagos" in City filter
2. [ ] Click Filter
3. [ ] Should show 2 cards (both Lagos properties)
4. [ ] Clear and try "Ibadan"
5. [ ] Should show 1 card

Filter - Min ROI "7%":
1. [ ] Select "7%+" in Min ROI dropdown
2. [ ] Click Filter
3. [ ] Should show all 3 cards
4. [ ] Try "9%+"
5. [ ] Should show 2 cards (9.5% and 8.5% filtered out, only 8% and 9.5%)

---

## Dashboard - Investment Detail Modal

Test: Click on investment card shows details

Steps:
1. [ ] Clear all filters
2. [ ] Click on "Multi-Family Rental Property - Ibadan" card
3. [ ] Modal opens with details:
      - [ ] Title
      - [ ] Location
      - [ ] Expected ROI: 8.0%
      - [ ] Cap Rate: 6.2%
      - [ ] Investment Amount: $150,000
      - [ ] Minimum: $5,000
      - [ ] Raised: $95,000 (63.3%)
      - [ ] Description
      - [ ] Monthly Rental: $2,500
      - [ ] Annual NOI: $9,300
      - [ ] Occupancy: 95%
      - [ ] Units: 5
      - [ ] Manager info
      - [ ] "Invest Now" button
      - [ ] "Save Deal" button
4. [ ] Click "Invest Now"
5. [ ] Prompt asks for investment amount
6. [ ] Enter 5000 (meets minimum)
7. [ ] Should show success message
8. [ ] Click "Continue"
9. [ ] Modal closes

---

## Dashboard - Investment with Invalid Amount

Test: Error handling for minimum investment

Steps:
1. [ ] Click same investment card again
2. [ ] Click "Invest Now"
3. [ ] Prompt asks for amount
4. [ ] Enter 2000 (below $5,000 minimum)
5. [ ] Should show error: "Minimum investment is $5000"
6. [ ] Try again with 5000
7. [ ] Should succeed

---

## Dashboard - Tab Switching

Test: Tabs switch without losing data

Steps:
1. [ ] On Sales tab - apply filter (e.g., "Lagos")
2. [ ] Results show 1 card
3. [ ] Switch to Investment tab
4. [ ] Investment cards show
5. [ ] Switch back to Sales tab
6. [ ] Filter still applied? [ ] (should reload)

---

## Dashboard - Logout

Test: User logout functionality

Steps:
1. [ ] Click "Logout" button
2. [ ] Confirm dialog appears
3. [ ] Click OK
4. [ ] Redirected to index.html
5. [ ] LocalStorage data cleared (check browser DevTools)
6. [ ] Can sign up fresh with new email

---

## Security Tests

Test: Dashboard authentication

Steps:
1. [ ] Logout
2. [ ] Try to manually navigate to dashboard.html
3. [ ] Should redirect to index.html
4. [ ] Sign back in
5. [ ] Should allow access

---

## Responsive Design

Test: Mobile view

Steps:
1. [ ] Open DevTools (F12)
2. [ ] Set to iPhone/Mobile view
3. [ ] [ ] Dashboard header stacks vertically
4. [ ] [ ] Tabs are readable
5. [ ] [ ] Filters stack on mobile
6. [ ] [ ] Cards are single column
7. [ ] [ ] Modal is readable on mobile
8. [ ] [ ] No horizontal scrolling needed

---

## Performance Tests

Test: Data loading speed

Steps:
1. [ ] Open DevTools Network tab
2. [ ] Reload dashboard
3. [ ] JSON files load quickly (< 100ms each)
4. [ ] No console errors
5. [ ] Filters respond in < 300ms

---

## Browser Compatibility

Test: Multiple browsers

Steps:
1. [ ] Chrome - Works
2. [ ] Firefox - Works
3. [ ] Safari - Works
4. [ ] Edge - Works

---

## Known Limitations (Testing Phase)

- All data is mock/sample
- No real database yet
- Investments don't actually save
- No email confirmations
- No payment processing
- User data not persisted between sessions (unless localStorage cleared)

---

## Next Phase Preparation

Once Phase 1 testing passes:

1. [ ] Set up Supabase account
2. [ ] Create database tables
3. [ ] Build api-supabase.js
4. [ ] Test database integration
5. [ ] Add payment processing

