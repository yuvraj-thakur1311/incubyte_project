import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// Remove the immediate check - do it at runtime instead
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
};

interface JwtPayload {
  id: string;
  role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: 'user' | 'admin' };
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token.trim() === '') {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  console.log("Token received:", token);


  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JwtPayload;

    if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    console.log("Decoded payload:", decoded);


    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
