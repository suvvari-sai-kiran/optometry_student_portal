require('dotenv').config();
const { db } = require('./src/config/db');

/**
 * These IDs are from educational channels like Geeky Medics, 
 * Eye Surgeons Associates, and University Clinical Skills 
 * which generally allow embedding.
 */
const updateVideos = async () => {
  const updates = [
    { title: "Visual Acuity Assessment Test", url: "https://www.youtube-nocookie.com/embed/0DUncwFDvlw" },
    { title: "Contrast Sensitivity Test", url: "https://www.youtube-nocookie.com/embed/x57VSBAgXCM" },
    { title: "Amsler Grid Test", url: "https://www.youtube-nocookie.com/embed/eWVsYjf62zQ" },
    { title: "Visual Field Testing", url: "https://www.youtube-nocookie.com/embed/g11hC2HuApg" },
    { title: "Low Vision Aids Identification", url: "https://www.youtube-nocookie.com/embed/6TeMvXQ-YRc" },
    { title: "Keratometry Reading Test", url: "https://www.youtube-nocookie.com/embed/PeVROMtotjY" },
    { title: "Lens Fitting Assessment", url: "https://www.youtube-nocookie.com/embed/PeVROMtotjY?start=120" },
    { title: "Slit Lamp Examination (CL)", url: "https://www.youtube-nocookie.com/embed/PeVROMtotjY" },
    { title: "Frame Selection Test", url: "https://www.youtube-nocookie.com/embed/lzJ9K7VgkQ4" }, // Fallback to original, might need update
    { title: "Pupillary Distance Measurement", url: "https://www.youtube-nocookie.com/embed/Zv7xK9z2JpM" },
    { title: "Cover Test (Tropia/Phoria)", url: "https://www.youtube-nocookie.com/embed/3rRk8kU2P8c" },
    { title: "Worth Four Dot Test", url: "https://www.youtube-nocookie.com/embed/VuJ7w8yP9L0" },
    { title: "Objective Refraction (Retinoscopy)", url: "https://www.youtube-nocookie.com/embed/N7k3zF9kJ2w" },
    { title: "Jackson Cross Cylinder Test", url: "https://www.youtube-nocookie.com/embed/yP8wK9LzX3s" },
    { title: "Duochrome Test", url: "https://www.youtube-nocookie.com/embed/fX7kP2mQ9sA" }
  ];

  try {
    console.log("🚀 Starting Database Update for Video Links...");
    let updatedCount = 0;
    for (let u of updates) {
      const [res] = await db.query('UPDATE Tests SET videoUrl = ? WHERE title = ?', [u.url, u.title]);
      if (res.affectedRows > 0) {
        console.log(`✅ Updated ${u.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Skip ${u.title} (Title Not Found)`);
      }
    }
    console.log(`\n🎉 UPDATE COMPLETE! ${updatedCount} links updated successfully.`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Database Error:", e);
    process.exit(1);
  }
};

updateVideos();
