const API_BASE = 'http://localhost:8080/api/files';

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchFiles() {
  const res = await fetch(API_BASE);
  return handleResponse(res);
}

export async function fetchFile(name) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`);
  return handleResponse(res);
}

export async function createFile({ name, language, content }) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, language, content })
  });
  return handleResponse(res);
}

export async function updateFile(name, { content, language }) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language })
  });
  return handleResponse(res);
}

export async function deleteFile(name) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

export function isBackendReachable() {
  return fetch(API_BASE, { method: 'GET' })
    .then((r) => r.ok)
    .catch(() => false);
}
