import app from './app';
import { connectDatabase } from './services/dbService';
import logger from './logger';

const port = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    logger.error('Failed to connect to the database', err);
  });
