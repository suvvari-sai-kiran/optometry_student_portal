const { db } = require('./src/config/db');

async function update() {
  await db.query(`UPDATE Tests SET videoUrl = 'https://www.youtube-nocookie.com/embed/YsfN6MNAT6k' WHERE title = 'Low Vision Aids Identification'`);
  console.log('Done!');
  process.exit(0);
}

update().catch(console.error);
