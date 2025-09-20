import express from 'express';
import {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
} from '../controllers/sweetController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeAdmin } from '../middlewares/adminMiddleware';
import { purchaseSweet, restockSweet } from "../controllers/inventoryController"

const router = express.Router();

// router.use(); // Protect all sweets routes

router.post('/',authenticateJWT, authorizeAdmin, addSweet);
router.get('/', getSweets);
router.get('/search', searchSweets);
router.put('/:id', updateSweet);
router.delete('/:id', authenticateJWT, authorizeAdmin, deleteSweet); 
router.post('/:id/purchase', authenticateJWT, purchaseSweet);
router.post('/:id/restock', authenticateJWT, authorizeAdmin, restockSweet);
export default router;
