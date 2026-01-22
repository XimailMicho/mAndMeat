import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createPartner, createWorker, listPartners, listWorkers } from "../../services/adminService.js";

function WorkerSection() {
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
    <section className="card">
      <h3>Workers</h3>

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
    </section>
  );
}

function PartnerSection() {
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
      setEmail(""); setPassword(""); setName(""); setDateCreated("");
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to create partner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h3>Partners</h3>

      <form className="form" onSubmit={onCreate}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Temp password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" placeholder="Company/Partner name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="date" value={dateCreated} onChange={e=>setDateCreated(e.target.value)} />
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
              <th>ID</th><th>Email</th><th>Name</th><th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.email}</td>
                <td>{p.name}</td>
                <td>{p.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminUsers() {
  return (
    <main className="container">
      <h2>Admin: Users</h2>
      <p className="muted">Create and list Workers and Partners.</p>

      <div className="grid">
        <WorkerSection />
        <PartnerSection />
      </div>
    </main>
  );
}
