// ============================================
// GLOBAL STATE
// ============================================
let currentLanguage = "en";
let allServices = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  loadServices();
  setupMobileMenu();
  setupSmoothScroll();
  setupContactForm();
  setupLanguageSwitcher();
  setupScrollAnimations();
});

// ============================================
// FETCH & RENDER SERVICES
// ============================================
async function loadServices() {
  try {
    const response = await fetch("services.json");
    allServices = await response.json();
    renderServices(currentLanguage);
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

function renderServices(lang) {
  const grid = document.getElementById("services-grid");
  if (!grid) return;

  grid.innerHTML = "";

  allServices.forEach((service) => {
    const card = document.createElement("div");
    card.classList.add("service-card", "fade-in");
    card.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h3>${service["title_" + lang]}</h3>
            <p>${service["description_" + lang]}</p>
        `;
    grid.appendChild(card);
  });

  // Re-observe new cards for scroll animation
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

// ============================================
// LANGUAGE SWITCHER
// ============================================
async function setupLanguageSwitcher() {
  const switcher = document.getElementById("language-switcher");

  // Load saved language preference
  const savedLang = localStorage.getItem("ashraqa-lang");
  if (savedLang && ["en", "om", "am"].includes(savedLang)) {
    currentLanguage = savedLang;
    switcher.value = savedLang;
    await applyTranslations(savedLang);
  }

  switcher.addEventListener("change", async (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem("ashraqa-lang", currentLanguage);
    await applyTranslations(currentLanguage);
    renderServices(currentLanguage);
  });
}

async function applyTranslations(lang) {
  try {
    const response = await fetch("site-content.json");
    const content = await response.json();
    const translations = content[lang];

    // Update all elements with data-lang attribute
    document.querySelectorAll("[data-lang]").forEach((el) => {
      const key = el.getAttribute("data-lang");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update document title
    const titles = {
      en: "Ashraqa BDS | Business Development Services in Borana",
      om: "Ashraqa BDS | Tajaajila Misooma Daldalaa Booranaa",
      am: "Ashraqa BDS | የቢዝነስ ልማት አገልግሎቶች በበረንዳ",
    };
    document.title = titles[lang];
  } catch (error) {
    console.error("Error applying translations:", error);
  }
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // Change icon
    const icon = hamburger.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close menu on link click
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const icon = hamburger.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// CONTACT FORM
// ============================================
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      status.style.color = "#dc3545";
      status.textContent = "Please fill in all required fields.";
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      status.style.color = "#dc3545";
      status.textContent = "Please enter a valid email address.";
      return;
    }

    // Simulate submission
    status.style.color = "#28a745";
    status.textContent =
      "Thank you! Your message has been sent. We will contact you soon.";
    form.reset();

    // Clear status after 5 seconds
    setTimeout(() => {
      status.textContent = "";
    }, 5000);
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
  },
);

function setupScrollAnimations() {
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}
