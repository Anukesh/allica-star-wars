# Allica Star Wars App 🚀

A React + TypeScript + Vite web application that integrates with the Star Wars API (SWAPI), built using modern tools, best practices, and comprehensive tests.

---

## 🛠️ Tech Stack

- **React 18** (with Hooks & functional components)
- **TypeScript** for static typing
- **Vite** for fast development and optimized builds
- **Vitest** + **React Testing Library** for unit and integration testing
- **Redux Toolkit (RTK Query)** for state management and API handling
- **ESLint** & **Prettier** for code quality and formatting
- **CSS Modules / SCSS** for styling
- **GitHub Actions / Azure Pipelines** (for CI/CD)

---

## 📁 Project Structure

```
allica-star-wars/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Icons, images
│   ├── components/          # Reusable components
│   ├── pages/               # Top-level route views
│   ├── store/               # Redux slices and API logic
│   ├── hooks/               # Custom hooks
│   ├── types/               # Global TypeScript types
│   ├── utils/               # Utility functions
│   └── App.tsx              # Root component
├── tests/                   # Custom test utilities or mocks
├── .eslintrc / eslint.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---
## ⚠️ Important Note

This project uses [https://swapi.dev](https://swapi.dev) to fetch Star Wars data.

Due to an invalid SSL certificate on the API, Chrome may block requests.

### ✅ To Fix:

1. Open [https://swapi.dev](https://swapi.dev) in Chrome.
2. If you see a “Your connection is not private” warning:
   - Click **Advanced** → **Proceed to swapi.dev (unsafe)**.
   - Or type `thisisunsafe` anywhere on the screen to continue.

> This is required only once to allow the app to fetch dynamic content.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Anukesh/allica-star-wars.git
cd allica-star-wars

# Install dependencies
npm install
```

---

## 🚀 Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✅ Testing

```bash
# Run all test suites
npm test

# Watch mode
npm run test:watch

# Test coverage
npm run coverage
```

---

## 🔍 Linting & Formatting

```bash
# Lint code
npm run lint

# Fix lint errors
npm run lint:fix

# Format code using Prettier
npm run format
```

### ESLint Configuration (Type-Aware + React Plugins)

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## 🌐 API Integration

The app fetches data from [SWAPI (Star Wars API)](https://swapi.dev/) using **Redux Toolkit Query**. This handles:

- Caching
- Auto-fetching
- Loading state
- Error handling
- Auto-retries

---

## 🧪 Testing Strategy

- Unit tests for Redux slices and components
- Integration tests for pages (search, filters, URL updates)
- Snapshot tests for stable UI rendering

---

## ⚙️ CI/CD Setup (Optional)

Ready for integration with:

- **GitHub Actions**
- **Azure Pipelines**
- **Netlify / Vercel / Firebase Hosting**

Add a `.github/workflows/ci.yml` for automated linting and testing.

---
