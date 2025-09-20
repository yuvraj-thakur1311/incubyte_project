"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MUST be first - before any other imports
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.default)();
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Environment check:');
        console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
        console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);
    });
};
startServer();
