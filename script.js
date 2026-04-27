document.addEventListener("DOMContentLoaded", () => {
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

  // 2. MODAL SYSTEM
  const modals = document.querySelectorAll(".modal");
  const closeBtns = document.querySelectorAll(".modal-close");

  function openModal(modalId) {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    document.getElementById(modalId)?.classList.add("active");
  }

  function closeAllModals() {
    modals.forEach(m => m.classList.remove("active"));
  }

  closeBtns.forEach(btn => btn.addEventListener("click", closeAllModals));
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) closeAllModals();
  });

  // 3. BUTTON TRIGGERS
  // Get Started & Nav Sign In
  document.querySelectorAll(".get-started-btn, .nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("signupModal"); // Leading to signup first
    });
  });

  // Specifically the Nav Sign In button
  document.getElementById("navSignInBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signinModal");
  });

  // View Details Buttons (Redirect to sign in if not logged in)
  document.querySelectorAll(".property-card .cta-button.secondary").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("signinModal");
    });
  });

  // Modal Switching (Links inside modals)
  document.getElementById("toSignUp")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signupModal");
  });

  document.getElementById("toSignIn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signinModal");
  });

  // 4. FORM SUBMISSIONS (Leads to Dashboard)
  const handleAuth = (e) => {
    e.preventDefault();
    // Simulate auth logic
    console.log("Authenticating...");
    window.location.href = "../pages/dashboard.html"; // Make sure dashboard.html exists
  };

  document.getElementById("signinForm")?.addEventListener("submit", handleAuth);
  document.getElementById("signupForm")?.addEventListener("submit", handleAuth);
});