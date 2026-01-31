import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createPartner, listPartners } from "../../services/adminService.js";

export default function AdminPartners() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateCreated, setDateCreated] = useState(""); // yyyy-mm-dd
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setError("");
    setLoadingList(true);
    try {
      const data = await listPartners(token);
      setItems(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load partners");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { email, password, name };
      if (dateCreated) payload.dateCreated = dateCreated;
      await createPartner(token, payload);
      setEmail("");
      setPassword("");
      setName("");
      setDateCreated("");
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to create partner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Partners</h2>
      <p className="muted">Create and list partners.</p>

      <form className="form" onSubmit={onCreate}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Temp password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="row">
          <input className="input" placeholder="Company / Partner name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" type="date" value={dateCreated} onChange={(e) => setDateCreated(e.target.value)} />
        </div>

        <button className="btn" disabled={saving}>
          {saving ? "Creating..." : "Create Partner"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div style={{ marginTop: 12 }}>
        <button className="btn btn--small" onClick={refresh} disabled={loadingList}>
          {loadingList ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.email}</td>
                <td>{p.name}</td>
                <td>{p.dateCreated ?? "-"}</td>
              </tr>
            ))}
            {items.length === 0 && !loadingList && (
              <tr>
                <td colSpan="4" className="muted">No partners.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
