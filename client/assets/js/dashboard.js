/* =====================================================
   HAKIM ሃኪም — DASHBOARD JAVASCRIPT
   ===================================================== */
'use strict';

/* -------- AUTH GUARD -------- */
(function authGuard() {
  const token = localStorage.getItem('hakim-token');
  const guest = localStorage.getItem('hakim-guest');
  // Allow entry if we have a token (real user or guest JWT) OR guest flag
  if (!token && !guest) {
    window.location.href = 'index.html';
  }
})();

/* -------- INIT USER -------- */
const userData = JSON.parse(localStorage.getItem('hakim-user') || '{}');
const heroName = document.getElementById('heroName');
const userInitials = document.getElementById('userInitials');

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

function populateProfileUI() {
  const user = JSON.parse(localStorage.getItem('hakim-user') || '{}');
  const name    = user.name  || 'Guest';
  const email   = user.email || 'guest@hakim.app';
  const phone   = user.phone || '';
  const initials= getInitials(name);
  const isGuest = localStorage.getItem('hakim-guest') === 'true' && !user.email;
  const joined  = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : 'Today';
  const trackerMode = localStorage.getItem('hakim-preg') ? 'Pregnancy' : localStorage.getItem('hakim-period') ? 'Period' : 'None';
  const lang = localStorage.getItem('hakim-lang') || 'en';

  // Avatar
  if (userInitials)         userInitials.textContent = initials;
  if (heroName)             heroName.textContent = name.split(' ')[0];

  // Dropdown
  const pdAvatar = document.getElementById('pdAvatar');
  const pdName   = document.getElementById('pdName');
  const pdEmail  = document.getElementById('pdEmail');
  const pdBadge  = document.getElementById('pdBadge');
  const pdJoined = document.getElementById('pdJoined');
  const pdMode   = document.getElementById('pdMode');
  const pdLang   = document.getElementById('pdLang');

  if (pdAvatar) pdAvatar.textContent = initials;
  if (pdName)   pdName.textContent   = name;
  if (pdEmail)  pdEmail.textContent  = email;
  if (pdBadge)  pdBadge.textContent  = isGuest ? 'Guest' : 'Member';
  if (pdJoined) pdJoined.textContent = joined;
  if (pdMode)   pdMode.textContent   = trackerMode;
  if (pdLang)   pdLang.textContent   = lang.toUpperCase();

  // Modal
  const editName  = document.getElementById('editName');
  const editEmail = document.getElementById('editEmail');
  const editPhone = document.getElementById('editPhone');
  const modalAvatarCircle = document.getElementById('modalAvatarCircle');
  const modalNameBig      = document.getElementById('modalNameBig');
  const modalEmailSm      = document.getElementById('modalEmailSm');

  if (editName)  editName.value  = name !== 'Guest' ? name  : '';
  if (editEmail) editEmail.value = email !== 'guest@hakim.app' ? email : '';
  if (editPhone) editPhone.value = phone;
  if (modalAvatarCircle) modalAvatarCircle.textContent = initials;
  if (modalNameBig)      modalNameBig.textContent      = name;
  if (modalEmailSm)      modalEmailSm.textContent      = email;
}

populateProfileUI();

/* -------- PROFILE DROPDOWN -------- */
const profileWrap   = document.getElementById('profileWrap');
const profileDropdown = document.getElementById('profileDropdown');
const avatarBtn     = document.getElementById('userAvatarBtn');

function openDropdown() {
  profileDropdown.classList.add('open');
  profileDropdown.setAttribute('aria-hidden', 'false');
  avatarBtn.setAttribute('aria-expanded', 'true');
}
function closeDropdown() {
  profileDropdown.classList.remove('open');
  profileDropdown.setAttribute('aria-hidden', 'true');
  avatarBtn.setAttribute('aria-expanded', 'false');
}

avatarBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
});
avatarBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avatarBtn.click(); }
});
document.addEventListener('click', (e) => {
  if (!profileWrap.contains(e.target)) closeDropdown();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDropdown();
});

/* -------- EDIT PROFILE -------- */
const profileModal  = document.getElementById('profileModal');

function openProfileModal() {
  closeDropdown();
  profileModal.classList.remove('hidden');
  profileModal.offsetHeight; // reflow
  profileModal.classList.add('visible');
  document.getElementById('editName').focus();
}
function closeProfileModal() {
  profileModal.classList.remove('visible');
  setTimeout(() => profileModal.classList.add('hidden'), 300);
}

