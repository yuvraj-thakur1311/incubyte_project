"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI)
    throw new Error('MONGO_URI not set');
mongoose_1.default.connect(MONGO_URI).then(async () => {
    const existingAdmin = await User_1.default.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
        console.log('Admin already exists.');
        mongoose_1.default.connection.close();
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash('adminpassword', 10);
    const adminUser = new User_1.default({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
    });
    await adminUser.save();
    console.log('Admin user seeded.');
    mongoose_1.default.connection.close();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
