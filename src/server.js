import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandle } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';

import { env } from './utils/env.js';
const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(cookieParser());

  app.use(router);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('*', notFoundHandle);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
