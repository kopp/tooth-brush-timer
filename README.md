# Tooth Brush Timer

A small mobile-first Tooth Brush Timer web app.

Features
- Guided brushing sequence for children (chewing, outside, inside) with default timings.
- Visual area indicator, progress bar, Back and Pause controls.
- Settings (gear icon) to change language (EN/DE) and durations; settings are stored in localStorage.
- Detects browser language by default.


# Development

Running locally

1. npm install
2. npm run dev

Notes
- Settings stored under localStorage key `tbt.settings`.
- This project was bootstrapped with `npm create vite@latest` and adapted into the brushing timer app.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
