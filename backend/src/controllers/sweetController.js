"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSweet = exports.updateSweet = exports.searchSweets = exports.getSweets = exports.addSweet = void 0;
const Sweet_1 = __importDefault(require("../models/Sweet"));
const addSweet = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;
        const existing = await Sweet_1.default.findOne({ name });
        if (existing) {
            return res.status(400).json({ error: 'Sweet already exists' });
        }
        const sweet = new Sweet_1.default({ name, category, price, quantity });
        await sweet.save();
        res.status(201).json(sweet);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add sweet' });
    }
};
exports.addSweet = addSweet;
const getSweets = async (_req, res) => {
    try {
        const sweets = await Sweet_1.default.find();
        res.json(sweets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get sweets' });
    }
};
exports.getSweets = getSweets;
const searchSweets = async (req, res) => {
    try {
        const { name, category } = req.query;
        const filters = {};
        if (name) {
            filters.name = { $regex: new RegExp(String(name), 'i') };
        }
        if (category) {
            filters.category = { $regex: new RegExp(String(category), 'i') };
        }
        // if (minPrice || maxPrice) {
        //   filters.price = {};
        //   if (minPrice) filters.price.$gte = Number(minPrice);
        //   if (maxPrice) filters.price.$lte = Number(maxPrice);
        // }
        const sweets = await Sweet_1.default.find(filters);
        res.json(sweets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search sweets' });
    }
};
exports.searchSweets = searchSweets;
const updateSweet = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedSweet = await Sweet_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedSweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        res.json(updatedSweet);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update sweet' });
    }
};
exports.updateSweet = updateSweet;
const deleteSweet = async (req, res) => {
    const { id } = req.params;
    if (!id || id.length !== 24) { // Basic check for valid Mongo ObjectId length
        return res.status(400).json({ error: 'Invalid sweet ID' });
    }
    try {
        const existingSweet = await Sweet_1.default.findById(id);
        if (!existingSweet) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        await Sweet_1.default.deleteOne({ _id: id });
        return res.json({ message: 'Sweet deleted successfully' });
    }
    catch (err) {
        console.error('Delete sweet error:', err);
        return res.status(500).json({ error: 'Internal server error deleting sweet' });
    }
};
exports.deleteSweet = deleteSweet;
