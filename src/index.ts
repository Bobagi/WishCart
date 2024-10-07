import express, { Request, Response } from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import Knex from 'knex';
import knexConfig from '../knexfile';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

client.connect()
  .then(() => {console.log('Connected to PostgreSQL');
    console.log('Connecting to Knex');
    const knex = Knex(knexConfig.development);

    knex.migrate.latest()
    .then(() => console.log('Database migrated'))
    .catch((err) => console.error('Migration failed', err));
  })
  .catch((err: Error) => console.error('Connection error', err.stack));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
