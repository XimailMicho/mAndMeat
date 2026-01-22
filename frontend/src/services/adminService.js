const API_BASE = "http://localhost:8080";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function listWorkers(token) {
  const res = await fetch(`${API_BASE}/api/admin/workers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function createWorker(token, payload) {
  const res = await fetch(`${API_BASE}/api/admin/workers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function listPartners(token) {
  const res = await fetch(`${API_BASE}/api/admin/partners`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function createPartner(token, payload) {
  const res = await fetch(`${API_BASE}/api/admin/partners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}
