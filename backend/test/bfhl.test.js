import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBfhlResponse } from '../src/bfhl/bfhlProcessor.js';

test('builds the sample hierarchy response shape', () => {
  const result = buildBfhlResponse([
    'A->B',
    'A->C',
    'B->D',
    'C->E',
    'E->F',
    'X->Y',
    'Y->Z',
    'Z->X',
    'P->Q',
    'Q->R',
    'G->H',
    'G->H',
    'G->I',
    'hello',
    '1->2',
    'A->',
  ]);

  assert.deepEqual(result.invalid_entries, ['hello', '1->2', 'A->']);
  assert.deepEqual(result.duplicate_edges, ['G->H']);
  assert.equal(result.summary.total_trees, 3);
  assert.equal(result.summary.total_cycles, 1);
  assert.equal(result.summary.largest_tree_root, 'A');
  assert.equal(result.hierarchies.length, 4);
  assert.deepEqual(result.hierarchies[0], {
    root: 'A',
    tree: {
      A: {
        B: { D: {} },
        C: { E: { F: {} } },
      },
    },
    depth: 4,
  });
  assert.deepEqual(result.hierarchies[1], {
    root: 'X',
    tree: {},
    has_cycle: true,
  });
});

test('treats whitespace and self loops as invalid', () => {
  const result = buildBfhlResponse([' A->B ', 'A->A', '', 'B->C']);

  assert.deepEqual(result.invalid_entries, ['A->A', '']);
  assert.equal(result.summary.total_trees, 1);
});

test('keeps the first parent for diamond edges', () => {
  const result = buildBfhlResponse(['A->D', 'B->D', 'D->E']);

  assert.equal(result.hierarchies.length, 1);
  assert.deepEqual(result.hierarchies[0], {
    root: 'A',
    tree: {
      A: { D: { E: {} } },
    },
    depth: 3,
  });
});

test('returns cycle root as lexicographically smallest when no natural root exists', () => {
  const result = buildBfhlResponse(['Y->Z', 'Z->X', 'X->Y']);

  assert.equal(result.hierarchies.length, 1);
  assert.equal(result.hierarchies[0].root, 'X');
  assert.deepEqual(result.hierarchies[0].tree, {});
  assert.equal(result.hierarchies[0].has_cycle, true);
  assert.equal(Object.hasOwn(result.hierarchies[0], 'depth'), false);
});

test('reports duplicate edge only once even if repeated many times', () => {
  const result = buildBfhlResponse(['A->B', 'A->B', 'A->B', 'A->B']);

  assert.deepEqual(result.duplicate_edges, ['A->B']);
  assert.equal(result.summary.total_trees, 1);
});

test('uses lexicographically smaller root when largest depth ties', () => {
  const result = buildBfhlResponse(['A->B', 'B->C', 'X->Y', 'Y->Z']);

  assert.equal(result.summary.total_trees, 2);
  assert.equal(result.summary.total_cycles, 0);
  assert.equal(result.summary.largest_tree_root, 'A');
});

test('keeps has_cycle only on cycle hierarchies', () => {
  const result = buildBfhlResponse(['A->B', 'B->C']);

  assert.equal(result.hierarchies.length, 1);
  assert.equal(Object.hasOwn(result.hierarchies[0], 'has_cycle'), false);
  assert.equal(result.hierarchies[0].depth, 3);
});

