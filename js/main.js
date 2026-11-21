// ============================================
// GLOBAL STATE
// ============================================
let currentLanguage = "en";

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupSmoothScroll();
  setupBackendForm(); // Connects to your MongoDB backend
});

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
// BACKEND FORM CONNECTION
// ============================================
function setupBackendForm() {
  const form = document.getElementById('bookingForm');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault(); // Stop page from reloading

      // Get the values from the input fields
      const formData = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        serviceInterest: document.getElementById('serviceInterest').value
      };

      // Change button text to show loading
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;

      try {
        // ⚠️ REPLACE THIS LINK WITH YOUR ACTUAL RENDER LINK!
        const response = await fetch('https://ashraqa-backend-xxxx.onrender.com/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        // Show success message on the website
        const responseMsg = document.getElementById('responseMessage');
        responseMsg.innerText = data.message || "Message sent successfully!";
        responseMsg.style.color = 'green';
        
        form.reset(); // Clear the form
      } catch (error) {
        console.error('Error:', error);
        const responseMsg = document.getElementById('responseMessage');
        responseMsg.innerText = "Error: Could not connect to the server. Please try again later.";
        responseMsg.style.color = 'red';
      } finally {
        // Reset button text
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
}