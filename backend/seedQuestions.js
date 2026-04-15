const { db } = require('./src/config/db');

const optometryQuestions = [
  // Corneal Reflex Test Questions
  {
    testType: "corneal reflex test",
    question: "What is the primary purpose of the corneal reflex test?",
    options: ["To measure visual acuity", "To assess corneal sensitivity and blink reflex", "To check intraocular pressure", "To evaluate color vision"],
    correct: "B",
    explanation: "The corneal reflex test evaluates the integrity of the corneal sensory nerves and the blink reflex arc."
  },
  {
    testType: "corneal reflex test",
    question: "Which cranial nerve is primarily responsible for the corneal reflex?",
    options: ["Optic nerve (CN II)", "Oculomotor nerve (CN III)", "Trigeminal nerve (CN V)", "Facial nerve (CN VII)"],
    correct: "C",
    explanation: "The corneal reflex involves the trigeminal nerve (CN V) for sensory input and the facial nerve (CN VII) for motor response."
  },
  {
    testType: "corneal reflex test",
    question: "A patient shows no corneal reflex in one eye. What condition should be suspected?",
    options: ["Cataract", "Corneal anesthesia", "Glaucoma", "Macular degeneration"],
    correct: "B",
    explanation: "Absence of corneal reflex indicates corneal anesthesia, which can occur in conditions like herpes simplex keratitis or trigeminal nerve damage."
  },
  {
    testType: "corneal reflex test",
    question: "What stimulus is typically used to elicit the corneal reflex?",
    options: ["Light", "Cotton wisp", "Tonometer", "Retinoscope"],
    correct: "B",
    explanation: "A soft cotton wisp is gently touched to the cornea to elicit the blink reflex without causing discomfort."
  },
  {
    testType: "corneal reflex test",
    question: "The corneal reflex is mediated through which reflex arc?",
    options: ["Monosynaptic", "Polysynaptic", "Direct cortical", "Spinal reflex"],
    correct: "B",
    explanation: "The corneal reflex involves a polysynaptic pathway through the brainstem, involving both sensory and motor components."
  },
  {
    testType: "corneal reflex test",
    question: "In which condition would you expect an exaggerated corneal reflex?",
    options: ["Corneal ulcer", "Dry eye syndrome", "Trigeminal neuralgia", "Bell's palsy"],
    correct: "C",
    explanation: "Trigeminal neuralgia causes hypersensitivity of the trigeminal nerve, leading to exaggerated corneal reflex."
  },
  {
    testType: "corneal reflex test",
    question: "What is the normal response time for the corneal reflex?",
    options: ["Immediate (within 0.1 seconds)", "Delayed (1-2 seconds)", "Slow (5-10 seconds)", "No specific time"],
    correct: "A",
    explanation: "The corneal reflex should occur immediately upon corneal stimulation, typically within 0.1 seconds."
  },
  {
    testType: "corneal reflex test",
    question: "Which medication can temporarily abolish the corneal reflex?",
    options: ["Atropine", "Local anesthetic drops", "Beta-blockers", "Steroid drops"],
    correct: "B",
    explanation: "Topical anesthetic drops temporarily block corneal sensation, abolishing the corneal reflex."
  },
  {
    testType: "corneal reflex test",
    question: "The corneal reflex helps assess the function of which part of the nervous system?",
    options: ["Central nervous system", "Peripheral nervous system", "Autonomic nervous system", "Both peripheral and central"],
    correct: "D",
    explanation: "The corneal reflex tests both peripheral nerve function (trigeminal and facial nerves) and central brainstem pathways."
  },
  {
    testType: "corneal reflex test",
    question: "A unilateral absence of corneal reflex with normal facial muscle function suggests:",
    options: ["Facial nerve palsy", "Trigeminal nerve lesion", "Brainstem lesion", "Ophthalmic nerve lesion"],
    correct: "B",
    explanation: "Unilateral loss of corneal reflex with preserved facial movement indicates a trigeminal nerve lesion affecting the ophthalmic division."
  },

  // Worth 4 Dot Test Questions
  {
    testType: "worth 4 dot test",
    question: "What is the primary purpose of the Worth 4-dot test?",
    options: ["To measure visual acuity", "To assess binocular vision and detect suppression", "To check color vision", "To evaluate depth perception"],
    correct: "B",
    explanation: "The Worth 4-dot test is used to detect suppression, diplopia, or normal binocular vision by presenting different colored lights."
  },
  {
    testType: "worth 4 dot test",
    question: "How many lights does the Worth 4-dot test present?",
    options: ["2 lights", "3 lights", "4 lights", "5 lights"],
    correct: "C",
    explanation: "The test consists of 4 lights: 2 red, 1 green, and 1 white, arranged in a diamond pattern."
  },
  {
    testType: "worth 4 dot test",
    question: "If a patient reports seeing 2 red lights during the Worth 4-dot test, what does this indicate?",
    options: ["Normal binocular vision", "Right eye suppression", "Left eye suppression", "Diplopia"],
    correct: "C",
    explanation: "Seeing only 2 red lights indicates suppression of the left eye (green filter blocks green light from left eye)."
  },
  {
    testType: "worth 4 dot test",
    question: "What colors are used in the Worth 4-dot test?",
    options: ["Red and blue", "Green and yellow", "Red, green, and white", "All primary colors"],
    correct: "C",
    explanation: "The test uses red lights for both eyes, green light for the right eye, and white light for both eyes."
  },
  {
    testType: "worth 4 dot test",
    question: "At what distance is the Worth 4-dot test typically performed?",
    options: ["20 feet (6 meters)", "10 feet (3 meters)", "6 meters or 20 feet", "2 meters"],
    correct: "C",
    explanation: "The test can be performed at either 6 meters (20 feet) for distance or 33 cm for near vision assessment."
  },
  {
    testType: "worth 4 dot test",
    question: "A patient sees 3 lights (2 red + 1 green) during the test. What does this indicate?",
    options: ["Normal fusion", "Right eye suppression", "Diplopia", "Color blindness"],
    correct: "B",
    explanation: "Seeing 3 lights (2 red + 1 green) indicates suppression of the right eye, as the green light from the right eye is visible."
  },
  {
    testType: "worth 4 dot test",
    question: "Which condition would most likely show abnormal Worth 4-dot test results?",
    options: ["Myopia", "Amblyopia", "Cataract", "Presbyopia"],
    correct: "B",
    explanation: "Amblyopia often results in suppression of the amblyopic eye, leading to abnormal Worth 4-dot test results."
  },
  {
    testType: "worth 4 dot test",
    question: "The Worth 4-dot test requires:",
    options: ["Good visual acuity in both eyes", "Intact binocular vision", "Color vision", "All of the above"],
    correct: "D",
    explanation: "The test requires good visual acuity, intact binocular vision, and color vision to properly interpret the results."
  },
  {
    testType: "worth 4 dot test",
    question: "What does seeing 5 lights during the Worth 4-dot test indicate?",
    options: ["Normal vision", "Diplopia", "Color blindness", "Cataract"],
    correct: "B",
    explanation: "Seeing 5 lights indicates diplopia, as the patient is seeing double images of the lights."
  },
  {
    testType: "worth 4 dot test",
    question: "The Worth 4-dot test is most useful for detecting:",
    options: ["Refractive errors", "Binocular vision anomalies", "Glaucoma", "Macular degeneration"],
    correct: "B",
    explanation: "The test is specifically designed to detect anomalies in binocular vision such as suppression and diplopia."
  },

  // Maddox Wing Test Questions
  {
    testType: "maddox wing test",
    question: "What does the Maddox wing test primarily measure?",
    options: ["Visual acuity", "Heterophoria at near", "Color vision", "Depth perception"],
    correct: "B",
    explanation: "The Maddox wing test measures the amount of heterophoria (latent deviation) present at near fixation distances."
  },
  {
    testType: "maddox wing test",
    question: "How does the Maddox wing test work?",
    options: ["Uses polarized lenses", "Uses a dissociating prism", "Uses a streak of light", "Uses colored filters"],
    correct: "B",
    explanation: "The test uses a dissociating prism that separates the images, allowing measurement of the latent deviation."
  },
  {
    testType: "maddox wing test",
    question: "What is the normal range for exophoria measured by Maddox wing?",
    options: ["0-2 prism diopters", "2-6 prism diopters", "6-10 prism diopters", "10-15 prism diopters"],
    correct: "B",
    explanation: "Normal exophoria at near typically ranges from 2-6 prism diopters, though this can vary by individual."
  },
  {
    testType: "maddox wing test",
    question: "In the Maddox wing test, the arrow represents:",
    options: ["The right eye", "The left eye", "The dominant eye", "The non-dominant eye"],
    correct: "B",
    explanation: "The arrow represents the image seen by the left eye through the Maddox rod, while the numbers represent the right eye."
  },
  {
    testType: "maddox wing test",
    question: "What condition shows a high exophoria reading on Maddox wing?",
    options: ["Convergence insufficiency", "Convergence excess", "Divergence insufficiency", "Accommodative insufficiency"],
    correct: "A",
    explanation: "High exophoria at near often indicates convergence insufficiency, where the eyes tend to drift outward."
  },
  {
    testType: "maddox wing test",
    question: "The Maddox wing test is performed at what distance?",
    options: ["20 feet", "10 feet", "33 cm", "6 meters"],
    correct: "C",
    explanation: "The Maddox wing test is performed at near distance, typically 33 cm (13 inches) from the eyes."
  },
  {
    testType: "maddox wing test",
    question: "What does esophoria on Maddox wing indicate?",
    options: ["Eyes tend to turn outward", "Eyes tend to turn inward", "Vertical deviation", "No deviation"],
    correct: "B",
    explanation: "Esophoria indicates that the eyes have a tendency to turn inward when fusion is disrupted."
  },
  {
    testType: "maddox wing test",
    question: "The Maddox wing test uses which optical principle?",
    options: ["Refraction", "Reflection", "Dispersion", "Dissociation"],
    correct: "D",
    explanation: "The test uses dissociation to separate the images from each eye, allowing measurement of latent deviations."
  },
  {
    testType: "maddox wing test",
    question: "What is the significance of measuring heterophoria?",
    options: ["To prescribe glasses", "To assess binocular stability", "To check color vision", "To measure IOP"],
    correct: "B",
    explanation: "Measuring heterophoria helps assess the stability of binocular vision and guides prism prescription if needed."
  },
  {
    testType: "maddox wing test",
    question: "In Maddox wing, if the arrow points to 6 on the esophoria scale, it means:",
    options: ["6 diopters of exophoria", "6 diopters of esophoria", "6 diopters of hyperphoria", "Normal alignment"],
    correct: "B",
    explanation: "The arrow pointing to 6 on the esophoria scale indicates 6 prism diopters of esophoria (inward deviation)."
  },

  // Near Point Accommodation Questions
  {
    testType: "near point accommodation",
    question: "What does the near point of accommodation (NPA) measure?",
    options: ["Distance visual acuity", "Maximum accommodative ability", "Pupil size", "Convergence ability"],
    correct: "B",
    explanation: "The NPA measures the closest point at which an object can be clearly focused, indicating maximum accommodative amplitude."
  },
  {
    testType: "near point accommodation",
    question: "How is the near point of accommodation typically measured?",
    options: ["Snellen chart", "Push-up test", "Autorefractometer", "Tonometry"],
    correct: "B",
    explanation: "The push-up test involves moving a target closer to the eye until it becomes blurred, measuring the near point."
  },
  {
    testType: "near point accommodation",
    question: "What is the normal range for near point of accommodation in a 20-year-old?",
    options: ["5-10 cm", "10-15 cm", "15-20 cm", "20-25 cm"],
    correct: "B",
    explanation: "Normal NPA for a young adult is typically 10-15 cm from the eye, decreasing with age."
  },
  {
    testType: "near point accommodation",
    question: "Presbyopia is characterized by:",
    options: ["Increased accommodation", "Decreased accommodation", "Unchanged accommodation", "Reversed accommodation"],
    correct: "B",
    explanation: "Presbyopia is the age-related decrease in accommodation amplitude, making near vision difficult."
  },
  {
    testType: "near point accommodation",
    question: "The near point of accommodation is measured in:",
    options: ["Dioptres", "Centimeters", "Degrees", "Millimeters"],
    correct: "B",
    explanation: "The NPA is measured as the distance in centimeters from the eye to the closest point of clear vision."
  },
  {
    testType: "near point accommodation",
    question: "Which condition would show a reduced near point of accommodation?",
    options: ["Myopia", "Hyperopia", "Presbyopia", "Astigmatism"],
    correct: "C",
    explanation: "Presbyopia causes a reduction in accommodation amplitude, resulting in a more distant near point."
  },
  {
    testType: "near point accommodation",
    question: "The amplitude of accommodation can be calculated as:",
    options: ["1/NPA (in meters)", "1/NPA (in dioptres)", "NPA × 100", "NPA ÷ 100"],
    correct: "B",
    explanation: "Amplitude of accommodation (D) = 1/NPA (in meters), or approximately 100/NPA (in cm)."
  },
  {
    testType: "near point accommodation",
    question: "What is the expected NPA for a 40-year-old patient?",
    options: ["7-10 cm", "15-20 cm", "25-30 cm", "35-40 cm"],
    correct: "C",
    explanation: "By age 40, accommodation typically decreases to 25-30 cm, requiring bifocal or progressive lenses."
  },
  {
    testType: "near point accommodation",
    question: "The near point of accommodation test requires:",
    options: ["Distance correction only", "Near correction in place", "No correction", "Monocular testing"],
    correct: "B",
    explanation: "The test should be performed with the patient's near correction in place to accurately assess accommodation."
  },
  {
    testType: "near point accommodation",
    question: "A patient with NPA of 50 cm has accommodation amplitude of:",
    options: ["2 dioptres", "5 dioptres", "10 dioptres", "20 dioptres"],
    correct: "A",
    explanation: "Accommodation amplitude = 100/NPA(cm) = 100/50 = 2 dioptres."
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

    // 2. Insert questions for each test based on test type
    for (const test of tests) {
      console.log(`Seeding questions for test: ${test.title} (ID: ${test.id})...`);

      // Filter questions by test type
      const testType = test.title.toLowerCase();
      const relevantQuestions = optometryQuestions.filter(q => q.testType === testType);

      if (relevantQuestions.length === 0) {
        console.log(`No specific questions found for ${test.title}, using general questions.`);
        // Fallback to general questions if no specific ones found
        const shuffled = [...optometryQuestions].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 10);

        for (const q of selectedQuestions) {
          await db.query(
            'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [test.id, q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correct, q.explanation]
          );
        }
      } else {
        // Use specific questions for this test type
        const shuffled = [...relevantQuestions].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

        for (const q of selectedQuestions) {
          await db.query(
            'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [test.id, q.question, q.options[0], q.options[1], q.options[2], q.options[3], q.correct, q.explanation]
          );
        }
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
