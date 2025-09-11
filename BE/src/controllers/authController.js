import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import createError from 'http-errors';
import { validationResult } from 'express-validator';
import { User } from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(422, { errors: errors.array() }));
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw createError(409, 'Email already registered');
    const user = await User.create({ name, email, password, role: 'user' });
    const token = signToken(user);
    res
      .status(201)
      .json({ success: true, token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createError(422, { errors: errors.array() }));
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password name email role');
    if (!user) throw createError(401, 'Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createError(401, 'Invalid credentials');
    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw createError(409, 'Email already registered');
    const admin = await User.create({ name, email, password, role: 'admin' });
    res
      .status(201)
      .json({ success: true, admin: { id: admin._id, name, email, role: admin.role } });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password name email role');
    if (!user) throw createError(401, 'Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createError(401, 'Invalid credentials');
    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found');
    const resetToken = user.generatePasswordReset();
    await user.save({ validateBeforeSave: false });
    const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
    res.json({ success: true, resetToken, hashed });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');
    if (!user) throw createError(400, 'Token invalid or expired');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
