/* =====================================================
   HAKIM — SELAM SCREEN ENGINE
   Pregnancy Tracker + Period Tracker
   Full calculation, calendar, insights, animations
   ===================================================== */
'use strict';

/* ═══════════════════════════════════════════════════
   BABY SIZE DATA (by week)
   ═══════════════════════════════════════════════════ */
const BABY_DATA = {
  4:  { emoji:'🫘', title:'Poppy seed',      size:'1–2 mm',  desc:'A tiny cluster of cells is forming — the beginning of everything.' },
  6:  { emoji:'🫐', title:'Blueberry',       size:'6 mm',    desc:'Brain and spinal cord are forming. Heart begins to beat.' },
  8:  { emoji:'🫒', title:'Olive',           size:'1.6 cm',  desc:'Fingers and toes are forming. Facial features are developing.' },
  10: { emoji:'🍓', title:'Strawberry',      size:'3 cm',    desc:'All vital organs are developing. Baby can make tiny movements.' },
  12: { emoji:'🍋', title:'Lime',            size:'5 cm',    desc:'Baby has fingernails and can suck their thumb.' },
  14: { emoji:'🍑', title:'Peach',           size:'8 cm',    desc:'Baby can make facial expressions. Kidneys are producing urine.' },
  16: { emoji:'🥑', title:'Avocado',         size:'12 cm',   desc:'Baby hears sounds and may respond to your voice.' },
  18: { emoji:'🍠', title:'Sweet potato',    size:'14 cm',   desc:'Baby is very active — you may feel first kicks soon.' },
  20: { emoji:'🍌', title:'Banana',          size:'16 cm',   desc:'Halfway there! Baby has well-defined sleep and wake cycles.' },
  22: { emoji:'🌽', title:'Corn',            size:'27 cm',   desc:'Baby can hear clearly and responds to sounds. Eyebrows forming.' },
  24: { emoji:'🌽', title:'Corn',            size:'30 cm',   desc:'Baby\'s lungs are developing rapidly. Skin is becoming smoother.' },
  26: { emoji:'🥬', title:'Lettuce head',    size:'35 cm',   desc:'Eyes can open and close. Brain activity increasing rapidly.' },
  28: { emoji:'🍆', title:'Eggplant',        size:'37 cm',   desc:'Third trimester! Baby can dream during REM sleep.' },
  30: { emoji:'🥦', title:'Broccoli head',   size:'40 cm',   desc:'Baby\'s brain is growing fast. Bones are hardening.' },
  32: { emoji:'🎃', title:'Small pumpkin',   size:'43 cm',   desc:'Baby practices breathing. All five senses are developed.' },
  34: { emoji:'🍈', title:'Honeydew melon',  size:'45 cm',   desc:'Baby gains about 200g per week now. Immune system strengthening.' },
  36: { emoji:'🥥', title:'Coconut',         size:'47 cm',   desc:'Baby is almost full-term. Lungs nearly mature.' },
  38: { emoji:'🎂', title:'Small watermelon',size:'49 cm',   desc:'Baby is ready! Position is likely head-down for birth.' },
  40: { emoji:'🍉', title:'Full watermelon', size:'51 cm',   desc:'Full term! Average weight is around 3.4 kg. Ready to meet you!' },
  42: { emoji:'🍉', title:'Watermelon',      size:'51+ cm',  desc:'Post-dates pregnancy. Stay in close contact with your health team.' },
};

function getBabyData(week) {
  const keys = Object.keys(BABY_DATA).map(Number).sort((a,b)=>a-b);
  let best = keys[0];
  for (const k of keys) { if (week >= k) best = k; }
  return BABY_DATA[best];
}

/* ═══════════════════════════════════════════════════
   WEEKLY INSIGHTS (by week ranges)
   ═══════════════════════════════════════════════════ */
