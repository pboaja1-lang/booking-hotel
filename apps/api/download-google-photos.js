import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = "AIzaSyCy8S6vhoP_9ei2iptPvEY6cBu-n1wc8Y8";

const hotels = [
  { id: "mulia", query: "Hotel Mulia Senayan Jakarta" },
  { id: "pullman", query: "Pullman Jakarta Central Park" },
  { id: "trans", query: "The Trans Luxury Hotel Bandung" },
  { id: "padma", query: "Padma Hotel Bandung" },
  { id: "hilton", query: "Hilton Bandung" },
  { id: "jhl", query: "JHL Solitaire Gading Serpong" },
  { id: "swiss", query: "Swiss-Belhotel Airport Jakarta" },
  { id: "margo", query: "The Margo Hotel Depok" },
  { id: "santika", query: "Hotel Santika Depok" },
  { id: "aston", query: "Aston Imperial Bekasi" },
  { id: "harris", query: "Harris Hotel Bekasi" }
];

const targetDir = path.join(process.cwd(), '../web/public/hotels');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchJsonPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.photos',
        'Referer': 'https://booking-hotel-web.vercel.app/'
      }
    };
    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Referer': 'https://booking-hotel-web.vercel.app/'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filename);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      } else {
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  for (const h of hotels) {
    console.log(`Searching for ${h.query}...`);
    try {
      const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
      const searchResult = await fetchJsonPost(searchUrl, { textQuery: h.query });
      
      console.log(`Raw response for ${h.query}:`, JSON.stringify(searchResult).substring(0, 200));

      if (!searchResult.places || searchResult.places.length === 0) {
        console.error(`  Failed to find ${h.query}`);
        continue;
      }
      
      const place = searchResult.places[0];
      const photos = place.photos;
      
      if (!photos || photos.length === 0) {
        console.error(`  No photos found for ${h.query}`);
        continue;
      }

      // Download up to 4 photos for the 4 room types
      const numPhotos = Math.min(photos.length, 4);
      for (let i = 0; i < numPhotos; i++) {
        const photoName = photos[i].name; // e.g. places/123/photos/456
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=800&key=${API_KEY}`;
        const suffix = i === 0 ? '' : `-${i}`; // padma.jpg, padma-1.jpg, padma-2.jpg, padma-3.jpg
        const filename = path.join(targetDir, `${h.id}${suffix}.jpg`);
        
        console.log(`  Downloading photo ${i} for ${h.id}...`);
        await downloadImage(photoUrl, filename);
      }
      console.log(`  Success for ${h.id}`);
      
    } catch (err) {
      console.error(`  Error processing ${h.id}: ${err.message}`);
    }
  }
}

main();
