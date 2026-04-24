import { Router } from 'express';
import { buildBfhlResponse } from '../bfhl/bfhlProcessor.js';

const bfhlRoute = Router();

bfhlRoute.post('/bfhl', (request, response) => {
  const bodyData = request.body?.data;

  if (!Array.isArray(bodyData)) {
    response.status(400).json({ message: 'Request body must include a data array.' });
    return;
  }

  response.json(buildBfhlResponse(bodyData));
});

export default bfhlRoute;
