import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Global ignores (flat config replaces .eslintignore)
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,

  {
    files: ['src/**/*.js', 'demo/**/*.js'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      globals: {
        ...globals.browser,
        __DEV__: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  {
    files: [
      'build.mjs',
      'scripts/**/*.mjs',
      'scripts/**/*.js',
      'mock/**/*.mjs',
      'mock/**/*.js',
      'mocks/**/*.js',
      'tools/**/*.js',
      'vitest.config.*',
      'eslint.config.*',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['tests/**/*.{js,ts}', 'e2e/**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      'no-console': 'off',
      // Avoid failing lint on unused test args/vars
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  prettier,
];
