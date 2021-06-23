const environment = process.env.NODE_ENV || "development";
const env = require(`./${environment}.env.js`);

module.exports = {
  env: {
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  webpack5: false,
  webpack: (config) => {
    config.node = {
      fs: "empty",
      child_process: "empty",
      net: "empty",
      dns: "empty",
      tls: "empty",
    };
    return config;
  },
  eslint: {
    // ignoreDuringBuilds: true,
  },
};
