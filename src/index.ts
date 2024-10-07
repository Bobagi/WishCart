import express, { Request, Response } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import Knex from 'knex';
import { Knex as KnexType } from 'knex';
import knexConfig from '../knexfile';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

let knex: KnexType;

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    console.log('Connecting to Knex');
    knex = Knex(knexConfig.development);

    knex.migrate.latest()
      .then(() => console.log('Database migrated'))
      .catch((err: Error) => console.error('Migration failed', err));
  })
  .catch((err: Error) => console.error('Connection error', err.stack));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.post('/items', async (req: Request, res: Response): Promise<void> => {
  const { item_name, brand, size } = req.body;

  if (!item_name) {
    res.status(400).json({ error: 'item_name is required' });
    return;
  }

  try {
    const [newItem] = await knex('shopping_items')
      .insert({ item_name, brand, size })
      .returning('*');
    
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add item to shopping list' });
  }
});

app.get('/items', async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await knex('shopping_items').select('*');
    res.status(200).json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.delete('/items/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedRows = await knex('shopping_items').where({ id }).del();

    if (deletedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
