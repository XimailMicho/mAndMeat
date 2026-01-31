import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createPartner, listPartners } from "../../services/adminService.js";

export default function AdminPartners() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
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
      setEmail(""); setPassword(""); setName(""); setDateCreated("");
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to create partner");
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(p =>
      String(p.id).includes(s) ||
      (p.email ?? "").toLowerCase().includes(s) ||
      (p.name ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <div className="card">
      <div className="toolbar">
        <div>
          <h2 className="h2">Partners</h2>
          <p className="muted pSub">Create and manage partner accounts.</p>
        </div>

        <div className="toolbar__group">
          <input
            className="search"
            placeholder="Search by email or name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn--ghost" onClick={refresh} disabled={loadingList}>
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="formCard">
        <h3 className="formTitle">Create Partner</h3>

        <form className="form" onSubmit={onCreate}>
          <div className="row">
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" placeholder="Temp password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          <div className="row">
            <input className="input" placeholder="Company / Partner name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="input" type="date" value={dateCreated} onChange={e=>setDateCreated(e.target.value)} />
          </div>

          <div className="formActions">
            <button className="btn" disabled={saving}>
              {saving ? "Creating..." : "Create Partner"}
            </button>
          </div>
        </form>
      </div>


      {error && <div className="error">{error}</div>}

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th style={{ width: 160 }}>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="cell--mono">{p.id}</td>
                <td>{p.email}</td>
                <td>{p.name}</td>
                <td>{p.dateCreated ?? "-"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">No partners found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
