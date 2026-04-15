require('dotenv').config();
const { db } = require('./src/config/db');

const seedData = async () => {
  try {
    // ⭐ HIGHLIGHTED TESTS ONLY ⭐
    const data = [
      {
        course: "Featured Tests",
        tests: [
          { title: "Corneal reflex test", videoUrl: "https://drive.google.com/file/d/1udoojmzFB1tksQkZs6Qadu6hRyfjbMne/view?usp=sharing" },
          { title: "worth 4 dot test", videoUrl: "https://drive.google.com/file/d/10rTKFKhJ1oCP_NOdtWVa-mpaCDWqOTgv/view?usp=sharing" },
          { title: "maddox wing test", videoUrl: "https://drive.google.com/file/d/16SGk5cNUEAjZRauEhkwtIE9DQgEL8rkw/view?usp=sharing" },
          { title: "near point accommodation", videoUrl: "https://drive.google.com/file/d/1-RjZBOpYuezVx7d2H0wUOHiG5QMT7X3-/view?usp=sharing" }
        ]
      }
    ];

    console.log("Starting Seeding Process...");

    for (let c of data) {
      // 1. Insert Course
      const [courseResult] = await db.query(
        "INSERT INTO Courses (title, description, thumbnailUrl) VALUES (?, ?, ?)",
        [c.course, "Comprehensive guide to " + c.course, ""]
      );
      const courseId = courseResult.insertId;
      console.log("Inserted course: " + c.course);

      // 2. Insert Tests for this course
      for (let t of c.tests) {
        await db.query(
          "INSERT INTO Tests (courseId, title, videoUrl) VALUES (?, ?, ?)",
          [courseId, t.title, t.videoUrl]
        );
        console.log("  Inserted test: " + t.title);
      }
    }

    console.log("SEEDED SUCCESSFULLY!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
