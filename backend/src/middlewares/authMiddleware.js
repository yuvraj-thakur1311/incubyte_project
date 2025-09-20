"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Remove the immediate check - do it at runtime instead
const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set in environment variables');
    }
    return secret;
};
const authenticateJWT = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, getJWTSecret());
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }
        console.log("Decoded payload:", decoded);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticateJWT = authenticateJWT;
