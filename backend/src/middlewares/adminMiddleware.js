"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
// Role-based authorization middleware
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only.' });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