const WEEKLY_INSIGHTS = {
  '1-4':   ['Your pregnancy is just beginning — congratulations!', 'Take folic acid (400 mcg) every day — it\'s critical now.', 'Avoid alcohol, smoking, and raw meat completely.', 'Schedule your first prenatal visit as soon as possible.'],
  '5-8':   ['Morning sickness may peak this week — ginger tea helps.', 'Your blood volume is increasing. Stay well hydrated.', 'Small, frequent meals of teff and ayib are ideal now.', 'Fatigue is normal — rest as much as you can.'],
  '9-12':  ['First trimester ends soon. Risk of miscarriage drops significantly.', 'Book your 12-week scan (nuchal translucency) if you haven\'t.', 'Your uterus is now the size of a grapefruit.', 'Start gentle prenatal stretching if your health worker approves.'],
  '13-16': ['Welcome to the second trimester — many women feel much better!', 'Energy often returns. Take advantage with gentle walks.', 'Eat iron-rich foods: gomen, misir, and teff injera daily.', 'You may start to show a baby bump soon.'],
  '17-20': ['Baby can now hear — talk and sing to your baby!', 'You may feel first movements (quickening) this week.', 'Sleep on your left side to improve circulation.', 'Schedule your anatomy scan at week 20.'],
  '21-24': ['Baby is very active. Track daily kick counts if advised.', 'Back pain may start — practice good posture.', 'Drink 10 glasses of water daily. Your blood volume is highest now.', 'Consider a pregnancy massage for back and hip relief.'],
  '25-28': ['Third trimester approaching. Begin birth plan discussions.', 'Glucose tolerance test is recommended this week.', 'Leg cramps are common — increase calcium and magnesium.', 'Pack your hospital bag soon.'],
  '29-32': ['Baby is gaining weight rapidly — increase healthy calories.', 'Braxton Hicks contractions may begin. They are normal.', 'Sleep may be difficult — try a pregnancy pillow.', 'Attend all prenatal appointments without fail.'],
  '33-36': ['Baby is getting into birth position. Check with your midwife.', 'Colostrum (first milk) may begin to leak — this is normal.', 'Avoid long travel. Stay close to your delivery facility.', 'Group B strep test is recommended at week 35-36.'],
  '37-42': ['Full term! Baby can arrive any day.', 'Watch for signs of labor: regular contractions, water breaking.', 'Eat well and rest. Your body is preparing for birth.', 'Call your health worker immediately if labor begins.'],
};

function getInsights(week) {
  for (const range of Object.keys(WEEKLY_INSIGHTS)) {
    const [a,b] = range.split('-').map(Number);
    if (week >= a && week <= b) return WEEKLY_INSIGHTS[range];
  }
  return ['Stay in contact with your health care provider.'];
}

const HEALTH_TIPS = [
  { icon:'💊', title:'Iron + Folic Acid', text:'Take iron and folic acid tablets from your health post every day.' },
  { icon:'💧', title:'Stay Hydrated',     text:'Drink at least 8–10 glasses of water daily during pregnancy.' },
  { icon:'🥗', title:'Eat Well',          text:'Teff injera, misir, gomen, and ayib — your daily Ethiopian wellness plate.' },
  { icon:'🚶', title:'Gentle Movement',   text:'Walk 20–30 minutes daily unless your doctor advises rest.' },
  { icon:'😴', title:'Rest Well',         text:'Sleep 8–9 hours. Sleep on your left side after week 20.' },
  { icon:'🏥', title:'Attend Checkups',   text:'Never skip prenatal appointments — they protect both you and baby.' },
];

/* ═══════════════════════════════════════════════════
   PRENATAL MILESTONES
   ═══════════════════════════════════════════════════ */
const PRENATAL_MILESTONES = [
  { week: 8,  desc: 'First prenatal visit · Blood tests · Weight check' },
  { week: 12, desc: 'Nuchal translucency scan · First trimester screen' },
  { week: 16, desc: 'Blood tests · Check baby heartbeat' },
  { week: 20, desc: 'Anatomy scan — detailed ultrasound' },
  { week: 24, desc: 'Fundal height measurement · Iron check' },
  { week: 28, desc: 'Glucose tolerance test · Rh factor check' },
  { week: 32, desc: 'Growth scan · Birth plan discussion' },
  { week: 36, desc: 'Group B strep test · Position check' },
  { week: 38, desc: 'Weekly checks begin · Hospital bag ready' },
  { week: 40, desc: 'Due date! Contact health worker immediately if labor begins' },
];

/* ═══════════════════════════════════════════════════
   PERIOD INSIGHTS (by cycle day)
   ═══════════════════════════════════════════════════ */
