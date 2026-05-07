# SenseGuard AI 🛡️
### Adaptive Gaming & PC Companion Agent

SenseGuard AI is a production-grade hackathon MVP designed to optimize both player performance and system health in real-time.

## 🚀 Key Features
- **Real-time Telemetry:** Tracks CPU, GPU, RAM, and high-frequency mouse input.
- **Aim Performance Index (API):** Analyzes aim dispersion, velocity variance, and overshoot to detect sensitivity drift.
- **Intelligent Overlay:** A lightweight, transparent HUD providing live coaching and system alerts.
- **System Optimizer:** Automatically switches Windows power plans and monitors thermal state.
- **AI Coach:** Generates post-match reviews and provides personalized sensitivity recommendations.

## 🛠️ Technology Stack
- **Backend:** Python 3.12, FastAPI, WebSockets, psutil, pynput, PyTorch.
- **Frontend:** React, Vite, TypeScript, TailwindCSS, Framer Motion, Recharts.
- **Desktop Layer:** Electron (Main process manages backend lifecycle).
- **Database:** SQLite (SQLModel) for session persistence.

## 🏃 Quick Start
1. Run `setup.bat` to install dependencies.
2. In one terminal, start the Vite dev server:
   ```bash
   cd frontend && npm run dev
   ```
3. In another terminal, launch the Electron app:
   ```bash
   cd frontend && npm run electron
   ```

## 📂 Architecture
- `/backend`: Sensor layer, AI agents, and FastAPI orchestrator.
- `/frontend`: Dashboard UI and Gaming Overlay.
- `/electron`: Main process for window and process management.

---
Built for the Hackathon. SenseGuard AI - Secure your aim, guard your system.
