// ===== CINEMATIC LOADER =====
window.addEventListener('load', () => {
  const fill    = document.getElementById('loaderFill');
  const pct     = document.getElementById('loaderPct');
  const loader  = document.getElementById('loader');
  const curtain = document.getElementById('loaderCurtain');
  let p = 0;

  // Progress bar fills up over ~2.2s
  const iv = setInterval(() => {
    p += Math.random() * 12 + 4;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);

      // Small pause at 100%, then do curtain wipe exit
      setTimeout(() => {
        if (curtain) curtain.classList.add('wipe');
        setTimeout(() => {
          if (loader) loader.classList.add('hidden');
        }, 700);
      }, 400);
    }
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.floor(p) + '%';
  }, 90);
});

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== SMOOTH NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.ski-fill').forEach((bar, i) => {
        const w = bar.getAttribute('data-w');
        setTimeout(() => { bar.style.width = w + '%'; }, i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.skill-block').forEach(el => skillObserver.observe(el));

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

function showStatus(type, msg) {
  if (!statusEl) return;
  statusEl.className = 'form-status show ' + type;
  statusEl.textContent = msg;
}
function clearStatus() {
  if (!statusEl) return;
  statusEl.className = 'form-status';
  statusEl.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    const nameEl = document.getElementById('senderName');
    const emailEl = document.getElementById('senderEmail');
    const msgEl = document.getElementById('message');

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg = msgEl.value.trim();

    // Remove old errors
    [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('error'));

    // Validate
    let hasError = false;
    if (!name) { nameEl.classList.add('error'); hasError = true; }
    if (!email || !validateEmail(email)) { emailEl.classList.add('error'); hasError = true; }
    if (!msg) { msgEl.classList.add('error'); hasError = true; }
    if (hasError) {
      showStatus('error', 'Please fill in all fields correctly.');
      return;
    }

    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    // EmailJS integration — replace the three IDs below with your real keys
    const PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
    const SERVICE_ID  = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

    if (PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Demo mode — simulate success for preview
      setTimeout(() => {
        showStatus('success', '✅ Message sent! Hariharasudhan will get back to you soon.');
        form.reset();
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1200);
      return;
    }

    try {
      // Load EmailJS if not loaded
      if (typeof emailjs === 'undefined') {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        emailjs.init(PUBLIC_KEY);
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: msg,
        to_email: 'hhariharasudhan523@gmail.com'
      });

      showStatus('success', '✅ Message sent! Hariharasudhan will get back to you soon.');
      form.reset();
    } catch (err) {
      console.error(err);
      showStatus('error', '❌ Something went wrong. Please email directly: hhariharasudhan523@gmail.com');
    } finally {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}
