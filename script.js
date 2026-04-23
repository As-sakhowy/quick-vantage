console.log("MAIN JS LOADED");
// ========================================
// NAVBAR / HAMBURGER MENU
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  // ========================
  // HAMBURGER TOGGLE
  // ========================
  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // ========================
  // CLOSE MENU WHEN LINK CLICKED
  // ========================
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // ========================
  // SIGN IN BUTTON → OPEN MODAL
  // ========================
 document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // MODAL HELPERS
  // ======================
  function openModal(name) {
    closeAllModals();
    const modal = document.getElementById(name + "Modal");
    if (modal) modal.classList.add("active");
  }

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  }

  // Close buttons
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
  });

  // ======================
  // NAV BUTTONS
  // ======================
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("signin");
    });
  });

  // ======================
  // SWITCH LINKS
  // ======================
  document.getElementById("signupLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signup");
  });

  document.getElementById("signinLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signin");
  });

});
function openPropertyModal(propertyTitle) {
  const property = propertyData[propertyTitle];

  if (!property) {
    console.error("Property not found:", propertyTitle);
    return;
  }

  document.getElementById("propertyTitle").textContent = propertyTitle;
  document.getElementById("propertyLocation").textContent = property.location;
  document.getElementById("propertyImage").src = property.image;
  document.getElementById("propertyPrice").textContent = property.price;

  openModal("property");
}

document.querySelectorAll(".property-card .cta-button.secondary")
.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signin");
  });
});

// ========================================
// NAV USER STATE
// ========================================

function updateNavUser() {
  const nav = document.getElementById("navLinks");

  if (!nav) return;

  const existing = document.getElementById("userSection");
  if (existing) existing.remove();

  if (window.AuthManager?.isAuthenticated()) {
    const user = window.AuthManager.user;

    const li = document.createElement("li");
    li.id = "userSection";
    li.innerHTML = `
      <span>Hi, ${user?.email || "User"}</span>
      <button id="logoutBtn" class="cta-button nav-btn">Logout</button>
    `;

    nav.appendChild(li);

    document.getElementById("logoutBtn").addEventListener("click", async () => {

      window.AuthManager.logout();
    });
  }
}

const pendingProperty = sessionStorage.getItem("pendingProperty");

if (pendingProperty) {
  sessionStorage.removeItem("pendingProperty");

  // small delay so modal closes first
  setTimeout(() => {
    openPropertyModal(pendingProperty);
  }, 300);
}

document.querySelectorAll(".cta-button.primary").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signup");
  });
});



// REDIRECT IF LOGGED IN
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (window.auth.isAuthenticated()) {
      if (window.location.pathname.includes("index.html")) {
        window.location.href = "./dashboard.html";
      }
    }
  }, 500);
});


// show user on dashboard
const user = window.auth.user;

document.getElementById("welcomeUser").textContent =
  user?.email || "User";

// SIGN IN
document.getElementById("signinForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  alert("Login successful");

  form.reset();
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
});

// SIGN UP
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const checkbox = form.querySelector("input[type='checkbox']");

  if (!checkbox.checked) {
    alert("You must agree to terms");
    return;
  }

  if (!fullName || !email || !password) {
    alert("All fields are required");
    return;
  }

  console.log("Creating account...");

  // TEMP SUCCESS (we'll connect backend later)
  alert("Account created successfully");

  form.reset();
});
// SIGN IN/UP LINKS
document.getElementById("signinLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal("signup");
  openModal("signin");
});

document.getElementById("signupLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal("signin");
  openModal("signup");
});

document.getElementById("newsletterbutton")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = document.getElementById("formMessage");

  msg.textContent = "Subscribed successfully!";
  msg.style.color = "green";

  e.target.reset();

  setTimeout(() => {
    msg.textContent = "";
  }, 4000);
});

document.getElementById("investmentTab")?.addEventListener("click", () => {
  alert("Investment tab clicked");
});





document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    // remove active
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    // activate
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
  window.AuthManager.logout();
  
});