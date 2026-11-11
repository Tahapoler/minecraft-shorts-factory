
const { Aparat } = require("aparat.js");
const fs = require("fs");

const aparat = new Aparat();

const keywords = [
  "ماینکرافت",
  "چالش ماینکرافت",
  "اتفاقات عجیب ماینکرافت"
];

async function main() {
  const allVideos = new Map();

  for (const keyword of keywords) {
    console.log(`Searching: ${keyword}`);

    try {
      const videos = await aparat.video.search(keyword);

      for (const video of videos || []) {
        if (!video.hash_id) continue;

        allVideos.set(video.hash_id, {
          id: video.hash_id,
          title: video.title,
          url: video.url,
          duration: video.duration,
          views: video.views,
          uploader: video.uploader?.name || "Unknown"
        });
      }
    } catch (error) {
      console.log(`Search failed: ${keyword}`);
      console.log(error.message);
    }
  }

  const results = [...allVideos.values()];

  fs.writeFileSync(
    "results.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log(`Total unique videos: ${results.length}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
