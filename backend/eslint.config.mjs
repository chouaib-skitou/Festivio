import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'], // Apply to all relevant JavaScript files
    languageOptions: {
      globals: {
        ...globals.browser, // Keep browser globals
        ...globals.node, // Add Node.js globals (process, __dirname, etc.)
      },
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } }, // Treat .js files as CommonJS
  pluginJs.configs.recommended, // Apply recommended ESLint rules for JavaScript
  pluginReact.configs.flat.recommended, // Apply recommended React rules
];
