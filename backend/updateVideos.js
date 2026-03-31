require('dotenv').config();
const { db } = require('./src/config/db');

const updateVideos = async () => {
  const updates = [
    { title: "Visual Acuity Assessment Test", url: "https://www.youtube.com/embed/9g4JzQq0p6g" },
    { title: "Amsler Grid Test", url: "https://www.youtube.com/embed/6jJ8F0w7GkE" },
    { title: "Visual Field Testing", url: "https://www.youtube.com/embed/WC0XnF9s0s8" },
    { title: "Keratometry Reading Test", url: "https://www.youtube.com/embed/0h4GzJr6YyQ" },
    { title: "Lens Fitting Assessment", url: "https://www.youtube.com/embed/3pQHcKkZLxE" },
    { title: "Slit Lamp Examination (CL)", url: "https://www.youtube.com/embed/FxwHq9KZl9I" },
    { title: "Frame Selection Test", url: "https://www.youtube.com/embed/lzJ9K7VgkQ4" },
    { title: "Pupillary Distance Measurement", url: "https://www.youtube.com/embed/Zv7xK9z2JpM" },
    { title: "Cover Test (Tropia/Phoria)", url: "https://www.youtube.com/embed/3rRk8kU2P8c" },
    { title: "Worth Four Dot Test", url: "https://www.youtube.com/embed/VuJ7w8yP9L0" },
    { title: "Objective Refraction (Retinoscopy)", url: "https://www.youtube.com/embed/N7k3zF9kJ2w" },
    { title: "Jackson Cross Cylinder Test", url: "https://www.youtube.com/embed/yP8wK9LzX3s" },
    { title: "Duochrome Test", url: "https://www.youtube.com/embed/fX7kP2mQ9sA" }
  ];

  try {
    console.log("Starting DB Update...");
    for (let u of updates) {
      const [res] = await db.query('UPDATE Tests SET videoUrl = ? WHERE title = ?', [u.url, u.title]);
      console.log("Updated " + u.title + ": " + res.affectedRows + " row(s)");
    }
    console.log("UPDATE COMPLETE!");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

updateVideos();
