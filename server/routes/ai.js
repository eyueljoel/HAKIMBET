/**
 * server/routes/ai.js
 * POST /api/ai/chat         — main wellness chat
 * POST /api/ai/farmers      — farmers-specific chat
 * POST /api/ai/skin         — skin analysis advice
 * POST /api/ai/product      — product ingredient analysis
 *
 * Powered by OpenRouter  →  https://openrouter.ai
 * Model: configurable via OPENROUTER_MODEL in .env
 */

const express = require('express');
const https   = require('https');
const router  = express.Router();
const { softAuth } = require('../middleware/auth');

/* ── CONFIG ─────────────────────────────────────────── */
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Startup check
if (OPENROUTER_API_KEY) {
  console.log(`🤖 OpenRouter AI ready — model: ${MODEL}`);
} else {
  console.warn('⚠️  OPENROUTER_API_KEY missing — AI will use fallback replies');
}

/* ── SYSTEM PROMPTS ─────────────────────────────────── */
const PROMPTS = {
  general: `You are Hakim AI (ሃኪም AI) — a warm, expert wellness advisor built specifically for Ethiopia.

Your specialties:
- Ethiopian traditional remedies and herbs (niter kibbeh, tikur azmud, koseret, tena adam, berbere, teff, etc.)
- Women's health, pregnancy, and maternal care in the Ethiopian context
- Skin care advice for dark/melanin-rich skin tones common in Ethiopia
- Nutrition using Ethiopian cuisine (injera, wot, tibs, shiro, gomen, misir, ayib, etc.)
- Mental wellness, stress relief, and mindfulness rooted in Ethiopian culture
- General health advice aligned with Ethiopian healthcare realities

Rules:
1. Always reply in the SAME language the user writes in — English or Amharic ( አማርኛ).
2. Be warm, practical, and encouraging — like a trusted community health worker.
3. For serious medical symptoms, always advise visiting a health post or calling 907.
4. Keep responses concise (3–6 sentences unless detail is needed).
5. Use relevant emojis naturally (🌿 🤱 💪 🥗 ✨) but don't overuse them.
6. Never invent drug dosages. Say "consult your health worker" for medication questions.`,

  farmers: `You are the Hakim Farmers Advisor (ሰብሳቢ ሃኪም) — a health advisor specifically for Ethiopian agricultural workers.

Your focus:
- Seasonal health risks by Ethiopian farming calendar (Kiremt, Belg, Bega, etc.)
- Field injuries, back pain, heat exhaustion, and physical strain
- Malaria, waterborne diseases, and pesticide exposure
- Nutrition for hard physical labour using locally available Ethiopian foods
- Traditional Ethiopian farmer remedies
- Pregnant farm workers' special safety needs

Rules:
1. Reply in the same language the user uses (English or Amharic).
2. Be direct and practical — farmers need simple, actionable advice.
3. For emergencies, always say: go to the nearest health post or call 907.
4. Reference Ethiopian seasons, crops, and farming context where relevant.`,

  skin: `You are Hakim Skin AI — an expert in skincare for Ethiopian and African skin tones.

Your expertise:
- Dark/melanin-rich skin analysis and care (hyperpigmentation, acne, dryness)
- Ethiopian natural beauty ingredients (niter kibbeh, turmeric, honey, black seed oil, shea butter, castor oil)
- Identifying harmful ingredients in products (hydroquinone, mercury, parabens) common in Ethiopian markets
- Hair care for natural coily/4C textures common in Ethiopia
- Recommending affordable, locally available natural alternatives

Rules:
1. Always consider the melanin-rich skin context — avoid advice designed for lighter skin types.
2. Warn clearly about bleaching agents (hydroquinone, mercury, glutathione injections).
3. Prioritize Ethiopian/African natural remedies before commercial products.
4. Keep advice practical and affordable.`,

  product: `You are Hakim Product Truth AI — you analyze beauty/personal care product ingredient lists honestly.

Your job:
1. Identify potentially harmful ingredients (hydroquinone, mercury, parabens, sulfates, phthalates, formaldehyde).
2. Identify beneficial ingredients (vitamin C, niacinamide, glycerin, argan oil, shea butter, aloe vera).
3. Rate overall safety: SAFE ✅ / CAUTION ⚠️ / AVOID ❌
4. Suggest natural Ethiopian/African alternatives to the product.

Rules:
- Be direct and honest — no marketing language.
- Focus on ingredients that specifically affect dark/Ethiopian skin tones.
- Always suggest at least one affordable local alternative.
- Format: start with overall verdict, then ingredient breakdown, then alternatives.`,
};

/* ── OPENROUTER CALL ─────────────────────────────────── */
async function callOpenRouter(systemPrompt, userMessage, history = []) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set in .env');
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const body = JSON.stringify({
    model:       MODEL,
    messages,
    max_tokens:  600,
    temperature: 0.7,
    stream:      false,
  });

  return new Promise((resolve, reject) => {
    const url    = new URL(OPENROUTER_URL);
    const options = {
      hostname: url.hostname,
      path:     url.pathname,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer':   'https://hakim-wellness.app',
        'X-Title':        'Hakim Wellness App',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);

          // OpenRouter error response
          if (json.error) {
            return reject(new Error(json.error.message || 'OpenRouter API error'));
          }

          const reply = json.choices?.[0]?.message?.content;
          if (!reply) return reject(new Error('Empty response from AI'));

          resolve({
            reply,
            model:  json.model || MODEL,
            tokens: json.usage?.total_tokens || 0,
          });
        } catch (e) {
          reject(new Error('Failed to parse AI response: ' + e.message));
        }
      });
    });

    req.on('error', (e) => reject(new Error('Network error: ' + e.message)));
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timed out')); });
    req.write(body);
    req.end();
  });
}

