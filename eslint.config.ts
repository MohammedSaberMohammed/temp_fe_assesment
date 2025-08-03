import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends', allowObjectTypes: 'always' }],
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1}],
      'camelcase': 'error',
      'no-underscore-dangle': 'warn',
      'linebreak-style': ['off', 'windows'],
      'consistent-return': 'off',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'import/no-unresolved': 'off',
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
      'import/prefer-default-export': 'off',
      'no-useless-escape': 'off',
      'no-restricted-globals': 'warn',
      'no-extend-native': 'off',
      'import/extensions': 'off',
      'import/no-dynamic-require': 'off',
      'no-useless-concat': 'warn',
      'no-mixed-operators': 'warn',
      'no-use-before-define': 'warn',
    },
  }
);