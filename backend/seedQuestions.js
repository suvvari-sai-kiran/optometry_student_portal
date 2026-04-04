const { db } = require('./src/config/db');

const optometryQuestions = [
  {
    question: "Which of the following is the primary clinical sign of high hyperopia in a child?",
    options: ["Amblyopia", "Esotropia", "Myopia", "Presbyopia"],
    correct: "B",
    explanation: "High uncorrected hyperopia in children often leads to accommodative esotropia due to the increased accommodative effort needed for clear vision."
  },
  {
    question: "What is the standard vertex distance typically used in a trial frame?",
    options: ["5mm", "12mm", "20mm", "25mm"],
    correct: "B",
    explanation: "The standard vertex distance (distance from cornea to lens back surface) is typically 12mm to 14mm."
  },
  {
    question: "A patient with a prescription of -10.00 DS moves their spectacles further from their eyes. What happens to the effective power?",
    options: ["Increases plus power", "Increases minus power", "Decreases minus power", "Stays the same"],
    correct: "C",
    explanation: "Moving a minus lens further from the eye decreases its effective minus power at the corneal plane."
  },
  {
    question: "Which low vision aid is most appropriate for a patient who needs hands-free activity at near?",
    options: ["Handheld magnifier", "Stand magnifier", "Spectacle-mounted telescope", "Magnifying mirror"],
    correct: "C",
    explanation: "Spectacle-mounted telescopes or high-add bifocals are ideal for hands-free near tasks in low vision patients."
  },
  {
    question: "In contact lens fitting, what does 'base curve' refer to?",
    options: ["The front surface curvature", "The back surface curvature", "The diameter of the lens", "The edge thickness"],
    correct: "B",
    explanation: "The base curve is the radius of curvature of the back surface of the contact lens, which must match the corneal curvature."
  },
  {
    question: "What is the primary purpose of Prentice's Rule?",
    options: ["To calculate lens thickness", "To determine induced prismatic effect", "To measure visual acuity", "To calculate vertex distance"],
    correct: "B",
    explanation: "Prentice's Rule (\u0394 = c \u00D7 F) is used to calculate the amount of prism induced when looking through a non-optical center of a lens."
  },
  {
    question: "Which of the following is a common symptom of presbyopia?",
    options: ["Blurred distance vision", "Difficulty reading small print at near", "Constant headaches", "Diplopia at distance"],
    correct: "B",
    explanation: "Presbyopia is the age-related loss of accommodation, making it difficult to focus on near objects."
  },
  {
    question: "What does are 'A-constant' values used for?",
    options: ["Glaucoma screening", "IOL power calculation", "Contact lens power", "Frame sizing"],
    correct: "B",
    explanation: "The A-constant is a lens-specific value used in regression formulas like SRK to calculate Intraocular Lens (IOL) power."
  },
  {
    question: "If a patient has an AC/A ratio of 8:1, they are likely to have:",
    options: ["Convergence Insufficiency", "Convergence Excess", "Divergence Insufficiency", "Normal binocular vision"],
    correct: "B",
    explanation: "A high AC/A ratio (normal is 4:1 to 6:1) often results in Convergence Excess at near."
  },
  {
    question: "Which test is used to measure the Near Point of Accommodation (NPA)?",
    options: ["Cover test", "Push-up test", "Worth 4-dot test", "Hirschberg test"],
    correct: "B",
    explanation: "The push-up test measures the nearest point at which a target remains clear, determining the amplitude of accommodation."
  }
];

async function seedQuestions() {
  try {
    console.log("--- Starting Question Seeding ---");
    
    // 1. Get all tests
    const [tests] = await db.query('SELECT id, title FROM Tests');
    console.log(`Found ${tests.length} tests to populate.`);

    if (tests.length === 0) {
      console.log("No tests found. Please run seedData.js first.");
      process.exit();
    }

    // 2. Insert questions for each test
    for (const test of tests) {
      console.log(`Seeding questions for test: ${test.title} (ID: ${test.id})...`);
      
      // Shuffle our pool of questions and pick 10 (if available)
      const shuffled = [...optometryQuestions].sort(() => 0.5 - Math.random());
      
      for (const q of shuffled) {
        await db.query(
          'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [test.id, q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correct, q.explanation]
        );
      }
    }

    console.log("--- Seeding Completed Successfully! ---");
    process.exit();
  } catch (error) {
    console.error("Error seeding questions:", error);
    process.exit(1);
  }
}

seedQuestions();