/* ── FALLBACK (if API key missing / network error) ───── */
function fallbackReply(message) {
  const t = message.toLowerCase();
  if (t.includes('pregnant') || t.includes('ወር'))
    return '🤱 For pregnancy care: take iron + folic acid daily, drink 2L water, attend all prenatal checkups. Use the Selam ሰላም tab for detailed tracking. Call 907 for emergencies.';
  if (t.includes('skin') || t.includes('acne') || t.includes('ቆዳ'))
    return '✨ Ethiopian natural skin care: Niter Kibbeh as night moisturizer, turmeric + honey mask 2×/week for dark spots, black seed oil for acne. Avoid hydroquinone.';
  if (t.includes('food') || t.includes('eat') || t.includes('ምግብ'))
    return '🥗 Top Ethiopian wellness foods: teff injera (iron + fiber), misir wot (protein), gomen (calcium), berbere (anti-inflammatory). Use the Wellbeing Report for a personalized meal plan.';
  if (t.includes('stress') || t.includes('ጭንቀት'))
    return '🧘 Ethiopian stress relief: buna ceremony (communal coffee), tikur azmud tea, koseret tea, deep breathing (4-7-8 method). Connecting with family is deeply healing.';
  return '🌿 Selam! I\'m Hakim AI. For accurate wellness advice, try our Wellbeing Report for a personalized plan, or connect to a specialist. Call 907 for emergencies. 💚';
}

/* ── ROUTE: MAIN WELLNESS CHAT ──────────────────────── */
router.post('/chat', softAuth, async (req, res) => {
  try {
    const { message, context = 'general', history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const systemPrompt = PROMPTS[context] || PROMPTS.general;

    // Sanitize history (last 6 turns max to save tokens)
    const safeHistory = (Array.isArray(history) ? history : [])
      .slice(-6)
      .filter(m => m.role && m.content)
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 500) }));

    let reply, model, tokens;

    try {
      ({ reply, model, tokens } = await callOpenRouter(systemPrompt, message, safeHistory));
    } catch (apiErr) {
      console.warn('⚠️  OpenRouter error, using fallback:', apiErr.message);
      reply  = fallbackReply(message);
      model  = 'fallback';
      tokens = 0;
    }

    res.json({
      reply,
      model,
      tokens,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* ── ROUTE: FARMERS ADVISOR ─────────────────────────── */
router.post('/farmers', softAuth, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required.' });

    let reply, model, tokens;
    try {
      ({ reply, model, tokens } = await callOpenRouter(PROMPTS.farmers, message,
        (Array.isArray(history) ? history : []).slice(-4)));
    } catch (e) {
      console.warn('⚠️  Farmers AI fallback:', e.message);
      reply = fallbackReply(message); model = 'fallback'; tokens = 0;
    }

    res.json({ reply, model, tokens, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── ROUTE: SKIN ANALYSIS ───────────────────────────── */
router.post('/skin', softAuth, async (req, res) => {
  try {
    const { concern, area, skinType } = req.body;

    const message = `Analyze skin concern for an Ethiopian person:
Area: ${area || 'face'}
Concern: ${concern || 'general'}
Skin type: ${skinType || 'not specified'}

Provide: 1) Brief analysis 2) Top 3 Ethiopian natural remedies 3) What to avoid.`;

    let reply, model, tokens;
    try {
      ({ reply, model, tokens } = await callOpenRouter(PROMPTS.skin, message));
    } catch (e) {
      reply = '✨ For skin analysis, try Niter Kibbeh as a night moisturizer, turmeric + honey mask 2×/week, and black seed oil for acne. Avoid hydroquinone bleaching creams.';
      model = 'fallback'; tokens = 0;
    }

    res.json({ reply, model, tokens, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── ROUTE: PRODUCT ANALYSIS ────────────────────────── */
router.post('/product', softAuth, async (req, res) => {
  try {
    const { productName, ingredients, skinType } = req.body;
    if (!productName) return res.status(400).json({ message: 'Product name is required.' });

    const message = `Analyze this product for an Ethiopian consumer:
Product: ${productName}
Skin/hair type: ${skinType || 'melanin-rich Ethiopian skin'}
${ingredients ? `Ingredients listed: ${ingredients}` : '(No ingredient list provided — analyze based on known product formulations)'}

Give: overall verdict, key ingredient breakdown, Ethiopian natural alternatives.`;

    let reply, model, tokens;
    try {
      ({ reply, model, tokens } = await callOpenRouter(PROMPTS.product, message));
    } catch (e) {
      reply = `🔍 For ${productName}: check for hydroquinone, mercury, and parabens — common in products sold in Ethiopian markets. Natural alternatives: niter kibbeh, argan oil, turmeric paste.`;
      model = 'fallback'; tokens = 0;
    }

    res.json({ reply, model, tokens, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── ROUTE: TEST CONNECTION ─────────────────────────── */
router.get('/test', softAuth, async (req, res) => {
  try {
    const { reply, model, tokens } = await callOpenRouter(
      PROMPTS.general,
      'Say "Hakim AI is connected and working!" in one sentence.'
    );
    res.json({ status: 'connected', reply, model, tokens });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
