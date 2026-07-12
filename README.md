# KAVACH-AI

**Kerala Agentic Vulnerability Analysis & Child Protection Assistant**

A hybrid, AI-powered cyber-investigation and citizen emergency response platform, built for **HAC'KP 2026 — Kerala Police Cyberdome Hackathon**.

> "Kavach" means armor — built to protect.

KAVACH-AI connects two systems into one seamless pipeline: a **citizen emergency SOS app** and an **investigator triage terminal**, correlating multi-format digital evidence, scoring risk with explainable AI, and keeping a human decision-maker in control at every step.

---

## ⚠️ Disclaimer

This is a **hackathon prototype** built entirely on **synthetic, fictional mock data**. No real personal data, case data, or images of real individuals are used anywhere in this project. All entities, devices, and evidence items (e.g. "Entity A", "Device-004", "Sample Chat Log #12") are placeholders for demonstration purposes only.

---

## ✨ Key Features

### 🛡️ The Hub — Investigator Workspace
- **Explainable Risk Gauge** — every risk score is broken down into the specific contributing factors (metadata anomalies, keyword matches, cross-source corroboration), not just a bare number
- **Evidence Correlation Map** — an interactive, force-directed graph linking cases, suspect devices, and multi-format evidence (text, image, audio, video)
- **Confidence-Weighted Triage Queue** — a kanban board sorting alerts into High Confidence / Ambiguous / Low Priority lanes, with human Approve / Reject / Escalate actions on every item
- **Immutable Audit Trail** — an append-only, chain-of-custody log of every system and human action
- **Automated Report Generator** — one-click, citation-backed case report compilation

### 📱 The Guard — Citizen Emergency Simulator
- Biometric (fingerprint) login simulation
- Animated SOS trigger with live pulse and dispatch confirmation
- GPS radar view with simulated live tracking
- Multi-step incident reporting with mock file upload

### 🤖 Agentic Orchestration
Automates initial triage and correlation while keeping a **Human-in-the-Loop** in absolute control of all legal/investigative decisions.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Bundler & Tooling | Vite 8 |
| Styling | Tailwind CSS v4 + custom CSS (glassmorphism, conic scans) |
| Animation | Framer Motion |
| Data Visualization | D3-Force (correlation graph), Recharts (gauges/counters) |
| Icons | Lucide React |
| Data | Static synthetic JSON (`/src/data`) — no backend required |
| Linting | oxlint |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone <your-repo-url>
cd kavach-ai
npm install
```

### Run in development

```bash
npm run dev
```

Vite will start a local dev server and print a URL — typically:

```
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 📁 Project Structure

```
kavach-ai/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── data/           # synthetic mock dataset (cases, evidence, devices)
│   ├── components/      # shared UI (layout, cards, gauges, graph, kanban)
│   └── pages/            # Dashboard, Triage Queue, Evidence Graph, Timeline,
│                          # Copilot, Reports, Audit Log, Settings
└── README.md
```

*(Adjust to match your actual folder layout as the project evolves.)*

---

## 🗺️ Roadmap

- Integration with CCTNS databases and Dial 112 emergency services
- Multilingual regional-language speech AI for audio evidence
- On-premise, air-gapped deployment for secure Cyberdome environments

---

## 👥 Team

Team KAVACH-AI — HAC'KP 2026, Kerala Police Cyberdome

---

## 📄 License

This project was built for hackathon evaluation purposes. Add a license here if you intend to open-source or distribute it.
