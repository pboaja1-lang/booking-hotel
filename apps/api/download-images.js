import fs from 'fs';
import path from 'path';
import https from 'https';

const imageUrls = {
  mulia: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Hotel_Mulia_Senayan_Jakarta.jpg/800px-Hotel_Mulia_Senayan_Jakarta.jpg",
  pullman: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Central_Park_Jakarta_01.jpg/800px-Central_Park_Jakarta_01.jpg",
  trans: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/The_Trans_Luxury_Hotel.jpg/800px-The_Trans_Luxury_Hotel.jpg",
  padma: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Padma_Hotel_Bandung.jpg/800px-Padma_Hotel_Bandung.jpg",
  hilton: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hilton_Bandung.jpg/800px-Hilton_Bandung.jpg",
  jhl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/JHL_Solitaire.jpg/800px-JHL_Solitaire.jpg",
  swiss: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Swiss-Belhotel_Airport_Jakarta.jpg/800px-Swiss-Belhotel_Airport_Jakarta.jpg",
  margo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/The_Margo_Hotel_Depok.jpg/800px-The_Margo_Hotel_Depok.jpg",
  santika: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hotel_Santika_Depok.jpg/800px-Hotel_Santika_Depok.jpg",
  aston: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Aston_Imperial_Bekasi.jpg/800px-Aston_Imperial_Bekasi.jpg",
  harris: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Harris_Hotel_Bekasi.jpg/800px-Harris_Hotel_Bekasi.jpg"
};

// Fallback Unsplash images if Wikimedia doesn't have the exact one
const fallbackUrls = {
  mulia: "https://images.unsplash.com/photo-1542314831-c6a4d14b8328?w=800",
  pullman: "https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=800",
  trans: "https://images.unsplash.com/photo-1578683010236-d716f9a3f46c?w=800",
  padma: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
  hilton: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
  jhl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
  swiss: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
  margo: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
  santika: "https://images.unsplash.com/photo-1598928506311-c55dd1b31bb1?w=800",
  aston: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  harris: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800"
};

const targetDir = path.join(process.cwd(), '../web/public/hotels');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
