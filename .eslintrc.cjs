
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/recommended'],
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  }
};