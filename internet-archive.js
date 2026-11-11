
const fs = require("fs");

const API = "https://archive.org/advancedsearch.php";

function allowedLicense(value = "") {
  const license = value.toLowerCase();

  if (license.includes("by-nc")) return false;

  return (
    license.includes("creativecommons.org/licenses/by/") ||
    license.includes("creativecommons.org/licenses/by-sa/") ||
    license.includes("creativecommons.org/publicdomain/zero/") ||
    license.includes("creativecommons.org/publicdomain/mark/") ||
    license.includes("creativecommons.org/licenses/publicdomain/")
  );
}

async function main() {
  console.log("Searching Internet Archive for Minecraft videos...");

  const params = new URLSearchParams({
    q: 'minecraft AND mediatype:movies',
    "fl[]": "identifier,title",
    rows: "50",
    page: "1",
    output: "json"
  });

  const response = await fetch(`${API}?${params}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data = await response.json();
  const items = data.response?.docs || [];
  const results = [];

  for (const item of items) {
    try {
      const metadataResponse = await fetch(
        `https://archive.org/metadata/${encodeURIComponent(item.identifier)}`
      );

      if (!metadataResponse.ok) continue;

      const metadata = await metadataResponse.json();
      const license = metadata.metadata?.licenseurl || "";

      if (!allowedLicense(license)) continue;

      results.push({
        id: item.identifier,
        title: item.title || "Untitled",
        url: `https://archive.org/details/${item.identifier}`,
        license
      });

      console.log(`Allowed candidate: ${item.title}`);
    } catch (error) {
      console.log(`Skipped: ${item.identifier}`);
    }
  }

  fs.writeFileSync(
    "archive-results.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log(`Found ${results.length} license-filtered candidates.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
