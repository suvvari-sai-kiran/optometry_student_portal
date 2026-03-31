require('dotenv').config();
const { db } = require('./src/config/db');

const seedData = async () => {
  try {
    const data = [
      {
        course: "Low Vision",
        tests: [
          { title: "Visual Acuity Assessment Test", videoUrl: "/videos/lowvision/visual-acuity.mp4" },
          { title: "Contrast Sensitivity Test", videoUrl: "/videos/lowvision/contrast-sensitivity.mp4" },
          { title: "Amsler Grid Test", videoUrl: "/videos/lowvision/amsler-grid.mp4" },
          { title: "Visual Field Testing", videoUrl: "/videos/lowvision/visual-field.mp4" },
          { title: "Low Vision Aids Identification", videoUrl: "" },
          { title: "Magnification Calculation Test", videoUrl: "" },
          { title: "Illumination & Glare Assessment", videoUrl: "" },
          { title: "Functional Vision Assessment", videoUrl: "" }
        ]
      },
      {
        course: "Contact Lens (CL)",
        tests: [
          { title: "Keratometry Reading Test", videoUrl: "/videos/cl/keratometry.mp4" },
          { title: "Contact Lens Power Calculation", videoUrl: "" },
          { title: "Base Curve Selection Test", videoUrl: "" },
          { title: "Lens Fitting Assessment", videoUrl: "/videos/cl/lens-fitting.mp4" },
          { title: "Tear Film Evaluation", videoUrl: "/videos/cl/tear-film.mp4" },
          { title: "Slit Lamp Examination (CL)", videoUrl: "/videos/cl/slit-lamp.mp4" },
          { title: "RGP vs Soft Lens Identification", videoUrl: "" },
          { title: "Contact Lens Complications Test", videoUrl: "" }
        ]
      },
      {
        course: "Dispensing Optics",
        tests: [
          { title: "Frame Selection Test", videoUrl: "/videos/dispensing/frame-selection.mp4" },
          { title: "Lens Type Identification", videoUrl: "/videos/dispensing/lens-types.mp4" },
          { title: "Pupillary Distance Measurement", videoUrl: "/videos/dispensing/pd-measurement.mp4" },
          { title: "Optical Center Alignment", videoUrl: "" },
          { title: "Lens Thickness Calculation", videoUrl: "" },
          { title: "Frame Adjustment Techniques", videoUrl: "" },
          { title: "Prescription Interpretation", videoUrl: "" },
          { title: "Lens Material Comparison", videoUrl: "" }
        ]
      },
      {
        course: "Binocular Vision (BV)",
        tests: [
          { title: "Cover Test (Tropia/Phoria)", videoUrl: "/videos/bv/cover-test.mp4" },
          { title: "Near Point of Convergence (NPC)", videoUrl: "/videos/bv/npc.mp4" },
          { title: "Prism Bar Test", videoUrl: "/videos/bv/prism-bar.mp4" },
          { title: "Worth Four Dot Test", videoUrl: "/videos/bv/worth-dot.mp4" },
          { title: "Stereopsis Test", videoUrl: "" },
          { title: "Vergence Testing", videoUrl: "" },
          { title: "Accommodation-Convergence Test", videoUrl: "" },
          { title: "Ocular Motility Test", videoUrl: "" }
        ]
      },
      {
        course: "Refraction",
        tests: [
          { title: "Objective Refraction (Retinoscopy)", videoUrl: "/videos/refraction/retinoscopy.mp4" },
          { title: "Subjective Refraction Test", videoUrl: "/videos/refraction/subjective.mp4" },
          { title: "Spherical Power Determination", videoUrl: "" },
          { title: "Cylindrical Axis Refinement", videoUrl: "" },
          { title: "Jackson Cross Cylinder Test", videoUrl: "/videos/refraction/jcc.mp4" },
          { title: "Duochrome Test", videoUrl: "/videos/refraction/duochrome.mp4" },
          { title: "Near Vision Testing", videoUrl: "" },
          { title: "Autorefractometer Reading", videoUrl: "" }
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
