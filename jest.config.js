module.exports = {
  // setupFiles: ["<rootDir>" / src / __tests__ / testSetup.js],
  testEnvironmentOptions: {
    beforeParse(window) {
      console.log("------------------------------------------  log ");
      window.document.childNodes.length === 0;
      window.alert = (msg) => {
        console.log(msg);
      };
      window.matchMedia = () => ({});
      window.scrollTo = () => {};
    },
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/node_modules/jest-css-modules",
  },
  testEnvironment: "jest-environment-uint8array",
};
