import type { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const purchaseSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity = 1 } = req.body; // quantity to purchase, default 1

  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in stock' });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.json({ message: `Purchased ${quantity} ${sweet.name}(s)`, sweet });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase sweet' });
  }
};

export const restockSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity = 1 } = req.body; // quantity to restock, default 1

  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({ message: `Restocked ${quantity} 
                        ${sweet.name}(s)`, 
                        sweet });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: 'Failed to restock sweet' });
  }
};
