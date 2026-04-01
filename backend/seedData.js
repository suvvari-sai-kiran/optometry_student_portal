require('dotenv').config();
const { db } = require('./src/config/db');

const seedData = async () => {
  try {
    const data = [
      {
        course: "Low Vision",
        tests: [
          { title: "Visual Acuity Assessment Test", videoUrl: "https://www.youtube-nocookie.com/embed/0DUncwFDvlw" },
          { title: "Contrast Sensitivity Test", videoUrl: "https://www.youtube-nocookie.com/embed/1nc8Jp7o3_0" },
          { title: "Amsler Grid Test", videoUrl: "https://www.youtube-nocookie.com/embed/mZH0Cm2MagY" },
          { title: "Visual Field Testing", videoUrl: "https://www.youtube-nocookie.com/embed/ETIp8kZPoBw" },
          { title: "Low Vision Aids Identification", videoUrl: "https://www.youtube-nocookie.com/embed/YsfN6MNAT6k" },
          { title: "Magnification Calculation Test", videoUrl: "https://www.youtube-nocookie.com/embed/AlVxX7JSwgw" },
          { title: "Illumination & Glare Assessment", videoUrl: "https://www.youtube-nocookie.com/embed/dSieW48NfMs" },
          { title: "Functional Vision Assessment", videoUrl: "https://www.youtube-nocookie.com/embed/WCsKtRlskKA" }
        ]
      },
      {
        course: "Contact Lens (CL)",
        tests: [
          { title: "Keratometry Reading Test", videoUrl: "https://www.youtube-nocookie.com/embed/vkcM6M3CxAc" },
          { title: "Contact Lens Power Calculation", videoUrl: "https://www.youtube-nocookie.com/embed/H2WSsOK-3Nc" },
          { title: "Base Curve Selection Test", videoUrl: "https://www.youtube-nocookie.com/embed/35FvBuwhi5Q" },
          { title: "Lens Fitting Assessment", videoUrl: "https://www.youtube-nocookie.com/embed/m_U-zwBQKjA" },
          { title: "Tear Film Evaluation", videoUrl: "https://www.youtube-nocookie.com/embed/HAZ5vAI_PLY" },
          { title: "Slit Lamp Examination (CL)", videoUrl: "https://www.youtube-nocookie.com/embed/1RwP94Vh6DI" },
          { title: "RGP vs Soft Lens Identification", videoUrl: "https://www.youtube-nocookie.com/embed/JpFBQEtYhaw" },
          { title: "Contact Lens Complications Test", videoUrl: "https://www.youtube-nocookie.com/embed/y_LGksM93ZM" }
        ]
      },
      {
        course: "Dispensing Optics",
        tests: [
          { title: "Frame Selection Test", videoUrl: "https://www.youtube-nocookie.com/embed/WeKk39XaXoo" },
          { title: "Lens Type Identification", videoUrl: "https://www.youtube-nocookie.com/embed/Sy9R0fjdjr0" },
          { title: "Pupillary Distance Measurement", videoUrl: "https://www.youtube-nocookie.com/embed/cYjQMpVcyoI" },
          { title: "Optical Center Alignment", videoUrl: "https://www.youtube-nocookie.com/embed/ArFjMb1zSKw" },
          { title: "Lens Thickness Calculation", videoUrl: "https://www.youtube-nocookie.com/embed/x4CtvAJ7BV8" },
          { title: "Frame Adjustment Techniques", videoUrl: "https://www.youtube-nocookie.com/embed/pf-PVywpA1g" },
          { title: "Prescription Interpretation", videoUrl: "https://www.youtube-nocookie.com/embed/szyjbaPBCC0" },
          { title: "Lens Material Comparison", videoUrl: "https://www.youtube-nocookie.com/embed/vPLgzFnzcUQ" }
        ]
      },
      {
        course: "Binocular Vision (BV)",
        tests: [
          { title: "Cover Test (Tropia/Phoria)", videoUrl: "https://www.youtube-nocookie.com/embed/MAmrkSrKIcU" },
          { title: "Near Point of Convergence (NPC)", videoUrl: "https://www.youtube-nocookie.com/embed/ygRvzMWw-0A" },
          { title: "Prism Bar Test", videoUrl: "https://www.youtube-nocookie.com/embed/jjHKSJPKgJQ" },
          { title: "Worth Four Dot Test", videoUrl: "https://www.youtube-nocookie.com/embed/3P7cS2o_94c" },
          { title: "Stereopsis Test", videoUrl: "https://www.youtube-nocookie.com/embed/los_D5ptHvU" },
          { title: "Vergence Testing", videoUrl: "https://www.youtube-nocookie.com/embed/98B-hP7korM" },
          { title: "Accommodation-Convergence Test", videoUrl: "https://www.youtube-nocookie.com/embed/yr196TKH0JI" },
          { title: "Ocular Motility Test", videoUrl: "https://www.youtube-nocookie.com/embed/MsBDVW-gdF0" }
        ]
      },
      {
        course: "Refraction",
        tests: [
          { title: "Objective Refraction (Retinoscopy)", videoUrl: "https://www.youtube-nocookie.com/embed/VGKaQlZBKGg" },
          { title: "Subjective Refraction Test", videoUrl: "https://www.youtube-nocookie.com/embed/eiXQiZ1GjaU" },
          { title: "Spherical Power Determination", videoUrl: "https://www.youtube-nocookie.com/embed/BZyFnJXshJM" },
          { title: "Cylindrical Axis Refinement", videoUrl: "https://www.youtube-nocookie.com/embed/zK5hydIBHAw" },
          { title: "Jackson Cross Cylinder Test", videoUrl: "https://www.youtube-nocookie.com/embed/BsLBIbwSRS0" },
          { title: "Duochrome Test", videoUrl: "https://www.youtube-nocookie.com/embed/TD23ha-1gXY" },
          { title: "Near Vision Testing", videoUrl: "https://www.youtube-nocookie.com/embed/anIdC5j_KPs" },
          { title: "Autorefractometer Reading", videoUrl: "https://www.youtube-nocookie.com/embed/Qc0vXt3uwD8" }
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
