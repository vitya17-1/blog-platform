import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import * as importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
    },
  },
  {
    plugins: {
      import: importPlugin,
      prettier: eslintPluginPrettier,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src/'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      // правила форматирования из конфига каты
      'prettier/prettier': [
        'error',
        { singleQuote: true, endOfLine: 'auto', tabWidth: 2, semi: true },
      ],
      'linebreak-style': [0, 'unix'],
      quotes: ['error', 'single'],
      'prettier/end-of-line': [0, 'auto'],
      'import/no-unresolved': [2, { caseSensitive: false }],
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  },
];
