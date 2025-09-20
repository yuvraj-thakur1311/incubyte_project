import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authMiddleware';

// Role-based authorization middleware
export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only.' });
  }
  next();
};
