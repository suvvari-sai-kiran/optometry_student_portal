const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { db } = require('../config/db');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const [existing] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'student';

    // Auto-verify user to bypass OTP requirement
    await db.query(
      'INSERT INTO Users (name, email, password, role, isVerified) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, userRole, true]
    );

    res.status(201).json({ 
      message: 'Registration successful! You can now log in.',
      email 
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const [result] = await db.query('UPDATE Users SET otp = ?, otpExpiry = ? WHERE email = ?', [otp, otpExpiry, email]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mailOptions = {
      from: `"EyeCare AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your EyeCare AI Verification Code',
      html: `<p>Your new OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = users[0];
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp !== otp) return res.status(401).json({ message: 'Invalid OTP' });
    if (new Date() > new Date(user.otpExpiry)) return res.status(401).json({ message: 'OTP expired' });

    await db.query('UPDATE Users SET isVerified = 1, otp = NULL, otpExpiry = NULL WHERE id = ?', [user.id]);
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      message: 'Account verified successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification error' });
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

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first', unverified: true });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); 
    await db.query('UPDATE Users SET otp = ?, otpExpiry = ? WHERE email = ?', [otp, otpExpiry, email]);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${otp}&email=${email}`;

    const mailOptions = {
      from: `"EyeCare AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'EyeCare AI - Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to set a new password. The link will expire in 15 minutes.</p>
             <p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ 
      message: 'Error processing forgot password request', 
      error: error.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const [users] = await db.query('SELECT * FROM Users WHERE email = ? AND otp = ?', [email, token]);

    if (users.length === 0) return res.status(400).json({ message: 'Invalid or expired reset link' });

    const user = users[0];
    if (new Date() > new Date(user.otpExpiry)) return res.status(400).json({ message: 'Reset link has expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE Users SET password = ?, otp = NULL, otpExpiry = NULL WHERE id = ?', [hashedPassword, user.id]);

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

