const { db } = require('./src/config/db');

const patients = [
  {
    name: "Arjun Sharma",
    age: 45,
    gender: "Male",
    history: "Blurred distance vision for 1 year. Difficulty reading small prints. Known diabetic (controlled).",
    test_results: JSON.stringify({
      vision: { od: "6/12", os: "6/9", near: "N10" },
      refraction: {
        subjective: {
          od: { sph: "-1.50", cyl: "-0.50", axis: "180", add: "+1.50" },
          os: { sph: "-1.25", cyl: "-0.75", axis: "175", add: "+1.50" }
        }
      },
      slitLamp: {
        od: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "C/D 0.3, Macula Clear" },
        os: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "C/D 0.3, Macula Clear" }
      },
      diagnostics: {
        iop: { od: "16", os: "15" },
        tbut: { od: "12s", os: "11s" },
        color: { od: "Ishihara 14/14", os: "Ishihara 14/14" }
      },
      rehab: {
        aids: "Progressive Addition Lenses (PALs)",
        plan: "Annual diabetic eye exam. Myopic correction with near add."
      }
    })
  },
  {
    name: "Sanya Malhotra",
    age: 22,
    gender: "Female",
    history: "Routine eye examination. No systemic complaints. Computer user (8+ hours).",
    test_results: JSON.stringify({
      vision: { od: "6/6", os: "6/6", near: "N6" },
      refraction: {
        subjective: {
          od: { sph: "+0.25", cyl: "0.00", axis: "0" },
          os: { sph: "+0.25", cyl: "0.00", axis: "0" }
        }
      },
      slitLamp: {
        od: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "Macula Clear" },
        os: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "Macula Clear" }
      },
      diagnostics: {
        iop: { od: "14", os: "14" },
        tbut: { od: "8s", os: "7s" },
        color: { od: "Ishihara 14/14", os: "Ishihara 14/14" }
      },
      rehab: {
        aids: "Blue-cut lenses for digital work",
        plan: "20-20-20 rule education. Lubricant eye drops PRN."
      }
    })
  },
  {
    name: "Robert M. Brown",
    age: 68,
    gender: "Male",
    history: "Gradual painless vision loss. Difficulty driving at night due to glare. Hypertension.",
    test_results: JSON.stringify({
      vision: { od: "6/36", os: "6/24", near: "N18" },
      refraction: {
        subjective: {
          od: { sph: "+2.50", cyl: "-1.50", axis: "90" },
          os: { sph: "+2.25", cyl: "-1.00", axis: "85" }
        }
      },
      slitLamp: {
        od: { ac: "Grade 3 (VH)", lens: "NS3+", fundus: "Hazy view" },
        os: { ac: "Grade 3 (VH)", lens: "NS2+", fundus: "C/D 0.4" }
      },
      diagnostics: {
        iop: { od: "18", os: "17" },
        tbut: { od: "10s", os: "10s" },
        color: { od: "Failed Red-Green", os: "Fail" }
      },
      rehab: {
        aids: "Referral for Phacoemulsification + IOL",
        plan: "Surgical intervention for OD first. Post-op follow-up in 2 weeks."
      }
    })
  },
  {
    name: "Lila Chen",
    age: 10,
    gender: "Female",
    history: "Squinting at school board. Headaches after reading. Uses tablet frequently.",
    test_results: JSON.stringify({
      vision: { od: "6/9", os: "6/9", near: "N6" },
      refraction: {
        subjective: {
          od: { sph: "-1.00", cyl: "0.00", axis: "0" },
          os: { sph: "-1.00", cyl: "0.00", axis: "0" }
        }
      },
      slitLamp: {
        od: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "Macula Clear" },
        os: { ac: "Grade 4 (VH)", lens: "Clear", fundus: "Macula Clear" }
      },
      diagnostics: {
        iop: { od: "15", os: "15" },
        tbut: { od: "12s", os: "12s" },
        color: { od: "Ishihara 14/14", os: "Ishihara 14/14" }
      },
      rehab: {
        aids: "Vision therapy / Reading hygiene",
        plan: "Limit screen time. Follow up cycloplegic refraction in 3 months."
      }
    })
  },
  {
    name: "David Wilson",
    age: 55,
    gender: "Male",
    history: "Occasional halos around lights. Family history of Glaucoma (Father).",
    test_results: JSON.stringify({
      vision: { od: "6/6", os: "6/6", near: "N6" },
      refraction: {
        subjective: {
          od: { sph: "+1.25", cyl: "0.00", axis: "0" },
          os: { sph: "+1.50", cyl: "0.00", axis: "0" }
        }
      },
      slitLamp: {
        od: { ac: "Grade 2 (VH)", lens: "Clear", fundus: "C/D 0.4" },
        os: { ac: "Grade 2 (VH)", lens: "Clear", fundus: "C/D 0.65" }
      },
      diagnostics: {
        iop: { od: "19", os: "24" },
        tbut: { od: "10s", os: "10s" },
        color: { od: "N/A", os: "N/A" }
      },
      rehab: {
        aids: "Monitored observation",
        plan: "Visual Field (HFA 24-2) and GAT scheduled. Possible Prostaglandin Analog start."
      }
    })
  }
];

async function seed() {
  try {
    const [users] = await db.query('SELECT id FROM Users');
    if (users.length === 0) {
      console.log('No users found. Please register a user first.');
      process.exit(1);
    }
    
    // Clear existing patients to avoid massive duplicates if re-run
    await db.query('DELETE FROM Patients');
    console.log('Existing clinical cases cleared for fresh sync.');

    for (const u of users) {
      for (const p of patients) {
        await db.query(
          'INSERT INTO Patients (userId, name, age, history, test_results) VALUES (?, ?, ?, ?, ?)',
          [u.id, p.name, p.age, p.history, p.test_results]
        );
      }
    }
    console.log(`✅ ${patients.length * users.length} Clinical Patient Cases synchronized across ${users.length} clinical profiles!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding patients:', err);
    process.exit(1);
  }
}

seed();
