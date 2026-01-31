import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createPartner, listPartners } from "../../services/adminService.js";

<<<<<<< HEAD
=======
function AddPartnerForm({ onCancel, onCreated }) {
  const { token } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateCreated, setDateCreated] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !name.trim()) {
      setError("Please fill in email, password, and name.");
      return;
    }

    setSaving(true);
    try {
      const payload = { email, password, name };
      if (dateCreated) payload.dateCreated = dateCreated;

      await createPartner(token, payload);
      await onCreated();
    } catch (e2) {
      setError(e2?.message ?? "Failed to create partner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>Add Partner</h3>

      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Temp password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" placeholder="Company/Partner name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="date" value={dateCreated} onChange={e=>setDateCreated(e.target.value)} />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" disabled={saving}>
            {saving ? "Creating..." : "Create Partner"}
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
export default function AdminPartners() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
<<<<<<< HEAD

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateCreated, setDateCreated] = useState(""); // yyyy-mm-dd
  const [saving, setSaving] = useState(false);
=======
  const [showAdd, setShowAdd] = useState(false);
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)

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

<<<<<<< HEAD
  async function onCreate(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !name.trim()) {
      setError("Please fill in email, password and partner name.");
      return;
    }

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
    <div className="card">
      <h2>Partners</h2>
      <p className="muted">Create and list partners.</p>

      <form className="form" onSubmit={onCreate}>
        <div className="row">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Temp password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="row">
          <input className="input" placeholder="Partner name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="date" value={dateCreated} onChange={e=>setDateCreated(e.target.value)} />
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
            <h2 style={{ margin: 0 }}>Partners</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              View partners and create new partner accounts.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn--ghost" onClick={refresh} disabled={loadingList}>
              {loadingList ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? "Close" : "Add Partner"}
            </button>
          </div>
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
        </div>

        {error && <div className="error">{error}</div>}

<<<<<<< HEAD
        <button className="btn" disabled={saving}>
          {saving ? "Creating..." : "Create Partner"}
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
=======
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
              {items.length === 0 && !loadingList && (
                <tr>
                  <td colSpan="4" className="muted">No partners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddPartnerForm
          onCancel={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
    </div>
  );
}
