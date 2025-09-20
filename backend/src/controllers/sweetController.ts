import type { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;
    const existing = await Sweet.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Sweet already exists' });
    }

    const sweet = new Sweet({ name, category, price, quantity });
    await sweet.save();

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add sweet' });
  }
};

export const getSweets = async (_req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sweets' });
  }
};

export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category } = req.query;

    const filters: any = {};

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

    const sweets = await Sweet.find(filters);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search sweets' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSweet = await Sweet.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedSweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(updatedSweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sweet' });
  }
};


export const deleteSweet = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || id.length !== 24) { // Basic check for valid Mongo ObjectId length
    return res.status(400).json({ error: 'Invalid sweet ID' });
  }

  try {
    const existingSweet = await Sweet.findById(id);
    if (!existingSweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    await Sweet.deleteOne({ _id: id });

    return res.json({ message: 'Sweet deleted successfully' });
  } catch (err) {
    console.error('Delete sweet error:', err);
    return res.status(500).json({ error: 'Internal server error deleting sweet' });
  }
};
