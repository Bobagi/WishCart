import express from 'express';
import itemRoutes from './routes/itemRoutes';
import logger from './logger';

const app = express();

app.use(express.json());
app.use(itemRoutes);

export default app;
