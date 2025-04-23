# ⚛️ Next.js Frontend Architecture

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## ✅ Requirements

Ensure the following are installed on your system:

- 🟢 [Node.js v22.14.0](https://nodejs.org/en)
- 📦 [npm v10.9.2](https://www.npmjs.com/)

---

## 📁 Project Structure

```
src/
├── app/             # App directory and routing
├── assets/          # Static files: images, fonts, etc.
├── components/      # Shared UI components
├── config/          # Global configuration and env exports
├── features/        # Feature-based modules
├── hooks/           # Shared hooks
├── lib/             # Reusable utility libraries
├── stores/          # Global state stores
├── testing/         # Test utilities and mocks
├── types/           # Shared TypeScript types
├── utils/           # Shared utility functions
```

---

## 🚀 Getting Started

### 🏗️ Step-by-step

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧱 Feature Folder Pattern

To improve scalability and separation of concerns, organize most domain-specific logic within the `features/` folder. This ensures each feature is self-contained and easier to maintain.

### 📦 Feature Folder Example

```
src/features/awesome-feature/
├── api/         # API calls and hooks related to the feature
├── assets/      # Static assets for this feature
├── components/  # UI components scoped to this feature
├── hooks/       # Custom hooks used by the feature
├── stores/      # Local state management
├── types/       # Feature-specific types
├── utils/       # Utility functions used by the feature
```

This architecture encourages modular development, simplifies maintenance, and improves team collaboration by keeping feature logic isolated from shared concerns.
