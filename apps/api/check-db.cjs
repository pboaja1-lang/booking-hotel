const Database = require('better-sqlite3');
const db = new Database('sqlite.db');
console.log('=== ROOMS ===');
console.log(JSON.stringify(db.prepare('SELECT id, name, status FROM room').all(), null, 2));
console.log('=== USERS ===');
console.log(JSON.stringify(db.prepare('SELECT id, name, email, role FROM user').all(), null, 2));
console.log('=== BOOKINGS ===');
console.log(JSON.stringify(db.prepare('SELECT * FROM booking').all(), null, 2));
