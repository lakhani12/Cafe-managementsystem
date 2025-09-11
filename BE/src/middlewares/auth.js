import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) throw createError(401, 'Authentication required');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('_id name email role');
    if (!user) throw createError(401, 'Invalid token user');
    req.user = user;
    next();
  } catch (err) {
    next(createError(err.status || 401, err.message || 'Invalid token'));
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(createError(403, 'Forbidden'));
    }
    next();
  };
