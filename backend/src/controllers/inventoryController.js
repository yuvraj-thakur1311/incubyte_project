"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockSweet = exports.purchaseSweet = void 0;
const Sweet_1 = __importDefault(require("../models/Sweet"));
const purchaseSweet = async (req, res) => {
    const { id } = req.params;
    const { quantity = 1 } = req.body; // quantity to purchase, default 1
    try {
        const sweet = await Sweet_1.default.findById(id);
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        if (sweet.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity in stock' });
        }
        sweet.quantity -= quantity;
        await sweet.save();
        res.json({ message: `Purchased ${quantity} ${sweet.name}(s)`, sweet });
    }
    catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: 'Failed to purchase sweet' });
    }
};
exports.purchaseSweet = purchaseSweet;
const restockSweet = async (req, res) => {
    const { id } = req.params;
    const { quantity = 1 } = req.body; // quantity to restock, default 1
    try {
        const sweet = await Sweet_1.default.findById(id);
        if (!sweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        sweet.quantity += quantity;
        await sweet.save();
        res.json({ message: `Restocked ${quantity} 
                        ${sweet.name}(s)`,
            sweet });
    }
    catch (error) {
        console.error('Restock error:', error);
        res.status(500).json({ error: 'Failed to restock sweet' });
    }
};
exports.restockSweet = restockSweet;