document.getElementById('pdEditProfile').addEventListener('click', openProfileModal);
document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (e) => { if (e.target === profileModal) closeProfileModal(); });

document.getElementById('saveProfileBtn').addEventListener('click', async () => {
  const name  = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const phone = document.getElementById('editPhone').value.trim();

  if (!name) { document.getElementById('editName').focus(); return; }

  const user = JSON.parse(localStorage.getItem('hakim-user') || '{}');
  const updated = { ...user, name, email: email || user.email, phone };
  localStorage.setItem('hakim-user', JSON.stringify(updated));

  // Sync to backend
  try {
    await window.fetchAPI('/api/auth/me', { method: 'GET' }); // verify token still valid
    // In production: PATCH /api/users/profile with updated data
  } catch (_) {}

  populateProfileUI();
  closeProfileModal();

  // Show toast
  if (typeof showToast === 'function') showToast('Profile updated!', '#4ade80');
  else {
    const t = document.createElement('div');
    Object.assign(t.style, {
      position:'fixed', bottom:'90px', left:'50%', transform:'translateX(-50%)',
      background:'var(--card-bg)', border:'1px solid #4ade80', borderRadius:'50px',
      padding:'0.6rem 1.25rem', fontSize:'0.82rem', fontWeight:'600',
      color:'var(--text-primary)', zIndex:'999', boxShadow:'0 8px 24px rgba(74,222,128,0.3)',
    });
    t.textContent = '✓ Profile updated!';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }
});

/* -------- SETTINGS (placeholder) -------- */
document.getElementById('pdSettings').addEventListener('click', () => {
  closeDropdown();
  if (typeof showToast === 'function') showToast('Settings coming soon!', '#d4a017');
});

/* -------- HELP -------- */
document.getElementById('pdHelpBtn').addEventListener('click', () => {
  closeDropdown();
  if (typeof showToast === 'function') showToast('Contact: support@hakim.app', '#22d3ee');
});

/* -------- LOGOUT -------- */
document.getElementById('pdLogout').addEventListener('click', () => {
  closeDropdown();

  // Animate out
  const card = document.querySelector('.dash-layout');
  if (card) { card.style.opacity = '0'; card.style.transform = 'scale(0.97)'; card.style.transition = 'all 0.4s ease'; }

  setTimeout(() => {
    // Clear all session data
    localStorage.removeItem('hakim-token');
    localStorage.removeItem('hakim-guest');
    localStorage.removeItem('hakim-user');
    // Keep theme and language preference
    window.location.href = 'index.html';
  }, 400);
});

/* -------- PARTICLES (init directly — no splash on dashboard) -------- */
window.addEventListener('DOMContentLoaded', () => {
  // shared initParticles is in app.js
  if (typeof initParticles === 'function') initParticles();
  if (typeof initFloatingParallax === 'function') initFloatingParallax();
  initCalendar();
  initStatCounters();
});

/* -------- SCREEN NAVIGATION -------- */
function navigateTo(screenId) {
  // Update screens
  document.querySelectorAll('.dash-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.add('active');

  // Update bottom nav
  document.querySelectorAll('.bnav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === screenId);
  });

  // Scroll to top
  if (target) target.scrollTop = 0;
}

// Bottom nav clicks
document.querySelectorAll('.bnav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

// Feature cards on home
document.querySelectorAll('[data-screen]').forEach(el => {
  if (el.classList.contains('bnav-btn')) return;
  el.addEventListener('click', () => navigateTo(el.dataset.screen));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') navigateTo(el.dataset.screen); });
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.back || 'home'));
});

// Screen-switch buttons (used inside screens)
document.querySelectorAll('[data-screen]').forEach(el => {
  el.addEventListener('click', () => {
    if (el.dataset.screen) navigateTo(el.dataset.screen);
  });
});

/* -------- SELAM TABS -------- */
document.querySelectorAll('.stab').forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.stab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const el = document.getElementById(`stab-${key}`);
    if (el) el.classList.add('active');
  });
});

// Tab-switch buttons inside selam
document.querySelectorAll('[data-tab-switch]').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.tabSwitch;
    document.querySelectorAll('.stab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === key);
    });
    document.querySelectorAll('.stab-content').forEach(c => {
      c.classList.toggle('active', c.id === `stab-${key}`);
    });
  });
});

/* -------- FARMERS TABS -------- */
document.querySelectorAll('.ftab').forEach(tab => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.ftab;
    document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ftab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const el = document.getElementById(`ftab-${key}`);
    if (el) el.classList.add('active');
  });
});

