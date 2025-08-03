# Linting Setup Guide

This project is configured with ESLint and Prettier for code quality and formatting.

## Current Setup

### ESLint Configuration
- **Config File**: `eslint.config.js` (ESLint flat config)
- **TypeScript Support**: Full TypeScript and React TypeScript support
- **React Hooks**: Enforced with `eslint-plugin-react-hooks`
- **React Refresh**: Configured for Vite development

### Prettier Configuration
- **Config File**: `.prettierrc`
- **Ignore File**: `.prettierignore`
- **Integration**: Works with ESLint via `eslint-config-prettier`

### VS Code/Cursor Integration
- **Settings**: `.vscode/settings.json`
- **Auto-fix on save**: Enabled
- **Format on save**: Enabled
- **ESLint validation**: Enabled for JS/TS/JSX/TSX files

## Available Scripts

```bash
# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check
```

## Current Issues Found

The linter is currently detecting:
- **0 errors** ✅
- **20 warnings** ⚠️

### Warning Types:
1. **React Refresh warnings**: Files exporting non-components (constants, functions)
2. **Console statements**: Development console.log statements
3. **Unused variables**: Variables that are declared but not used

## How to Fix Common Issues

### 1. Console Statements
Replace `console.log` with proper logging or remove for production:
```typescript
// Instead of console.log
console.log('Debug info');

// Use proper logging or remove
// logger.debug('Debug info');
```

### 2. React Refresh Warnings
Move non-component exports to separate files:
```typescript
// Instead of exporting constants in component files
export const CONSTANTS = { ... };

// Create a separate constants file
// constants.ts
export const CONSTANTS = { ... };
```

### 3. Unused Variables
Prefix unused variables with underscore:
```typescript
// Instead of
function handleClick(event) { ... }

// Use
function handleClick(_event) { ... }
```

## IDE Setup

### VS Code/Cursor Extensions Required:
1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **TypeScript** (built-in)

### Auto-fix on Save
The workspace is configured to automatically fix ESLint issues and format code when you save files.

## Troubleshooting

### Linter Not Highlighting Errors
1. **Restart your editor** after making configuration changes
2. **Check if ESLint extension is installed and enabled**
3. **Verify the ESLint extension is using the workspace configuration**
4. **Run `npm run lint` in terminal to verify linting works**

### TypeScript Errors Not Showing
1. **Ensure TypeScript extension is enabled**
2. **Check that `tsconfig.json` is properly configured**
3. **Restart TypeScript language server** (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Formatting Issues
1. **Ensure Prettier extension is installed**
2. **Check that `.prettierrc` is in the project root**
3. **Verify format on save is enabled in settings**

## Best Practices

1. **Run linting before commits**: `npm run lint`
2. **Auto-fix issues**: `npm run lint:fix`
3. **Format code**: `npm run format`
4. **Check for unused imports and variables**
5. **Use TypeScript strict mode** (already enabled)
6. **Avoid `any` types** (use proper TypeScript types)

## Configuration Files

- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to ignore during formatting
- `.vscode/settings.json` - Editor-specific settings
- `tsconfig.json` - TypeScript configuration 