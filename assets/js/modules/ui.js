
/* ════════════════════════════════════════
   UI MODULE
   file: assets/js/modules/ui.js
════════════════════════════════════════ */

export function initUI() {
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mainNav = document.getElementById('main-nav');

  // Hamburger & Mobile Menu
  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Window functions for menu closure (called from HTML)
  window.closeMenu = () => {
    ham.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Scroll Shadow
  window.addEventListener('scroll', () => {
    if (mainNav) {
      mainNav.style.boxShadow = window.scrollY > 30 ? '0 4px 28px rgba(0,0,0,0.5)' : 'none';
    }
  });

  // Active Mobile Bottom Nav
  const sections = document.querySelectorAll('section[id]');
  const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    mobileNavLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  // Scroll Animations (Fade-up)
  const fadeEls = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { 
        setTimeout(() => e.target.classList.add('visible'), i * 100); 
        obs.unobserve(e.target); 
      }
    });
  }, { threshold: 0.08 });
  fadeEls.forEach(el => obs.observe(el));

  // Lightbox Closure
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === this) window.closeLightbox();
    });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-modal')?.classList.contains('active')) {
      if (typeof window.adminLogin === 'function') window.adminLogin();
    }
    if (e.key === 'Escape') {
      document.getElementById('login-modal')?.classList.remove('active');
      window.closeLightbox?.();
      window.closeMenu?.();
    }
  });
}

export function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }
}

// Global functions for HTML access
window.showToast = showToast;
window.bookService = (service) => {
  const serviceInput = document.getElementById('f-service');
  if (serviceInput) serviceInput.value = service;
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
};

window.openLightbox = (src) => {
  const lbImg = document.getElementById('lightbox-img');
  const lb = document.getElementById('lightbox');
  if (lbImg && lb) {
    lbImg.src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = () => {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
};
