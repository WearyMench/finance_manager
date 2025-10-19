// Internationalization (i18n) System
class I18n {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.translations = {};
    this.loadTranslations();
  }

  detectLanguage() {
    // Check if language is stored in localStorage
    const storedLang = localStorage.getItem("expense-manager-lang");
    if (storedLang) {
      return storedLang;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith("es")) {
      return "es";
    }

    // Default to English
    return "en";
  }

  async loadTranslations() {
    try {
      const response = await fetch(`assets/i18n/${this.currentLanguage}.json`);
      this.translations = await response.json();
      this.updatePageContent();
    } catch (error) {
      console.error("Error loading translations:", error);
      // Fallback to English if current language fails
      if (this.currentLanguage !== "en") {
        this.currentLanguage = "en";
        this.loadTranslations();
      }
    }
  }

  updatePageContent() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getTranslation(key);
      if (translation) {
        if (element.tagName === "INPUT" && element.type === "text") {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update page title and meta description
    document.title = this.getTranslation("pageTitle") || "Expense Manager";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        this.getTranslation("pageDescription") ||
        "Personal Finance Management App";
    }
  }

  getTranslation(key) {
    const keys = key.split(".");
    let translation = this.translations;

    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return translation;
  }

  async changeLanguage(lang) {
    if (lang === this.currentLanguage) return;

    this.currentLanguage = lang;
    localStorage.setItem("expense-manager-lang", lang);

    // Update language switcher
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`lang-${lang}`).classList.add("active");

    // Load new translations
    await this.loadTranslations();
  }
}

// Initialize i18n
const i18n = new I18n();

// Language switcher event listeners
document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      i18n.changeLanguage(lang);
    });
  });

  // Set initial active language button
  const activeLangBtn = document.getElementById(`lang-${i18n.currentLanguage}`);
  if (activeLangBtn) {
    activeLangBtn.classList.add("active");
  }
});
