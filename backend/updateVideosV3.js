require('dotenv').config();
const { db } = require('./src/config/db');

/**
 * Updates test video links with the provided YouTube links.
 * All links are converted to embeddable youtube-nocookie format.
 */
const updateVideos = async () => {
  const updates = [
    // Low Vision
    { title: "Magnification Calculation Test", url: "https://www.youtube-nocookie.com/embed/AlVxX7JSwgw" },
    { title: "Illumination & Glare Assessment", url: "https://www.youtube-nocookie.com/embed/dSieW48NfMs" },
    { title: "Functional Vision Assessment", url: "https://www.youtube-nocookie.com/embed/WCsKtRlskKA" },

    // Contact Lens (CL)
    { title: "Keratometry Reading Test", url: "https://www.youtube-nocookie.com/embed/vkcM6M3CxAc" },
    { title: "Contact Lens Power Calculation", url: "https://www.youtube-nocookie.com/embed/H2WSsOK-3Nc" },
    { title: "Base Curve Selection Test", url: "https://www.youtube-nocookie.com/embed/35FvBuwhi5Q" },
    { title: "Lens Fitting Assessment", url: "https://www.youtube-nocookie.com/embed/m_U-zwBQKjA" },
    { title: "Tear Film Evaluation", url: "https://www.youtube-nocookie.com/embed/HAZ5vAI_PLY" },
    { title: "Slit Lamp Examination (CL)", url: "https://www.youtube-nocookie.com/embed/1RwP94Vh6DI" },
    { title: "RGP vs Soft Lens Identification", url: "https://www.youtube-nocookie.com/embed/JpFBQEtYhaw" },
    { title: "Contact Lens Complications Test", url: "https://www.youtube-nocookie.com/embed/y_LGksM93ZM" },

    // Dispensing Optics
    { title: "Frame Selection Test", url: "https://www.youtube-nocookie.com/embed/WeKk39XaXoo" },
    { title: "Lens Type Identification", url: "https://www.youtube-nocookie.com/embed/Sy9R0fjdjr0" },
    { title: "Pupillary Distance Measurement", url: "https://www.youtube-nocookie.com/embed/cYjQMpVcyoI" },
    { title: "Optical Center Alignment", url: "https://www.youtube-nocookie.com/embed/ArFjMb1zSKw" },
    { title: "Lens Thickness Calculation", url: "https://www.youtube-nocookie.com/embed/x4CtvAJ7BV8" },
    { title: "Frame Adjustment Techniques", url: "https://www.youtube-nocookie.com/embed/pf-PVywpA1g" },
    { title: "Prescription Interpretation", url: "https://www.youtube-nocookie.com/embed/szyjbaPBCC0" },
    { title: "Lens Material Comparison", url: "https://www.youtube-nocookie.com/embed/vPLgzFnzcUQ" },

    // Binocular Vision (BV)
    { title: "Cover Test (Tropia/Phoria)", url: "https://www.youtube-nocookie.com/embed/MAmrkSrKIcU" },
    { title: "Near Point of Convergence (NPC)", url: "https://www.youtube-nocookie.com/embed/ygRvzMWw-0A" },
    { title: "Prism Bar Test", url: "https://www.youtube-nocookie.com/embed/jjHKSJPKgJQ" },
    { title: "Worth Four Dot Test", url: "https://www.youtube-nocookie.com/embed/3P7cS2o_94c" },
    { title: "Stereopsis Test", url: "https://www.youtube-nocookie.com/embed/los_D5ptHvU" },
    { title: "Vergence Testing", url: "https://www.youtube-nocookie.com/embed/98B-hP7korM" },
    { title: "Accommodation-Convergence Test", url: "https://www.youtube-nocookie.com/embed/yr196TKH0JI" },
    { title: "Ocular Motility Test", url: "https://www.youtube-nocookie.com/embed/MsBDVW-gdF0" },

    // Refraction
    { title: "Objective Refraction (Retinoscopy)", url: "https://www.youtube-nocookie.com/embed/VGKaQlZBKGg" },
    { title: "Subjective Refraction Test", url: "https://www.youtube-nocookie.com/embed/eiXQiZ1GjaU" },
    { title: "Spherical Power Determination", url: "https://www.youtube-nocookie.com/embed/BZyFnJXshJM" },
    { title: "Cylindrical Axis Refinement", url: "https://www.youtube-nocookie.com/embed/zK5hydIBHAw" },
    { title: "Jackson Cross Cylinder Test", url: "https://www.youtube-nocookie.com/embed/BsLBIbwSRS0" },
    { title: "Duochrome Test", url: "https://www.youtube-nocookie.com/embed/TD23ha-1gXY" },
    { title: "Near Vision Testing", url: "https://www.youtube-nocookie.com/embed/anIdC5j_KPs" },
    { title: "Autorefractometer Reading", url: "https://www.youtube-nocookie.com/embed/Qc0vXt3uwD8" }
  ];

  try {
    console.log("🚀 Starting Database Update for Video Links (V3)...");
    let updatedCount = 0;
    for (let u of updates) {
      const [res] = await db.query('UPDATE Tests SET videoUrl = ? WHERE title = ?', [u.url, u.title]);
      if (res.affectedRows > 0) {
        console.log(`✅ Updated: ${u.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Skip: ${u.title} (Title Not Found)`);
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
