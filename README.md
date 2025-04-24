# 🌟 Full-stack Project with Supabase and Next.js

This project is a full-stack application with a **Supabase** backend and a **Next.js** frontend, using Docker for local development and deployment.

---

## ✅ Requirements

Before you begin, ensure you have the following installed:

- 🐳 [Docker](https://www.docker.com/)
- 🦕 [Deno v1.40.0+](https://deno.land/)
- 🟢 [Node.js v22.14.0](https://nodejs.org/en)
- 📦 [npm v10.9.2](https://www.npmjs.com/)

---

## 📁 Project Structure

```
.
├── client/                     # Next.js frontend
├── supabase/                   # Supabase backend (Edge Functions, DB, etc.)
├── docker-compose.yml          # Multi-container Docker setup
```

---

## 🚀 Getting Started

### 🏗️ Step-by-step

1. Clone the repository
   
```bash
git clone git@github.com:Code-Engine-Studio/ces-retro-tool.git
cd ces-retro-tool
```

2. Copy and update environment variables

```bash
cp client/.env.example client/.env
cp supabase/.env.example supabase/.env
```

3. Install frontend dependencies

```bash
cd client && npm install
```

4. Start the application

```bash
docker compose up --build -d && npx supabase start && npx supabase functions serve
```

---

## 📍 Local URLs

- **Frontend**: http://localhost:3000  
- **Supabase Studio**: http://localhost:54323  
