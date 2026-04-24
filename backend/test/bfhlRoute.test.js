import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { buildApp } from '../src/app.js';

test('POST /bfhl returns 400 when data is missing', async () => {
  const app = buildApp();
  const response = await request(app)
    .post('/bfhl')
    .send({});

  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Request body must include a data array.');
});

test('POST /bfhl returns a valid response payload', async () => {
  const app = buildApp();
  const response = await request(app)
    .post('/bfhl')
    .send({ data: ['A->B', 'B->C', 'A->B', 'bad'] });

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body.hierarchies));
  assert.ok(Array.isArray(response.body.invalid_entries));
  assert.ok(Array.isArray(response.body.duplicate_edges));
  assert.equal(response.body.invalid_entries[0], 'bad');
  assert.deepEqual(response.body.duplicate_edges, ['A->B']);
  assert.equal(typeof response.body.summary.total_trees, 'number');
  assert.equal(typeof response.body.summary.total_cycles, 'number');
  assert.equal(typeof response.body.summary.largest_tree_root, 'string');
});

test('OPTIONS /bfhl handles CORS preflight', async () => {
  const app = buildApp();
  const response = await request(app)
    .options('/bfhl')
    .set('Origin', 'http://example-client.test')
    .set('Access-Control-Request-Method', 'POST')
    .set('Access-Control-Request-Headers', 'content-type');

  assert.equal(response.status, 204);
  assert.equal(response.headers['access-control-allow-origin'], 'http://example-client.test');
  assert.match(response.headers['access-control-allow-methods'], /POST/);
});
