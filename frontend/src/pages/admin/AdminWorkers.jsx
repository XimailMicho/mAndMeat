import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createWorker, listWorkers } from "../../services/adminService.js";

<<<<<<< HEAD
=======
function AddWorkerForm({ onCancel, onCreated }) {
  const { token } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [embg, setEmbg] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !embg.trim() || !name.trim() || !surname.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSaving(true);
    try {
      await createWorker(token, { email, password, embg, name, surname });
      await onCreated();
    } catch (e2) {
      setError(e2?.message ?? "Failed to create worker");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Worker</h3>

      <form className="form" onSubmit={onSubmit}>
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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" disabled={saving}>
            {saving ? "Creating..." : "Create Worker"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
export default function AdminWorkers() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [embg, setEmbg] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [saving, setSaving] = useState(false);
=======
  const [showAdd, setShowAdd] = useState(false);
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)

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

<<<<<<< HEAD
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
=======
  async function handleCreated() {
    setShowAdd(false);
    await refresh();
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Workers</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              View workers and create new worker accounts.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn--ghost" onClick={refresh} disabled={loadingList}>
              {loadingList ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? "Close" : "Add Worker"}
            </button>
          </div>
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
        </div>

        {error && <div className="error">{error}</div>}

<<<<<<< HEAD
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
=======
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
              {items.length === 0 && !loadingList && (
                <tr>
                  <td colSpan="5" className="muted">No workers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddWorkerForm
          onCancel={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
    </div>
  );
}
