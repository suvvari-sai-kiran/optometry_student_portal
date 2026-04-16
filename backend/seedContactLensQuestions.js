const { db } = require('./src/config/db');

const clModules = [
  {
    title: "Keratometry Reading Test",
    courseId: 2,
    videoUrl: "", // Local simulation handled by React component
    questions: [
      { q: "What is the primary purpose of Keratometry?", options: ["Measure corneal curvature", "Measure axial length", "Assess color vision", "Check pupil size"], correct: "A", explanation: "Keratometry measures the curvature of the central 3mm of the cornea." },
      { q: "The cornea acts as which type of mirror in Keratometry?", options: ["Concave", "Convex", "Plane", "Parabolic"], correct: "B", explanation: "The cornea acts as a convex mirror when reflecting the mires." },
      { q: "What are the reflected images in a keratometer called?", options: ["Purkinje images", "Mires", "Halos", "Scintillations"], correct: "B", explanation: "The target images reflected by the cornea are known as mires." },
      { q: "A keratometer reading of 45.00 D corresponds to a radius of approximately:", options: ["7.50 mm", "8.00 mm", "8.50 mm", "7.00 mm"], correct: "A", explanation: "Radius (mm) = 337.5 / Power (D). 337.5 / 45 = 7.5mm." },
      { q: "The 'K' in K-reading stands for:", options: ["Keratometry", "Kestenbaum", "Koeppe", "Knapp"], correct: "A", explanation: "K-reading is the standard abbreviation for keratometry reading." },
      { q: "If the mires appear distorted and cannot be aligned, it may indicate:", options: ["Myopia", "Irregular Astigmatism", "Presbyopia", "Cataract"], correct: "B", explanation: "Distorted mires are a hallmark of irregular corneal surfaces or keratoconus." },
      { q: "Keratometry measures which part of the cornea?", options: ["Total surface", "Central 3mm", "Peripheral 5mm", "Limbus"], correct: "B", explanation: "Standard keratometers measure the central 3mm of the corneal apex." },
      { q: "A difference between the two primary meridians indicates:", options: ["Myopia", "Astigmatism", "Hyperopia", "Glaucoma"], correct: "B", explanation: "Unequal curvature in different meridians is the definition of astigmatism." },
      { q: "In contact lens fitting, 'K' usually refers to:", options: ["The steepest meridian", "The flattest meridian", "The average reading", "The horizontal reading"], correct: "B", explanation: "The 'K' reading used for base curve selection is typically the flattest K reading." },
      { q: "Which division of the eye does Keratometry evaluate?", options: ["Anterior segment", "Posterior segment", "Vitreous", "Retina"], correct: "A", explanation: "Keratometry is an anterior segment assessment tool." }
    ]
  },
  {
    title: "Contact Lens Power Calculation",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "Vertex distance correction becomes significant for powers greater than:", options: ["+/- 1.00 D", "+/- 2.00 D", "+/- 4.00 D", "+/- 6.00 D"], correct: "C", explanation: "At powers above 4 diopters, the change in effective power due to vertex distance must be accounted for." },
      { q: "In the conversion formula Fc = Fs / (1 - d*Fs), what does 'd' represent?", options: ["Density", "Diameter", "Vertex distance in meters", "Degrees"], correct: "C", explanation: "'d' is the vertex distance, converted from millimeters to meters." },
      { q: "If a myopic spectacle lens is moved closer to the eye, its effective power:", options: ["Increases (more minus)", "Decreases (less minus)", "Stays the same", "Becomes plus"], correct: "A", explanation: "Moving a minus lens closer to the eye increases its effective power." },
      { q: "A -10.00 D spectacle prescription (at 12mm) will require a CL of approximately:", options: ["-10.00 D", "-11.25 D", "-8.90 D", "-12.00 D"], correct: "C", explanation: "Fc = -10 / (1 - 0.012 * -10) = -10 / 1.12 ≈ -8.93 D." },
      { q: "Compared to spectacles, a hyperope's contact lens power will be:", options: ["More plus", "Less plus", "Same", "Minus"], correct: "A", explanation: "Hyperopes require more plus power in a contact lens than in spectacles." },
      { q: "Standard vertex distance for most spectacle frames is approximately:", options: ["5 mm", "12 mm", "25 mm", "40 mm"], correct: "B", explanation: "12-14mm is the standard clinical assumption for vertex distance." },
      { q: "The effective power of a lens changes because of:", distance: "Focal length", options: ["Change in light wavelength", "Change in image distance relative to eye", "Lens material thickness", "Lens diameter"], correct: "B", explanation: "Effective power is the power of the lens at a specific plane (the cornea)." },
      { q: "Why do we round CL power to the nearest 0.25 D?", options: ["To save money", "Manufacturing standards", "Eye cannot tell the difference", "Standard pharmacy laws"], correct: "B", explanation: "Contact lenses are commercially available in 0.25 D increments." },
      { q: "Vertex distance is the distance between the eye and the:", options: ["Front of lens", "Back of lens", "Edge of lens", "Center of lens"], correct: "B", explanation: "It is the distance from the corneal apex to the ocular surface of the lens." },
      { q: "For a 'plano' prescription, the vertex distance correction is:", options: ["0 D", "0.25 D", "0.50 D", "1.00 D"], correct: "A", explanation: "Plano (zero power) has no effective change regardless of distance." }
    ]
  },
  {
    title: "Base Curve Selection Test",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "What is the 'Base Curve' of a contact lens?", options: ["Power of front surface", "Curvature of back surface", "Lens diameter", "Center thickness"], correct: "B", explanation: "The base curve is defined as the radius of curvature of the posterior optical zone." },
      { q: "Base curve is typically measured in:", options: ["Diopters", "Millimeters", "Degrees", "Microns"], correct: "B", explanation: "While keratometry uses diopters, base curve is standardly specified in millimeters (radius)." },
      { q: "A lens that is 'steeper' than the cornea will:", options: ["Move too much", "Trap debris", "Be loose", "Slide down"], correct: "B", explanation: "A steep lens fits tightly and can trap metabolic waste or debris under the lens." },
      { q: "A 'flat' fit contact lens will typically show:", options: ["Excessive movement", "No movement", "Centration", "Redness"], correct: "A", explanation: "A lens flatter than the cornea will lack stability and move significantly on blinking." },
      { q: "The 'Three-Point Touch' refers to a lens touching the:", options: ["Apex and periphery", "Limbus and sclera", "Lids and cornea", "Pupil and Iris"], correct: "A", explanation: "A good RGP fit touches the corneal apex and the peripheral edges (3 points)." },
      { q: "On a blink, a well-fitted soft lens should move approximately:", options: ["0 mm", "0.5 to 1.0 mm", "5 mm", "10 mm"], correct: "B", explanation: "A healthy movement to allow tear exchange is around 0.5 to 1.0 mm." },
      { q: "If a lens is too steep, the clinician might select a new lens with:", options: ["Larger base curve (mm)", "Smaller base curve (mm)", "Higher power", "Smaller diameter"], correct: "A", explanation: "Increasing the radius (mm) makes the base curve flatter." },
      { q: "A patient complaining of 'awareness' of the lens edge usually has a:", options: ["Steep fit", "Flat fit", "Perfect fit", "Dirty lens"], correct: "B", explanation: "Flat lenses move more, causing the patient to feel the lens edges more frequently." },
      { q: "The base curve is usually selected based on:", options: ["Axial length", "K-readings", "Pupil size", "Patient age"], correct: "B", explanation: "K-readings provide the baseline corneal curvature for initial BC selection." },
      { q: "A smaller base curve number (e.g. 8.1 vs 8.7) indicates a:", options: ["Steeper lens", "Flatter lens", "Thicker lens", "Larger lens"], correct: "A", explanation: "A smaller radius (shorter curve) means a steeper physical shape." }
    ]
  },
  {
    title: "Lens Fitting Assessment",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "What is the primary indicator of a well-fitted soft contact lens?", options: ["No movement on blink", "Slight movement (0.5-1.0mm) on blink", "Lens rotates 90 degrees", "Patient cannot feel it at all"], correct: "B", explanation: "Slight movement is necessary for tear exchange and oxygenation of the cornea." },
      { q: "Centration refers to the lens being positioned over the:", options: ["Sclera", "Pupil and Cornea", "Limbus", "Iris only"], correct: "B", explanation: "Proper centration ensures the optical zone of the lens aligns with the visual axis." },
      { q: "The 'Push-Up' test evaluates which fitting characteristic?", options: ["Lens power", "Lens mobility and tightness", "Lens diameter", "Lens color"], correct: "B", explanation: "By manually moving the lens, clinicians assess how easily it recovers its position, indicating fit tightness." },
      { q: "If a lens shows 'Incomplete Coverage', it means:", options: ["Lens is too large", "Cornea is not fully covered by the lens", "Lens is too thick", "Lens is inside out"], correct: "B", explanation: "Full corneal coverage is essential to protect the ocular surface and maintain vision." },
      { q: "A 'Loose' lens fit is characterized by:", options: ["Tight grip on cornea", "Minimal movement", "Excessive movement and decentration", "Stable vision"], correct: "C", explanation: "A lens flatter than the cornea will lack stability and move excessively." },
      { q: "When should the final assessment of a lens fit be performed?", options: ["Immediately after insertion", "After 15-20 minutes of wear", "After 24 hours of wear", "Before insertion"], correct: "B", explanation: "Lenses need time to dehydrate slightly and 'settle' on the eye's tear film." },
      { q: "What does 'Edge Lift' indicate in a contact lens fit?", options: ["Steep fit", "Flat fit", "Perfect fit", "Dirty lens"], correct: "B", explanation: "Excessive edge lift usually occurs when the lens base curve is significantly flatter than the cornea." },
      { q: "A patient complaining of 'Variable Vision' that clears after a blink likely has a:", options: ["Tight lens", "Flat lens", "Steep lens", "Perfect fit"], correct: "B", explanation: "If vision clears upon blinking, the lens is likely flat and moving into a better position momentarily." },
      { q: "The limbus should be:", options: ["Partially covered", "Completely covered by the lens", "Left exposed", "Touched by the lens edge"], correct: "B", explanation: "Proper lens diameter should ensure the lens extends slightly beyond the limbus in all directions." },
      { q: "A 'Tight' lens fit may lead to:", options: ["Corneal edema and redness", "Stable vision always", "Excessive comfort", "No clinical issues"], correct: "A", explanation: "Poor tear exchange under a tight lens causes hypoxia, leading to edema and perilimbal injection." }
    ]
  },
  {
    title: "Tear Film Evaluation",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "What are the three primary layers of the tear film?", options: ["Lipid, Aqueous, Mucin", "Water, Salt, Protein", "Oil, Water, Oxygen", "Epithelium, Stroma, Endothelium"], correct: "A", explanation: "The tear film consists of an outer lipid layer, a central aqueous layer, and an inner mucin layer." },
      { q: "Which layer of the tear film prevents evaporation?", options: ["Aqueous", "Mucin", "Lipid", "Cornea"], correct: "C", explanation: "The lipid layer, produced by Meibomian glands, reduces evaporation of the aqueous component." },
      { q: "Tear Break-Up Time (TBUT) is considered abnormal if it is less than:", options: ["5 seconds", "10 seconds", "15 seconds", "20 seconds"], correct: "B", explanation: "A TBUT of less than 10 seconds is generally considered clinical evidence of tear film instability." },
      { q: "What dye is commonly used to measure TBUT?", options: ["Rose Bengal", "Lissamine Green", "Fluorescein", "Methylene Blue"], correct: "C", explanation: "Sodium fluorescein dye is used to visualize the tear film under cobalt blue light." },
      { q: "The Schirmer's I test primarily measures:", options: ["Tear quality", "Tear quantity (reflex and basal)", "Tear evaporation rate", "Mucin production"], correct: "B", explanation: "Schirmer's test uses paper strips to quantify the amount of tears produced over 5 minutes." },
      { q: "A stable tear film is essential for:", options: ["Clear vision", "Good contact lens comfort", "Protection from infection", "All of the above"], correct: "D", explanation: "The tear film provides a smooth optical surface, lubricates the eye, and contains antimicrobial proteins." },
      { q: "Which test is used specifically to measure the tear quantity by placing a filter strip in the lower fornix?", options: ["TBUT", "Schirmer's Test", "Tear Meniscus Height", "Lid Wiper Epitheliopathy"], correct: "B", explanation: "Schirmer's test is the standard clinical method for measuring tear volume." },
      { q: "Dry spots appearing on the cornea under blue light after 3 seconds signifies:", options: ["Normal TBUT", "Severely reduced TBUT", "Good tear stability", "High tear volume"], correct: "B", explanation: "Any break-up occurring under 10 seconds is abnormal; 3 seconds indicates significant instability." },
      { q: "The mucin layer of the tear film is produced by:", options: ["Lacrimal gland", "Meibomian glands", "Conjunctival goblet cells", "Eyelid skin"], correct: "C", explanation: "Goblet cells in the conjunctiva secrete mucins that help the tear film adhere to the hydrophobic corneal surface." },
      { q: "Effective contact lens wear requires a tear film that can:", options: ["Equilibrate under the lens", "Maintain oxygen supply", "Remove metabolic waste", "All of the above"], correct: "D", explanation: "A healthy tear film is critical for the physiological success of any contact lens fitting." }
    ]
  },
  {
    title: "Slit Lamp Examination (CL)",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "What is the primary role of the slit lamp in contact lens practice?", options: ["Measure visual acuity", "Evaluate lens fit and anterior segment health", "Calculate lens power", "Check color vision"], correct: "B", explanation: "The slit lamp biomicroscope is essential for assessing the physical fit of the lens and monitoring ocular tissue health." },
      { q: "Which illumination technique is best for assessing general corneal health and lens centration?", options: ["Sclerotic scatter", "Diffuse illumination / Parallelepiped", "Retro-illumination", "Specular reflection"], correct: "B", explanation: "A broad beam (parallelepiped) provides a good overview of the lens position and corneal surface." },
      { q: "An 'Optical Section' (very narrow beam) is used to:", options: ["Check centration", "Gauge the depth of a corneal infiltrate or layer", "Measure pupil size", "Assess lens movement"], correct: "B", explanation: "The optical section allows the clinician to see the cross-section of the cornea and locate depth accurately." },
      { q: "Fluorescein dye is used during slit lamp exam to detect:", options: ["Tear quality only", "Corneal epithelial damage and staining patterns", "Lens color", "Patient's eye color"], correct: "B", explanation: "Fluorescein stains areas of damaged epithelial cells, revealing patterns typical of poor lens fit or debris." },
      { q: "Where should the patient place their chin during a slit lamp exam?", options: ["Against the headrest", "On the chin rest", "On the table", "In their hands"], correct: "B", explanation: "Proper positioning on the chin rest and against the forehead band is crucial for stability and focus." },
      { q: "Redness at the limbus (limbal injection) seen under the slit lamp is a sign of:", options: ["Perfect lens fit", "Hypoxia or irritation", "High visual acuity", "Normal physiological response"], correct: "B", explanation: "Limbal injection often signifies that the cornea is not receiving enough oxygen, common with tight or over-worn lenses." },
      { q: "Specular reflection is a technique used to view the:", options: ["Corneal endothelium", "Eyelids", "Lens edge", "Tear meniscus"], correct: "A", explanation: "The specular reflection zone allows the examiner to see the 'orange peel' mosaic of the endothelial cells." },
      { q: "When evaluating a soft lens fit, what three things are primarily assessed?", options: ["Power, Color, Price", "Centration, Movement, Coverage", "Thickness, Weight, Diameter", "Material, Water content, Brand"], correct: "B", explanation: "A healthy fit is defined by how well the lens centers, moves on blink, and covers the limbus." },
      { q: "The Cobolt Blue filter is used in conjunction with:", options: ["No dye", "Rose Bengal", "Fluorescein", "Lissamine Green"], correct: "C", explanation: "Cobalt blue light excites fluorescein, making it glow green for easy observation of staining or tear film." },
      { q: "What should an examiner do if they see 'GPC' (Giant Papillary Conjunctivitis) on the tarsal conjunctiva?", options: ["Prescribe stronger lenses", "Advise against or pause lens wear", "Ignore it", "Clean the eye with water"], correct: "B", explanation: "GPC is an inflammatory response to lens deposits or mechanical irritation and requires clinical management." }
    ]
  },
  {
    title: "RGP vs Soft Lens Identification",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "Which of the following describes the material of RGP lenses?", options: ["Flexible hydrogel", "Rigid and oxygen-permeable", "Liquid-filled", "Glass"], correct: "B", explanation: "RGP (Rigid Gas Permeable) lenses are made from firm materials that allow oxygen to reach the cornea." },
      { q: "What is the result of the 'Taco Test' on a soft contact lens?", options: ["It breaks in half", "The edges curl and fold together like a taco", "It stays perfectly flat", "It turns inside out"], correct: "B", explanation: "The taco test is a standard way to check the flexibility and orientation of a soft lens." },
      { q: "Compared to soft lenses, RGP lenses typically offer:", options: ["Sharper vision for astigmatism", "Better initial comfort", "Less movement on the eye", "Larger diameter"], correct: "A", explanation: "Because they maintain their shape, RGP lenses provide a more stable optical surface for refracting light." },
      { q: "Why do RGP lenses move more during a blink?", options: ["They are slippery", "To facilitate tear exchange and oxygenation", "They are too small", "They are damaged"], correct: "B", explanation: "Increased movement (typically 1-2mm) allows fresh tears to circulate under the rigid lens." },
      { q: "Which lens modality generally requires a longer adaptation period for comfort?", options: ["Soft hydrogel", "Scleral lenses", "RGP lenses", "Disposable lenses"], correct: "C", explanation: "Patients usually feel the edge of an RGP lens initially and require a few weeks for the lids to adapt." },
      { q: "Soft contact lenses are primarily made of:", options: ["Polymethyl methacrylate (PMMA)", "Silicone Hydrogel", "Fluorosilicone acrylate", "Glass"], correct: "B", explanation: "Modern soft lenses use hydrogel or silicone hydrogel materials for maximum flexibility and comfort." },
      { q: "In terms of size, RGP lenses are typically:", options: ["Larger than the cornea", "Smaller than soft lenses", "The same size as the limbus", "24mm in diameter"], correct: "B", explanation: "RGP lenses are corneal lenses, usually 9-10mm in diameter, while soft lenses are 14mm+." },
      { q: "A patient with irregular astigmatism would likely benefit most from which lens?", options: ["Standard soft lens", "RGP lens", "Colored lens", "Plano lens"], correct: "B", explanation: "The rigid surface of an RGP lens creates a new, smooth spherical surface over the irregular cornea." },
      { q: "What happens if you try the 'Taco Test' on an RGP lens?", options: ["It folds easily", "It resists bending and maintains its shape", "It melts", "It changes color"], correct: "B", explanation: "RGP materials are designed to be firm and do not bend under normal handling pressure." },
      { q: "Soft lenses are often preferred by occasional wearers because of:", options: ["Better vision", "Superior initial comfort", "Lower cost", "Longer lifespan"], correct: "B", explanation: "Soft lenses are comfortable from the moment they are inserted, making them ideal for part-time wear." }
    ]
  },
  {
    title: "Contact Lens Complications",
    courseId: 2,
    videoUrl: "",
    questions: [
      { q: "Which of the following is a symptom of Contact Lens Overwear Syndrome (CLOS)?", options: ["Extreme pain and photophobia upon lens removal", "Perfectly clear vision", "Immediate comfort", "Normal eye appearance"], correct: "A", explanation: "CLOS often manifests as severe pain several hours after removing the lenses, usually due to corneal hypoxia." },
      { q: "Giant Papillary Conjunctivitis (GPC) is most commonly associated with:", options: ["Material allergy", "Protein deposits and mechanical irritation", "Low water content", "Perfect hygiene"], correct: "B", explanation: "GPC involves large bumps (papillae) on the upper tarsal conjunctiva, often triggered by deposits on the lens." },
      { q: "What clinical sign on the cornea indicates significant hypoxia (oxygen deprivation)?", options: ["Corneal neovascularization", "Increased tear volume", "Sharper vision", "Clear stroma"], correct: "A", explanation: "To compensate for low oxygen, new blood vessels grow from the limbus into the normally avascular cornea." },
      { q: "A 'Tight Lens' fit can lead to which complication?", options: ["Sclerotic scatter", "Corneal edema and perilimbal injection", "Lens falling out", "Increased comfort"], correct: "B", explanation: "A tight lens traps metabolic waste and prevents tear exchange, leading to hypoxia and redness." },
      { q: "Microbial Keratitis (MK) is considered:", options: ["A minor irritation", "A sight-threatening medical emergency", "A normal side effect", "Easily treated with saline"], correct: "B", explanation: "MK is a bacterial infection (often Pseudomonas) that can cause rapid corneal ulceration and permanent vision loss." },
      { q: "What does fluorescein staining in a '3 and 9 o'clock' pattern on an RGP wearer indicate?", options: ["Normal fit", "Peripheral desiccation and dryness", "Central steepness", "Perfect lubrication"], correct: "B", explanation: "Dry spots at the horizontal margins are common in RGP wearers if the lens design prevents proper lid-driven lubrication." },
      { q: "Corneal infiltrates are typically a sign of:", options: ["High oxygen transmission", "Inflammatory response to bacteria or toxicity", "Good lens cleaning", "New lens material"], correct: "B", explanation: "Infiltrates are collections of white blood cells in the corneal stroma, signaling an immune response." },
      { q: "The primary prevention for Acanthamoeba keratitis is:", options: ["Using tap water to rinse lenses", "Avoiding swimming or showering with lenses", "Wearing lenses for 24 hours", "Ignoring redness"], correct: "B", explanation: "Acanthamoeba is a water-borne parasite; exposing lenses to non-sterile water is the main risk factor." },
      { q: "If a patient presents with a 'red eye' while wearing lenses, the first clinical advice should be:", options: ["Change the solution", "Wait and see", "Remove the lenses immediately", "Try a different brand"], correct: "C", explanation: "Immediate discontinuation of lens wear is the first step in managing any symptomatic contact lens-related issue." },
      { q: "Tight Lens Syndrome is characterized by:", options: ["A lens that moves too much", "An immobile lens with trapped debris", "Superior centration", "Excellent vision"], correct: "B", explanation: "An immobile lens prevents tear turnover, leading to the accumulation of toxic byproducts and hypoxia." }
    ]
  }
];

