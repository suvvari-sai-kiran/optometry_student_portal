const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { db } = require('../config/db');

let transporter;
const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_SENDER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const [existing] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'student';

    const [result] = await db.query(
      'INSERT INTO Users (name, email, password, role, isVerified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, userRole, true] // Set isVerified = true by default
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log(`[AUTH] Registration successful for ${email}. OTP bypassed.`);

    res.status(201).json({ 
      message: 'Registration successful!', 
      token,
      user: { id: userId, name, email, role: userRole }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = users[0];
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(401).json({ message: 'OTP expired' });
    }

    // Mark as verified
    await db.query('UPDATE Users SET isVerified = ?, otp = NULL, otpExpiry = NULL WHERE email = ?', [true, email]);
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      message: 'OTP verified securely',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // OTP verification check removed for direct access

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      message: 'Secure login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
