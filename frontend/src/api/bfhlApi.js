const defaultApiRoot = __BFHL_API_BASE_URL__ || import.meta.env.VITE_BFHL_API_BASE_URL || 'http://localhost:4000';

export async function sendNodeList(apiRoot, nodeList) {
  const response = await fetch(new URL('/bfhl', apiRoot), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: nodeList }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

export function getDefaultApiRoot() {
  return defaultApiRoot;
}
