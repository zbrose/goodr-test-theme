class GoodrPopup {
  constructor(container) {
    this.container = container;
    this.overlay = container.querySelector(".goodr-modal__overlay");
    this.closeBtn = container.querySelector(".goodr-modal__close-btn");
    this.dismissBtn = container.querySelector(".goodr-modal__dismiss-btn");
    this.confirmBtn = container.querySelector(".goodr-modal__confirm-btn");

    this.storageKey = `goodr_popup_seen_${container.dataset.sectionId}`;
    this.delay = parseInt(container.dataset.delay) * 1000 || 3000;

    this.init();
  }

  init() {
    const isTestMode = this.container.classList.contains(
      "goodr-modal--test-mode",
    );
    const isEditor = window.Shopify && window.Shopify.designMode;

    // ATTACH EVENTS FIRST (Always run this)
    this.closeBtn.addEventListener("click", () => this.close());
    if (this.dismissBtn)
      this.dismissBtn.addEventListener("click", () => this.close());
    if (this.confirmBtn)
      this.confirmBtn.addEventListener("click", (e) => this.handleConfirm(e));

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.container.classList.contains("is-active")
      ) {
        this.close();
      }
    });

    // DETERMINE IF/WHEN TO SHOW
    if (isEditor || isTestMode) {
      this.show(); // Show immediately in editor
    } else {
      // Normal Customer Logic
      if (sessionStorage.getItem(this.storageKey)) return;

      setTimeout(() => {
        this.show();
      }, this.delay);
    }
  }

  show() {
    this.container.classList.add("is-active");
    if (this.overlay) this.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.container.classList.add("is-closing");
    setTimeout(() => {
      this.container.classList.remove("is-active", "is-closing");
      if (this.overlay) this.overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // Only set session storage if NOT in editor
      if (!(window.Shopify && window.Shopify.designMode)) {
        sessionStorage.setItem(this.storageKey, "true");
      }
    }, 400);
  }

  handleConfirm(e) {
    const shopUrl = this.confirmBtn.getAttribute("href") || "/collections/all";
    if (!(window.Shopify && window.Shopify.designMode)) {
      sessionStorage.setItem(this.storageKey, "true");
    }
    window.location.href = shopUrl;
  }
}

// Global Init
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".goodr-modal");
  if (popup) new GoodrPopup(popup);
});

// Theme Editor Support
document.addEventListener("shopify:section:load", (event) => {
  const popup = event.target.querySelector(".goodr-modal");
  if (popup) new GoodrPopup(popup);
});
