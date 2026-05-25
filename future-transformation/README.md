<div align="center">

<br/>

```
███████╗████████╗
██╔════╝╚══██╔══╝
█████╗     ██║   
██╔══╝     ██║   
██║        ██║   
╚═╝        ╚═╝   

```

# 🧠 Future Transformation
### AI-Powered Knowledge & Task Management System

<br/>

> *"Imagine having a super-smart helper inside your company who has read every single document — and can answer any question instantly."*
> That's exactly what this is. 🚀

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-FF6B35?style=for-the-badge)](https://trychroma.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

</div>

---

## 📖 Table of Contents

- [🤔 What Is This?](#-what-is-this)
- [💡 The Problem It Solves](#-the-problem-it-solves)
- [🌍 Real World Use Cases](#-real-world-use-cases)
- [✨ Features](#-features)
- [🏗️ System Architecture](#-system-architecture)
- [🗄️ Database Design](#-database-design)
- [🔄 How Data Flows](#-how-data-flows)
  - [👤 User Flow](#-user-flow)
  - [📄 Document Flow](#-document-flow)
  - [🔍 Query & Search Flow](#-query--search-flow)
  - [🧬 Embeddings Flow](#-embeddings-flow)
- [📁 Project Structure](#-project-structure)
- [🚀 Run Locally (Step by Step)](#-run-locally-step-by-step)
- [🔌 API Reference](#-api-reference)
- [🖥️ Screenshots](#-screenshots)
- [🛠️ Tech Stack](#-tech-stack)

---

## 🤔 What Is This?

Think of it like **"ChatGPT for your company's documents"** — but smarter and safer.

Most companies have tons of documents:
- 📋 HR policies
- 🔐 Security guidelines
- 💻 Onboarding manuals
- 📊 SOPs and workflows

The problem? **Nobody can find anything quickly.**

> A new employee joins. They want to know: *"How do I apply for emergency leave?"*
> 
> Without this system → Open 50-page PDF → Search manually → Ask HR → Wait → Waste time ⏳
> 
> With this system → Type the question → AI reads all documents → Get the exact answer in seconds ✅

That's the magic. **This system turns boring document folders into a living, searchable brain.**

---

## 💡 The Problem It Solves

```
❌  BEFORE (The Old Way)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Employee has a question
        ↓
  Searches through 10 PDFs
        ↓
  Asks a senior colleague
        ↓
  Waits for reply
        ↓
  Still not sure if answer is right
        ↓
  Time wasted. Work delayed. 😤


✅  AFTER (With This System)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Employee has a question
        ↓
  Types it into the AI search bar
        ↓
  System searches ALL company docs
        ↓
  Returns exact, grounded answer
        ↓
  Employee completes task
        ↓
  Fast. Accurate. Done. 🎉
```

---

## 🌍 Real World Use Cases

| Industry | How They'd Use It |
|----------|-------------------|
| 🏢 **Corporates** | New employees find HR policies, leave rules, IT setup guides instantly |
| 🏥 **Hospitals** | Doctors search medical protocols, drug interaction guides, patient forms |
| 🏫 **Universities** | Students and staff query academic regulations and course handbooks |
| ⚖️ **Law Firms** | Lawyers search case precedents and compliance documents |
| 🏗️ **Manufacturing** | Workers look up safety SOPs and equipment maintenance guides |
| 💻 **Tech Companies** | Developers find onboarding guides, coding standards, deployment docs |

---

## ✨ Features

### 👑 Admin Features
- 🔐 Secure login with role-based access
- 📤 Upload company documents (PDF / TXT)
- 🤖 Automatic AI processing of uploaded documents
- 📝 Create and assign tasks to users
- 📊 View analytics — completed tasks, search activity
- 🔍 Review user submissions

### 👤 User Features
- 🔐 Secure login
- 📋 View all assigned tasks
- 🧠 Ask questions using natural language AI search
- 📄 Read AI-generated answers grounded in company documents
- ✅ Submit completed task responses
- 📜 Activity history

### 🤖 AI Features
- Converts documents into **vector embeddings** (numerical brain-food for AI)
- Uses **semantic search** — finds meaning, not just keywords
- Retrieves the most relevant document chunks
- Generates grounded answers (no hallucination — answers come from YOUR documents)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FUTURE TRANSFORMATION                        │
│                     AI Knowledge & Task System                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                                       │
    ┌─────────▼─────────┐                 ┌──────────▼──────────┐
    │    ADMIN LOGIN     │                 │     USER LOGIN       │
    └─────────┬─────────┘                 └──────────┬──────────┘
              │                                       │
    ┌─────────▼─────────┐                 ┌──────────▼──────────┐
    │   Admin Dashboard  │                 │    User Dashboard    │
    │                   │                 │                      │
    │  • Upload Docs    │                 │  • View Tasks        │
    │  • Assign Tasks   │                 │  • AI Search         │
    │  • View Analytics │                 │  • Submit Work       │
    │  • Manage Users   │                 │  • View History      │
    └─────────┬─────────┘                 └──────────┬──────────┘
              │                                       │
              └──────────────┬────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │        FASTAPI BACKEND       │
              │      (Python REST APIs)      │
              └──────────────┬──────────────┘
                             │
           ┌─────────────────┼──────────────────┐
           │                 │                  │
  ┌────────▼───────┐ ┌───────▼──────┐ ┌────────▼────────┐
  │   MySQL DB      │ │  ChromaDB    │ │  Gemini AI API  │
  │                 │ │  (Vectors)   │ │                 │
  │  • users        │ │              │ │  Embedding +    │
  │  • tasks        │ │  Document    │ │  Answer Gen     │
  │  • documents    │ │  Embeddings  │ │                 │
  │  • submissions  │ │  Stored Here │ │                 │
  │  • activity_log │ │              │ │                 │
  └─────────────────┘ └──────────────┘ └─────────────────┘
```

---

## 🗄️ Database Design

```sql
┌──────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                       │
└──────────────────────────────────────────────────────────┘

  ┌────────────┐       ┌──────────────┐       ┌───────────────┐
  │   roles    │       │    users     │       │     tasks     │
  ├────────────┤       ├──────────────┤       ├───────────────┤
  │ PK id      │◄──┐   │ PK id        │◄──┐   │ PK id         │
  │ name       │   │   │ name         │   │   │ title         │
  │ created_at │   └───│ FK role_id   │   │   │ description   │
  └────────────┘       │ email        │   │   │ FK assigned_to│───┐
                       │ password     │   │   │ status        │   │
                       │ created_at   │   │   │ created_at    │   │
                       └──────────────┘   │   └───────────────┘   │
                                          │                        │
  ┌─────────────────┐                     └────────────────────────┘
  │    documents    │
  ├─────────────────┤
  │ PK id           │       ┌──────────────────────┐
  │ filename        │       │    activity_logs      │
  │ file_path       │       ├──────────────────────┤
  │ uploaded_by     │       │ PK id                 │
  │ created_at      │       │ FK user_id            │
  └─────────────────┘       │ action (login/search) │
                            │ details               │
                            │ created_at            │
                            └──────────────────────┘
```

---

## 🔄 How Data Flows

### 👤 User Flow

```
  New User Registers / Admin Creates Account
                    │
                    ▼
           User opens the website
                    │
                    ▼
             Logs in securely
            (JWT token issued)
                    │
                    ▼
        Lands on Personal Dashboard
                    │
           ┌────────┴────────┐
           │                 │
           ▼                 ▼
     View Assigned       Search AI
        Tasks           Knowledge
           │                 │
           ▼                 ▼
     Open a Task      Get AI Answer
           │                 │
           └────────┬────────┘
                    │
                    ▼
           Write Response / Summary
                    │
                    ▼
              Submit Task ✅
                    │
                    ▼
        Admin receives submission
```

---

### 📄 Document Flow

```
  Admin uploads a PDF or TXT file
              │
              ▼
   ┌──────────────────────────┐
   │    File Upload API        │
   │   POST /documents/upload  │
   └──────────────────────────┘
              │
              ▼
   File saved to server storage
   Metadata saved in MySQL DB
              │
              ▼
   ┌──────────────────────────────┐
   │    AI Processing Pipeline    │
   │                              │
   │  1. Extract raw text         │
   │         ↓                    │
   │  2. Split into chunks        │
   │     (paragraphs ~500 chars)  │
   │         ↓                    │
   │  3. Generate embeddings      │
   │     (each chunk → numbers)   │
   │         ↓                    │
   │  4. Store in ChromaDB        │
   │     (vector database)        │
   └──────────────────────────────┘
              │
              ▼
   Document is now SEARCHABLE 🎉
   Ready for AI queries
```

---

### 🔍 Query & Search Flow

```
  User types a question:
  "How do I apply for emergency leave?"
                │
                ▼
      ┌─────────────────────┐
      │   POST /search       │
      │   { query: "..." }   │
      └─────────────────────┘
                │
                ▼
      Query converted to embedding
      (numbers that represent meaning)
                │
                ▼
      ┌─────────────────────────────────┐
      │    ChromaDB Similarity Search    │
      │                                  │
      │  Find top-3 most similar chunks  │
      │  from all stored documents       │
      └─────────────────────────────────┘
                │
                ▼
      Most relevant document chunks
      retrieved (e.g. from HR Policy PDF)
                │
                ▼
      ┌─────────────────────────────────┐
      │       Gemini AI (LLM)           │
      │                                  │
      │  Context: [retrieved chunks]     │
      │  Question: [user's question]     │
      │  → Generate a clear answer       │
      └─────────────────────────────────┘
                │
                ▼
      Answer shown to user with
      source document reference ✅
```

---

### 🧬 Embeddings Flow

> *Think of embeddings like GPS coordinates — but for meaning.*
> Similar sentences get similar coordinates. So "leave request" and "absence form" end up close together.

```
  DOCUMENT TEXT (Raw)
  ─────────────────────────────────────────────────────
  "Employees are eligible for 12 days of casual leave
   per year. Leave must be applied 2 days in advance."
  ─────────────────────────────────────────────────────
                │
                ▼  AI Embedding Model
  ─────────────────────────────────────────────────────
  [ 0.231, -0.847, 0.512, 0.099, -0.334, 0.781, ... ]
    768 numbers that represent the MEANING of the text
  ─────────────────────────────────────────────────────
                │
                ▼  Stored in ChromaDB
  ─────────────────────────────────────────────────────
  ChromaDB stores:
    • The embedding (numbers)
    • The original text chunk
    • The document it came from
  ─────────────────────────────────────────────────────

  LATER — When User Searches:
  ─────────────────────────────────────────────────────
  User query: "How many leaves do I get?"
        │
        ▼ Converted to embedding
  [ 0.219, -0.831, 0.498, 0.104, -0.318, 0.762, ... ]
        │
        ▼ Compare with stored embeddings
  VERY SIMILAR to the chunk above! ✅
        │
        ▼ Return that chunk as context → Generate answer
  ─────────────────────────────────────────────────────

  WHY THIS IS POWERFUL:
  "leave request" ≈ "absence application" ≈ "time off form"
  AI understands they mean the SAME thing. Keyword search doesn't!
```

---

## 📁 Project Structure

```
future-transformation/
│
├── 📁 backend/                     ← Python FastAPI Backend
│   ├── 📄 main.py                  ← App entry point
│   ├── 📄 requirements.txt         ← Python dependencies
│   ├── 📄 .env.example             ← Config template
│   │
│   ├── 📁 routers/                 ← API route handlers
│   │   ├── auth.py                 ← Login, logout, register
│   │   ├── documents.py            ← Upload & manage docs
│   │   ├── tasks.py                ← CRUD for tasks
│   │   ├── search.py               ← AI semantic search
│   │   └── analytics.py            ← Stats & reporting
│   │
│   ├── 📁 models/                  ← Database table definitions
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── document.py
│   │   └── activity_log.py
│   │
│   ├── 📁 services/                ← Business logic
│   │   ├── ai_service.py           ← Embeddings + search
│   │   ├── auth_service.py         ← JWT handling
│   │   └── document_service.py     ← Processing pipeline
│   │
│   └── 📁 uploads/                 ← Uploaded files stored here
│
├── 📁 frontend/                    ← React.js Frontend
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   │
│   └── 📁 src/
│       ├── 📄 App.jsx              ← Routes & layout
│       ├── 📁 pages/
│       │   ├── Login.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── UserDashboard.jsx
│       │   ├── Documents.jsx
│       │   ├── Tasks.jsx
│       │   └── Analytics.jsx
│       │
│       ├── 📁 components/
│       │   ├── SearchBar.jsx       ← AI search UI
│       │   ├── TaskCard.jsx
│       │   └── Navbar.jsx
│       │
│       └── 📁 services/
│           └── api.js              ← Axios API calls
│
└── 📄 README.md                    ← You are here! 👋
```

---

## 🚀 Run Locally (Step by Step)

> ⚡ Total setup time: ~10–15 minutes. You got this!

### 🛠️ What You Need First

Make sure these are installed on your computer:

| Tool | Why | Download |
|------|-----|----------|
| **Python 3.10+** | Runs the backend | [python.org](https://python.org/downloads) |
| **Node.js 18+** | Runs the frontend | [nodejs.org](https://nodejs.org) |
| **MySQL 8.0+** | Stores all data | [mysql.com](https://dev.mysql.com/downloads/mysql) |

---

### Step 1 — Extract the ZIP

Download and unzip the project:

```bash
# After unzipping, go into the project folder
cd future-transformation
```

---

### Step 2 — Create MySQL Database

Open MySQL (Workbench or terminal) and run:

```sql
CREATE DATABASE ft_knowledge;
```

---

### Step 3 — Backend Setup

```bash
# Go into the backend folder
cd backend

# Copy the example config file
cp .env.example .env
```

Now open `.env` in any text editor and fill in your details:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost/ft_knowledge
SECRET_KEY=any-long-random-secret-string-here-123456
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
```

> 💡 Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

```bash
# Create a Python virtual environment (keeps things clean)
python -m venv venv

# Activate it — Mac/Linux:
source venv/bin/activate

# Activate it — Windows:
venv\Scripts\activate

# Install all Python packages
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```

✅ **Backend running at:** `http://localhost:8000`  
📖 **API docs at:** `http://localhost:8000/docs`

---

### Step 4 — Frontend Setup

Open a **new terminal window** and run:

```bash
# Go into the frontend folder
cd frontend

# Install Node packages
npm install

# Start the frontend
npm run dev
```

✅ **Frontend running at:** `http://localhost:5173`

---

### Step 5 — Open & Use the App

Go to **`http://localhost:5173`** in your browser.

**Default Admin Login:**
```
Email:    admin@futuretransformation.com
Password: Admin@123
```

---

### 🎯 First Time Setup Checklist

Do these steps in order after logging in as Admin:

```
[ ] 1. Login as Admin
[ ] 2. Go to Documents → Upload your PDF files
[ ] 3. Go to Users → Create user accounts
[ ] 4. Go to Tasks → Create tasks and assign to users
[ ] 5. Logout → Login as a User
[ ] 6. Open an assigned task
[ ] 7. Use the AI Search bar to find information
[ ] 8. Write your response and click Submit ✅
```

> 🔁 Keep **both terminals** (backend + frontend) running while using the app.

---

## 🔌 API Reference

| Method | Endpoint | Who Can Use | What It Does |
|--------|----------|-------------|--------------|
| `POST` | `/auth/login` | Everyone | Login and get JWT token |
| `POST` | `/auth/register` | Admin | Create a new user |
| `GET` | `/tasks` | User/Admin | Get all tasks |
| `POST` | `/tasks` | Admin | Create a new task |
| `PATCH` | `/tasks/{id}` | User | Update task status |
| `GET` | `/tasks?status=completed` | Admin | Filter tasks by status |
| `GET` | `/tasks?assigned_to=1` | Admin | Filter by user |
| `POST` | `/documents/upload` | Admin | Upload a document |
| `GET` | `/documents` | Admin | List all documents |
| `POST` | `/search` | User | AI semantic search |
| `GET` | `/analytics` | Admin | View system stats |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        TECH STACK                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🖥️  FRONTEND                                               │ 
│     React.js 18     — UI framework                          │
│     Vite             — Lightning fast dev server            │
│     Axios            — API communication                    │
│     React Router     — Page navigation                      │
│                                                             │
│  ⚙️  BACKEND                                                │
│     Python 3.10+    — Core language                         │
│     FastAPI          — REST API framework                   │
│     SQLAlchemy       — Database ORM                         │
│     PyJWT            — Authentication tokens                │
│     Uvicorn          — ASGI server                          │
│                                                             │
│  🗄️  DATABASE                                               │
│     MySQL 8.0        — Relational data (users, tasks, docs) │
│     ChromaDB         — Vector embeddings storage            │
│                                                             │
│  🤖  AI / ML                                                │
│     Google Gemini    — LLM for answer generation            │
│     Sentence Transformers — Text embeddings                 │
│     RAG Architecture — Retrieval-Augmented Generation       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 How RAG Works (Simple Explanation)

> **RAG = Retrieval-Augmented Generation**
> Fancy name, simple idea: *"Look it up first, then answer."*

```
  Normal AI (ChatGPT):          Your System (RAG):
  ─────────────────────         ──────────────────────────────
  Question → AI Brain           Question
  → Might hallucinate! ❌            ↓
                                Search YOUR documents first
                                     ↓
                                Find the relevant parts
                                     ↓
                                Give those to AI as context
                                     ↓
                                AI answers from YOUR content ✅
                                → Grounded. Accurate. Trusted.
```

---

<div align="center">

---

Made with 🧠 + ❤️ by **Future Transformation**

*Turning company knowledge into intelligent conversation.*

---

</div>