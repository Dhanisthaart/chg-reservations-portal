/* ============================================================
   CHG Reservations Standards — script.js
   Capella Ubud, Bali | Internal Portal
   ============================================================ */

/* ─── AUTH CONSTANTS ──────────────────────────────────────── */
const VALID_EMAIL_DOMAIN = '@gmail.com';
const VALID_PASSWORD = 'aptx4869';
const SESSION_KEY = 'chg_auth_session';

/* ─── checkAuth ───────────────────────────────────────────── */
/* Call at top of every inner page to guard against direct access */
function checkAuth() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    // Not logged in — redirect to login
    window.location.replace('index.html');
  }
}

/* ─── handleLogin ─────────────────────────────────────────── */
function handleLogin() {
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errorBox = document.getElementById('loginError');
  const errorMsg = document.getElementById('loginErrorMsg');

  // Clear previous errors
  errorBox.style.display = 'none';

  // Validate
  if (!email || !password) {
    showLoginError('Please enter both email and password.');
    return;
  }

  if (!email.endsWith(VALID_EMAIL_DOMAIN)) {
    showLoginError('Access is restricted to authorized email accounts.');
    return;
  }

  if (password !== VALID_PASSWORD) {
    showLoginError('Incorrect password. Please try again.');
    return;
  }

  // Success — store session and redirect
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loginTime: Date.now() }));
  window.location.href = 'home.html';
}

function showLoginError(msg) {
  const errorBox = document.getElementById('loginError');
  const errorMsg = document.getElementById('loginErrorMsg');
  errorMsg.textContent = msg;
  errorBox.style.display = 'flex';
  // Shake animation
  errorBox.style.animation = 'none';
  errorBox.offsetHeight; // reflow
  errorBox.style.animation = 'shake 0.4s ease';
}

/* ─── handleLogout ────────────────────────────────────────── */
function handleLogout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.replace('index.html');
}

/* ─── togglePassword ──────────────────────────────────────── */
function togglePassword() {
  const input   = document.getElementById('loginPassword');
  const icon    = document.getElementById('pwEyeIcon');
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  icon.className = isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
}

/* ─── toggleNav (mobile) ──────────────────────────────────── */
function toggleNav() {
  document.getElementById('navMenu').classList.toggle('open');
}

/* ─── Allow Enter key on login form ──────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Enter key trigger */
  const pwInput = document.getElementById('loginPassword');
  if (pwInput) {
    pwInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }
  const emailInput = document.getElementById('loginEmail');
  if (emailInput) {
    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  /* Navbar scroll effect */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* Scroll-reveal for content sections */
  const sections = document.querySelectorAll('.content-section');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered reveal
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach(s => observer.observe(s));
  }

  /* Close mobile nav on link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navMenu')?.classList.remove('open');
    });
  });

});

/* ─── Shake keyframe (injected via JS) ───────────────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);