/* -------- AI TOPIC TABS -------- */
document.querySelectorAll('.aitab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.aitab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* -------- MOOD BUTTONS -------- */
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Micro bounce
    this.style.transform = 'scale(1.35)';
    setTimeout(() => { this.style.transform = ''; }, 300);
  });
});

/* -------- SYMPTOM CHIPS -------- */
document.querySelectorAll('.symptom-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});

/* -------- FLOW BUTTONS -------- */
document.querySelectorAll('.flow-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.flow-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

/* -------- OPTION CHIPS -------- */
document.querySelectorAll('.option-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    const group = this.closest('.option-chips');
    if (!group) return;
    group.querySelectorAll('.option-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

/* -------- PREGNANCY / AI TABS -------- */
document.querySelectorAll('.pg-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pg-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

/* -------- SPA GOAL CHIPS (multi-select) -------- */
document.querySelectorAll('#spaGoals .option-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});

/* -------- SAVE SYMPTOM LOG -------- */
const saveSymptomBtn = document.getElementById('saveSymptomBtn');
if (saveSymptomBtn) {
  saveSymptomBtn.addEventListener('click', async () => {
    const selected = [...document.querySelectorAll('.symptom-chip.active')].map(c => c.dataset.sym);
    const flow = document.querySelector('.flow-btn.active')?.textContent || 'None';
    setLoading(saveSymptomBtn, true);
    await delay(1000);
    setLoading(saveSymptomBtn, false);
    saveSymptomBtn.querySelector('.btn-text').textContent = '✓ Log saved!';
    setTimeout(() => { saveSymptomBtn.querySelector('.btn-text').textContent = '💾 Save today\'s log'; }, 2000);

    // — Backend sync —
    try {
      await window.fetchAPI('/api/tracker/symptoms', {
        method: 'POST',
        body: JSON.stringify({ symptoms: selected, flow, date: new Date().toISOString() })
      });
    } catch (_) { /* demo: ignore if backend offline */ }
  });
}

/* -------- SETUP TRACKER -------- */
const setupTrackerBtn = document.getElementById('setupTrackerBtn');
if (setupTrackerBtn) {
  setupTrackerBtn.addEventListener('click', async () => {
    const name = document.getElementById('selamName').value;
    const lmp  = document.getElementById('lmpDate').value;
    setLoading(setupTrackerBtn, true);
    await delay(1200);
    setLoading(setupTrackerBtn, false);
    setupTrackerBtn.querySelector('.btn-text').textContent = '✓ Tracker set up!';
    if (document.getElementById('heroName') && name) document.getElementById('heroName').textContent = name.split(' ')[0];
  });
}

/* -------- SOS BUTTON -------- */
const sosBtn = document.getElementById('sosBtn');
if (sosBtn) {
  let sosActive = false;
  sosBtn.addEventListener('click', async () => {
    if (sosActive) return;
    sosActive = true;
    sosBtn.querySelector('.sos-text').textContent = '🚨 SOS SENT — Help is coming!';
    sosBtn.style.background = 'linear-gradient(135deg,#7f1d1d,#dc2626)';
    animateAmbulance();
    try {
      await window.fetchAPI('/api/emergency/sos', {
        method: 'POST',
        body: JSON.stringify({ lat: 8.9806, lng: 38.7578, type: 'pregnancy' })
      });
    } catch (_) {}
    setTimeout(() => {
      sosBtn.querySelector('.sos-text').textContent = 'SEND SOS — PREGNANCY EMERGENCY';
      sosBtn.style.background = '';
      sosActive = false;
    }, 8000);
  });
}

function animateAmbulance() {
  const amb = document.getElementById('mapAmbulance');
  if (!amb) return;
  let pos = 0;
  const iv = setInterval(() => {
    pos = (pos + 5) % 100;
    amb.style.transform = `translate(${pos}px, ${Math.sin(pos * 0.15) * 15}px)`;
    if (pos >= 95) clearInterval(iv);
  }, 60);
}

/* -------- SKIN SCAN -------- */
const uploadZone = document.getElementById('uploadZone');
const skinPhoto  = document.getElementById('skinPhoto');
if (uploadZone && skinPhoto) {
  uploadZone.addEventListener('click', () => skinPhoto.click());
  skinPhoto.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      uploadZone.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:160px;object-fit:cover;border-radius:14px;" alt="Uploaded"/>`;
    };
    reader.readAsDataURL(file);
  });
}

/* Skin scan and product truth handled in AI section above */

/* -------- WELLBEING REPORT -------- */
const reportForm   = document.getElementById('reportForm');
const reportResult = document.getElementById('reportResult');
if (reportForm) {
  reportForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = reportForm.querySelector('.primary-btn');
    setLoading(btn, true);
    await delay(2000);
    setLoading(btn, false);
    const age    = document.getElementById('rAge').value    || '25';
    const gender = document.getElementById('rGender').value || 'Female';
    const weight = document.getElementById('rWeight').value || '60';
    const height = document.getElementById('rHeight').value || '165';
    const goal   = document.getElementById('rGoal').value   || 'Maintain health';
    const bmi    = (weight / ((height / 100) ** 2)).toFixed(1);
    document.getElementById('wellnessPlan').innerHTML = `<p>BMI: <strong>${bmi}</strong> — ${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}. Focus: <em>${goal}</em>.</p><p style="margin-top:.4rem">Drink 2L water daily. Sleep 7–8 hours. Meditate 10 min daily.</p>`;
    document.getElementById('nutritionPlan').innerHTML = `<p>Daily calories: ~${Math.round(weight * (goal.includes('Lose') ? 28 : goal.includes('Gain') ? 38 : 33))} kcal. Protein: ${Math.round(weight * 1.4)}g. Carbs: 50%. Fats: 25%.</p>`;
    document.getElementById('exercisePlan').innerHTML  = `<p>${goal.includes('Lose') ? 'Cardio 4×/wk (30 min) + strength 2×/wk' : goal.includes('Muscle') ? 'Strength training 4×/wk, progressive overload' : 'Walk 30 min/day + stretching 3×/wk'}.</p>`;
    document.getElementById('mealPlan').innerHTML      = '<p>🌅 <strong>Breakfast:</strong> Teff firfir with ayib + black coffee.<br>🌞 <strong>Lunch:</strong> Injera with shiro wot + gomen.<br>🌙 <strong>Dinner:</strong> Misir wot with brown teff injera + salad.</p>';
    reportResult.classList.remove('hidden');
    reportResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

document.getElementById('recalcBtn')?.addEventListener('click', () => {
  reportResult.classList.add('hidden');
  reportForm.scrollIntoView({ behavior: 'smooth' });
});

/* -------- SPA -------- */
const findPackageBtn = document.getElementById('findPackageBtn');
const spaPackages    = document.getElementById('spaPackages');
if (findPackageBtn) {
  findPackageBtn.addEventListener('click', async () => {
    setLoading(findPackageBtn, true);
    await delay(1400);
    setLoading(findPackageBtn, false);
    spaPackages.classList.remove('hidden');
    spaPackages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

const confirmBookingBtn = document.getElementById('confirmBookingBtn');
if (confirmBookingBtn) {
  confirmBookingBtn.addEventListener('click', async () => {
    const date = document.getElementById('checkinDate').value;
    if (!date) { confirmBookingBtn.querySelector('.btn-text').textContent = '⚠️ Select a date first'; setTimeout(() => { confirmBookingBtn.querySelector('.btn-text').textContent = '✅ Confirm booking'; }, 2000); return; }
    setLoading(confirmBookingBtn, true);
    await delay(1600);
    setLoading(confirmBookingBtn, false);
    confirmBookingBtn.querySelector('.btn-text').textContent = '✅ Booking confirmed!';
    confirmBookingBtn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
  });
}

/* =====================================================
   AI CHAT — OpenRouter powered
   ===================================================== */

/* Shared message renderer */
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(22,163,74,0.12);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>');
}

/* Build a chat instance — returns a sendMessage function */
function buildChat(inputId, sendId, messagesId, apiEndpoint, context) {
  const input    = document.getElementById(inputId);
  const sendBtn  = document.getElementById(sendId);
  const messages = document.getElementById(messagesId);
  if (!input || !sendBtn || !messages) return null;

  // Conversation history for this chat (sent to backend for context)
  const history = [];

  function addMessage(text, isUser) {
    const msg  = document.createElement('div');
    msg.className = `ai-msg ${isUser ? 'user' : 'ai'}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.innerHTML = `
      <div class="msg-avatar">${isUser ? '👤' : '🌿'}</div>
      <div class="msg-bubble">${renderMarkdown(text)}<span class="msg-time">${time}</span></div>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'ai-msg ai typing-indicator';
    t.innerHTML = '<div class="msg-avatar">🌿</div><div class="typing-bubble"><span></span><span></span><span></span></div>';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
    return t;
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    addMessage(text, true);
    input.value    = '';
    sendBtn.disabled = true;

    // Append to local history
    history.push({ role: 'user', content: text });

    const typing = showTyping();

    try {
      const res = await window.fetchAPI(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          context,
          history: history.slice(-8),
        }),
      });

      typing.remove();
      const reply = res.reply || '🌿 Selam! I could not generate a response. Please try again.';
      history.push({ role: 'assistant', content: reply });
      addMessage(reply, false);

    } catch (err) {
      typing.remove();
      console.warn('AI error:', err.message);
      const fallback = offlineFallback(text);
      history.push({ role: 'assistant', content: fallback });
      addMessage(fallback, false);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Wire send button + Enter key
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
  });

  return sendMessage;
}

/* ---- Offline fallback when server unreachable ---- */
function offlineFallback(text) {
  const t = text.toLowerCase();
  if (t.includes('pregnant') || t.includes('pregnancy') || t.includes('ወር'))
    return '🤱 For pregnancy care: take iron + folic acid daily, drink 2L water, attend all prenatal checkups. Use the **Selam ሰላም** tab. Call **907** for emergencies.';
  if (t.includes('skin') || t.includes('acne') || t.includes('ቆዳ'))
    return '✨ Ethiopian skin care: **Niter Kibbeh** as night moisturizer, **turmeric + honey mask** 2×/week, **black seed oil** for acne. Avoid hydroquinone bleaching creams.';
  if (t.includes('malaria') || t.includes('fever') || t.includes('ትኩሳት'))
    return '🦟 If you have fever + chills + headache after outdoor work, visit a health post within **24 hours** — could be malaria. Call **907** if severe.';
  if (t.includes('food') || t.includes('eat') || t.includes('ምግብ'))
    return '🥗 Top Ethiopian wellness foods: **teff injera** (iron), **misir wot** (protein), **gomen** (calcium), **berbere** (anti-inflammatory). Try our **Wellbeing Report** for a personal plan.';
  if (t.includes('stress') || t.includes('anxiety') || t.includes('ጭንቀት'))
    return '🧘 Ethiopian stress relief: **buna ceremony**, **tikur azmud tea**, **koseret tea**, 4-7-8 breathing. Community connection is deeply healing.';
  if (t.includes('back') || t.includes('pain') || t.includes('ህመም'))
    return '💪 For back pain: stretch before work, bend knees when lifting, apply warm ginger-turmeric compress. See a health worker if pain persists more than 3 days.';
  return '🌿 Selam! I\'m having trouble connecting to the server. Please ensure the backend is running (`npm start`) or check your internet connection. 💚';
}

/* ---- Init main AI chat ---- */
const mainSend = buildChat('aiInput', 'aiSend', 'aiMessages', '/api/ai/chat', 'general');

/* ---- Suggestion chips → main chat ---- */
document.querySelectorAll('#aiSuggestions .ai-suggestion').forEach(chip => {
  chip.addEventListener('click', () => {
    if (mainSend) mainSend(chip.textContent.trim());
  });
});

/* ---- Init farmers AI chat ---- */
const farmersSend = buildChat('farmersInput', 'farmersSend', 'farmersMessages', '/api/ai/farmers', 'farmers');

/* ---- Farmers suggestion chips ---- */
document.querySelectorAll('.ftab-content .ai-suggestion').forEach(chip => {
  chip.addEventListener('click', () => {
    if (farmersSend) farmersSend(chip.textContent.trim());
  });
});

/* ---- Skin Scan — AI analysis call ---- */
const analyzeSkinBtn = document.getElementById('analyzeSkinBtn');
const skinResult     = document.getElementById('skinResult');
if (analyzeSkinBtn) {
  analyzeSkinBtn.addEventListener('click', async () => {
    setLoading(analyzeSkinBtn, true);

    const area    = document.querySelector('.skin-option-group:first-child .option-chip.active')?.textContent || 'face';
    const concern = document.querySelector('.skin-option-group:last-child .option-chip.active')?.textContent  || 'general';

    try {
      const res = await window.fetchAPI('/api/ai/skin', {
        method: 'POST',
        body: JSON.stringify({ area, concern, skinType: 'melanin-rich Ethiopian skin' }),
      });
      // Inject AI reply into the recommendations section
      const recEl = skinResult.querySelector('.skin-recs');
      if (recEl && res.reply) {
        recEl.innerHTML = `<h4>🌿 AI recommendations</h4><p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">${renderMarkdown(res.reply)}</p>`;
      }
    } catch (_) {
      // keep static demo content
    }

    setLoading(analyzeSkinBtn, false);
    skinResult.classList.remove('hidden');
    skinResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ---- Product Truth — AI analysis call ---- */
const analyzeProductBtn = document.getElementById('analyzeProductBtn');
const productResult     = document.getElementById('productResult');
const productSearch     = document.getElementById('productSearch');
if (analyzeProductBtn) {
  analyzeProductBtn.addEventListener('click', async () => {
    const name = productSearch?.value?.trim() || 'Unknown Product';
    setLoading(analyzeProductBtn, true);

    const pn = document.getElementById('productName');
    if (pn) pn.textContent = name;

    try {
      const skinType = document.querySelector('.option-chip.active')?.textContent || 'melanin-rich skin';
      const res = await window.fetchAPI('/api/ai/product', {
        method: 'POST',
        body: JSON.stringify({ productName: name, skinType }),
      });
      // Inject AI analysis
      const verdictEl = productResult.querySelector('.product-verdict');
      if (verdictEl && res.reply) {
        verdictEl.innerHTML = `
          <div class="verdict-header">
            <h3>${name}</h3>
            <span class="verdict-badge warn">⚠️ AI Analysis</span>
          </div>
          <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.65;margin-top:0.5rem">
            ${renderMarkdown(res.reply)}
          </div>`;
      }
    } catch (_) {
      // keep static demo content
    }

    setLoading(analyzeProductBtn, false);
    productResult.classList.remove('hidden');
    productResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* -------- MINI CALENDAR -------- */
function initCalendar() {
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calMonthLabel');
  if (!grid) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  if (label) label.textContent = `${monthNames[month]} ${year}`;

  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  dayNames.forEach(d => {
    const dn = document.createElement('div');
    dn.className = 'cal-day-name';
    dn.textContent = d;
    grid.appendChild(dn);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty slots
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }

  // Period days (simulated — days 1-5)
  const periodDays = [1, 2, 3, 4, 5];
  // Fertile days (days 12-16)
  const fertileDays = [12, 13, 14, 15, 16];
  // Ovulation (day 14)
  const ovulationDay = 14;

  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = d;
    if (d === today.getDate()) day.classList.add('today');
    else if (d === ovulationDay) day.classList.add('ovulation');
    else if (fertileDays.includes(d)) day.classList.add('fertile');
    else if (periodDays.includes(d)) day.classList.add('period');
    day.addEventListener('click', () => {
      document.querySelectorAll('.cal-day').forEach(c => c.style.outline = '');
      day.style.outline = '2px solid var(--clr-gold)';
    });
    grid.appendChild(day);
  }
}

/* -------- STAT COUNTERS (home) -------- */
function initStatCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (!el.dataset.target) return;
      let start = performance.now();
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      (function tick(now) {
        const p = Math.min((now - start) / 1400, 1);
        const v = target * (1 - Math.pow(1 - p, 3));
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => obs.observe(el));
}

/* -------- NOTIFICATION-STYLE LIVE UPDATES (demo) -------- */
const liveMessages = [
  '3 doctors online now',
  'AI analyzing 47 wellness plans',
  'New: Farmers Health updated',
  '2 ambulances on standby',
  '12 women in Selam tracker today',
];
let liveIdx = 0;
setInterval(() => {
  liveIdx = (liveIdx + 1) % liveMessages.length;
  const el = document.querySelector('.live-indicator span');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = liveMessages[liveIdx]; el.style.opacity = '1'; el.style.transition = 'opacity 0.5s'; }, 300);
  }
}, 4000);

/* -------- SPA GOAL CHIPS (allow multi) -------- */
// Already handled above via option-chip handler

/* -------- HELPERS -------- */
function setLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* -------- CALL BUTTONS -------- */
document.querySelectorAll('.call-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.textContent;
    btn.textContent = '📞 Calling…';
    btn.style.background = 'rgba(22,163,74,0.2)';
    setTimeout(() => { btn.textContent = text; btn.style.background = ''; }, 2500);
  });
});

/* -------- BOOK CONSULTATION -------- */
document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const original = this.textContent;
    this.textContent = '✓ Booked!';
    this.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
    setTimeout(() => { this.textContent = original; this.style.background = ''; }, 2500);
  });
});

/* -------- MOD CARD HOVER TILT -------- */
document.querySelectorAll('.mod-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