function getPeriodInsights(dayOfCycle, cycleLen, periodDur, daysToNextPeriod, daysToOvulation) {
  const msgs = [];
  if (dayOfCycle <= periodDur) {
    msgs.push(`Your period is active — day ${dayOfCycle}. Rest and warmth are your best friends today.`);
    msgs.push('Drink warm koseret or ginger tea to ease cramps naturally.');
    msgs.push('Iron-rich foods like misir and gomen help replace nutrients.');
  } else if (daysToOvulation <= 3 && daysToOvulation >= 0) {
    msgs.push(`Ovulation window is here! Your most fertile days are now.`);
    msgs.push('Energy and confidence often peak during ovulation — great time to be active.');
    msgs.push('If trying to conceive, this is your optimal window.');
  } else if (daysToNextPeriod <= 5) {
    msgs.push(`Your next period may begin in about ${daysToNextPeriod} days.`);
    msgs.push('PMS symptoms like mood changes and bloating may increase.');
    msgs.push('Rest well, reduce salt intake, and stay hydrated. Tena adam tea can help with headaches.');
  } else if (dayOfCycle <= Math.floor(cycleLen / 2)) {
    msgs.push(`Day ${dayOfCycle} — Follicular phase. Estrogen is rising and energy is building.`);
    msgs.push('Good time for exercise, planning, and social activities.');
    msgs.push('Hydration and rest are recommended today.');
  } else {
    msgs.push(`Day ${dayOfCycle} — Luteal phase. Progesterone is dominant.`);
    msgs.push('You may feel calmer but more tired. Honor your body\'s need for rest.');
    msgs.push('Magnesium-rich foods (sesame, pumpkin seeds) help with PMS symptoms.');
  }
  if (daysToNextPeriod > 0) {
    msgs.push(`Next cycle expected in ${daysToNextPeriod} days.`);
  }
  return msgs;
}

/* ═══════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════ */
let selamMode = 'pregnancy'; // 'pregnancy' | 'period'
let pregData  = null;
let periodData = null;
let pregCalDate   = new Date();
let periodCalDate = new Date();
let appointments  = JSON.parse(localStorage.getItem('hakim-appts') || '[]');
let waterCount    = 0;

/* Load saved data */
const savedPreg   = localStorage.getItem('hakim-preg');
const savedPeriod = localStorage.getItem('hakim-period');
if (savedPreg)   pregData   = JSON.parse(savedPreg);
if (savedPeriod) periodData = JSON.parse(savedPeriod);

/* ═══════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initModeSwitch();
  initPregSetup();
  initPeriodSetup();
  initWaterTracker();
  initAppointments();
  initReminders();
  initPeriodSymptoms();

  // Auto-restore saved trackers
  if (pregData) {
    document.getElementById('pregSetupPanel').classList.add('hidden');
    document.getElementById('pregView').classList.add('visible');
    renderPregDashboard(pregData);
  }
  if (periodData && selamMode === 'period') {
    document.getElementById('periodSetupPanel').classList.add('hidden');
    document.getElementById('periodView').classList.add('visible');
    renderPeriodDashboard(periodData);
  }
});

/* ═══════════════════════════════════════════════════
   MODE SWITCH
   ═══════════════════════════════════════════════════ */
function initModeSwitch() {
  const mPreg   = document.getElementById('modePregnancy');
  const mPeriod = document.getElementById('modePeriod');

  mPreg.addEventListener('click',   () => switchMode('pregnancy'));
  mPeriod.addEventListener('click', () => switchMode('period'));
  mPreg.addEventListener('keydown',   e => { if (e.key==='Enter'||e.key===' ') switchMode('pregnancy'); });
  mPeriod.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') switchMode('period'); });
}

function switchMode(mode) {
  selamMode = mode;
  document.getElementById('modePregnancy').classList.toggle('active', mode==='pregnancy');
  document.getElementById('modePeriod').classList.toggle('active',    mode==='period');

  // Panels
  const pregSetup   = document.getElementById('pregSetupPanel');
  const periodSetup = document.getElementById('periodSetupPanel');
  const pregView    = document.getElementById('pregView');
  const periodView  = document.getElementById('periodView');

  if (mode === 'pregnancy') {
    pregSetup.classList.toggle('hidden', !!pregData);
    periodSetup.classList.add('hidden');
    pregView.classList.toggle('visible', !!pregData);
    periodView.classList.remove('visible');
  } else {
    periodSetup.classList.toggle('hidden', !!periodData);
    pregSetup.classList.add('hidden');
    periodView.classList.toggle('visible', !!periodData);
    pregView.classList.remove('visible');
    if (periodData) renderPeriodDashboard(periodData);
  }
}

/* ═══════════════════════════════════════════════════
   PREGNANCY SETUP
   ═══════════════════════════════════════════════════ */
