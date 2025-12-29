# Swasth Saathi (स्वास्थ्य साथी) - Healthcare Guidance MVP

**Tagline:** Healthcare guidance, even without internet.

A rural telemedicine MVP (hackathon prototype) built with Next.js that provides AI-powered triage and care guidance. Works completely **offline** - no internet needed.

## 🎯 Key Features

- **🩺 Symptom Checker**: Select from 10 common symptoms in a clean, bilingual UI
- **❓ Smart Questions**: Age, symptom duration, existing conditions, severity, medicine taken
- **🧠 AI Triage Logic**: Real-time risk assessment (LOW/MEDIUM/HIGH) based on 11 medical rules
- **📋 Care Guidance**: Day-by-day care instructions tailored to risk level
- **🌐 Bilingual**: Full support for English & Hindi (हिंदी)
- **📴 Offline-First**: Works completely offline with PWA + Service Worker caching
- **🎨 Clean UI**: Modern, accessible design with TailwindCSS
- **📱 Mobile-Ready**: Responsive design optimized for low-end devices

## 🚀 Tech Stack

- **Framework**: Next.js 16 (React)
- **Styling**: TailwindCSS
- **State**: React Hooks (useState, useEffect)
- **Storage**: localStorage (offline data persistence)
- **PWA**: next-pwa for offline capability
- **Language**: JavaScript

## 📊 User Flow

```
Home (/) 
  ↓
Symptoms (/symptoms) - Select symptoms
  ↓
Questions (/questions) - Answer 5 questions
  ↓
Result (/result) - Get triage assessment
  ↓
Pathway (/pathway) - Get care guidance
  ↓
Home (/) - Start new check
```

## 🏗️ Page Structure

### 1. **Home** (`/`)
- Welcome screen with app title
- Language toggle (EN / हिंदी)
- Network status badge
- Start button

### 2. **Symptoms** (`/symptoms`)
- Select from 10 symptoms in a 2-column grid
- Each symptom has English & Hindi names
- Shows count of selected symptoms
- Continue button

### 3. **Questions** (`/questions`)
Five screening questions:
1. **Age Group**: Below 18 / 18-40 / 41-60 / Above 60
2. **Duration**: Today / 1-2 days / 3-5 days / 5+ days
3. **Existing Conditions**: Yes / No (Diabetes, BP, Heart disease, etc.)
4. **Severity**: Mild / Moderate / Severe
5. **Medicine Taken**: None / Paracetamol / Other / Unsure

### 4. **Result** (`/result`)
- Triage level: LOW / MEDIUM / HIGH (color-coded)
- Explanation of result
- Confirmation that data is saved
- Button to view care guidance

### 5. **Pathway** (`/pathway`)
- Day-by-day care instructions (Day 1, Day 2, Day 3)
- Home care tips
- Warning signs to watch for
- Done button to return home

## 🧠 Triage Logic

The app uses **11 medical rules** to classify risk level:

### HIGH RISK (Urgent attention needed)
1. Breathing difficulty → Always HIGH
2. Severe symptoms → HIGH
3. Took medicine but not mild → HIGH
4. Elderly (60+) with fever → HIGH
5. Existing conditions with fever → HIGH
6. Children with fever → HIGH

### MEDIUM RISK (Monitor closely)
7. Moderate severity → MEDIUM
8. Symptoms 3+ days → MEDIUM
9. Vomiting + Diarrhea → MEDIUM (dehydration risk)
10. 3+ symptoms → MEDIUM
11. Medicine taken but symptoms persist → MEDIUM

### LOW RISK (Home care)
- Default for mild symptoms

## 💾 localStorage Keys

```javascript
'swasth-language'     → 'en' | 'hi'
'swasth-symptoms'     → JSON array of symptom IDs
'swasth-ageGroup'     → 'below18' | '18-40' | '41-60' | 'above60'
'swasth-duration'     → 'today' | '1-2' | '3-5' | 'more5'
'swasth-conditions'   → 'yes' | 'no'
'swasth-severity'     → 'mild' | 'moderate' | 'severe'
'swasth-medicine'     → 'none' | 'paracetamol' | 'other' | 'unsure'
'swasth-result'       → JSON { level, en, hi }
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
npm run export
```

## 📴 Offline Testing

1. **First visit**: Open app in browser, visit all pages (while online) to cache them
2. **DevTools**: Open DevTools → Application → Service Workers
3. **Check "Update on reload"** to test service worker updates
4. **Go offline**: DevTools → Network → Check "Offline"
5. **Refresh**: All pages should work offline!

## 🎨 UI Theme

- **Gradient Background**: `from-green-50 to-white`
- **Primary Color**: Green (`bg-green-600`, `hover:bg-green-700`)
- **Risk Colors**:
  - HIGH: Red (`bg-red-100`, `text-red-700`)
  - MEDIUM: Yellow (`bg-yellow-100`, `text-yellow-700`)
  - LOW: Green (`bg-green-100`, `text-green-700`)

## 📁 Project Structure

```
frontend/
├── pages/
│   ├── index.js          # Home page
│   ├── symptoms.js       # Symptom selection
│   ├── questions.js      # Screening questions
│   ├── result.js         # Triage result
│   ├── pathway.js        # Care guidance
│   ├── _app.js           # App wrapper
│   ├── _offline.js       # Offline fallback
│   └── api/
│       └── hello.js      # Sample API
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service worker (auto-generated)
│   └── icons/           # App icons
├── styles/
│   └── globals.css      # Global styles
├── next.config.js       # Next.js + PWA config
├── tailwind.config.js   # TailwindCSS config
└── package.json         # Dependencies
```

## 🌟 Key Design Decisions

1. **No API Calls**: Fully client-side triage logic for reliability and privacy
2. **Conservative Triage**: When in doubt, classify as higher risk
3. **Simple Language**: No medical jargon - friendly, accessible text
4. **Offline First**: All data stored locally, no cloud dependency
5. **Bilingual**: Equal support for English and Hindi
6. **Mobile Optimized**: Designed for low-end Android/feature phones

## ✅ Quality Checklist

- ✅ Works completely offline (PWA + Service Worker)
- ✅ Bilingual (English + Hindi)
- ✅ Responsive design (mobile-first)
- ✅ No external API dependencies
- ✅ Simple, readable code for judges
- ✅ Clean, modern UI with TailwindCSS
- ✅ localStorage for data persistence
- ✅ Network status detection
- ✅ Language preference saved
- ✅ Safe triage logic (conservative risk assessment)

## 🚨 Important Notes

**Disclaimer**: This is a **prototype for demonstration only**. It is NOT a medical diagnosis tool. It provides general health guidance only. Always consult a healthcare professional for actual medical advice.

## 📝 License

This project is part of the TechFiesta Hackathon 2024.

## 👥 Contributors

Built for rural telemedicine MVP hackathon challenge.
