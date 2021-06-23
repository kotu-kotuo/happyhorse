module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    // "eslint:recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
    // "plugin:react/recommended",
  ],
  // plugins: ["@typescript-eslint"],
  // parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   sourceType: "module",
  //   project: "./tsconfig.json",
  // },
  root: true,
  rules: {},
};
