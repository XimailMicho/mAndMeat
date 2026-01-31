const API_BASE = "http://localhost:8080";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  // 204 No Content
  if (res.status === 204) return null;

  // Some endpoints might return empty body or non-json
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;

  return res.json();
}

/* PUBLIC PRODUCTS */
export async function listActiveProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  return handle(res);
}

/* PARTNER */
export async function partnerSubmitOrder(token, payload) {
  const res = await fetch(`${API_BASE}/api/partner/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function partnerListOrders(token) {
  const res = await fetch(`${API_BASE}/api/partner/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

/* ADMIN */
export async function adminListSubmittedOrders(token) {
  const res = await fetch(`${API_BASE}/api/admin/orders/submitted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function adminApproveOrder(token, orderId) {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}


export async function adminListAllOrders(token) {
  const res = await fetch(`${API_BASE}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function adminCreateApprovedOrder(token, payload) {
  const res = await fetch(`${API_BASE}/api/admin/orders/create-approved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function adminRejectOrder(token, orderId, reason) {
  const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${token}`,
    },
    body: reason ?? "",
  });
  return handle(res);
}


/* WORKER */
export async function workerQueue(token) {
  const res = await fetch(`${API_BASE}/api/worker/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function workerSetItemPacked(token, orderId, itemId, packed) {
  const res = await fetch(
    `${API_BASE}/api/worker/orders/${orderId}/items/${itemId}/packed`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packed }),
    }
  );
  return handle(res);
}
