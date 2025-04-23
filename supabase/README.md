# 🧩 Supabase Backend - Project Setup

This repository contains the backend setup using **Supabase**, including:

- Edge Functions (Deno)
- SQL migrations
- Database schema
- Local development using Docker

---

## ✅ Requirements

Make sure you have the following installed before getting started:

- 🐳 [Docker](https://www.docker.com/) – containerized services
- 🦕 [Deno v1.40.0+](https://deno.land/) – required to run Supabase edge functions locally

---

## 📁 Folder Structure

```
.
supabase/
├── functions/                   # Edge functions written in Deno
│   ├── import_map.json          # A top-level import map to use across functions.
│   ├── _shared
│   │   └── supabaseAdmin.ts     # Supabase client with SERVICE_ROLE key.
│   │   └── supabaseClient.ts    # Supabase client with ANON key.
│   │   └── cors.ts              # Reusable CORS headers.
│   ├── function-one/            # Function entry point
│   │   └── index.ts
│   ├── function-two/
│   │   └── index.ts
│   └── tests/                   # Functions' tests
│       └── function-one-test.ts
│       └── function-one-test.ts
├── schemas/                     # Database schema files
│   ├── users.sql
├── migrations/                  # SQL migration files
│   ├── 20240401_init.sql
│   └── 20240415_add-users.sql
├── seed/                        # Seed scripts
│   └── users.sql
├── config.toml                  # Supabase project config

```

---

## 🚀 Getting Started

### 🛠️ Start Supabase Locally

```bash
npx supabase start && npx supabase functions serve
```
Studio URL: http://localhost:54323

### 🔗 Connect to Supabase project

Login to the CLI

```bash
npx supabase login
```

Get your project ID

```bash
npx supabase projects list
```

Link your local project

```bash
npx supabase link --project-ref your-project-id
```

---

## ⚡ Edge Functions

Located in `supabase/functions/`.

### Create a New Function

```bash
npx supabase functions new hello-world
```

### Deploy Functions

Deploy all functions

```bash
npx supabase functions deploy
```

Deploy specific functions

```bash
npx supabase functions deploy hello-world
```

---

## 🧬 Database Schema & Migrations

### Declare schema

1. Stop the local database

```bash
npx supabase stop
```

2. Create schema file

`supabase/schemas/users.sql`
```
create table "users" (
  "id" integer not null,
  "name" text
);
```

3. Generate migration file

```bash
npx supabase db diff -f create_users_table
```

4. Apply the pending migration

```bash
npx supabase start && npx supabase migration up
```

### Deploying schema changes

To deploy database changes

```bash
npx supabase db push
```
