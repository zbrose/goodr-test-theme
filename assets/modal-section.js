class GoodrPopup {
  constructor(container) {
    this.container = container;
    this.overlay = container.querySelector('.modal-overlay');
    this.closeBtn = container.querySelector('.close-modal-btn');
    this.declineBtn = container.querySelector('.decline-modal-btn');
    this.confirmBtn = container.querySelector('.confirm-modal-btn');
    this.storageKey = `goodr_popup_seen_${container.dataset.sectionId}`;
    this.delay = parseInt(container.dataset.delay) * 1000 || 3000;

    this.init();
  }

  init() {
    if (sessionStorage.getItem(this.storageKey)) return;

    setTimeout(() => {
      this.show();
    }, this.delay);

    this.closeBtn.addEventListener('click', () => this.close());

    if (this.declineBtn) {
      this.declineBtn.addEventListener('click', () => this.close());
    }

    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', e => this.handleConfirm(e));
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.container.classList.contains('is-active')) {
        this.close();
      }
    });
  }

  show() {
    this.container.classList.add('is-active');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    // Add closing animation class
    this.container.classList.add('is-closing');

    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.container.classList.remove('is-active', 'is-closing');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sessionStorage.setItem(this.storageKey, 'true');
    }, 400); // Match CSS transition duration
  }

  handleConfirm(e) {
    e.preventDefault();
    const shopUrl = this.confirmBtn.getAttribute('href') || '/collections/all';
    sessionStorage.setItem(this.storageKey, 'true');
    window.location.href = shopUrl;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('.custom-modal-section');
  if (popup) new GoodrPopup(popup);
});
