import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createWorker, listWorkers } from "../../services/adminService.js";

export default function AdminWorkers() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [embg, setEmbg] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setError("");
    setLoadingList(true);
    try {
      const data = await listWorkers(token);
      setItems(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load workers");
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
      await createWorker(token, { email, password, embg, name, surname });
      setEmail(""); setPassword(""); setEmbg(""); setName(""); setSurname("");
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to create worker");
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(w =>
      String(w.id).includes(s) ||
      (w.email ?? "").toLowerCase().includes(s) ||
      (w.embg ?? "").toLowerCase().includes(s) ||
      (w.name ?? "").toLowerCase().includes(s) ||
      (w.surname ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <div className="card">
      <div className="toolbar">
        <div>
          <h2 className="h2">Workers</h2> 
          <p className="muted pSub">Create and manage worker accounts.</p>
        </div>

        <div className="toolbar__group">
          <input
            className="search"
            placeholder="Search by email, EMBG, name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn--ghost" onClick={refresh} disabled={loadingList}>
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <form className="form" onSubmit={onCreate}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Temp password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" placeholder="EMBG" value={embg} onChange={e=>setEmbg(e.target.value)} />
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Surname" value={surname} onChange={e=>setSurname(e.target.value)} />
        </div>

        <button className="btn" disabled={saving}>
          {saving ? "Creating..." : "Create Worker"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Email</th>
              <th>EMBG</th>
              <th>Name</th>
              <th>Surname</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id}>
                <td className="cell--mono">{w.id}</td>
                <td>{w.email}</td>
                <td>{w.embg}</td>
                <td>{w.name}</td>
                <td>{w.surname}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">No workers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
