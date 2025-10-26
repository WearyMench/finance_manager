// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar background on scroll - removed to maintain consistent header color

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".feature-card, .screenshot-item, .support-card"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Add loading states to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      if (this.href && this.href.startsWith("http")) {
        this.style.opacity = "0.7";
        this.style.pointerEvents = "none";

        setTimeout(() => {
          this.style.opacity = "1";
          this.style.pointerEvents = "auto";
        }, 2000);
      }
    });
  });

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // ESC key closes mobile menu
    if (e.key === "Escape") {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Add focus management for mobile menu
  if (navMenu) {
    const focusableElements = navMenu.querySelectorAll("a, button");
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Add analytics tracking (placeholder)
  function trackEvent(category, action, label) {
    // Google Analytics or other analytics tracking
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  }

  // Track button clicks
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function () {
      const buttonText = this.textContent.trim();
      trackEvent("Button", "Click", buttonText);
    });
  });

  // Track navigation clicks
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      const linkText = this.textContent.trim();
      trackEvent("Navigation", "Click", linkText);
    });
  });

  // Track language changes
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const language = this.getAttribute("data-lang");
      trackEvent("Language", "Change", language);
    });
  });

  // Add error handling for external links
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      // Add a small delay to allow tracking
      setTimeout(() => {
        // The link will open in a new tab/window
      }, 100);
    });
  });

  // Add performance monitoring
  window.addEventListener("load", function () {
    // Measure page load time
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;

    // Track page load time
    if (typeof gtag !== "undefined") {
      gtag("event", "timing_complete", {
        name: "load",
        value: loadTime,
      });
    }
  });

  // Add service worker registration for PWA features
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          // ServiceWorker registered successfully
        })
        .catch(function (err) {
          // ServiceWorker registration failed - this is expected if sw.js doesn't exist
        });
    });
  }

  // Add theme detection and switching
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function updateTheme() {
    if (prefersDark.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  updateTheme();
  prefersDark.addEventListener("change", updateTheme);

  // Add scroll to top functionality
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
  scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;

  document.body.appendChild(scrollToTopBtn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.visibility = "visible";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.visibility = "hidden";
    }
  });

  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