function initPregSetup() {
  document.getElementById('startPregTracker').addEventListener('click', () => {
    const name    = document.getElementById('pregName').value.trim();
    const age     = +document.getElementById('pregAge').value || 0;
    const lmpRaw  = document.getElementById('pregLmpDate').value;
    const weekIn  = +document.getElementById('pregCurrentWeek').value || 0;

    if (!name) { alert('Please enter your name.'); return; }

    const today = new Date();
    let lmpDate, currentWeek, dueDate;

    if (lmpRaw) {
      lmpDate = new Date(lmpRaw);
      const diffDays = Math.floor((today - lmpDate) / (1000*60*60*24));
      currentWeek = Math.max(1, Math.min(42, Math.floor(diffDays / 7)));
    } else if (weekIn) {
      currentWeek = weekIn;
      lmpDate = new Date(today);
      lmpDate.setDate(lmpDate.getDate() - currentWeek * 7);
    } else {
      alert('Please enter either your LMP date or current week.'); return;
    }

    dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

    pregData = { name, age, lmpDate: lmpDate.toISOString(), dueDate: dueDate.toISOString(), currentWeek };
    localStorage.setItem('hakim-preg', JSON.stringify(pregData));

    document.getElementById('pregSetupPanel').classList.add('hidden');
    document.getElementById('pregView').classList.add('visible');
    renderPregDashboard(pregData);
  });

  document.getElementById('editPregBtn').addEventListener('click', () => {
    pregData = null;
    localStorage.removeItem('hakim-preg');
    document.getElementById('pregView').classList.remove('visible');
    document.getElementById('pregSetupPanel').classList.remove('hidden');
  });
}

/* ═══════════════════════════════════════════════════
   RENDER PREGNANCY DASHBOARD
   ═══════════════════════════════════════════════════ */
function renderPregDashboard(data) {
  const today      = new Date();
  const lmp        = new Date(data.lmpDate);
  const due        = new Date(data.dueDate);
  const diffDays   = Math.floor((today - lmp) / (1000*60*60*24));
  const week       = Math.max(1, Math.min(42, Math.floor(diffDays / 7)));
  const totalDays  = 280;
  const daysElapsed= Math.floor((today - lmp) / (1000*60*60*24));
  const daysLeft   = Math.max(0, Math.floor((due - today) / (1000*60*60*24)));
  const pct        = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
  const trimester  = week <= 13 ? 1 : week <= 26 ? 2 : 3;

  // Circle progress (circumference ≈ 2π×70 ≈ 440)
  const offset = 440 - (440 * pct / 100);
  const fillEl = document.getElementById('pregCircleFill');
  if (fillEl) setTimeout(() => { fillEl.style.strokeDashoffset = offset; }, 200);

  // Text updates
  setText('pregWeekDisplay',  week);
  setText('pregNameDisplay',  data.name + ' 🌸');
  setText('pregDueDate',      fmtDate(due));
  setText('pregDaysLeft',     daysLeft + 'd');
  setText('pregPercent',      pct + '%');
  setText('insightWeekLabel', `Week ${week} Insights`);
  setText('timelineMidLabel', `Week ${week}`);

  // Trimester badge
  const tb = document.getElementById('trimesterBadge');
  if (tb) {
    tb.textContent = `Trimester ${trimester}`;
    tb.className = `trimester-badge t${trimester}`;
  }

  // Baby info
  const baby = getBabyData(week);
  setText('babyEmoji',   baby.emoji);
  setText('babyTitle',   `Week ${week} — ${baby.title}`);
  setText('babyDesc',    baby.desc);
  setText('babySizePill', baby.size);

  // Insights
  const insightList = document.getElementById('pregInsightList');
  if (insightList) {
    insightList.innerHTML = getInsights(week).map(i => `<li>${i}</li>`).join('');
  }

  // Health tips
  const tipsEl = document.getElementById('pregHealthTips');
  if (tipsEl) {
    tipsEl.innerHTML = HEALTH_TIPS.slice(0, 4).map(t => `
      <div class="health-tip-card">
        <span class="ht-icon">${t.icon}</span>
        <div class="ht-title">${t.title}</div>
        <div class="ht-text">${t.text}</div>
      </div>`).join('');
  }

  // Timeline
  const pctTimeline = Math.min(100, pct);
  const tfill = document.getElementById('pregTimelineFill');
  if (tfill) setTimeout(() => { tfill.style.width = pctTimeline + '%'; }, 300);

  const milestoneEl = document.getElementById('timelineMilestones');
  if (milestoneEl) {
    milestoneEl.innerHTML = PRENATAL_MILESTONES.map(m => {
      const status = m.week < week ? 'done' : m.week === week ? 'current' : 'upcoming';
      const icon   = status === 'done' ? '✓' : status === 'current' ? 'Now' : '';
      return `<div class="milestone-item ${status}">
        <span class="milestone-week">Week ${m.week}</span>
        <span class="milestone-desc">${m.desc}</span>
        <span class="milestone-status">${icon}</span>
      </div>`;
    }).join('');
  }

  // Calendars
  renderPregCalendar(pregCalDate, lmp, due, week);
}

