import { Router } from 'express';
import { addItemController, getAllItemsController, deleteItemController } from '../controllers/itemController';

const router = Router();

router.post('/items', addItemController);
router.get('/items', getAllItemsController);
router.delete('/items/:id', deleteItemController);

export default router;
