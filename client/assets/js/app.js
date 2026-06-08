/* =====================================================
   HAKIM ሃኪም — SHARED APP JAVASCRIPT
   Splash · Theme · Particles · Auth
   ===================================================== */
'use strict';

/* -------- SPLASH SCREEN -------- */
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splashScreen');
  if (!splash) return;

  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.classList.add('gone');
      initParticles();
      initFloatingParallax();
    }, 650);
  }, 2600);
});

/* -------- THEME -------- */
const body = document.body;
const savedTheme = localStorage.getItem('hakim-theme') || 'light';
body.setAttribute('data-theme', savedTheme);

document.querySelectorAll('[id="themeToggle"], .theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('hakim-theme', next);
  });
});

/* -------- LANGUAGE TOGGLE — EN / አማ / ORO -------- */

/* Full translation dictionaries */
const TRANSLATIONS = {
  en: {
    /* Navbar */
    liveText:    '3 doctors online',
    /* Profile dropdown */
    joined:      'Joined',
    tracker:     'Tracker',
    language:    'Language',
    editProfile: 'Edit Profile',
    settings:    'Settings',
    helpSupport: 'Help & Support',
    logout:      'Log Out',
    /* Modal */
    fullName:    'Full Name',
    email:       'Email',
    phone:       'Phone',
    saveChanges: 'Save Changes',
    /* Home */
    heroBadge:   "Ethiopia's First Wellness Super-App",
    heroSub:     'How are you feeling today?',
    /* Bottom nav */
    navHome:     'Home',
    navSelam:    'Selam',
    navFarmers:  'Farmers',
    navAI:       'AI Chat',
    navEmergency:'Emergency',
    /* Feature cards */
    aiAdvisor:   'AI Advisor',
    skinScan:    'Skin Scan',
    productTruth:'Product Truth',
    wellbeing:   'Wellbeing Report',
    spa:         'Spa & Resort',
    farmersHealth:'Farmers Health',
    selamCard:   'Selam ሰላም — Pregnancy Companion',
    emergencyCard:'Pregnancy Emergency',
  },
  am: {
    liveText:    '3 ዶክተሮች ኦንላይን ናቸው',
    joined:      'የተቀላቀሉበት',
    tracker:     'መከታተያ',
    language:    'ቋንቋ',
    editProfile: 'መገለጫ አርትዕ',
    settings:    'ቅንብሮች',
    helpSupport: 'እርዳታ',
    logout:      'ውጣ',
    fullName:    'ሙሉ ስም',
    email:       'ኢሜይል',
    phone:       'ስልክ',
    saveChanges: 'ለውጦችን አስቀምጥ',
    heroBadge:   'የኢትዮጵያ የመጀመሪያ ደህንነት አፕ',
    heroSub:     'ዛሬ እንዴት ይሰማዎታል?',
    navHome:     'ቤት',
    navSelam:    'ሰላም',
    navFarmers:  'ሰብሳቢ',
    navAI:       'AI ወኪል',
    navEmergency:'አደጋ',
    aiAdvisor:   'AI አማካሪ',
    skinScan:    'የቆዳ ምርመራ',
    productTruth:'የምርት እውነት',
    wellbeing:   'የጤና ሪፖርት',
    spa:         'ስፓ እና ሪዞርት',
    farmersHealth:'የሰብሳቢ ጤና',
    selamCard:   'ሰላም — የእርግዝና ጓደኛ',
    emergencyCard:'የእርግዝና ድንገተኛ',
  },
  or: {
    liveText:    'Dokitaroonni 3 online jiru',
    joined:      'Galmeesse',
    tracker:     'Hordoffii',
    language:    'Afaan',
    editProfile: 'Profaayila Gulaali',
    settings:    'Qindaa\'ina',
    helpSupport: 'Gargaarsa',
    logout:      'Ba\'i',
    fullName:    'Maqaa Guutuu',
    email:       'Imeelii',
    phone:       'Bilbila',
    saveChanges: 'Jijjiirama Kuusi',
    heroBadge:   'App Fayyaa Jalqabaa Itoophiyaa',
    heroSub:     'Har\'a akkam dhaabbatte?',
    navHome:     'Mana',
    navSelam:    'Nagaa',
    navFarmers:  'Qonnaan',
    navAI:       'AI Marii',
    navEmergency:'Ariifannaa',
    aiAdvisor:   'AI Gorsaa',
    skinScan:    'Qorannoo Gogaa',
    productTruth:'Dhugaa Oomisha',
    wellbeing:   'Gabaasa Fayyaa',
    spa:         'Spa fi Riizoorti',
    farmersHealth:'Fayyaa Qonnaan Bulaa',
    selamCard:   'Nagaa — Hiriyaa Ulfaa',
    emergencyCard:'Ariifannaa Ulfaa',
  },
};