/* ═══════════════════════════════════════════════════
   PREGNANCY CALENDAR
   ═══════════════════════════════════════════════════ */
function renderPregCalendar(viewDate, lmpDate, dueDate, currentWeek) {
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();

  const titleEl = document.getElementById('pregCalTitle');
  if (titleEl) titleEl.textContent = MONTH_NAMES[month] + ' ' + year;

  const grid = document.getElementById('pregCalDays');
  if (!grid) return;
  grid.innerHTML = '';

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // Build set of appointment dates
  const apptDateStrs = appointments.map(a => a.date);

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-d empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date     = new Date(year, month, d);
    const el       = document.createElement('div');
    el.className   = 'cal-d';
    el.textContent = d;

    // Determine trimester colour
    if (lmpDate) {
      const weekNum = Math.floor((date - lmpDate) / (1000*60*60*24*7));
      if (weekNum >= 1 && weekNum <= 13)  el.classList.add('trimester-1');
      else if (weekNum >= 14 && weekNum <= 26) el.classList.add('trimester-2');
      else if (weekNum >= 27)             el.classList.add('trimester-3');

      // Milestone weeks
      const isMilestoneWeek = PRENATAL_MILESTONES.some(m => m.week === weekNum);
      if (isMilestoneWeek) el.classList.add('milestone-week');
    }

    // Today
    if (isSameDay(date, today)) el.classList.add('today');

    // Appointment
    const ds = dateStr(date);
    if (apptDateStrs.includes(ds)) el.classList.add('appt-day');

    // Tooltip on click
    el.addEventListener('click', () => showCalDayInfo(date, lmpDate, dueDate));
    grid.appendChild(el);
  }
}

function initPregCalNav() {
  document.getElementById('pregCalPrev').addEventListener('click', () => {
    pregCalDate = new Date(pregCalDate.getFullYear(), pregCalDate.getMonth()-1, 1);
    if (pregData) renderPregCalendar(pregCalDate, new Date(pregData.lmpDate), new Date(pregData.dueDate), pregData.currentWeek);
  });
  document.getElementById('pregCalNext').addEventListener('click', () => {
    pregCalDate = new Date(pregCalDate.getFullYear(), pregCalDate.getMonth()+1, 1);
    if (pregData) renderPregCalendar(pregCalDate, new Date(pregData.lmpDate), new Date(pregData.dueDate), pregData.currentWeek);
  });
}
document.addEventListener('DOMContentLoaded', initPregCalNav);

function showCalDayInfo(date, lmpDate, dueDate) {
  if (!lmpDate) return;
  const weekNum = Math.floor((date - lmpDate) / (1000*60*60*24*7));
  const m = PRENATAL_MILESTONES.find(x => x.week === weekNum);
  if (m) {
    const msg = `Week ${weekNum}: ${m.desc}`;
    // Show a gentle toast
    showToast(msg, '#a78bfa');
  }
}

/* ═══════════════════════════════════════════════════
   PERIOD SETUP
   ═══════════════════════════════════════════════════ */
function initPeriodSetup() {
  document.getElementById('startPeriodTracker').addEventListener('click', () => {
    const name      = document.getElementById('periodName').value.trim();
    const age       = +document.getElementById('periodAge').value || 0;
    const lastPeriod= document.getElementById('lastPeriodDate').value;
    const cycleLen  = +document.getElementById('cycleLength').value || 28;
    const perDur    = +document.getElementById('periodDuration').value || 5;

    if (!name)        { alert('Please enter your name.'); return; }
    if (!lastPeriod)  { alert('Please enter your last period start date.'); return; }

    periodData = { name, age, lastPeriodDate: lastPeriod, cycleLength: cycleLen, periodDuration: perDur };
    localStorage.setItem('hakim-period', JSON.stringify(periodData));

    document.getElementById('periodSetupPanel').classList.add('hidden');
    document.getElementById('periodView').classList.add('visible');
    renderPeriodDashboard(periodData);
  });

  document.getElementById('editPeriodBtn').addEventListener('click', () => {
    periodData = null;
    localStorage.removeItem('hakim-period');
    document.getElementById('periodView').classList.remove('visible');
    document.getElementById('periodSetupPanel').classList.remove('hidden');
  });
}

