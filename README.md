<p align="center">
  <img src="assets/logo.svg" alt="Utkarsh AI Logo" width="220" />
</p>

<h1 align="center">Utkarsh AI - Intelligent Large Language Model Suite</h1>

<p align="center">
  <strong>A high-performance, professional-grade AI Chatbot architecture designed for deep intelligence and seamless hardware integration.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-FastAPI%20%2b%20React-blueviolet.svg" alt="Architecture" />
  <img src="https://img.shields.io/badge/LLM-LangChain%20Engine-orange.svg" alt="LLM Engine" />
  <img src="https://img.shields.io/badge/Deployment-Docker%20Native-blue.svg" alt="Docker Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

---

## 🚀 Overview

**Utkarsh AI** is more than just a chatbot; it is a meticulously engineered LLM platform. Built with a **FastAPI** high-density backend and a **React/Vite** glassmorphism frontend, it delivers an ultra-responsive, premium user experience mapped against local and remote hardware acceleration.

## 🔍 Core Intelligence Features

### 🧠 Advanced LLM Orchestration
Go beyond basic prompting. Utkarsh AI utilizes **LangChain** and custom Pydantic-aware models to perform:
- **System Instruction Injection**: Forces consistent, professional behavioral profiles.
- **Parametric Chat Dynamics**: Real-time management of temperature, top-p, and context window.
- **Memory Subsystem**: Persistent conversation threading stored via a highly-indexed MySQL architecture.

### 🎨 Premium Visual Engine
The UI isn't just a skin—it's a performance-first interface built for speed:
- **Glassmorphism Design**: Minimalist, sleek aesthetic with ultra-smooth Framer Motion transitions.
- **High-Density Typography**: Optimized for long-form reading and code snippet visualization.
- **Dynamic Workspaces**: Collapsible sidebar architecture and auto-saving conversation states.

## 🛠 High-Performance Stack

| Category | Component | Technical Detail |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | State-managed via Redux Toolkit |
| **Backend** | FastAPI (Standard) | Uvicorn-driven async I/O |
| **Engine** | LangChain | Multi-provider support (OpenAI, HuggingFace, Groq) |
| **Database** | MySQL 8.0 | SQLAlchemy ORM for relational persistence |
| **Container** | Docker Compose | Orchestrated microservices (Front/Back/DB) |

## ⚙️ Operation & Deployment

### 1. Local Forensic Setup

**Backend Orchestration:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend Rendering:**
```bash
cd frontend
npm install
npm run dev
```

### 2. Standardized Docker Deployment
Utkarsh AI is native to the containerized ecosystem. Run the full forensic stack with zero configuration:

```bash
docker-compose up -d --build
```

- **Frontend Interface**: `http://localhost:80`
- **Backend API Layer**: `http://localhost:8000`

## 📊 Live Metrics & Logging
Utkarsh AI produces a high-density logs stream for performance analysis:
- **TTFT (Time to First Token)**: Sub-second latency on optimized endpoints.
- **Memory Bandwidth**: Optimized data movement between the LLM engine and the DB layer.
- **Inference Density**: High character-per-second throughput.

## 📜 License
This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

<p align="center">
  Built for the High-Performance AI Engineering Community by <strong>Utkarsh</strong>
</p>
