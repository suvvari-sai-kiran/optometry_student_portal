const { db } = require('../config/db');

exports.createPatient = async (req, res) => {
    try {
        const { name, age, history, test_results } = req.body;
        const userId = req.user.id;
        
        const [result] = await db.query(
            'INSERT INTO Patients (userId, name, age, history, test_results) VALUES (?, ?, ?, ?, ?)',
            [userId, name, age, history, test_results]
        );
        res.status(201).json({ message: 'Patient created', id: result.insertId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const userId = req.user.id;
        const [patients] = await db.query('SELECT * FROM Patients WHERE userId = ? ORDER BY createdAt DESC', [userId]);
        res.status(200).json(patients);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        await db.query('DELETE FROM Patients WHERE id = ? AND userId = ?', [id, userId]);
        res.status(200).json({ message: 'Patient deleted' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, age, history, test_results } = req.body;
        
        await db.query(
            'UPDATE Patients SET name = ?, age = ?, history = ?, test_results = ? WHERE id = ? AND userId = ?',
            [name, age, history, test_results, id, userId]
        );
        res.status(200).json({ message: 'Patient updated' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};
