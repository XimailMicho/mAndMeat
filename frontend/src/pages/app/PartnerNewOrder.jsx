import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { listActiveProducts, partnerSubmitOrder } from "../../services/orderService.js";

function defaultDate() {
  // optional: empty by default; user can select
  return "";
}

export default function PartnerNewOrder() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [items, setItems] = useState([
    { productId: "", unit: "", quantity: "" },
  ]);

  const [deliveryDate, setDeliveryDate] = useState(defaultDate());
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const productById = useMemo(() => {
    const m = new Map();
    for (const p of products) m.set(String(p.id), p);
    return m;
  }, [products]);

  async function loadProducts() {
    setError("");
    setLoadingProducts(true);
    try {
      const data = await listActiveProducts();
      setProducts(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateItem(idx, patch) {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addRow() {
    setItems(prev => [...prev, { productId: "", unit: "", quantity: "" }]);
  }

  function removeRow(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    // basic validation
    if (items.length === 0) {
      setError("Add at least one item.");
      return;
    }

    const payloadItems = [];
    for (const it of items) {
      if (!it.productId || !it.unit || !it.quantity) {
        setError("Fill product, unit, and quantity for all items.");
        return;
      }

      const qty = Number(it.quantity);
      if (Number.isNaN(qty) || qty <= 0) {
        setError("Quantity must be a number greater than 0.");
        return;
      }

      // enforce integer for UNIT
      if (it.unit === "UNIT" && !Number.isInteger(qty)) {
        setError("UNIT quantity must be a whole number.");
        return;
      }

      payloadItems.push({
        productId: Number(it.productId),
        unit: it.unit,
        quantity: qty,
      });
    }

    const payload = {
      deliveryDate: deliveryDate || null,
      notes: notes || null,
      items: payloadItems,
    };

    setSaving(true);
    try {
      await partnerSubmitOrder(token, payload);
      setOkMsg("Order submitted successfully.");
      setItems([{ productId: "", unit: "", quantity: "" }]);
      setDeliveryDate(defaultDate());
      setNotes("");
    } catch (e2) {
      setError(e2?.message ?? "Failed to submit order");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Create Order</h2>
        <p className="muted">Select products, unit and quantity. Price locks at submission.</p>

        {error && <div className="error">{error}</div>}
        {okMsg && <div className="card">{okMsg}</div>}

        <form className="form" onSubmit={onSubmit}>
          <div className="row">
            <label className="label" style={{ flex: 1 }}>
              Delivery date (optional)
              <input
                className="input"
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </label>
          </div>

          <label className="label">
            Notes (optional)
            <textarea
              className="input"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anything the team should know..."
            />
          </label>

          <div className="card" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0 }}>Items</h3>
              <button type="button" className="btn btn--small" onClick={addRow}>
                + Add item
              </button>
            </div>

            {loadingProducts && <p className="muted">Loading products...</p>}

            {items.map((it, idx) => {
              const p = productById.get(String(it.productId));
              const allowedUnits = p?.allowedUnits ?? [];

              return (
                <div key={idx} className="row" style={{ marginTop: 10, alignItems: "center" }}>
                  <select
                    className="input"
                    value={it.productId}
                    onChange={(e) => {
                      const newPid = e.target.value;
                      const prod = productById.get(String(newPid));
                      // auto-pick first allowed unit if available
                      const firstUnit = (prod?.allowedUnits ?? [])[0] ?? "";
                      updateItem(idx, { productId: newPid, unit: firstUnit, quantity: it.quantity });
                    }}
                  >
                    <option value="">Select product…</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input"
                    value={it.unit}
                    onChange={(e) => updateItem(idx, { unit: e.target.value })}
                    disabled={!it.productId}
                  >
                    <option value="">Unit…</option>
                    {allowedUnits.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>

                  <input
                    className="input"
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                    placeholder={it.unit === "UNIT" ? "Qty (whole number)" : "Qty (e.g. 2.5)"}
                  />

                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => removeRow(idx)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" disabled={saving}>
              {saving ? "Submitting..." : "Submit Order"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={loadProducts} disabled={loadingProducts}>
              Refresh products
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
