<p align="center">
  <img src="assets/logo.png" alt="Utkarsh-NexusAI Logo" width="200" />
</p>

<h1 align="center">Utkarsh-NexusAI</h1>

<p align="center">
  <strong>A premium, modern AI Chatbot experience built with high-performance technologies.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained: Yes" />
  <img src="https://img.shields.io/badge/Docker-ready-blue.svg" alt="Docker: Ready" />
</p>

---

## 🚀 Overview

**Utkarsh-NexusAI** is a sophisticated chatbot application designed for visual elegance and seamless performance. It features a robust FastAPI backend, a stunning React (Vite) frontend with glassmorphism design, and deep integration with LLMs via LangChain.

## ✨ Key Features

- **Premium UI**: Modern dark mode with glassmorphism, smooth animations (Framer Motion), and responsive layouts.
- **Secure Authentication**: JWT-based login and signup system.
- **Persistent Chat History**: Securely store and retrieve user conversations using MySQL.
- **LLM Integration**: Flexible backend powered by LangChain for high-quality AI responses.
- **Dockerized Ready**: Deploy anywhere in seconds using Docker and Docker Compose.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/).
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy](https://www.sqlalchemy.org/), [MySQL](https://www.mysql.com/), [LangChain](https://www.langchain.com/).
- **DevOps**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/).

## ⚙️ Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional, for deployment)

### 2. Local Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Deployment with Docker

Deploy the full stack (Frontend, Backend, and Database) with a single command:

```bash
docker-compose up -d --build
```

Access the application at:
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:8000`

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Utkarsh
</p>
