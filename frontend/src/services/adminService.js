const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";


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


/* ===================== PRODUCTS ===================== */

export async function listProducts(token) {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function createProduct(token, payload) {
  const res = await fetch(`${API_BASE}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateProduct(token, id, payload) {
  const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function setProductPrice(token, productId, payload) {
  const res = await fetch(`${API_BASE}/api/admin/products/${productId}/prices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

/* Active catalogue (no token needed later) */
export async function listActiveProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  return handle(res);
}
