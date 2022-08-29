module.exports = {
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'max-len': ['error', { code: 250 }],
    'consistent-return': 0,
    'import/no-extraneous-dependencies': ['warn', { packageDir: __dirname }],
    'no-underscore-dangle': 0,
  },
};
