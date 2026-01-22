import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createWorker, listWorkers } from "../../services/adminService.js";

export default function AdminWorkers() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

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

    if (!email.trim() || !password.trim() || !embg.trim() || !name.trim() || !surname.trim()) {
      setError("Please fill in all worker fields.");
      return;
    }

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

  return (
    <div className="card">
      <h2>Workers</h2>
      <p className="muted">Create and list workers.</p>

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

        {error && <div className="error">{error}</div>}

        <button className="btn" disabled={saving}>
          {saving ? "Creating..." : "Create Worker"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn--small" onClick={refresh} disabled={loadingList}>
          {loadingList ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Email</th><th>EMBG</th><th>Name</th><th>Surname</th>
            </tr>
          </thead>
          <tbody>
            {items.map(w => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.email}</td>
                <td>{w.embg}</td>
                <td>{w.name}</td>
                <td>{w.surname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
