import Knex from 'knex';
import { Knex as KnexType } from 'knex';
import knexConfig from '../../knexfile';
import logger from '../logger';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let knex: KnexType;
const port = process.env.PORT || 3000;

export async function connectDatabase() {
  if (!knex) {
    logger.info('Connecting to PostgreSQL');
     const client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
    });
    
    await client.connect()
      .then(() => {
        logger.info('Connected to PostgreSQL');
      })
      .catch((err: Error) => {
        logger.error('Connection error:', err);
        throw err;
      });

    knex = Knex(knexConfig.development);
    await knex.migrate.latest()
      .then(() => logger.info('Database migrated'))
      .catch((err: Error) => {
        logger.error('Migration failed:', err);
        throw err;
      });
  }
  return knex;
}

export async function getAllItems() {
  return knex('shopping_items').select('*');
}

export async function addItem(item: { item_name: string, brand?: string, size?: string }) {
  return knex('shopping_items').insert(item).returning('*');
}

export async function deleteItemById(id: string) {
  return knex('shopping_items').where({ id }).del();
}
