import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const targetDir = path.join(process.cwd(), '../web/public/hotels/rooms');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
  console.log("Starting download of 44 unique interior photos...");
  
  // Downloading in batches to avoid overwhelming the server
  for (let i = 1; i <= 44; i++) {
    const url = `https://loremflickr.com/800/600/bedroom,hotel/all?lock=${i}`;
    const filename = path.join(targetDir, `room-${i}.jpg`);
    
    console.log(`Downloading room-${i}.jpg...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const fileStream = fs.createWriteStream(filename, { flags: 'w' });
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
    } catch (e) {
      console.error(`  Failed room-${i}: ${e.message}`);
    }
  }
  
  console.log("Finished downloading 44 images!");
}

main();
