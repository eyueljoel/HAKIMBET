# 🌿 Hakim ሃኪም — Ethiopia's Wellness Super-App

> Health, beauty & wellbeing — rooted in Ethiopian tradition, powered by AI.

---

## 📁 Project Structure

```
wellness/
│
├── client/                        ← Frontend (HTML · CSS · JS)
│   ├── index.html                 ← Login & Signup page
│   ├── dashboard.html             ← Main app dashboard
│   └── assets/
│       ├── css/
│       │   ├── style.css          ← Shared styles (auth, theme, components)
│       │   └── dashboard.css      ← Dashboard-only styles
│       ├── js/
│       │   ├── app.js             ← Splash, auth logic, theme, particles
│       │   └── dashboard.js       ← All dashboard screens & interactions
│       └── images/                ← Static images / icons
│
├── server/                        ← Backend (Node.js · Express · MongoDB)
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js                ← JWT authentication middleware
│   ├── models/
│   │   ├── User.js                ← User schema (auth + tracker + wellness)
│   │   └── EmergencySos.js        ← SOS dispatch record schema
│   └── routes/
│       ├── auth.js                ← POST /register · POST /login · GET /me
│       ├── tracker.js             ← Pregnancy & cycle tracker endpoints
│       ├── emergency.js           ← SOS dispatch & history endpoints
│       ├── ai.js                  ← AI chat endpoint (swap for real LLM)
│       └── wellness.js            ← Wellbeing report & spa booking
│
├── server.js                      ← Express entry point
├── package.json
├── .env                           ← Environment variables (never commit)
└── README.md
```

---

## 🚀 Quick Start

### Option A — Open frontend directly (no server needed)

```
Double-click → client/index.html
```

The app works fully in demo mode. Auth calls fall back gracefully when no server is running.

---

### Option B — Full stack with Node.js + MongoDB

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure environment

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hakim
JWT_SECRET=your-secret-key-here
```

#### 3. Start MongoDB

Make sure MongoDB is running locally, or paste a MongoDB Atlas URI into `.env`.

#### 4. Start the server

```bash
# Production
npm start

# Development (auto-restart on change)
npm run dev
```

#### 5. Open the app

```
http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Sign in | — |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/tracker/setup` | Set up cycle/pregnancy tracker | ✅ |
| POST | `/api/tracker/symptoms` | Log daily symptoms | ✅ |
| GET | `/api/tracker/history` | Get cycle history | ✅ |
| POST | `/api/emergency/sos` | Send SOS dispatch | ✅ |
| GET | `/api/emergency/history` | Get SOS history | ✅ |
| PATCH | `/api/emergency/:id/status` | Update SOS status | ✅ |
| POST | `/api/ai/chat` | AI wellness chat | ✅ |
| POST | `/api/wellness/report` | Generate wellbeing plan | ✅ |
| GET | `/api/wellness/report` | Get saved plan | ✅ |
| POST | `/api/wellness/booking` | Kuriftu spa booking | ✅ |
| GET | `/api/health` | Server health check | — |

---

## ✨ Features

| Screen | Features |
|--------|----------|
| **Login / Signup** | Glassmorphism UI · Google/Facebook/Apple social · Guest mode · Dark/light mode · EN/አማ language |
| **Home** | Mood tracker · Feature grid · Live indicator · Stat counters |
| **Selam 🤱** | Pregnancy week tracker · Prenatal schedule · Period & cycle log · Symptom chips · Mini calendar |
| **Farmers 🌾** | Seasonal health tips · Nutrition · Safety · Ethiopian farm calendar · AI advisor |
| **Emergency 🚨** | SOS button · Ambulance simulation · Nearby hospitals · Emergency contacts · National numbers |
| **AI Advisor 🤖** | Chat with typing animation · Suggested questions · Specialist booking |
| **Skin Scan 📸** | Photo upload · AI skin analysis · Ethiopian natural recommendations |
| **Product Truth 🔍** | Ingredient analysis · Safety rating · Ethiopian alternatives |
| **Wellbeing Report 📋** | BMI · TDEE · Custom meal plan · Exercise plan |
| **Spa & Resort 🏨** | Kuriftu package finder · Booking confirmation |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 · CSS3 · Vanilla JavaScript |
| Backend | Node.js · Express.js |
| Database | MongoDB · Mongoose |
| Auth | JWT (jsonwebtoken) · bcryptjs |
| AI | Demo engine (swap for OpenAI / Gemini) |

---

## 🔐 Adding a Real AI

In `server/routes/ai.js`, replace the `generateReply()` call:

```js
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are Hakim AI, an Ethiopian wellness advisor...' },
    { role: 'user',   content: message },
  ],
});
const reply = completion.choices[0].message.content;
```

---

© 2026 Hakim ሃኪም — Made with 💚 for Ethiopia