/* ═══════════════════════════════════════════════════
   RENDER PERIOD DASHBOARD
   ═══════════════════════════════════════════════════ */
function renderPeriodDashboard(data) {
  const today       = new Date();
  const last        = new Date(data.lastPeriodDate);
  const cycle       = +data.cycleLength || 28;
  const perDur      = +data.periodDuration || 5;

  // Calculate current day of cycle
  const daysSinceLast = Math.floor((today - last) / (1000*60*60*24));
  const cyclesSince   = Math.floor(daysSinceLast / cycle);
  const lastStart     = new Date(last);
  lastStart.setDate(lastStart.getDate() + cyclesSince * cycle);
  const dayOfCycle    = Math.floor((today - lastStart) / (1000*60*60*24)) + 1;

  // Predictions
  const nextPeriodDate = new Date(lastStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycle);
  const daysToNextPeriod = Math.max(0, Math.ceil((nextPeriodDate - today) / (1000*60*60*24)));

  // Ovulation (typically 14 days before next period)
  const ovulationDay    = cycle - 14;
  const ovulationDate   = new Date(lastStart);
  ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);
  const daysToOvulation = Math.ceil((ovulationDate - today) / (1000*60*60*24));

  // Fertile window (ovulation ±2 days)
  const fertileStart = new Date(ovulationDate); fertileStart.setDate(fertileStart.getDate() - 2);
  const fertileEnd   = new Date(ovulationDate); fertileEnd.setDate(fertileEnd.getDate() + 2);

  // Phase
  let phaseName = 'Follicular', phaseClass = 'follicular';
  if (dayOfCycle <= perDur) { phaseName = 'Menstrual Phase';   phaseClass = 'menstrual'; }
  else if (dayOfCycle <= ovulationDay - 1) { phaseName = 'Follicular Phase'; phaseClass = 'follicular'; }
  else if (dayOfCycle <= ovulationDay + 1) { phaseName = 'Ovulation';        phaseClass = 'ovulation'; }
  else { phaseName = 'Luteal Phase'; phaseClass = 'luteal'; }

  // Circle progress
  const offset = 440 - (440 * ((dayOfCycle-1) / cycle));
  const fillEl = document.getElementById('periodCircleFill');
  if (fillEl) setTimeout(() => { fillEl.style.strokeDashoffset = offset; }, 200);

  setText('periodNameDisplay',    data.name + ' 🌸');
  setText('periodDayDisplay',     dayOfCycle);
  setText('nextPeriodDays',       daysToNextPeriod > 0 ? daysToNextPeriod + 'd' : 'Today');
  setText('ovulationDays',        daysToOvulation > 0 ? daysToOvulation + 'd' : daysToOvulation === 0 ? 'Today!' : 'Passed');
  setText('cycleLengthDisplay',   cycle + 'd');

  const phaseEl = document.getElementById('phaseTag');
  if (phaseEl) { phaseEl.textContent = phaseName; phaseEl.className = `phase-tag ${phaseClass}`; }

  // Insight messages
  const insightEl = document.getElementById('periodInsightMsgs');
  if (insightEl) {
    const msgs = getPeriodInsights(dayOfCycle, cycle, perDur, daysToNextPeriod, daysToOvulation);
    insightEl.innerHTML = msgs.map(m => `<div class="period-insight-msg">${m}</div>`).join('');
  }

  // Calendar
  renderPeriodCalendar(periodCalDate, lastStart, cycle, perDur, ovulationDay, today);
}

/* ═══════════════════════════════════════════════════
   PERIOD CALENDAR
   ═══════════════════════════════════════════════════ */
