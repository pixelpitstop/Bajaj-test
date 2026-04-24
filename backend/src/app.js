import cors from 'cors';
import express from 'express';
import bfhlRoute from './routes/bfhlRoute.js';

export function buildApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      message: 'BFHL API is running.',
      routes: {
        health: 'GET /health',
        process_nodes: 'POST /bfhl',
      },
      request_example: {
        method: 'POST',
        path: '/bfhl',
        body: {
          data: ['A->B', 'B->C'],
        },
      },
    });
  });

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use(bfhlRoute);

  app.use((error, _request, response, _next) => {
    response.status(500).json({ message: 'Something went wrong.', detail: error.message });
  });

  return app;
}