let currentLang = localStorage.getItem('hakim-lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('hakim-lang', lang);

  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  /* 1. Elements with data-i18n attribute */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  /* 2. Specific elements by ID */
  const setById = (id, key) => {
    const el = document.getElementById(id);
    if (el && dict[key]) el.textContent = dict[key];
  };

  setById('liveText',    'liveText');
  setById('heroSub',     'heroSub');

  /* 3. Bottom nav labels */
  const navMap = { home:'navHome', selam:'navSelam', farmers:'navFarmers', ai:'navAI', emergency:'navEmergency' };
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    const screen = btn.dataset.screen;
    const lbl    = btn.querySelector('.bnav-label');
    if (lbl && navMap[screen] && dict[navMap[screen]]) lbl.textContent = dict[navMap[screen]];
  });

  /* 4. Feature card titles */
  const cardMap = {
    'ai':       'aiAdvisor',
    'skin':     'skinScan',
    'product':  'productTruth',
    'report':   'wellbeing',
    'spa':      'spa',
    'farmers':  'farmersHealth',
  };
  document.querySelectorAll('.feature-card').forEach(card => {
    const screen = card.dataset.screen;
    const h3 = card.querySelector('.mod-body h3');
    if (h3 && cardMap[screen] && dict[cardMap[screen]]) h3.textContent = dict[cardMap[screen]];
  });

  /* 5. Hero badge */
  const badge = document.querySelector('.hero-badge');
  if (badge && dict.heroBadge) badge.textContent = '✦ ' + dict.heroBadge;

  /* 6. Selam / Emergency banners */
  const selamH3 = document.querySelector('.selam-banner .selam-text h3');
  if (selamH3 && dict.selamCard) selamH3.textContent = dict.selamCard;
  const emergH3 = document.querySelector('.emergency-banner .emergency-text h3');
  if (emergH3 && dict.emergencyCard) emergH3.textContent = dict.emergencyCard;

  /* 7. Update pdLang in profile dropdown */
  const pdLang = document.getElementById('pdLang');
  if (pdLang) pdLang.textContent = lang.toUpperCase();

  /* 8. html lang attribute */
  document.documentElement.lang = lang === 'am' ? 'am' : lang === 'or' ? 'om' : 'en';
}

/* Wire up language buttons */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    applyLanguage(this.dataset.lang);
  });
});

/* Restore saved language on load */
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('hakim-lang') || 'en';
  const btn = document.querySelector(`.lang-btn[data-lang="${saved}"]`);
  if (btn) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  applyLanguage(saved);
});

/* -------- PARTICLES CANVAS -------- */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(74,222,128,VAL)', 'rgba(212,160,23,VAL)',
    'rgba(34,211,238,VAL)', 'rgba(167,139,250,VAL)', 'rgba(249,168,212,VAL)',
  ];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.5 + 0.7;
      this.vy = -(Math.random() * 0.45 + 0.18);
      this.vx = (Math.random() - 0.5) * 0.28;
      this.opacity = Math.random() * 0.45 + 0.1;
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.color = c.replace('VAL', this.opacity.toFixed(2));
    }
    update() { this.y += this.vy; this.x += this.vx; if (this.y < -10) this.reset(); }
    draw()   { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
  }

  const count = Math.min(80, Math.floor(window.innerWidth / 18));
  const particles = Array.from({ length: count }, () => new Particle());

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* -------- BLOB + FLOATING ICON PARALLAX -------- */
function initFloatingParallax() {
  const blobs = document.querySelectorAll('.blob');
  const floatIcons = document.querySelectorAll('.float-icon');
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  (function tick() {
    blobs.forEach((b, i) => {
      const d = 0.014 + i * 0.007;
      b.style.transform = `translate(${mx * 38 * d}px, ${my * 28 * d}px)`;
    });
    floatIcons.forEach((ic, i) => {
      const d = 0.009 + (i % 4) * 0.007;
      ic.style.transform = `translateX(${mx * 22 * d}px) translateY(${my * 18 * d}px)`;
    });
    requestAnimationFrame(tick);
  })();
}

