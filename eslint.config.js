import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules',
      'documentation/**',
      'eslint.config.js',
    ],
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-console': 'warn',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['*/core/business/*'],
              message:
                "Relative imports are not allowed, use '@core/business' alias instead",
            },
            {
              group: ['*/core/interfaces/*'],
              message:
                "Relative imports are not allowed, use '@core/interfaces' alias instead",
            },
          ],
        },
      ],
    },
  },
]
