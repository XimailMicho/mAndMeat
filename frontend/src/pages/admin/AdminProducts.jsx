import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { createProduct, listProducts, setProductPrice } from "../../services/adminService.js";

const ALL_UNITS = ["KG", "UNIT"];

export default function AdminProducts() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");

  // Add product form
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [units, setUnits] = useState(new Set(["KG"]));
  const [savingProduct, setSavingProduct] = useState(false);

  // Inline price state: { [productId]: { [unit]: "123.45" } }
  const [priceInputs, setPriceInputs] = useState({});
  const [savingPrice, setSavingPrice] = useState({}); // key: `${id}:${unit}` => boolean

  const productsById = useMemo(() => {
    const m = new Map();
    for (const p of items) m.set(p.id, p);
    return m;
  }, [items]);

  async function refresh() {
    setError("");
    setLoadingList(true);
    try {
      const data = await listProducts(token);
      setItems(data);

      // Initialize inline price inputs from currentPrices
      const init = {};
      for (const p of data) {
        init[p.id] = init[p.id] || {};
        for (const u of p.allowedUnits || []) {
          const found = (p.currentPrices || []).find(x => x.unit === u);
          init[p.id][u] = found ? String(found.priceMkd) : "";
        }
      }
      setPriceInputs(init);
    } catch (e) {
      setError(e?.message ?? "Failed to load products");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleUnit(u) {
    setUnits(prev => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });
  }

  async function onCreateProduct(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (units.size === 0) {
      setError("Select at least one allowed unit (KG/UNIT).");
      return;
    }

    setSavingProduct(true);
    try {
      await createProduct(token, {
        name: name.trim(),
        active,
        allowedUnits: Array.from(units),
      });
      setName("");
      setActive(true);
      setUnits(new Set(["KG"]));
      setShowAdd(false);
      await refresh();
    } catch (e2) {
      setError(e2?.message ?? "Failed to create product");
    } finally {
      setSavingProduct(false);
    }
  }

  function setPriceValue(productId, unit, value) {
    setPriceInputs(prev => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [unit]: value },
    }));
  }

  async function onSavePrice(productId, unit) {
    setError("");

    const raw = priceInputs?.[productId]?.[unit] ?? "";
    const value = Number(raw);

    if (!raw || Number.isNaN(value) || value <= 0) {
      setError(`Invalid price for ${unit}. Please enter a number greater than 0.`);
      return;
    }

    const key = `${productId}:${unit}`;
    setSavingPrice(prev => ({ ...prev, [key]: true }));

    try {
      await setProductPrice(token, productId, { unit, priceMkd: value });
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to set price");
    } finally {
      setSavingPrice(prev => ({ ...prev, [key]: false }));
    }
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Products</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Create products, configure allowed units, and set MKD prices.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn btn--ghost" onClick={refresh} disabled={loadingList}>
              {loadingList ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? "Close" : "Add Product"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {showAdd && (
          <form className="form" onSubmit={onCreateProduct} style={{ marginTop: 12 }}>
            <div className="row">
              <input
                className="input"
                placeholder="Product name (unique)"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                />
                Active
              </label>
            </div>

            <div className="row" style={{ alignItems: "center" }}>
              <div className="muted" style={{ minWidth: 140 }}>Allowed units:</div>
              {ALL_UNITS.map(u => (
                <label key={u} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={units.has(u)}
                    onChange={() => toggleUnit(u)}
                  />
                  {u}
                </label>
              ))}
            </div>

            <button className="btn" disabled={savingProduct}>
              {savingProduct ? "Creating..." : "Create Product"}
            </button>
          </form>
        )}

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Name</th>
                <th>Active</th>
                <th>Units</th>
                <th style={{ minWidth: 320 }}>Prices (MKD)</th>
              </tr>
            </thead>

            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div className="muted">ID: {p.id}</div>
                  </td>

                  <td>{p.active ? "Yes" : "No"}</td>

                  <td>
                    {(p.allowedUnits || []).join(", ")}
                  </td>

                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(p.allowedUnits || []).map(unit => {
                        const key = `${p.id}:${unit}`;
                        const isSaving = !!savingPrice[key];

                        return (
                          <div key={unit} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ width: 60, fontWeight: 700 }}>{unit}</div>

                            <input
                              className="input"
                              style={{ maxWidth: 180 }}
                              placeholder="e.g. 520"
                              value={priceInputs?.[p.id]?.[unit] ?? ""}
                              onChange={e => setPriceValue(p.id, unit, e.target.value)}
                            />

                            <button
                              className="btn btn--small"
                              type="button"
                              disabled={isSaving}
                              onClick={() => onSavePrice(p.id, unit)}
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>

                            <span className="muted">MKD / {unit}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && !loadingList && (
                <tr>
                  <td colSpan="4" className="muted">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