/* =====================================================
   AUTH PAGE LOGIC (index.html only)
   ===================================================== */
if (document.getElementById('loginPage')) {

  /* --- Particles init (no splash on auth page, init directly) --- */
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { initParticles(); initFloatingParallax(); }, 2700);
  });

  /* --- Stat counters --- */
  function animateCounter(el, target, suffix, dur = 1400) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      animateCounter(el, +el.dataset.target, el.dataset.suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 }).observe
  // init all stat-nums
  ;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      animateCounter(el, +el.dataset.target, el.dataset.suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));

  /* --- Toggle between login / signup --- */
  const loginWrap  = document.getElementById('loginFormWrap');
  const signupWrap = document.getElementById('signupFormWrap');

  function switchToSignup() {
    loginWrap.classList.add('slide-out');
    setTimeout(() => {
      loginWrap.classList.add('hidden');
      loginWrap.classList.remove('slide-out');
      signupWrap.classList.remove('hidden');
      signupWrap.classList.add('slide-in');
      setTimeout(() => signupWrap.classList.remove('slide-in'), 400);
    }, 280);
  }
  function switchToLogin() {
    signupWrap.classList.add('slide-out');
    setTimeout(() => {
      signupWrap.classList.add('hidden');
      signupWrap.classList.remove('slide-out');
      loginWrap.classList.remove('hidden');
      loginWrap.classList.add('slide-in');
      setTimeout(() => loginWrap.classList.remove('slide-in'), 400);
    }, 280);
  }

  document.getElementById('goSignup').addEventListener('click', e => { e.preventDefault(); switchToSignup(); });
  document.getElementById('goLogin') .addEventListener('click', e => { e.preventDefault(); switchToLogin();  });

  /* --- Password show/hide (both forms) --- */
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.closest('.input-wrapper').querySelector('input');
      const pw = btn.closest('.input-wrapper').querySelector('input[type="password"], input[type="text"]');
      if (!pw) return;
      const show = btn.querySelector('.eye-show');
      const hide = btn.querySelector('.eye-hide');
      const isHidden = pw.type === 'password';
      pw.type = isHidden ? 'text' : 'password';
      if (show) show.style.display = isHidden ? 'none' : 'block';
      if (hide) hide.style.display = isHidden ? 'block' : 'none';
    });
  });

  /* --- Password strength (signup) --- */
  const sgPw = document.getElementById('sg-password');
  const sgStrengthWrap = document.getElementById('sg-strengthWrap');
  const sgBars = [document.getElementById('sb1'), document.getElementById('sb2'), document.getElementById('sb3'), document.getElementById('sb4')];
  const sgLabel = document.getElementById('sg-strengthLabel');
  const strengthTexts  = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#f87171', '#fb923c', '#facc15', '#4ade80'];

  if (sgPw) {
    sgPw.addEventListener('input', () => {
      const v = sgPw.value;
      if (!v) { sgStrengthWrap.classList.remove('visible'); return; }
      sgStrengthWrap.classList.add('visible');
      let s = 0;
      if (v.length >= 8)           s++;
      if (/[A-Z]/.test(v))        s++;
      if (/[0-9]/.test(v))        s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      sgBars.forEach((b, i) => { b.className = 'bar'; if (i < s) b.classList.add(`active-${s}`); });
      sgLabel.textContent = strengthTexts[s];
      sgLabel.style.color = strengthColors[s];
    });
  }

  /* --- Validation helpers --- */
  function validateEmail(v) {
    if (!v) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
    return '';
  }
  function validatePassword(v) {
    if (!v) return 'Password is required.';
    if (v.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }
  function validateName(v) {
    if (!v || v.trim().length < 2) return 'Please enter your full name.';
    return '';
  }
  function setField(input, errorEl, validEl, msg) {
    input.classList.remove('error', 'success');
    if (msg) {
      input.classList.add('error');
      errorEl.textContent = msg;
      if (validEl) validEl.textContent = '✗';
    } else if (input.value) {
      input.classList.add('success');
      errorEl.textContent = '';
      if (validEl) validEl.textContent = '✓';
    }
  }

  /* --- LOGIN FORM --- */
  const lgEmail   = document.getElementById('lg-email');
  const lgPw      = document.getElementById('lg-password');
  const lgEmailErr = document.getElementById('lg-emailError');
  const lgEmailVal = document.getElementById('lg-emailValid');
  const lgPwErr    = document.getElementById('lg-pwError');

  lgEmail.addEventListener('blur',  () => setField(lgEmail,  lgEmailErr, lgEmailVal, validateEmail(lgEmail.value)));
  lgEmail.addEventListener('input', () => { if (lgEmail.classList.contains('error')) setField(lgEmail, lgEmailErr, lgEmailVal, validateEmail(lgEmail.value)); });
  lgPw.addEventListener('blur',  () => setField(lgPw, lgPwErr, null, validatePassword(lgPw.value)));
  lgPw.addEventListener('input', () => { if (lgPw.classList.contains('error')) setField(lgPw, lgPwErr, null, validatePassword(lgPw.value)); });

  const loginForm = document.getElementById('loginForm');
  const loginBtn  = document.getElementById('loginBtn');

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const emailErr = validateEmail(lgEmail.value);
    const pwErr    = validatePassword(lgPw.value);
    setField(lgEmail, lgEmailErr, lgEmailVal, emailErr);
    setField(lgPw,    lgPwErr,    null,       pwErr);
    if (emailErr || pwErr) { shake(loginBtn); return; }

    setLoading(loginBtn, true);
    ripple(loginBtn);

    // — API call to backend —
    try {
      const res = await fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: lgEmail.value, password: lgPw.value, remember: document.getElementById('rememberMe').checked })
      });
      if (res.token) {
        localStorage.setItem('hakim-token', res.token);
        localStorage.setItem('hakim-user',  JSON.stringify(res.user));
        setLoading(loginBtn, false);
        showSuccess('Welcome Back! 🌿', 'Loading your dashboard…');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2800);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setLoading(loginBtn, false);
      lgEmailErr.textContent = err.message || 'Login failed. Please try again.';
      shake(loginBtn);
    }
  });

  /* --- SIGNUP FORM --- */
  const signupForm = document.getElementById('signupForm');
  const signupBtn  = document.getElementById('signupBtn');
  const sgName     = document.getElementById('sg-name');
  const sgEmail    = document.getElementById('sg-email');
  const sgPwInput  = document.getElementById('sg-password');
  const sgTerms    = document.getElementById('sg-terms');
  const sgNameErr  = document.getElementById('sg-nameError');
  const sgEmailErr = document.getElementById('sg-emailError');
  const sgEmailVal = document.getElementById('sg-emailValid');
  const sgPwErr    = document.getElementById('sg-pwError');

  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nameErr  = validateName(sgName.value);
    const emailErr = validateEmail(sgEmail.value);
    const pwErr    = validatePassword(sgPwInput.value);
    setField(sgName,    sgNameErr,  null,       nameErr);
    setField(sgEmail,   sgEmailErr, sgEmailVal, emailErr);
    setField(sgPwInput, sgPwErr,    null,       pwErr);
    if (nameErr || emailErr || pwErr) { shake(signupBtn); return; }
    if (!sgTerms.checked) { sgPwErr.textContent = 'Please accept the Terms to continue.'; shake(signupBtn); return; }

    setLoading(signupBtn, true);
    ripple(signupBtn);

    try {
      const res = await fetchAPI('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: sgName.value, email: sgEmail.value,
          password: sgPwInput.value, phone: document.getElementById('sg-phone').value
        })
      });
      if (res.token) {
        localStorage.setItem('hakim-token', res.token);
        localStorage.setItem('hakim-user',  JSON.stringify(res.user));
        setLoading(signupBtn, false);
        showSuccess('Welcome to Hakim! 🌿', 'Setting up your dashboard…');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2800);
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(signupBtn, false);
      sgEmailErr.textContent = err.message || 'Registration failed. Please try again.';
      shake(signupBtn);
    }
  });

  /* --- GUEST BUTTON --- */
  document.getElementById('guestBtn').addEventListener('click', async () => {
    // Get a real demo JWT from the server so AI/tracker endpoints work
    try {
      const res = await fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'guest@hakim.app', password: 'guest123' }),
      });
      localStorage.setItem('hakim-token', res.token);
      localStorage.setItem('hakim-user',  JSON.stringify(res.user));
    } catch (_) {
      // Server offline — store a placeholder; AI will show offline fallback
      localStorage.setItem('hakim-guest', 'true');
      localStorage.removeItem('hakim-token');
      localStorage.setItem('hakim-user', JSON.stringify({ name: 'Guest', email: '' }));
    }
    showSuccess('Welcome, Guest! 🌿', 'Entering Hakim…');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2200);
  });

  /* --- FORGOT PASSWORD --- */
  document.getElementById('forgotLink').addEventListener('click', e => {
    e.preventDefault();
    const link = e.target;
    link.textContent = '📧 Reset email sent!';
    link.style.color = 'var(--clr-gold)';
    setTimeout(() => { link.textContent = 'Forgot password?'; link.style.color = ''; }, 2800);
  });

  /* --- SOCIAL BUTTONS RIPPLE --- */
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      const s = Math.max(rect.width, rect.height);
      Object.assign(r.style, {
        position: 'absolute', width: `${s}px`, height: `${s}px`,
        left: `${e.clientX - rect.left - s / 2}px`, top: `${e.clientY - rect.top - s / 2}px`,
        borderRadius: '50%', background: 'rgba(255,255,255,0.28)', transform: 'scale(0)',
        animation: 'rippleEff 0.5s ease-out forwards', pointerEvents: 'none',
      });
      this.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  });
  const rs = document.createElement('style');
  rs.textContent = '@keyframes rippleEff { to { transform:scale(2.5); opacity:0; } }';
  document.head.appendChild(rs);

  /* --- SUCCESS OVERLAY --- */
  function showSuccess(title, msg) {
    const ov = document.getElementById('successOverlay');
    const t  = document.getElementById('successTitle');
    const m  = document.getElementById('successMsg');
    if (t) t.textContent = title;
    if (m) m.textContent = msg;
    ov.classList.remove('hidden');
    ov.offsetHeight; // reflow
    ov.classList.add('visible');
  }

  /* --- SHAKE HELPER --- */
  const shakeCSS = document.createElement('style');
  shakeCSS.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
  document.head.appendChild(shakeCSS);

  function shake(btn) {
    btn.style.animation = 'shake 0.4s ease';
    btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
  }

  function setLoading(btn, loading) {
    btn.classList.toggle('loading', loading);
    btn.disabled = loading;
  }

  function ripple(btn) {
    btn.classList.add('ripple');
    setTimeout(() => btn.classList.remove('ripple'), 600);
  }

} // end auth page

/* =====================================================
   SHARED API HELPER
   ===================================================== */

/* Auto-detect API base URL:
   - file://  → localhost:5000 (dev, direct file open)
   - localhost → localhost:5000 (dev, served by Node)
   - Vercel    → your Render backend URL
   Set window.HAKIM_API_URL before this script to override. */
const API_BASE = (function () {
  if (window.HAKIM_API_URL) return window.HAKIM_API_URL;
  const host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') {
    return 'http://localhost:5000';
  }
  // Production — your Render backend
  return 'https://hakimbet-1.onrender.com';
})();

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('hakim-token');

  let res;
  try {
    res = await fetch(API_BASE + endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
  } catch (networkErr) {
    throw new Error('Server not reachable. Is the backend running?');
  }

  let data;
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }

  return data;
}

window.fetchAPI = fetchAPI;
