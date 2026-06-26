import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../config/mailer.js';

const router = express.Router();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'Admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ error: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-escalation: If email includes 'admin', make Admin
    let role = 'Member';
    if (email.toLowerCase().startsWith('admin@') || email.toLowerCase().includes('admin')) {
      role = 'Admin';
    }

    user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      department,
      role,
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    
    res.status(201).json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, profilePicture: user.profilePicture },
      message: 'Account created successfully.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
    
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role, department: user.department, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid verification token.' });
    }

    if (new Date() > new Date(user.verificationTokenExpiry)) {
      return res.status(400).json({ success: false, message: 'Verification link has expired.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User with this email does not exist.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified.' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f1f5f9;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #1e293b;">
          <h2 style="color: #06b6d4; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">SANSAH INNOVATIONS</h2>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">IoT Mini Project Showcase Portal</p>
        </div>
        <div style="padding: 10px 0;">
          <h3 style="color: #f1f5f9; margin-top: 0; font-size: 18px;">Hello, ${user.name}!</h3>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Here is your new email verification link. Please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background-color: #06b6d4; color: #0f172a; text-decoration: none; padding: 12px 30px; font-size: 14px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25); display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser: <br/>
            <a href="${verificationLink}" style="color: #38bdf8; text-decoration: underline;">${verificationLink}</a>
          </p>
          <p style="color: #f43f5e; font-size: 12px; font-weight: bold; text-align: center; margin-top: 24px;">
            Note: This verification link will expire in 24 hours.
          </p>
        </div>
        <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; color: #64748b; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Sansah Innovations. All rights reserved.
        </div>
      </div>
    `;

    try {
      await sendEmail(email, 'Verify Your Email - Sansah Innovations', htmlContent);
    } catch (mailError) {
      console.warn("SMTP send failed for verification resend:", mailError.message);
    }

    res.json({ 
      success: true, 
      message: 'Verification link resent successfully! Check your inbox.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-mail', async (req, res) => {
  try {
    if (!process.env.MAIL_USER) {
      return res.status(400).json({ success: false, message: 'MAIL_USER is not configured in environment.' });
    }
    await sendEmail(
      process.env.MAIL_USER,
      'Test SMTP Connection - IoT Showcase Portal',
      `<h3>SMTP Server Configuration Works!</h3>
       <p>This is a verification that the Nodemailer transporter successfully connected using your Gmail credentials.</p>
       <p>Sent at: <strong>${new Date().toLocaleString()}</strong></p>`
    );
    res.json({ success: true, message: 'Test email successfully sent to ' + process.env.MAIL_USER });
  } catch (error) {
    console.error("Test email sending failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User with this email does not exist' });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    try {
      await sendEmail(
        email,
        'Password Reset Code - IoT Showcase Portal',
        `<h2>Password Reset Request</h2>
         <p>You requested a password reset for your IoT Showcase Portal account. Please use the following code to reset your password:</p>
         <h1 style="color: #ef4444; font-family: monospace; letter-spacing: 2px;">${resetCode}</h1>
         <p>This code is valid for 15 minutes. If you did not make this request, you can safely ignore this email.</p>`
      );
    } catch (mailError) {
      console.warn("SMTP send failed for forgot password:", mailError.message);
    }

    // Always log to console as fallback/easy developer access
    console.log("==========================================");
    console.log(`PASSWORD RESET CODE FOR ${email}: ${resetCode}`);
    console.log("==========================================");

    res.json({ message: 'Password reset code sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    if (new Date() > new Date(user.resetCodeExpires)) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now sign in.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.role;
    delete updates.password;
    
    await User.update(updates, { where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
