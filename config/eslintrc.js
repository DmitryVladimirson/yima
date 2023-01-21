/* eslint-disable unicorn/prefer-module,sonarjs/no-duplicate-string */

const generalRules = {
  /**
   * Override some ESLint rules
   */
  'prefer-template': 'error',
  'no-console': 'error',
  'newline-before-return': 'error',
  'max-params': ['error', 6],

  /**
   * Override some Import plugin rules
   */
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      pathGroups: [
        {
          // eslint-disable-next-line no-useless-escape,prettier/prettier
          pattern: '\#imports',
          group: 'external',
          position: 'before',
        },
        {
          pattern: '~icons/**',
          group: 'external',
          position: 'before',
        },
      ],
    },
  ],
  'import/first': 'error',
  'import/no-mutable-exports': 'error',
  'import/no-unresolved': [
    'error',
    {
      ignore: [
        '#app',
        '#image',
        '#imports',
        '#tailwind-config',
        '^@vueuse/integrations/',
        '^unplugin-icons/',
        '^unplugin-vue-components/',
        '^~',
      ],
    },
  ],
  'import/newline-after-import': 'error',

  /**
   * Override some Unicorn rules
   */
  'unicorn/filename-case': 'off',
}

const typeScriptRules = {
  ...generalRules,

  /**
   * Override some TypeScript rules
   */
  '@typescript-eslint/no-implicit-any-catch': 'off', // DEPRECATED by Eslint
  '@typescript-eslint/no-empty-function': 'off', // This is ok
  '@typescript-eslint/no-unsafe-return': 'off', // @todo
  '@typescript-eslint/no-unsafe-call': 'off', // @todo
  '@typescript-eslint/no-unsafe-assignment': 'off', // @todo
  '@typescript-eslint/restrict-template-expressions': 'off', // @todo
  '@typescript-eslint/naming-convention': 'off', // This is ok
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
  camelcase: 'off',
}

const vueRules = {
  ...typeScriptRules,

  /**
   * Override some ESLint rules
   */
  'no-undef': 'off',

  /**
   * Override some Unicorn rules
   */
  'unicorn/no-null': 'off',

  /**
   * Override some TypeScript rules
   */
  '@typescript-eslint/no-explicit-any': 'off',

  /**
   * Override some Vue rules
   */
  'vue/no-v-html': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/no-parsing-error': [
    'error',
    {
      'x-invalid-end-tag': false,
    },
  ],
}

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $fetch: 'readonly',
  },
  overrides: [
    {
      files: '**/*.js',
      extends: [
        'xo',
        'plugin:unicorn/all',
        'plugin:import/recommended',
        'plugin:sonarjs/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['unused-imports', 'unicorn', 'sonarjs'],
      rules: generalRules,
    },
    {
      files: '**/*.ts',
      extends: [
        'xo',
        'xo-typescript',
        'plugin:unicorn/all',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['unused-imports', 'unicorn', 'sonarjs'],
      rules: {
        ...typeScriptRules,
      },
    },
    {
      files: '**/*.vue',
      extends: [
        'xo',
        'plugin:unicorn/all',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:vue/vue3-recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['unused-imports', 'unicorn'],
      rules: {
        ...vueRules,
      },
    },
    {
      files: 'packages/**/*.ts',
      extends: [
        'xo',
        'xo-typescript',
        'plugin:unicorn/all',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:sonarjs/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['unused-imports', 'unicorn', 'sonarjs'],
      rules: {
        ...typeScriptRules,
        'no-undef': 'error',
        'unicorn/no-null': 'off',
      },
    },
    {
      files: 'packages/**/*.vue',
      extends: [
        'xo',
        'plugin:unicorn/all',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:vue/vue3-recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['unused-imports', 'unicorn'],
      rules: {
        ...vueRules,
        'no-undef': 'error',
      },
    },
  ],
}
