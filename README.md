# 🪦 PROJECT CEMETERY

> *"Some projects were never finished. That doesn't mean they were useless."*

**Project Cemetery** is an AI-powered platform that analyzes abandoned software projects, performs an automated forensic autopsy, discovers surviving reusable code/schemas/components, and generates actionable resurrection plans or combines multiple dead projects in signature **Frankenstein Mode**.

---

## 🌟 Key Features

1. **Dark Atmospheric Cemetery UI**: Polished obsidian aesthetic with glowing purple/emerald accents, mist canvas background, interactive tombstone grave cards, and smooth transitions.
2. **AI Forensic Autopsy**: Scans uploaded ZIP repositories safely (ignoring `node_modules`, `.git`, virtual environments, binaries, and secrets) to pinpoint why the project died grounded strictly in empirical repository evidence (e.g. missing endpoints, TODO debt, lack of tests).
3. **Project DNA**: Visual breakdown across Frontend, Backend, Database, Authentication, APIs, Testing, Documentation, and Deployment, alongside interactive Recharts technology distribution charts.
4. **Surviving Assets**: Discovers reusable JWT auth middleware, database schemas, UI component libraries, and API routes with copy-paste file paths, dependencies, and reusability rationales.
5. **⚡ Resurrection Plan Generator**: Interactive wizard mapping what to keep, modify, remove, and build with step-by-step implementation roadmaps and visual Before → After mapping.
6. **⚡ Frankenstein Mode**: Signature hackathon feature! Select 2 to 4 dead projects and fuse their surviving assets into a brand new hybrid concept.
7. **Project Comparison Matrix**: Side-by-side comparative grid displaying completion %, health score, survivor counts, and resurrection potential.
8. **Instant Demo Mode**: Pre-loaded with 4 realistic demo projects (*CampusChat*, *WeatherApp*, *RoutePlanner*, *DevPulse*) that work out of the box even without an API key or internet connection!

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Lucide React + Recharts
- **Backend**: FastAPI + Python 3.10+ + Uvicorn
- **Database**: SQLite (auto-provisioned `cemetery.db`)
- **AI**: Gemini API (`google-genai` SDK using `gemini-3.8-flash` or `gemini-flash-latest`) with a deterministic evidence-grounded fallback generator.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# (Optional) Set your Gemini API key in .env or environment variable
cp .env.example .env

# Run FastAPI Server (starts on http://127.0.0.1:8000)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server (starts on http://localhost:3000)
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🧪 Demo Mode & Gemini API Fallback

- **No API Key Required**: Project Cemetery includes built-in deterministic fallback logic. If `GEMINI_API_KEY` is not set, the platform uses structured repository heuristics to perform the Autopsy, identify Survivors, generate Resurrection Plans, and create Frankenstein fusions.
- **Using Gemini API**: Set `GEMINI_API_KEY=your_key` in `backend/.env` to enable real-time Gemini AI generation.

---

## 📁 Repository Structure

```
project-cemetery/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI routes & endpoints
│   │   ├── database.py        # SQLite schema & initialization
│   │   ├── models.py          # Pydantic schemas
│   │   ├── analyzer.py        # Safe ZIP parser, TODO scanner, AST & route detector
│   │   ├── ai_service.py      # Gemini API integration + fallback logic
│   │   └── seed_data.py       # Pre-seeded demo projects
│   ├── .env.example
│   ├── requirements.txt
│   └── cemetery.db (generated)
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components (GraveCard, AutopsyView, FrankensteinModal, etc.)
│   │   ├── services/          # API client (api.js)
│   │   ├── App.jsx            # Main app shell & router state
│   │   ├── index.css          # Tailwind CSS styles & animations
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
└── README.md
```
