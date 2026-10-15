module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
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
    "\\.(css)$": "<rootDir>/jest.styleMock.js",
  },
  testEnvironment: "jest-environment-jsdom",
};
