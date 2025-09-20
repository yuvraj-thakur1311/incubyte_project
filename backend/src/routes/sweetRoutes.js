"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sweetController_1 = require("../controllers/sweetController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const inventoryController_1 = require("../controllers/inventoryController");
const router = express_1.default.Router();
// router.use(); // Protect all sweets routes
router.post('/', authMiddleware_1.authenticateJWT, adminMiddleware_1.authorizeAdmin, sweetController_1.addSweet);
router.get('/', sweetController_1.getSweets);
router.get('/search', sweetController_1.searchSweets);
router.put('/:id', sweetController_1.updateSweet);
router.delete('/:id', authMiddleware_1.authenticateJWT, adminMiddleware_1.authorizeAdmin, sweetController_1.deleteSweet);
router.post('/:id/purchase', authMiddleware_1.authenticateJWT, inventoryController_1.purchaseSweet);
router.post('/:id/restock', authMiddleware_1.authenticateJWT, adminMiddleware_1.authorizeAdmin, inventoryController_1.restockSweet);
exports.default = router;
