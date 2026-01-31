import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  adminApproveOrder,
  adminListAllOrders,
  adminCreateApprovedOrder,
  adminRejectOrder,
  listActiveProducts,
} from "../../services/orderService.js";
import { listPartners } from "../../services/adminService.js";
import OrderList from "../../components/OrderList.jsx";

function emptyItem() {
  return { productId: "", unit: "KG", quantity: "" };
}

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState({}); // approve: orderId -> boolean

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL"); // partner email

  // create-approved form
  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [partnerId, setPartnerId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([emptyItem()]);

  // reject modal
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSaving, setRejectSaving] = useState(false);


  async function refreshOrders() {
    setError("");
    setLoadingOrders(true);
    try {
      const data = await adminListAllOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  }

  async function refreshPartners() {
    setError("");
    setLoadingPartners(true);
    try {
      const data = await listPartners(token);
      const sorted = [...(Array.isArray(data) ? data : [])].sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "")
      );
      setPartners(sorted);
    } catch (e) {
      setError(e?.message ?? "Failed to load partners");
    } finally {
      setLoadingPartners(false);
    }
  }

  async function refreshProducts() {
    setError("");
    setLoadingProducts(true);
    try {
      const data = await listActiveProducts();
      // Sort by name for nicer dropdown
      const sorted = [...(Array.isArray(data) ? data : [])].sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "")
      );
      setProducts(sorted);
    } catch (e) {
      setError(e?.message ?? "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    refreshOrders();
    refreshPartners();
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(orderId) {
    setError("");
    setSaving((prev) => ({ ...prev, [orderId]: true }));
    try {
      await adminApproveOrder(token, orderId);
      await refreshOrders();
    } catch (e) {
      setError(e?.message ?? "Failed to approve order");
    } finally {
      setSaving((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  const filteredOrders = useMemo(() => {
    const s = q.trim().toLowerCase();

    let arr = [...orders].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );

    if (statusFilter !== "ALL") arr = arr.filter((o) => o.status === statusFilter);
    if (partnerFilter !== "ALL") arr = arr.filter((o) => o.partnerEmail === partnerFilter);

    if (s) {
      arr = arr.filter((o) => {
        return (
          String(o.id).includes(s) ||
          (o.partnerEmail ?? "").toLowerCase().includes(s) ||
          (o.status ?? "").toLowerCase().includes(s) ||
          (o.notes ?? "").toLowerCase().includes(s)
        );
      });
    }
    return arr;
  }, [orders, q, statusFilter, partnerFilter]);

  function openReject(orderId) {
    setRejectOrderId(orderId);
    setRejectReason("");
    setRejectOpen(true);
  }

  function closeReject() {
    setRejectOpen(false);
    setRejectOrderId(null);
    setRejectReason("");
  }

  async function submitReject(e) {
    e.preventDefault();
    setError("");

    if (!rejectOrderId) return;

    setRejectSaving(true);
    try {
      await adminRejectOrder(token, rejectOrderId, rejectReason || "Rejected");
      closeReject();
      await refreshOrders();
    } catch (e2) {
      setError(e2?.message ?? "Failed to reject order");
    } finally {
      setRejectSaving(false);
    }
  }


  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx, patch) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function productById(id) {
    const pid = Number(id);
    return products.find((p) => p.id === pid);
  }

  function allowedUnitsFor(productId) {
    const p = productById(productId);
    const units = p?.allowedUnits ?? [];
    // if backend sends enum names, example: ["KG","UNIT"]
    return units.length ? units : ["KG", "UNIT"];
  }

  async function submitCreateApproved(e) {
    e.preventDefault();
    setError("");

    if (!partnerId) {
      setError("Please select a partner.");
      return;
    }

    const cleanedItems = items
      .map((it) => ({
        productId: Number(it.productId),
        unit: it.unit,
        quantity: it.quantity === "" ? null : Number(it.quantity),
      }))
      .filter((it) => it.productId && it.quantity != null);

    if (cleanedItems.length === 0) {
      setError("Add at least one valid item (product + quantity).");
      return;
    }

    const payload = {
      partnerId: Number(partnerId),
      order: {
        deliveryDate: deliveryDate || null,
        notes: notes || null,
        items: cleanedItems,
      },
    };

    setCreateSaving(true);
    try {
      await adminCreateApprovedOrder(token, payload);
      // reset form
      setPartnerId("");
      setDeliveryDate("");
      setNotes("");
      setItems([emptyItem()]);
      setCreateOpen(false);
      await refreshOrders();
    } catch (e2) {
      setError(e2?.message ?? "Failed to create order");
    } finally {
      setCreateSaving(false);
    }
  }

  return (
    <main className="container container--wide">
      <div className="card">
        <div className="toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Orders</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Filter by partner/status. Click an order row to view items.
            </p>
          </div>

          <div className="toolbar__group">
            <input
              className="search"
              placeholder="Search (id, partner, notes...)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="select"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              disabled={loadingPartners}
              title={loadingPartners ? "Loading partners..." : "Filter by partner"}
            >
              <option value="ALL">{loadingPartners ? "Loading partners..." : "All partners"}</option>
              {partners.map((p) => (
                <option key={p.id} value={p.email}>
                  {p.name ? `${p.name} — ${p.email}` : p.email}
                </option>
              ))}
            </select>

            <button className="btn btn--ghost" onClick={refreshOrders} disabled={loadingOrders}>
              {loadingOrders ? "Refreshing..." : "Refresh"}
            </button>

            <button className="btn" onClick={() => setCreateOpen((v) => !v)}>
              {createOpen ? "Close" : "Add Order"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {createOpen && (
          <div className="card card--flat" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Create approved order</h3>
            <p className="muted" style={{ marginTop: 6 }}>
              This will create an order directly in <b>APPROVED</b> state.
            </p>

            <form className="form" onSubmit={submitCreateApproved}>
              <div className="row">
                <select
                  className="select"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  disabled={loadingPartners}
                  style={{ minWidth: 280 }}
                >
                  <option value="">
                    {loadingPartners ? "Loading partners..." : "Select partner..."}
                  </option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name ? `${p.name} — ${p.email}` : p.email}
                    </option>
                  ))}
                </select>

                <input
                  className="input"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ maxWidth: 220 }}
                />
              </div>

              <div className="row">
                <input
                  className="input"
                  placeholder="Notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="tableWrap" style={{ marginTop: 12 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style={{ width: 140 }}>Unit</th>
                      <th style={{ width: 160 }}>Qty</th>
                      <th className="cell--actions" style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => {
                      const units = allowedUnitsFor(it.productId);
                      return (
                        <tr key={idx}>
                          <td>
                            <select
                              className="select"
                              value={it.productId}
                              onChange={(e) => {
                                const newPid = e.target.value;
                                const allowed = allowedUnitsFor(newPid);
                                updateItem(idx, {
                                  productId: newPid,
                                  unit: allowed.includes(it.unit) ? it.unit : (allowed[0] ?? "KG"),
                                });
                              }}
                              disabled={loadingProducts}
                              style={{ width: "100%" }}
                            >
                              <option value="">
                                {loadingProducts ? "Loading products..." : "Select product..."}
                              </option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <select
                              className="select"
                              value={it.unit}
                              onChange={(e) => updateItem(idx, { unit: e.target.value })}
                              disabled={!it.productId}
                            >
                              {units.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              className="input"
                              type="number"
                              step={it.unit === "KG" ? "0.001" : "1"}
                              min="0"
                              placeholder={it.unit === "KG" ? "e.g. 5.25" : "e.g. 3"}
                              value={it.quantity}
                              onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                            />
                          </td>

                          <td className="cell--actions">
                            <button
                              type="button"
                              className="btn btn--small btn--ghost"
                              onClick={() => removeItem(idx)}
                              disabled={items.length === 1}
                              title={items.length === 1 ? "At least one item required" : "Remove item"}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="toolbar" style={{ marginTop: 12 }}>
                <div className="toolbar__group">
                  <button type="button" className="btn btn--ghost" onClick={addItem}>
                    + Add item
                  </button>
                </div>

                <div className="toolbar__group">
                  <button className="btn btn--primary" disabled={createSaving}>
                    {createSaving ? "Creating..." : "Create approved order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <OrderList
          orders={filteredOrders}
          showPartner={true}
          actionsForOrder={(o) =>
            o.status === "SUBMITTED" ? (
              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button
                  className="btn btn--small btn--primary"
                  disabled={!!saving[o.id]}
                  onClick={(e) => { e.stopPropagation(); approve(o.id); }}
                >
                  {saving[o.id] ? "Approving..." : "Approve"}
                </button>

                <button
                  className="btn btn--small btn--danger"
                  disabled={rejectSaving || !!saving[o.id]}
                  onClick={(e) => { e.stopPropagation(); openReject(o.id); }}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span className="muted">—</span>
            )
          }
        />
      </div>
      {rejectOpen && (
        <div className="modalBackdrop" onClick={closeReject}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Reject order #{rejectOrderId}</h3>
            <p className="muted" style={{ marginTop: 6 }}>
              Provide a reason (partners will see it).
            </p>

            <form onSubmit={submitReject}>
              <textarea
                className="textarea"
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="toolbar" style={{ marginTop: 12 }}>
                <div className="toolbar__group">
                  <button type="button" className="btn btn--ghost" onClick={closeReject}>
                    Cancel
                  </button>
                </div>

                <div className="toolbar__group">
                  <button className="btn btn--danger" disabled={rejectSaving}>
                    {rejectSaving ? "Rejecting..." : "Reject Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


