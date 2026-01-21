const API_BASE = "http://localhost:8080";

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Login failed (${res.status})`);
  }

  const data = await res.json();
  if (!data?.token) throw new Error("Login response missing token");

  return data.token;
}
