<div align="center">

<img src="assets/logo.svg" alt="Utkarsh AI Logo" width="120" />

# ✦ Utkarsh AI

### *A Production-Grade Intelligent Conversational Assistant*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-utkarsh--sage--ten.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://utkarsh-sage-ten.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46e3b7?style=for-the-badge&logo=render&logoColor=white)](https://utkarsh-ai-chatbot.onrender.com)
[![Database](https://img.shields.io/badge/Database-Railway_MySQL-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=flat-square)](https://www.langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

</div>

---

## 🌐 Live Application

> **[https://utkarsh-sage-ten.vercel.app/](https://utkarsh-sage-ten.vercel.app/)**

Fully deployed across three cloud platforms — sign up, chat, and have your conversations auto-saved. No credit card. No setup.

---

## 🧠 What is Utkarsh AI?

Utkarsh AI is a **full-stack, production-deployed AI chat platform** built from scratch. It combines a high-performance FastAPI backend with a glassmorphism React frontend, persistent conversation storage in MySQL, and secure JWT-based user authentication — all stitched together with a modern multi-provider LLM engine via LangChain.

Think of it as a personal ChatGPT — but **you own the stack**.

---

## ✨ Feature Breakdown

### 🔐 Authentication System
- **JWT Tokens** — Secure `HS256`-signed tokens with 7-day expiry
- **Password Hashing** — bcrypt with SHA-256 pre-hashing (immune to the 72-byte bcrypt limit)
- **Protected Routes** — All conversation endpoints require a valid Bearer token
- **Persistent Sessions** — Token stored in `localStorage`, auto-restored on page load

### 💬 Intelligent Chat Engine
- **Streaming conversations** — Full message history sent to LLM on every turn for contextual replies
- **Multi-provider LLM** — LangChain backend supports OpenAI, HuggingFace, Groq, and Anthropic via config
- **Markdown rendering** — Full `react-markdown` + `remark-gfm` support with syntax-highlighted code blocks
- **Copy-to-clipboard** — One-click copy button on every code block
- **Prompt suggestions** — Randomized smart prompts to get you started instantly

### 🗂️ Conversation Management
- **Auto-save** — Every message (user + AI) is saved to the database in real-time
- **Named conversations** — First message is used as the conversation title automatically
- **Sidebar history** — Browse, load, and restore any past conversation
- **New chat** — Instantly reset to a clean slate

### 🎨 Premium UI / UX
- **Glassmorphism design** — Dark `#0b0d14` base with translucent card layers
- **Framer Motion** — Smooth enter/exit animations on every panel and message
- **Animated gradient logo** — Neural network SVG with pulsing indigo-to-purple gradient
- **Responsive layout** — Works from mobile to 4K; sidebar collapses automatically on small screens
- **Custom scrollbar** — Styled to match the dark theme

### 📊 Observability
- **Langfuse integration** — Every LLM call is traced with latency, tokens, and prompt details
- **Structured error logging** — Full tracebacks printed on any server-side error

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (React 19)                    │
│  AuthContext (JWT) → Redux Store → Framer Motion UI      │
└───────────────────────────┬──────────────────────────────┘
                            │  HTTPS + Bearer Token
                            ▼
┌──────────────────────────────────────────────────────────┐
│              FastAPI Backend (Render)                    │
│  CORSMiddleware → Auth Routes → /chat → /chathistory     │
│  LangChain Engine (Groq / HuggingFace / OpenAI)         │
└───────────────────────────┬──────────────────────────────┘
                            │  SQLAlchemy ORM
                            ▼
┌──────────────────────────────────────────────────────────┐
│              MySQL 8.0 (Railway)                         │
│  tables: users · conversations · chat_messages           │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite | Component-based reactive UI |
| **Styling** | Tailwind CSS | Utility-first design with custom theme |
| **Animations** | Framer Motion | Page/component transitions |
| **State** | Redux Toolkit | Global text state |
| **Auth Context** | React Context API | JWT token & user management |
| **Backend** | FastAPI + Uvicorn | Async REST API |
| **ORM** | SQLAlchemy | Database abstraction |
| **Auth** | python-jose + bcrypt | JWT creation & password hashing |
| **LLM Engine** | LangChain | Multi-provider model orchestration |
| **Database** | MySQL 8.0 | Persistent conversation & user storage |
| **Observability** | Langfuse | LLM call tracing & analytics |
| **Container** | Docker | Reproducible local dev environment |

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     DATETIME DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  user_id      INT,
  title        VARCHAR(255) DEFAULT 'New Conversation',
  is_public    BOOLEAN DEFAULT FALSE,
  timestamp    DATETIME DEFAULT NOW() ON UPDATE NOW(),
  conversation TEXT   -- JSON array of {role, content} messages
);
```

---

## ⚡ Local Development

### Prerequisites
- Python 3.11+
- Node 20+
- MySQL 8.0 (or a Railway connection string)

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Fill in your .env (see .env.example)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Docker (full stack)
```bash
docker-compose up -d --build
# Frontend → http://localhost:80
# Backend  → http://localhost:8000
```

---

## 🔒 Environment Variables

### Backend (`.env`)
| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `DATABASE_URL` | Full connection string (overrides above) |
| `JWT_SECRET_KEY` | Secret for signing JWT tokens |
| `FRONTEND_URL` | Comma-separated allowed CORS origins |
| `LANGFUSE_PUBLIC_KEY` | Langfuse observability key |
| `LANGFUSE_SECRET_KEY` | Langfuse observability secret |

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [utkarsh-sage-ten.vercel.app](https://utkarsh-sage-ten.vercel.app/) |
| **Backend** | Render | [utkarsh-ai-chatbot.onrender.com](https://utkarsh-ai-chatbot.onrender.com) |
| **Database** | Railway (MySQL 8) | Private / Railway internal |

---

## 📂 Project Structure

```
Utkarsh-AI-Chatbot/
├── backend/
│   ├── main.py          # FastAPI app, routes, CORS
│   ├── auth.py          # JWT + bcrypt password logic
│   ├── db.py            # SQLAlchemy models & session
│   ├── llm_config.py    # LangChain LLM setup
│   ├── model.py         # Pydantic request/response models
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root layout, sidebar, header
│   │   ├── components/
│   │   │   ├── ChatHero.jsx     # Main chat interface
│   │   │   ├── ChatSidebar.jsx  # Conversation history
│   │   │   ├── ChatInputDock.jsx
│   │   │   └── Auth/
│   │   │       ├── Login.jsx
│   │   │       └── Signup.jsx
│   │   └── context/
│   │       └── AuthContext.jsx  # JWT token & user state
│   ├── public/logo.svg
│   └── index.html
├── assets/
│   ├── logo.svg
│   └── logo.png
└── docker-compose.yml
```

---

## 📜 License

MIT © [Abakash Ronny](https://github.com/AbakashRonny)

---

<div align="center">
  <sub>Built with ♥ using FastAPI + React + LangChain</sub>
</div>
