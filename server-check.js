/**
 * Server Health Check Script
 *
 * This script can be used to verify that the server is running correctly.
 * It's useful for deployment environments to confirm proper operation.
 */

const http = require("http");

const options = {
  host: "localhost",
  port: process.env.PORT || 3000,
  path: "/",
  timeout: 2000,
};

const healthCheck = http.request(options, (res) => {
  console.log(`Server Status: ${res.statusCode}`);

  if (res.statusCode === 200) {
    console.log("✅ Server is running correctly");
    process.exit(0);
  } else {
    console.error(`❌ Server returned status code: ${res.statusCode}`);
    process.exit(1);
  }
});

healthCheck.on("error", (err) => {
  console.error("❌ Server health check failed:");
  console.error(err);
  process.exit(1);
});

healthCheck.end();

console.log("Checking server health...");
