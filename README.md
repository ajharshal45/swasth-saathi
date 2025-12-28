
# SWASTH SAATHI

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).
>>>>>>> fd85f63ac49c6a1e2942906d222b38552bc8e766

## Getting Started

First, run the development server:


---

## Table of Contents

- Problem Statement
- Our Solution
- Key Features
- Tech Stack
- Architecture
- Installation
- Usage
- Team

---

## Problem Statement

Telemedicine Platform with Smart Symptom Checker | Domain: Healthcare

In rural and underserved areas:
- 80% of telemedicine fails due to connectivity issues
- 51.7% of patients cite distance as a barrier to healthcare
- 1 doctor per 10,000 population in rural India
- Patients often visit hospitals unnecessarily or too late

Challenge: Build a system that provides healthcare guidance regardless of internet connectivity.

---

## Our Solution

SWASTH SAATHI is a Network-Adaptive Clinical Decision Support System that:

Online Mode: Voice input + AI processing + Video consult + Full sync
Limited Network: Text input + Basic AI + Audio consult
Offline Mode: Icon/Text input + Rule-based triage + SMS alerts

Core Philosophy:
Healthcare access should NOT disappear when the internet does.

---

## Key Features

For Patients:
- Voice/Text/Icon Symptom Input - Works in local languages
- Smart Triage - Risk-aware urgency classification
- Care Pathways - Step-by-step guidance (Day 1, Day 2, etc.)
- Emergency Alerts - SMS-based alerts when offline

For Doctors:
- Dashboard - View pre-triaged cases
- AI Reasoning - Transparent decision explanation
- Validation - Approve/Modify recommendations

Technical:
- Offline-First - Works without internet
- Auto-Sync - Syncs when connectivity restored
- PWA - Installable on any device

---

## Tech Stack

Frontend: Next.js 14 (PWA) + TailwindCSS
Offline Storage: Dexie.js (IndexedDB wrapper)
Backend: Python FastAPI
Backend Storage: SQLite
Triage Logic: Deterministic JSON Rules Engine
Voice Input: Web Speech API (online)
PWA: next-pwa (Service Workers)

---

## Architecture

Symptom Input --> Network Detect --> Triage Engine --> Doctor Review --> Care Pathway
                        |
                   _____|_____
                  |           |
               Online      Offline
             Voice + AI   Icons + Rules

---

## Installation

Prerequisites:
- Node.js 18+
- Python 3.9+
- npm or yarn

Frontend Setup:

# Clone the repository
git clone https://github.com/yourusername/swasth-saathi.git
cd swasth-saathi

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
=======
```bash
>>>>>>> fd85f63ac49c6a1e2942906d222b38552bc8e766
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

<<<<<<< HEAD
## Usage
=======
To learn more about Next.js, take a look at the following resources:
>>>>>>> fd85f63ac49c6a1e2942906d222b38552bc8e766

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

<<<<<<< HEAD
## Research Validation

80% telemedicine failure due to connectivity - WHO Digital Health Report, 2019
51.7% cite distance as barrier - National Health Mission, 2022
1:10,000 doctor ratio in rural India - MoHFW Rural Health Statistics, 2021-22
600K+ daily eSanjeevani consultations - MoHFW, 2024

---

## Compliance

- CDSS Framing - Clinical Decision Support, not diagnosis
- Doctor-in-the-Loop - Human validates all recommendations
- Telemedicine Guidelines 2020 - MoHFW compliant
- Consumer Protection Act 2019 - Safe AI usage

---

## Team

Harshal Jaiswal 
Samarth Randive
Mansi Jain
Pranav Jagtap
Yash Deshmukh

---


## Acknowledgments

- Ayushman Bharat Digital Mission (ABDM)
- Ministry of Health and Family Welfare (MoHFW)
- eSanjeevani Platform
- All healthcare workers serving rural India

---

Made with love for Rural India

SWASTH SAATHI - Intelligence adapts. Healthcare never stops.
=======
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
>>>>>>> fd85f63ac49c6a1e2942906d222b38552bc8e766
