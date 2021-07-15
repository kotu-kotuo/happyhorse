const environment = () => {
  if (process.env.NODE_ENV === "test") {
    return "development";
  } else if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  } else {
    return "development";
  }
};
const env = require(`./${environment()}.env.js`);

module.exports = {
  env: {
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  // experimental: {
  //   scrollRestoration: false,
  // },
  webpack5: true,
  // webpack: (config) => {
  //   config.node = {
  //     fs: "empty",
  //     child_process: "empty",
  //     net: "empty",
  //     dns: "empty",
  //     tls: "empty",
  //   };
  //   return config;
  // },
};
