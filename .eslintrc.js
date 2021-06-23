module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  // parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    // "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
    // "plugin:react/recommended",
  ],
  // plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  root: true,
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "init-declarations": ["error", "never"],
  },
};
