import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
  import { globalIgnores, defineConfig } from 'eslint/config'

export default defineConfig([  
  globalIgnores([
    'dist', 
    'node_modules/*'
  ]),




  

  // js.configs.recommended,

  //   tseslint.configs.recommended,
  // importPlugin.flatConfigs.recommended,
  // stylistic.configs.customize({
  //   indent: 2,
  //   quotes: 'single',
  //   semi: true,
  // }),
  // {
  //   rules: {
  //     // TS
  //     '@typescript-eslint/no-explicit-any': 'off',
  //     '@typescript-eslint/explicit-module-boundary-types': 'off',
  //     '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends', allowObjectTypes: 'always' }],
  //     '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
  //     '@typescript-eslint/no-var-requires': 'off',
  //     '@typescript-eslint/no-unsafe-function-type': 'warn',
  //     '@typescript-eslint/no-extra-semi': 'off',
  //     '@typescript-eslint/no-empty-function': 'off',
  //     '@typescript-eslint/no-this-alias': 'warn',
  //     '@typescript-eslint/ban-ts-comment': 'warn',
  //     // Stylistic
  //     '@stylistic/brace-style': ['error', '1tbs'],
  //     // Other
  //     'camelcase': 'warn',
  //     'no-underscore-dangle': 'warn',
  //     'linebreak-style': ['off', 'windows'],
  //     'consistent-return': 'off',
  //     'no-console': 'warn',
  //     'no-debugger': 'warn',
  //     'import/no-unresolved': 'off',
  //     'import/no-cycle': 'warn',
  //     'import/order': 'off',
  //     'no-template-curly-in-string': 'off',
  //     'class-methods-use-this': 'off',
  //     'lines-between-class-members': 'off',
  //     'no-return-assign': 'off',
  //     'max-len': 'off',
  //     'array-callback-return': 'off',
  //     'no-shadow': 'off',
  //     'no-extra-semi': 'off',
  //     'quotes': ['error', 'single'],
  //     'import/no-extraneous-dependencies': 'off',
  //     'no-param-reassign': 'off',
  //     // "import/no-cycle": "",
  //     'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
  //     'import/prefer-default-export': 'off',
  //     'no-useless-escape': 'off',
  //     'no-restricted-globals': 'warn',
  //     'no-extend-native': 'off',
  //     'import/extensions': 'off',
  //     'import/no-dynamic-require': 'off',
  //     'global-require': 'off',
  //     'unicode-bom': 'off',
  //     'no-restricted-syntax': 'off',
  //     'no-prototype-builtins': 'warn',
  //     'no-useless-concat': 'warn',
  //     'prefer-destructuring': 'warn',
  //     'no-mixed-operators': 'warn',
  //     'no-use-before-define': 'warn',
  //     'import/no-useless-path-segments': 'error',
  //   },
  // },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Disable react-refresh rules for development
      'react-refresh/only-export-components': 'warn',
    },
  },
])
