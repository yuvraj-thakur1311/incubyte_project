"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const sweetRoutes_1 = __importDefault(require("./routes/sweetRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/sweets', sweetRoutes_1.default);
// app.use('/api/sweets', inventoryRoutes);
// Health check endpoint
app.get('/', (req, res) => {
    res.send('Sweet Shop Management API is running');
});
app.get('/api/protected', authMiddleware_1.authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user?.id });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});
exports.default = app;
