const { db } = require('./src/config/db');

const dispensingModules = [
  {
    title: "Frame Selection Test",
    courseId: 3,
    videoUrl: "", 
    questions: [
      { q: "Which frame shape is generally most suitable for a round face?", options: ["Round", "Rectangular/Square", "Oval", "Narrow Circular"], correct: "B", explanation: "Angular frames like rectangular shapes provide contrast to round facial features, making the face appear longer and thinner." },
      { q: "For a square face with a strong jawline, which frame style is recommended?", options: ["Sharp Square", "Round or Oval", "Hexagonal", "Rectangle"], correct: "B", explanation: "Round or oval frames soften the angular features and strong jawline of a square face." },
      { q: "Proper frame size ensures that the wearer's pupils are positioned:", options: ["At the top edge", "In the horizontal centers of the lenses", "At the nasal edge", "At the bottom edge"], correct: "B", explanation: "For optimal optics and aesthetics, the eyes should be centered horizontally within the lens area." },
      { q: "What is the primary symptom of a frame bridge that is too narrow?", options: ["Frame slipping down", "Pressure marks and discomfort on the nose", "Eyelashes touching the lens", "Wide field of view"], correct: "B", explanation: "A bridge that is too narrow will pinch the nose, causing red marks and physical discomfort." },
      { q: "The temples of the frame should be adjusted so they:", options: ["Pinch the skin behind the ear", "Apply no pressure and extend comfortably over the ear", "Sit loosely without touching the ear", "Overlap the cheekbones"], correct: "B", explanation: "Temples should follow the contour of the ear without causing pressure, which can lead to headaches or skin irritation." },
      { q: "In high minus prescriptions, selecting a smaller eye size helps to:", options: ["Increase thickness", "Reduce lens weight and edge thickness", "Decrease field of view", "Make the lens heavier"], correct: "B", explanation: "Smaller frames require less decentration and result in thinner, lighter edges for minus lenses." },
      { q: "Which material is best known for being extremely lightweight and hypoallergenic?", options: ["Nickel Silver", "Titanium", "Stainless Steel", "Aluminum"], correct: "B", explanation: "Titanium is exceptionally light, strong, durable, and does not cause allergic skin reactions." },
      { q: "A frame that sits too high on the patient's face likely has a bridge that is:", options: ["Too wide", "Too narrow", "Properly sized", "Too thin"], correct: "B", explanation: "A narrow bridge sits higher on the nose, raising the entire frame position." },
      { q: "Standard 'Vertex Distance' in dispensing usually ranges between:", options: ["5-8mm", "12-14mm", "20-25mm", "30-35mm"], correct: "B", explanation: "12-14mm is the standard clinical distance from the cornea to the back surface of the lens." },
      { q: "Which adjustment is made to ensure the frame sits straight if one ear is higher than the other?", options: ["Change bridge width", "Adjust temple vertical alignment", "Increase lens size", "Decrease vertex distance"], correct: "B", explanation: "Changing the vertical angle (pantoscopic tilt/alignment) of the temples compensates for asymmetrical ear height." }
    ]
  },
  {
    title: "Lens Type Identification",
    courseId: 3,
    videoUrl: "",
    questions: [
      { q: "Which lens type has a uniform refractive power across its entire surface?", options: ["Bifocal", "Single Vision", "Progressive", "Trifocal"], correct: "B", explanation: "Single vision lenses correct for one specific distance (near, intermediate, or far) throughout the lens." },
      { q: "How is a standard 'Executive' bifocal identified?", options: ["No visible line", "Visible horizontal line across the entire lens", "Small round segment", "D-shaped segment"], correct: "B", explanation: "Executive bifocals have a distinct line extending across the full width of the lens." },
      { q: "Progressive Addition Lenses (PALs) provide vision at which distances?", options: ["Distance only", "Distance and near only", "Distance, Intermediate, and Near", "Near only"], correct: "C", explanation: "Progressives offer a seamless transition for far, intermediate, and near vision without visible segments." },
      { q: "In the rotation test, a lens that shows no image distortion when rotated is:", options: ["Spherical", "Cylindrical", "Toric", "Progressive"], correct: "A", explanation: "Spherical lenses have equal power in all meridians; cylindrical lenses show rotation-induced distortion." },
      { q: "A plus lens moved across a target will show which type of motion?", options: ["With-motion", "Against-motion", "No motion", "Circular motion"], correct: "B", explanation: "Plus lenses (converging) create an image that moves in the opposite direction to the lens movement." },
      { q: "A minus lens moved across a target will show which type of motion?", options: ["With-motion", "Against-motion", "No motion", "Diagonal motion"], correct: "A", explanation: "Minus lenses (diverging) create an image that moves in the same direction as the lens movement." },
      { q: "Which lens material offers the highest impact resistance and is recommended for children?", options: ["CR-39 Plastic", "Polycarbonate", "Crown Glass", "High Index 1.67"], correct: "B", explanation: "Polycarbonate is highly impact-resistant and safe for active users and children." },
      { q: "What is the primary benefit of high-index lens materials?", options: ["Thicker lenses", "Increased weight", "Thinner and lighter lenses for high prescriptions", "Lower cost"], correct: "C", explanation: "High-index materials refract light more efficiently, allowing lenses to be significantly thinner." },
      { q: "The 'Swimming' effect or peripheral distortion is a common adaptation issue for:", options: ["Single Vision", "Bifocal", "Progressive Lenses", "Plano Lenses"], correct: "C", explanation: "The peripheral astigmatism in progressives can cause a 'swim' sensation during initial adaptation." },
      { q: "To neutralize a +2.00 D lens, which lens power must be used?", options: ["+2.00 D", "-2.00 D", "+1.00 D", "-4.00 D"], correct: "B", explanation: "Neutralization occurs when an equal and opposite power lens stops all perceived image motion." }
    ]
  }
];

async function seed() {
  try {
    console.log("Starting Dispensing Optics module seeding...");
    
    for (const mod of dispensingModules) {
      const [existing] = await db.query('SELECT id FROM Tests WHERE title = ?', [mod.title]);
      let testId;
      
      if (existing.length > 0) {
        testId = existing[0].id;
        console.log(`Test '${mod.title}' already exists (ID: ${testId}). Updating questions...`);
        await db.query('DELETE FROM Questions WHERE testId = ?', [testId]);
      } else {
        const [result] = await db.query(
          'INSERT INTO Tests (courseId, title, videoUrl) VALUES (?, ?, ?)',
          [mod.courseId, mod.title, mod.videoUrl]
        );
        testId = result.insertId;
        console.log(`Created new test '${mod.title}' (ID: ${testId}).`);
      }
      
      for (const q of mod.questions) {
        await db.query(
          'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [testId, q.q, q.options[0], q.options[1], q.options[2], q.options[3], q.correct, q.explanation]
        );
      }
      console.log(`Seeded 10 questions for ${mod.title}.`);
    }
    
    console.log("Dispensing Optics seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
