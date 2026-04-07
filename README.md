# InsightPress 🚀

**InsightPress** is a modern, AI-augmented blogging platform designed to make writing and sharing ideas effortless. Built with **FastAPI**, **React**, and **MongoDB**, it features a powerful rich-text editor and an intelligent AI assistant to help you draft, polish, and refine your content.

---

## ✨ Key Features

### ✍️ Advanced Writing Experience
*   **Rich Text Editor**: Integrated **Tiptap** editor for a smooth, notion-like writing experience. Supports formatting, lists, code blocks, and more.
*   **Sanitized HTML Rendering**: Securely displays rich content while protecting against XSS attacks.
*   **Code Block Support**: Automatically handles horizontal scrolling for wide code snippets.

### 🤖 AI Writing Assistant
Powered by the `minimax/minimax-m2.5:free` model (via OpenRouter), InsightPress helps you write better:
*   **Generate Outline**: Stuck on where to start? Generate a structured HTML outline from just a title.
*   **Polish Content**: Turn rough drafts into professional, engaging prose.
*   **Get Suggestions**: Receive actionable tips to improve your writing style and tone.
*   **Smart Summaries**: Automatically generates concise, robust plain-text summaries for your blog posts.
*   **Sentiment Analysis**: Detects the mood of your content (e.g., Positive, Neutral, Creative).

### 🎨 Premium & Responsive UI
*   **Design System**: Custom Tailwind V4 aesthetic utilizing rich gradients, unified tokens, pulse-soft animations, and refined drop-shadows.
*   **Typography Engine**: Utilizes `@tailwindcss/typography` to elegantly and natively render raw AI HTML outputs and Tiptap rich-text blocks.
*   **Responsive Layout**: Handcrafted layout featuring horizontal feature cards, an expanded ambient footer, and fully responsive breakpoints.
*   **Interactive Architecture**: Distinct AI loading indicators separated from application-level states, preventing form collision.

### 🔐 Simplified Ownership
*   **Edit Keys**: No complex user accounts. Secure your posts with a simple "Edit Key" (passphrase) that is hashed and stored securely.
*   **Full Control**: Edit or delete your posts anytime using your unique key.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), TailwindCSS, Radix UI, Lucide Icons, Tiptap.
*   **Backend**: Python FastAPI, Motor (Async MongoDB), Pydantic V2.
*   **Database**: MongoDB
*   **DevOps**: Docker & Docker Compose.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v20 or higher)
*   **Python** (3.9 or higher)
*   **Docker** (optional, recommended for easy setup)

### 1. Configuration (.env)
Create a `.env` file in the root directory (`insightpress/`) to store your secrets.
**Note:** This file is git-ignored for security.

```ini
# Database Connection (Use MongoDB Atlas for Cloud, or localhost for local dev)
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/
DATABASE_NAME=insightpress

# CORS Settings
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# OpenRouter AI API (Required for AI features)
AI_API_KEY=sk-or-v1-your-secret-key...
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
```

### 2. Run with Docker (Recommended)
The easiest way to run the entire stack.

```bash
docker-compose up --build
```
*   **Frontend**: http://localhost:3000
*   **Backend Support**: http://localhost:8000

### 3. Run Locally (Development)

#### Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload


#### Frontend
```bash
cd frontend
npm install
npm run dev

---

## 📝 API Documentation
Once the backend is running, visit **http://localhost:8000/docs** for the interactive Swagger UI documentation to explore all API endpoints.
