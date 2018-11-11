module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {jsx: true}
  },
  env: {browser: true, node: true, es6: true, mocha: true},
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  plugins: ['prettier', 'immutable', 'ramda', 'unicorn'],
  rules: {
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'no-var': 'error',
    'no-bitwise': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'func-style': 'error',
    camelcase: 'error',
    'no-octal-escape': 'error',
    'no-implicit-globals': 'error',
    'no-fallthrough': 'off',
    'no-extend-native': 'error',
    'no-eval': 'error',
    'no-empty-function': 'error',
    'no-caller': 'error',
    'no-alert': 'error',
    'no-use-before-define': ['error', {functions: true,classes: true}],
    eqeqeq: 'off',
    'block-scoped-var': 'error',
    'no-unused-vars': 'error',
    'no-console': ['error', {allow: ['info', 'error']}],
    'require-yield': 'off',
    'no-duplicate-imports': 'error',
    'dot-notation': 'error',
    'quote-props': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'object-shorthand': 'error',
    'prettier/prettier': ['error', {singleQuote: true, bracketSpacing: false}],
    'immutable/no-let': 'error',
    'immutable/no-this': 'error',
    'immutable/no-mutation': 'error',
    'ramda/always-simplification': 'error',
    'ramda/any-pass-simplification': 'error',
    'ramda/both-simplification': 'error',
    'ramda/complement-simplification': 'error',
    'ramda/compose-simplification': 'error',
    'ramda/cond-simplification': 'error',
    'ramda/either-simplification': 'error',
    'ramda/eq-by-simplification': 'error',
    'ramda/filter-simplification': 'error',
    'ramda/if-else-simplification': 'error',
    'ramda/map-simplification': 'error',
    'ramda/merge-simplification': 'error',
    'ramda/no-redundant-and': 'error',
    'ramda/no-redundant-not': 'error',
    'ramda/no-redundant-or': 'error',
    'ramda/pipe-simplification': 'error',
    'ramda/prefer-complement': 'error',
    'ramda/prop-satisfies-simplification': 'error',
    'ramda/reduce-simplification': 'error',
    'ramda/reject-simplification': 'error',
    'ramda/set-simplification': 'error',
    'ramda/unless-simplification': 'error',
    'ramda/when-simplification': 'error',
    'unicorn/no-unsafe-regex': 'error'
  }
};
