const nodePattern = /^[A-Z]->[A-Z]$/;

function readIdentity() {
  return {
    user_id: process.env.BFHL_USER_ID || '',
    email_id: process.env.BFHL_EMAIL_ID || '',
    college_roll_number: process.env.BFHL_ROLL_NUMBER || '',
  };
}

function cleanEntry(entry) {
  return String(entry ?? '').trim();
}

function isValidEntry(entry) {
  return nodePattern.test(entry) && entry[0] !== entry[3];
}

function makeNode(parent, child) {
  return { parent, child, key: `${parent}->${child}` };
}

function gatherValidEdges(rawData) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const uniqueEdgeKeys = new Set();
  const duplicateSeen = new Set();
  const validEdges = [];

  for (const item of rawData) {
    const entry = cleanEntry(item);

    if (!isValidEntry(entry)) {
      invalidEntries.push(entry);
      continue;
    }

    if (uniqueEdgeKeys.has(entry)) {
      if (!duplicateSeen.has(entry)) {
        duplicateEdges.push(entry);
        duplicateSeen.add(entry);
      }

      continue;
    }

    uniqueEdgeKeys.add(entry);
    validEdges.push(makeNode(entry[0], entry[3]));
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

function keepFirstParentEdges(validEdges) {
  const keptEdges = [];
  const childOwners = new Set();

  for (const edge of validEdges) {
    if (childOwners.has(edge.child)) {
      continue;
    }

    childOwners.add(edge.child);
    keptEdges.push(edge);
  }

  return keptEdges;
}

function buildGraph(keptEdges) {
  const directed = new Map();
  const undirected = new Map();
  const allNodes = [];
  const seenNodes = new Set();

  function rememberNode(node) {
    if (!seenNodes.has(node)) {
      seenNodes.add(node);
      allNodes.push(node);
    }
  }

  function link(map, from, to) {
    if (!map.has(from)) {
      map.set(from, []);
    }

    map.get(from).push(to);
  }

  for (const edge of keptEdges) {
    rememberNode(edge.parent);
    rememberNode(edge.child);

    link(directed, edge.parent, edge.child);
    link(undirected, edge.parent, edge.child);
    link(undirected, edge.child, edge.parent);
  }

  return { directed, undirected, allNodes };
}

function collectComponents(allNodes, undirected) {
  const visited = new Set();
  const components = [];

  for (const startNode of allNodes) {
    if (visited.has(startNode)) {
      continue;
    }

    const stack = [startNode];
    const component = [];
    visited.add(startNode);

    while (stack.length > 0) {
      const currentNode = stack.pop();
      component.push(currentNode);

      const neighbors = undirected.get(currentNode) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}

function hasCycle(nodes, directed) {
  const state = new Map();

  function visit(node) {
    const currentState = state.get(node) || 0;

    if (currentState === 1) {
      return true;
    }

    if (currentState === 2) {
      return false;
    }

    state.set(node, 1);

    const children = directed.get(node) || [];
    for (const child of children) {
      if (visit(child)) {
        return true;
      }
    }

    state.set(node, 2);
    return false;
  }

  for (const node of nodes) {
    if ((state.get(node) || 0) === 0 && visit(node)) {
      return true;
    }
  }

  return false;
}

function buildTreeObject(rootNode, directed) {
  const children = directed.get(rootNode) || [];
  const branch = {};

  for (const child of children) {
    branch[child] = buildTreeObject(child, directed);
  }

  return branch;
}

function measureDepth(rootNode, directed) {
  const children = directed.get(rootNode) || [];

  if (children.length === 0) {
    return 1;
  }

  let deepestChild = 0;

  for (const child of children) {
    deepestChild = Math.max(deepestChild, measureDepth(child, directed));
  }

  return deepestChild + 1;
}

function chooseComponentRoot(component, directed) {
  const children = new Set();

  for (const node of component) {
    for (const child of directed.get(node) || []) {
      children.add(child);
    }
  }

  const roots = component.filter((node) => !children.has(node));

  if (roots.length > 0) {
    return roots[0];
  }

  return [...component].sort()[0] || '';
}

function processComponent(component, directed) {
  const rootNode = chooseComponentRoot(component, directed);
  const cycleFound = hasCycle(component, directed);

  if (cycleFound) {
    return {
      root: rootNode,
      tree: {},
      has_cycle: true,
    };
  }

  return {
    root: rootNode,
    tree: { [rootNode]: buildTreeObject(rootNode, directed) },
    depth: measureDepth(rootNode, directed),
  };
}

export function buildBfhlResponse(rawData) {
  const sourceData = Array.isArray(rawData) ? rawData : [];
  const { validEdges, invalidEntries, duplicateEdges } = gatherValidEdges(sourceData);
  const keptEdges = keepFirstParentEdges(validEdges);
  const { directed, undirected, allNodes } = buildGraph(keptEdges);
  const components = collectComponents(allNodes, undirected);

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = '';
  let largestTreeDepth = 0;

  for (const component of components) {
    const hierarchy = processComponent(component, directed);
    hierarchies.push(hierarchy);

    if (hierarchy.has_cycle) {
      totalCycles += 1;
      continue;
    }

    totalTrees += 1;

    if (
      hierarchy.depth > largestTreeDepth ||
      (hierarchy.depth === largestTreeDepth && (largestTreeRoot === '' || hierarchy.root < largestTreeRoot))
    ) {
      largestTreeDepth = hierarchy.depth;
      largestTreeRoot = hierarchy.root;
    }
  }

  return {
    ...readIdentity(),
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
}
