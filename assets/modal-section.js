class GoodrPopup {
  constructor(container) {
    this.container = container;
    // Updated Selectors to match BEM naming
    this.overlay = container.querySelector(".goodr-modal__overlay");
    this.closeBtn = container.querySelector(".goodr-modal__close-btn");
    this.dismissBtn = container.querySelector(".goodr-modal__dismiss-btn");
    this.confirmBtn = container.querySelector(".goodr-modal__confirm-btn");

    this.storageKey = `goodr_popup_seen_${container.dataset.sectionId}`;
    this.delay = parseInt(container.dataset.delay) * 1000 || 3000;

    this.init();
  }

  init() {
    // If user has seen it or if Test Mode is active in the editor, handle differently
    const isTestMode = this.container.classList.contains(
      "goodr-modal--test-mode",
    );

    if (sessionStorage.getItem(this.storageKey) && !isTestMode) return;

    // Only set delay and show if not in Test Mode
    if (!isTestMode) {
      setTimeout(() => {
        this.show();
      }, this.delay);
    }

    this.closeBtn.addEventListener("click", () => this.close());

    if (this.dismissBtn) {
      this.dismissBtn.addEventListener("click", () => this.close());
    }

    if (this.confirmBtn) {
      this.confirmBtn.addEventListener("click", (e) => this.handleConfirm(e));
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.container.classList.contains("is-active")
      ) {
        this.close();
      }
    });
  }

  show() {
    this.container.classList.add("is-active");
    if (this.overlay) this.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  close() {
    // Add closing animation class
    this.container.classList.add("is-closing");

    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.container.classList.remove("is-active", "is-closing");
      if (this.overlay) this.overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      sessionStorage.setItem(this.storageKey, "true");
    }, 400); // Matches CSS transition duration
  }

  handleConfirm(e) {
    e.preventDefault();
    const shopUrl = this.confirmBtn.getAttribute("href") || "/collections/all";
    sessionStorage.setItem(this.storageKey, "true");
    window.location.href = shopUrl;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".goodr-modal");
  if (popup) new GoodrPopup(popup);
});

// Shopify Design Mode Support (Re-init when section is added/selected in customizer)
document.addEventListener("shopify:section:load", (event) => {
  if (event.target.querySelector(".goodr-modal")) {
    new GoodrPopup(event.target.querySelector(".goodr-modal"));
  }
});
