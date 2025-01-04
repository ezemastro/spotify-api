import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import standard from 'eslint-config-standard'
import standardJSX from 'eslint-config-standard-jsx'
import promise from 'eslint-plugin-promise'
import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      promise,
      import: importPlugin,
      n
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...standard.rules,
      ...standardJSX.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'off',
        { allowConstantExport: true }
      ],
      'react/prop-types': 'off'
    }
  }
]
