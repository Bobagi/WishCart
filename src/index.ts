import express, { Request, Response } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import Knex from 'knex';
import { Knex as KnexType } from 'knex';
import knexConfig from '../knexfile';
import puppeteer from 'puppeteer';
import logger from './logger';

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
    logger.info('Connected to PostgreSQL');
    logger.info('Connecting to Knex');
    knex = Knex(knexConfig.development);

    knex.migrate.latest()
      .then(() => logger.info('Database migrated'))
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

    const mercadoLivreResults = await scrapeMercadoLivreProducts(item_name);
    
    res.status(201).json(newItem);
  } catch (err: any) {
    logger.error('Error posting an item: ', err)
    res.status(500).json({ error: 'Failed to add item to shopping list'});
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
  logger.info(`Server is running on port ${port}`);
});

async function scrapeMercadoLivreProducts(keyword: string) {
  logger.info('Scraping Mercado Livre for:', keyword);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  logger.info('Browser launched');	
  const page = await browser.newPage();
  logger.info('Page created');
  
  const searchUrl = `https://www.mercadolivre.com.br/jm/search?as_word=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  logger.info('Page loaded');

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ui-search-result__content')).map(product => {
      const title = product.querySelector('.ui-search-item__title')?.textContent?.trim() || 'No title';
      const price = product.querySelector('.price-tag-fraction')?.textContent?.trim() || 'No price';
      const link = product.querySelector('a')?.href || 'No link';

      const image = product.querySelector('img')?.getAttribute('data-src') ||
                    product.querySelector('img')?.getAttribute('srcset') ||
                    product.querySelector('img')?.src ||
                    'No image';

      return { title, price, link, image };
    });
  });

  logger.info('Products scraped:', products);

  await browser.close();
  return products;
}
