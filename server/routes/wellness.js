/**
 * server/routes/wellness.js
 * POST /api/wellness/report   — generate + save personalized plan
 * GET  /api/wellness/report   — fetch saved plan
 * POST /api/wellness/booking  — Kuriftu spa booking
 */
const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

/* ── GENERATE REPORT ────────────────────────────────── */
router.post('/report', auth, async (req, res) => {
  try {
    const { age, gender, weight, height, activityLevel, goal } = req.body;

    if (!weight || !height) {
      return res.status(400).json({ message: 'Weight and height are required.' });
    }

    // BMI
    const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
    const bmiCategory =
      bmi < 18.5 ? 'Underweight' :
      bmi < 25   ? 'Normal'      :
      bmi < 30   ? 'Overweight'  : 'Obese';

    // TDEE (Harris-Benedict simplified)
    const activityMultipliers = {
      'Sedentary':          1.2,
      'Lightly active':     1.375,
      'Moderately active':  1.55,
      'Very active':        1.725,
    };
    const mult = activityMultipliers[activityLevel] || 1.55;
    const bmrBase = gender === 'Female'
      ? (10 * weight) + (6.25 * height) - (5 * (age || 25)) - 161
      : (10 * weight) + (6.25 * height) - (5 * (age || 25)) + 5;
    const tdee = Math.round(bmrBase * mult);

    // Adjust for goal
    const calories =
      goal?.includes('Lose')   ? tdee - 400 :
      goal?.includes('Gain')   ? tdee + 350 :
      goal?.includes('Muscle') ? tdee + 200 : tdee;

    const protein = Math.round(weight * (goal?.includes('Muscle') ? 2.0 : 1.4));

    // Ethiopian meal plan
    const mealPlan = {
      breakfast: 'Teff firfir with ayib (cottage cheese) + black coffee (buna)',
      lunch:     'Injera with shiro wot + gomen (collard greens) + salata',
      dinner:    'Misir wot with brown teff injera + timatim fitfit salad',
      snacks:    'Kolo (roasted barley) · Boiled eggs · Fresh mango or banana',
    };

    const exercisePlan =
      goal?.includes('Lose')   ? 'Cardio 4×/week (30 min brisk walk or jogging) + strength 2×/week' :
      goal?.includes('Muscle') ? 'Strength training 4×/week with progressive overload + protein timing' :
      goal?.includes('Gain')   ? 'Compound lifts 3×/week + 500 kcal daily surplus from clean foods' :
                                 'Walk 30 min/day + full-body stretch 3×/week + one rest day';

    const plan = { bmi, bmiCategory, tdee, calories, protein, mealPlan, exercisePlan, goal };

    // Persist to user record (silent fail if DB offline)
    await User.findByIdAndUpdate(req.user.id, {
      wellness: { age, gender, weight, height, activityLevel, goal },
    }).catch(() => null);

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET SAVED REPORT ───────────────────────────────── */
router.get('/report', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wellness').catch(() => null);
    if (!user?.wellness?.weight) {
      return res.status(404).json({ message: 'No wellness data found. Generate a report first.' });
    }
    res.json(user.wellness);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── SPA BOOKING ────────────────────────────────────── */
router.post('/booking', auth, async (req, res) => {
  try {
    const { packageName, goals, checkinDate } = req.body;

    if (!checkinDate) {
      return res.status(400).json({ message: 'Check-in date is required.' });
    }

    // In production: integrate Kuriftu booking API or save to Booking model
    const confirmationCode = `KRF-${Date.now().toString(36).toUpperCase()}`;

    console.log(`🏨 Spa booking — User: ${req.user.email} | Package: ${packageName} | Date: ${checkinDate}`);

    res.json({
      success:          true,
      confirmationCode,
      message:          `Booking confirmed for ${checkinDate}. Code: ${confirmationCode}`,
      packageName:      packageName || 'Wellness Package',
      checkinDate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
