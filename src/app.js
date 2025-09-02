import express from 'express';
import dotenv from 'dotenv';
import { apiLimiter } from './utils/rateLimiter.js';
import searchRouter from './routes/search.js';
import genresRouter from './routes/genres.js';
import recommendRouter from './routes/recommend.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
app.use(express.json());
app.use(apiLimiter);

app.use('/search', searchRouter);
app.use('/genres', genresRouter);
app.use('/recommend', recommendRouter);

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Recommendation API',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.js']
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
