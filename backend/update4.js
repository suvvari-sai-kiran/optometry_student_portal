const { db } = require('./src/config/db');

async function update() {
  await db.query(`UPDATE Tests SET videoUrl = 'https://www.youtube-nocookie.com/embed/0DUncwFDvlw' WHERE title = 'Visual Acuity Assessment Test'`);
  await db.query(`UPDATE Tests SET videoUrl = 'https://www.youtube-nocookie.com/embed/1nc8Jp7o3_0' WHERE title = 'Contrast Sensitivity Test'`);
  await db.query(`UPDATE Tests SET videoUrl = 'https://www.youtube-nocookie.com/embed/mZH0Cm2MagY' WHERE title = 'Amsler Grid Test'`);
  await db.query(`UPDATE Tests SET videoUrl = 'https://www.youtube-nocookie.com/embed/ETIp8kZPoBw' WHERE title = 'Visual Field Testing'`);
  console.log('Done!');
  process.exit(0);
}

update().catch(console.error);
