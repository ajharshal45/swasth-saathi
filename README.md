# SWASTH SAATHI

### Network-Adaptive Clinical Decision Support System for Rural Healthcare

> "Intelligence adapts. Healthcare never stops."

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
npm run dev

Backend Setup:

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload

---

## Usage

Patient Flow:
1. Open App - Select language
2. Check Symptoms - Voice/Text/Icon input
3. Answer Questions - Age, duration, conditions
4. Get Result - Urgency level (Low / Medium / High)
5. Follow Pathway - Day-by-day care instructions

Doctor Flow:
1. Login - Access dashboard
2. View Cases - See pre-triaged patients
3. Review - Check AI reasoning
4. Validate - Approve or modify recommendation


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
