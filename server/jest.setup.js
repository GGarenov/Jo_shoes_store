require("dotenv").config({ path: ".env.test" });
module.exports = {
  testEnvironment: "node",
  maxWorkers: 1, // This forces tests to run sequentially
  testTimeout: 10000,
};