function renderPeriodCalendar(viewDate, lastStart, cycle, perDur, ovulationDay, today) {
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const titleEl = document.getElementById('periodCalTitle');
  if (titleEl) titleEl.textContent = MONTH_NAMES[month] + ' ' + year;

  const grid = document.getElementById('periodCalDays');
  if (!grid) return;
  grid.innerHTML = '';

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div'); el.className = 'cal-d empty'; grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date   = new Date(year, month, d);
    const el     = document.createElement('div');
    el.className = 'cal-d';
    el.textContent = d;

    // Calculate which day of cycle this date is
    const daysSince = Math.floor((date - lastStart) / (1000*60*60*24));
    let cyclesOffset = Math.floor(daysSince / cycle);
    if (daysSince < 0) cyclesOffset = Math.floor(daysSince / cycle) - 1;
    const cycleStart = new Date(lastStart);
    cycleStart.setDate(cycleStart.getDate() + cyclesOffset * cycle);
    const dayInCycle = Math.floor((date - cycleStart) / (1000*60*60*24)) + 1;

    if (dayInCycle >= 1 && dayInCycle <= perDur)           el.classList.add('period-day');
    else if (dayInCycle === ovulationDay)                   el.classList.add('ovulation-day');
    else if (dayInCycle >= ovulationDay-2 && dayInCycle <= ovulationDay+2 && dayInCycle > perDur) el.classList.add('fertile-day');
    else if (dayInCycle >= cycle-5 && dayInCycle < cycle)  el.classList.add('pms-day');

    if (isSameDay(date, today)) el.classList.add('today');

    el.addEventListener('click', () => {
      const labels = { 'period-day': 'Period day', 'ovulation-day': 'Ovulation day', 'fertile-day': 'Fertile window', 'pms-day': 'PMS phase', 'today': 'Today' };
      const cls = ['period-day','ovulation-day','fertile-day','pms-day'].find(c => el.classList.contains(c));
      if (cls) showToast(`${labels[cls]} — cycle day ${dayInCycle}`, '#f472b6');
    });

    grid.appendChild(el);
  }
}

function initPeriodCalNav() {
  document.getElementById('periodCalPrev').addEventListener('click', () => {
    periodCalDate = new Date(periodCalDate.getFullYear(), periodCalDate.getMonth()-1, 1);
    if (periodData) {
      const last = new Date(periodData.lastPeriodDate);
      renderPeriodDashboard(periodData);
      renderPeriodCalendar(periodCalDate, last, +periodData.cycleLength, +periodData.periodDuration, +periodData.cycleLength-14, new Date());
    }
  });
  document.getElementById('periodCalNext').addEventListener('click', () => {
    periodCalDate = new Date(periodCalDate.getFullYear(), periodCalDate.getMonth()+1, 1);
    if (periodData) {
      const last = new Date(periodData.lastPeriodDate);
      renderPeriodDashboard(periodData);
      renderPeriodCalendar(periodCalDate, last, +periodData.cycleLength, +periodData.periodDuration, +periodData.cycleLength-14, new Date());
    }
  });
}
document.addEventListener('DOMContentLoaded', initPeriodCalNav);

/* ═══════════════════════════════════════════════════
   WATER TRACKER
   ═══════════════════════════════════════════════════ */
function initWaterTracker() {
  const cupsEl = document.getElementById('waterCups');
  if (!cupsEl) return;
  for (let i = 0; i < 8; i++) {
    const cup = document.createElement('button');
    cup.className = 'water-cup';
    cup.setAttribute('aria-label', `Glass ${i+1}`);
    cup.textContent = '💧';
    cup.addEventListener('click', () => {
      const filled = cupsEl.querySelectorAll('.water-cup.filled').length;
      if (cup.classList.contains('filled')) {
        // Unfill this and all after
        [...cupsEl.querySelectorAll('.water-cup')].forEach((c, idx) => {
          if (idx >= i) c.classList.remove('filled');
        });
      } else {
        // Fill up to this
        [...cupsEl.querySelectorAll('.water-cup')].forEach((c, idx) => {
          if (idx <= i) c.classList.add('filled');
        });
      }
      waterCount = cupsEl.querySelectorAll('.water-cup.filled').length;
      setText('waterCount', `${waterCount} / 8 glasses`);
      if (waterCount === 8) showToast('Great job! 8 glasses of water today 💧', '#22d3ee');
    });
    cupsEl.appendChild(cup);
  }
}

/* ═══════════════════════════════════════════════════
   APPOINTMENTS
   ═══════════════════════════════════════════════════ */
