import jwt from 'jsonwebtoken';
import ENV from '../lib/env.js';

export function signToken(payload: object) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
