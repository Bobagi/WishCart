import { Request, Response } from 'express';
import { addItem, getAllItems, deleteItemById } from '../services/dbService';
import { scrapeMercadoLivreProducts } from '../services/scraperService';
import logger from '../logger';

export async function addItemController(req: Request, res: Response): Promise<void> {
  const { item_name, brand, size } = req.body;

  if (!item_name) {
    res.status(400).json({ error: 'item_name is required' });
    return;
  }

  try {
    const [newItem] = await addItem({ item_name, brand, size });
    const mercadoLivreResults = await scrapeMercadoLivreProducts(item_name);
    
    res.status(201).json({ item: newItem, mercadoLivreResults });
  } catch (err: any) {
    logger.error('Error adding item:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
}

export async function getAllItemsController(req: Request, res: Response): Promise<void> {
  try {
    const items = await getAllItems();
    res.status(200).json(items);
  } catch (err: any) {
    logger.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}

export async function deleteItemController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const deletedRows = await deleteItemById(id);
    if (deletedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err: any) {
    logger.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}
