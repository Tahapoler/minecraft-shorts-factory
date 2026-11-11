
const Aparat = require("aparat-api");

async function main() {
  const username = process.env.APARAT_USERNAME;
  const password = process.env.APARAT_PASSWORD;

  if (!username || !password) {
    throw new Error("Aparat credentials are missing.");
  }

  const aparat = new Aparat();

  console.log("Connecting to Aparat...");

  const profile = await aparat.login(username, password);

  if (!profile) {
    throw new Error("Aparat login failed.");
  }

  console.log("Aparat login successful!");
  console.log("Account:", profile.username);
}

main().catch(error => {
  console.error("Login test failed:", error.message);
  process.exit(1);
});