function initAppointments() {
  renderAppts();
  document.getElementById('addApptBtn').addEventListener('click', () => {
    const date = document.getElementById('apptDate').value;
    const desc = document.getElementById('apptDesc').value.trim();
    if (!date || !desc) { showToast('Please fill both date and description', '#fb923c'); return; }
    appointments.push({ date, desc });
    appointments.sort((a,b) => a.date.localeCompare(b.date));
    localStorage.setItem('hakim-appts', JSON.stringify(appointments));
    document.getElementById('apptDate').value = '';
    document.getElementById('apptDesc').value = '';
    renderAppts();
    if (pregData) renderPregCalendar(pregCalDate, new Date(pregData.lmpDate), new Date(pregData.dueDate));
    showToast('Appointment added!', '#a78bfa');
  });
}

function renderAppts() {
  const list = document.getElementById('apptListDynamic');
  if (!list) return;
  if (appointments.length === 0) {
    list.innerHTML = '<p style="font-size:0.8rem;color:var(--text-muted);padding:0.5rem 0">No appointments yet. Add your first one above.</p>';
    return;
  }
  list.innerHTML = appointments.map((a, i) => `
    <div class="appt-row">
      <span class="appt-row-date">${fmtDateShort(new Date(a.date))}</span>
      <span class="appt-row-desc">${a.desc}</span>
      <span class="appt-row-del" data-idx="${i}" title="Remove">✕</span>
    </div>`).join('');
  list.querySelectorAll('.appt-row-del').forEach(btn => {
    btn.addEventListener('click', () => {
      appointments.splice(+btn.dataset.idx, 1);
      localStorage.setItem('hakim-appts', JSON.stringify(appointments));
      renderAppts();
    });
  });
}

/* ═══════════════════════════════════════════════════
   REMINDERS
   ═══════════════════════════════════════════════════ */
function initReminders() {
  document.querySelectorAll('.reminder-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOn = card.classList.toggle('on');
      card.querySelector('.rem-toggle').textContent = isOn ? 'ON' : 'OFF';
      showToast(isOn ? 'Reminder turned on' : 'Reminder turned off', isOn ? '#4ade80' : '#94a3b8');
    });
  });
}

/* ═══════════════════════════════════════════════════
   PERIOD SYMPTOM LOG
   ═══════════════════════════════════════════════════ */
function initPeriodSymptoms() {
  document.querySelectorAll('.p-sym-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });
  document.querySelectorAll('.flow-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.flow-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
  document.querySelectorAll('.mood-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.mood-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
  const saveBtn = document.getElementById('savePeriodLogBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const symptoms = [...document.querySelectorAll('.p-sym-chip.active')].map(c => c.dataset.sym);
      const flow     = document.querySelector('.flow-opt.active')?.dataset.flow || 'none';
      const mood     = document.querySelector('.mood-opt.active')?.dataset.mood || 'okay';
      saveBtn.textContent = '✓ Log saved!';
      saveBtn.disabled = true;
      try {
        await window.fetchAPI('/api/tracker/symptoms', {
          method: 'POST',
          body: JSON.stringify({ symptoms, flow, mood, date: new Date().toISOString() }),
        });
      } catch (_) {}
      showToast('Today\'s log saved 🌸', '#f472b6');
      setTimeout(() => { saveBtn.textContent = '💾 Save today\'s log'; saveBtn.disabled = false; }, 2500);
    });
  }
}

/* ═══════════════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, color = '#4ade80') {
  let toast = document.getElementById('selamToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'selamToast';
    Object.assign(toast.style, {
      position:'fixed', bottom:'90px', left:'50%', transform:'translateX(-50%) translateY(20px)',
      background: 'var(--card-bg)', backdropFilter:'blur(16px)',
      border:'1px solid var(--card-border)', borderRadius:'50px',
      padding:'0.6rem 1.25rem', fontSize:'0.82rem', fontWeight:'600',
      color:'var(--text-primary)', zIndex:'999',
      boxShadow:'0 8px 24px rgba(0,0,0,0.12)',
      transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      opacity:'0', pointerEvents:'none', whiteSpace:'nowrap',
    });
    document.body.appendChild(toast);
  }
  toast.style.borderColor = color;
  toast.style.boxShadow = `0 8px 24px ${color}40`;
  toast.textContent = msg;
  clearTimeout(toastTimer);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 10);
  toastTimer = setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(20px)'; }, 3000);
}

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function fmtDate(d) {
  return d ? d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '--';
}
function fmtDateShort(d) {
  return d ? d.toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '--';
}
function isSameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function dateStr(d) {
  return d.toISOString().slice(0,10);
}
