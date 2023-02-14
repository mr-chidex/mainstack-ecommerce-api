import mongoose from 'mongoose';

import app from './app';
import config from './config';
import { logger } from './handlers';

const PORT = config.PORT || 5000;

// connect database and start server
mongoose.set('strictQuery', true);
mongoose
  .connect(config.DATABASE_URL)
  .then(() => {
    console.log('db successfully connected');

    // start server
    app.listen(PORT, () => console.log(`server running on PORT:: 🚀💥>>> ${PORT}`));
  })
  .catch((_error) => {
    logger.log('error', 'error connecting to database');
  });
