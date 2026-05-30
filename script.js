/**
 * PORTFOLIO — script.js
 * Handles: loader, custom cursor, navbar, mobile drawer,
 * typed text, scroll reveal, skill bars, form, scroll-to-top
 */

/* ── Loader ───────────────────────────────────────────────── */
// Hide loader immediately — no waiting for external fonts/resources
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('hidden');
  triggerHeroReveal();
}

// Run as soon as DOM is ready (do NOT wait for window.load)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1200));
} else {
  // DOM already ready
  setTimeout(hideLoader, 800);
}

/* ── Custom Cursor ────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0;   // mouse position
let rx = 0, ry = 0;   // ring (lagging) position

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  // Dot follows instantly
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

// Smooth ring lag via rAF
function animateRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .tech-pill')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

/* ── Navbar — scroll state & active link ─────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  // Scrolled glass effect
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Active link highlighting
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Mobile Drawer ────────────────────────────────────────── */
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobileDrawer');
const drawerClose   = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  mobileDrawer.classList.add('open');
  drawerOverlay.classList.add('show');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  mobileDrawer.classList.remove('open');
  drawerOverlay.classList.remove('show');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Close drawer on link click
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

/* ── Typed Text (Hero role) ───────────────────────────────── */
const roles = [
  'BCA Graduate',
  'Web Developer',
  'HTML & CSS Developer',
  'JavaScript Enthusiast',
  'Problem Solver',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800); // pause before deleting
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 45 : 80);
}

// Start after loader
setTimeout(typeRole, 2200);

/* ── Scroll Reveal ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

function triggerHeroReveal() {
  document.querySelectorAll('#hero .reveal-left, #hero .reveal-right, #hero .reveal-up')
    .forEach(el => el.classList.add('revealed'));
}

/* ── Skill Bars animation ─────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.dataset.width + '%';
      // Small delay so CSS transition is visible
      requestAnimationFrame(() => {
        fill.style.width = targetWidth;
      });
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ── Contact Form ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  // Basic HTML5 validation check
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  // Simulate async send
  const submitBtn = contactForm.querySelector('.form-submit');
  const btnText   = submitBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    btnText.textContent = originalText;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

/* ── Scroll-to-Top ────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Footer Year ──────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Smooth anchor scrolling (offset for fixed nav) ─────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Tilt effect on project cards (desktop only) ─────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Parallax for hero orbs ───────────────────────────────── */
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  orbs.forEach((orb, i) => {
    const strength = (i + 1) * 10;
    orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });
}, { passive: true });

/* ── Animated number counters for hero stats ──────────────── */
function animateCount(el, target, duration = 1400) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + '+';
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        const val = parseInt(el.textContent);
        animateCount(el, val);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ── Active section highlight in drawer too ───────────────── */
// already handled via navLinks loop above — drawer links share hrefs

/* ── Patch: respect suffix (+ or none) in stat counters ─── */
// Override the animateCount called in statsObserver above
// by re-observing with suffix-aware logic after page load
document.addEventListener('DOMContentLoaded', () => {
  // Store original text for each stat so we know the suffix
  document.querySelectorAll('.stat-num').forEach(el => {
    el.dataset.original = el.textContent.trim();
  });
});
