
# AI Chatbot Project

This project is a full-stack AI Chatbot application with a modern React frontend (using Vite), Redux state management, and a backend/database structure (to be implemented). The frontend features a ChatGPT-style UI, chat input, suggestions, and state management for user input.

## Features

- Modern React + Vite frontend
- ChatGPT-style chat interface
- Chat suggestions for quick prompts
- Redux Toolkit for state management
- Modular component structure (ChatHero, ChatInputDock)
- Ready for backend and database integration

## Project Structure

```
backend/           # Placeholder for backend API server
database/          # Placeholder for database logic
frontend/
  ├─ public/       # Static assets
  ├─ src/
  │   ├─ App.jsx   # Main App component
  │   ├─ main.jsx  # Entry point
  │   ├─ assets/   # Images, icons, etc.
  │   ├─ components/
  │   │   ├─ ChatHero.jsx
  │   │   └─ ChatInputDock.jsx
  │   └─ redux/
  │       ├─ slice.js
  │       └─ store.js
  ├─ index.html
  ├─ package.json
  └─ vite.config.js
```

## Frontend Flow

1. **User** interacts with the chat UI in the browser.
2. **main.jsx** renders the **App** component, wrapped with Redux Provider.
3. **App.jsx** uses modular components:
	- **ChatHero**: Displays chat messages, suggestions, and header.
	- **ChatInputDock**: Handles user input and sending messages.
4. **Redux** manages the chat input state (via `slice.js` and `store.js`).
5. (Planned) API calls to backend for AI responses and database storage.

## Flow Diagram

```mermaid
graph TD
  User[User] -->|Interacts| Frontend[Frontend (React + Vite)]
  Frontend -->|API Calls| Backend[Backend (API Server)]
  Backend -->|CRUD| Database[Database]
  Frontend -->|Redux| State[Redux Store]
  Frontend -->|Components| ChatHero[ChatHero Component]
  Frontend -->|Components| ChatInputDock[ChatInputDock Component]
  State -->|slice.js| Slice[Redux Slice]
  State -->|store.js| Store[Redux Store Config]
  Frontend -->|Assets| Assets[Assets Folder]
  Frontend -->|Static| Public[Public Folder]
  Frontend -->|Entry| Main[main.jsx]
  Main -->|Renders| App[App.jsx]
  App -->|Uses| Components[Components]
  Components -->|Chat| ChatHero
  Components -->|Input| ChatInputDock
```

## Setup & Usage

1. Install dependencies:
	```bash
	cd frontend
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How it Works

- The user sees a chat interface with suggestions.
- Clicking a suggestion injects it into the input box (via Redux state).
- Sending a message displays it in the chat; a dummy AI response is shown (UI only).
- The structure is ready for backend and database integration for real AI responses and persistence.

---
**Author:** Abakash Das
**Date:** February 2026



ChatHero.jsx        → handles API + state
ChatMessages.jsx    → handles rendering + auto scroll
ChatInputDock.jsx   → input
