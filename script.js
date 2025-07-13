const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeScrollEffects();
  initializeTabs();
  initializeFormValidation();
  initializeAnimations();
});

function initializeNavigation() {
  navToggle.addEventListener("click", toggleMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

function toggleMobileMenu() {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
}

function initializeScrollEffects() {
  window.addEventListener("scroll", () => {
    handleNavbarScroll();
    handleActiveNavLink();
    handleScrollAnimations();
  });
}

function handleNavbarScroll() {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function handleActiveNavLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".skill-card, .project-card, .tech-item, .highlight-item"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

function handleScrollAnimations() {
  const elements = document.querySelectorAll(
    ".skill-card, .project-card, .about-highlights, .tech-item"
  );
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("fade-in-up");
    }
  });
}

function initializeTabs() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  tabPanes.forEach((pane) => pane.classList.remove("active"));

  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
  document.getElementById(tabId).classList.add("active");

  const activePane = document.getElementById(tabId);
  activePane.style.opacity = "0";
  setTimeout(() => {
    activePane.style.opacity = "1";
  }, 100);
}

function initializeFormValidation() {
  contactForm.addEventListener("submit", handleFormSubmit);

  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearErrors(input));
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  clearAllErrors();

  let isValid = true;

  if (!name) {
    showError("nameError", "Name is required");
    isValid = false;
  } else if (name.length < 2) {
    showError("nameError", "Name must be at least 2 characters long");
    isValid = false;
  }

  if (!email) {
    showError("emailError", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("emailError", "Please enter a valid email address");
    isValid = false;
  }

  if (!message) {
    showError("messageError", "Message is required");
    isValid = false;
  } else if (message.length < 10) {
    showError("messageError", "Message must be at least 10 characters long");
    isValid = false;
  }

  if (isValid) {
    showFormMessage(
      "Thank you for your message! I'll get back to you soon.",
      "success"
    );
    contactForm.reset();
  } else {
    showFormMessage("Please correct the errors above.", "error");
  }
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let errorElement = document.getElementById(fieldName + "Error");

  clearErrors(field);

  switch (fieldName) {
    case "name":
      if (!value) {
        showError("nameError", "Name is required");
      } else if (value.length < 2) {
        showError("nameError", "Name must be at least 2 characters long");
      }
      break;
    case "email":
      if (!value) {
        showError("emailError", "Email is required");
      } else if (!isValidEmail(value)) {
        showError("emailError", "Please enter a valid email address");
      }
      break;
    case "message":
      if (!value) {
        showError("messageError", "Message is required");
      } else if (value.length < 10) {
        showError(
          "messageError",
          "Message must be at least 10 characters long"
        );
      }
      break;
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearErrors(field) {
  const errorElement = document.getElementById(field.name + "Error");
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

function clearAllErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  setTimeout(() => {
    formMessage.style.display = "none";
  }, 5000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function smoothScrollTo(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    let offsetTop;
    if (targetId === "home") {
      offsetTop = 0; // Scroll to top for home
    } else {
      offsetTop = targetElement.offsetTop - 90;
    }
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    smoothScrollTo(targetId);
  });
});

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }
});

function initializeParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

function animateSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
          entry.target.classList.add("animate-skill");
        }
      });
    },
    { threshold: 0.5 }
  );

  skillCards.forEach((card) => {
    observer.observe(card);
  });
}

function initializeProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.querySelector(".project-overlay").style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      card.querySelector(".project-overlay").style.opacity = "0";
    });
  });
}

function showLoading() {
  document.body.classList.add("loading");
}

function hideLoading() {
  document.body.classList.remove("loading");
}

function initializeBackToTop() {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.classList.add("back-to-top");
  backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;

  document.body.appendChild(backToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = "1";
      backToTopBtn.style.visibility = "visible";
    } else {
      backToTopBtn.style.opacity = "0";
      backToTopBtn.style.visibility = "hidden";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeParallax();
  animateSkillBars();
  initializeProjectCards();
  initializeBackToTop();

  window.addEventListener("load", hideLoading);
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedScrollHandler = debounce(() => {
  handleNavbarScroll();
  handleActiveNavLink();
  handleScrollAnimations();
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

console.log(`
  Welcome to Noraiz Rana's Portfolio!
📧 Contact: noraizrana389@gmail.com
🌐 Built with vanilla HTML, CSS, and JavaScript
💻 Feel free to check out the code!
`);

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidEmail,
    validateField,
    smoothScrollTo,
    typeWriter,
  };
}
