// FAQ Page JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");
  const searchInput = document.getElementById("faq-search");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let currentCategory = "all";

  // FAQ accordion functionality
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    question.addEventListener("click", function () {
      const isActive = item.classList.contains("active");

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });

    // Keyboard navigation
    question.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();
      filterFAQs(searchTerm, currentCategory);
    });
  }

  // Category filtering
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      // Update active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      currentCategory = category;
      const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";
      filterFAQs(searchTerm, category);
    });
  });

  function filterFAQs(searchTerm, category) {
    faqItems.forEach((item) => {
      const questionText = item
        .querySelector(".faq-question h3")
        .textContent.toLowerCase();
      const answerText = item
        .querySelector(".faq-answer p")
        .textContent.toLowerCase();
      const itemCategory = item.getAttribute("data-category");

      const matchesSearch =
        searchTerm === "" ||
        questionText.includes(searchTerm) ||
        answerText.includes(searchTerm);

      const matchesCategory = category === "all" || itemCategory === category;

      if (matchesSearch && matchesCategory) {
        item.classList.remove("hidden");
        item.style.display = "block";
      } else {
        item.classList.add("hidden");
        item.style.display = "none";
      }
    });

    // Show no results message if needed
    showNoResultsMessage();
  }

  function showNoResultsMessage() {
    const visibleItems = document.querySelectorAll(".faq-item:not(.hidden)");
    let noResultsMessage = document.getElementById("no-results-message");

    if (visibleItems.length === 0) {
      if (!noResultsMessage) {
        noResultsMessage = document.createElement("div");
        noResultsMessage.id = "no-results-message";
        noResultsMessage.className = "no-results-message";
        noResultsMessage.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3 data-i18n="noResultsTitle">No results found</h3>
                        <p data-i18n="noResultsDescription">Try adjusting your search terms or browse different categories.</p>
                    </div>
                `;

        const faqList = document.querySelector(".faq-list");
        if (faqList) {
          faqList.appendChild(noResultsMessage);
        }
      }
      noResultsMessage.style.display = "block";
    } else {
      if (noResultsMessage) {
        noResultsMessage.style.display = "none";
      }
    }
  }

  // Add smooth scrolling for FAQ items
  function scrollToFAQ(item) {
    const offsetTop = item.offsetTop - 100; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  // Add keyboard navigation for search
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        this.value = "";
        filterFAQs("", currentCategory);
      }
    });
  }

  // Add analytics tracking for FAQ interactions
  function trackFAQInteraction(action, category, question) {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: "FAQ",
        event_label: `${category}: ${question}`,
      });
    }
  }

  // Track FAQ item clicks
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question h3");
    const category = item.getAttribute("data-category");

    question.addEventListener("click", function () {
      const questionText = this.textContent.trim();
      trackFAQInteraction("FAQ_Question_Clicked", category, questionText);
    });
  });

  // Track search queries
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = this.value.trim();
        if (searchTerm.length > 2) {
          trackFAQInteraction("FAQ_Search", "Search", searchTerm);
        }
      }, 500);
    });
  }

  // Track category changes
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      trackFAQInteraction("FAQ_Category_Changed", "Category", category);
    });
  });

  // Add focus management for accessibility
  function manageFocus() {
    const visibleItems = document.querySelectorAll(".faq-item:not(.hidden)");
    const firstVisibleItem = visibleItems[0];
    const lastVisibleItem = visibleItems[visibleItems.length - 1];

    if (firstVisibleItem && lastVisibleItem) {
      const firstQuestion = firstVisibleItem.querySelector(".faq-question");
      const lastQuestion = lastVisibleItem.querySelector(".faq-question");

      if (firstQuestion && lastQuestion) {
        firstQuestion.addEventListener("keydown", function (e) {
          if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastQuestion.focus();
          }
        });

        lastQuestion.addEventListener("keydown", function (e) {
          if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstQuestion.focus();
          }
        });
      }
    }
  }

  // Update focus management when filtering
  const originalFilterFAQs = filterFAQs;
  filterFAQs = function (searchTerm, category) {
    originalFilterFAQs(searchTerm, category);
    setTimeout(manageFocus, 100);
  };

  // Initialize focus management
  manageFocus();

  // Add loading states
  function showLoading() {
    const faqList = document.querySelector(".faq-list");
    if (faqList) {
      faqList.style.opacity = "0.5";
      faqList.style.pointerEvents = "none";
    }
  }

  function hideLoading() {
    const faqList = document.querySelector(".faq-list");
    if (faqList) {
      faqList.style.opacity = "1";
      faqList.style.pointerEvents = "auto";
    }
  }

  // Add loading states to search and filter
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      showLoading();
      setTimeout(hideLoading, 200);
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      showLoading();
      setTimeout(hideLoading, 200);
    });
  });

  // Add print styles
  window.addEventListener("beforeprint", function () {
    // Expand all FAQ items for printing
    faqItems.forEach((item) => {
      item.classList.add("active");
    });
  });

  window.addEventListener("afterprint", function () {
    // Collapse all FAQ items after printing
    faqItems.forEach((item) => {
      item.classList.remove("active");
    });
  });
});
