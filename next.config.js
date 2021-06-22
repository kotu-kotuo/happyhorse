const environment = process.env.NODE_ENV || "development";
const env = require(`./${environment}.env.js`);

module.exports = {
  env: {
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
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
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