async function seed() {
  try {
    console.log("Starting Contact Lens module seeding...");
    
    for (const mod of clModules) {
      // 1. Insert or Get Test ID
      const [existing] = await db.query('SELECT id FROM Tests WHERE title = ?', [mod.title]);
      let testId;
      
      if (existing.length > 0) {
        testId = existing[0].id;
        console.log(`Test '${mod.title}' already exists (ID: ${testId}). Updating questions...`);
        // Optional: Delete old questions to avoid duplicates
        await db.query('DELETE FROM Questions WHERE testId = ?', [testId]);
      } else {
        const [result] = await db.query(
          'INSERT INTO Tests (courseId, title, videoUrl) VALUES (?, ?, ?)',
          [mod.courseId, mod.title, mod.videoUrl]
        );
        testId = result.insertId;
        console.log(`Created new test '${mod.title}' (ID: ${testId}).`);
      }
      
      // 2. Insert Questions
      for (const q of mod.questions) {
        await db.query(
          'INSERT INTO Questions (testId, questionText, optionA, optionB, optionC, optionD, correctOption, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [testId, q.q, q.options[0], q.options[1], q.options[2], q.options[3], q.correct, q.explanation]
        );
      }
      console.log(`Seeded 10 questions for ${mod.title}.`);
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
