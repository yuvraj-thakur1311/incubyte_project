"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set in environment variables');
    }
    return secret;
};
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, getJWTSecret(), { expiresIn: '1h' });
};
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please fill all required fields.' });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        const savedUser = await user.save();
        const token = generateToken(String(savedUser._id), savedUser.role);
        return res.status(201).json({
            userId: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            token,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill all required fields.' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }
        const token = generateToken(String(user._id), user.role);
        return res.status(200).json({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
};
exports.loginUser = loginUser;
