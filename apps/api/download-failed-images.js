import fs from 'fs';
import path from 'path';
import https from 'https';

const fallbackUrls = {
  mulia: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Hotel_Mulia_Senayan_Jakarta.jpg/800px-Hotel_Mulia_Senayan_Jakarta.jpg",
  pullman: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Central_Park_Jakarta_01.jpg/800px-Central_Park_Jakarta_01.jpg",
  trans: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/The_Trans_Luxury_Hotel.jpg/800px-The_Trans_Luxury_Hotel.jpg",
  santika: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hotel_Santika_Premiere_Slipi.jpg/800px-Hotel_Santika_Premiere_Slipi.jpg" // using slipi as placeholder
};

const targetDir = path.join(process.cwd(), '../web/public/hotels');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filename);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}, status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  for (const [key, url] of Object.entries(fallbackUrls)) {
    const filename = path.join(targetDir, `${key}.jpg`);
    console.log(`Downloading ${key}...`);
    try {
      await downloadImage(url, filename);
      console.log(`Successfully downloaded ${key}.jpg`);
    } catch (err) {
      console.error(`Failed for ${key}: ${err.message}`);
    }
  }
}

main();
