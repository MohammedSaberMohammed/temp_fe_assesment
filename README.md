# MSaber Frontend

A modern React dashboard application with TypeScript, Tailwind CSS, and D3.js charts.

## Features

- Interactive dashboard with D3.js charts
- Multi-currency support with real-time exchange rates
- Responsive design with mobile support
- Modern UI with Tailwind CSS
- TypeScript for type safety

## Development

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
npm run format:check
```

## Git Hooks (Husky)

This project uses Husky to ensure code quality before commits and pushes.

### Pre-commit Hook

Before each commit, the following checks are automatically run:

1. **Lint-staged**: Runs ESLint and Prettier on staged files only (fast)

### Pre-push Hook

Before pushing to the repository:

1. **Linting**: Runs full ESLint check on all files
2. **Build**: Ensures the project builds successfully

### Configuration

- **Husky**: Git hooks management
- **lint-staged**: Runs linters on staged files only
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting

### Files

- `.husky/pre-commit`: Pre-commit hook script
- `.husky/pre-push`: Pre-push hook script
- `package.json`: lint-staged configuration

### Manual Testing

You can test the hooks manually:

```bash
# Test lint-staged
npx lint-staged

# Test pre-commit hook
npx husky run .husky/pre-commit

# Test pre-push hook
npx husky run .husky/pre-push
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # D3.js chart components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
│   └── locales/        # Translation files
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API and data services
├── utils/              # Utility functions
└── models/             # TypeScript interfaces
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **D3.js** - Data visualization
- **Vite** - Build tool
- **i18next** - Internationalization
- **Husky** - Git hooks
- **ESLint** - Code linting
- **Prettier** - Code formatting