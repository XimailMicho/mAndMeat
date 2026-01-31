import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import OrderList from "../../components/OrderList.jsx";
import { workerQueue, workerSetItemPacked } from "../../services/orderService.js";

export default function WorkerQueue() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [saving, setSaving] = useState({}); // `${orderId}:${itemId}` -> boolean

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await workerQueue(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let arr = [...orders];

    // newest first
    arr.sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));

    if (statusFilter !== "ALL") {
      arr = arr.filter((o) => o.status === statusFilter);
    }

    if (s) {
      arr = arr.filter((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        return (
          String(o.id).includes(s) ||
          (o.partnerEmail ?? "").toLowerCase().includes(s) ||
          (o.notes ?? "").toLowerCase().includes(s) ||
          (o.status ?? "").toLowerCase().includes(s) ||
          items.some((it) => (it.productName ?? "").toLowerCase().includes(s))
        );
      });
    }

    return arr;
  }, [orders, q, statusFilter]);

  async function setPacked(orderId, itemId, packed) {
    const key = `${orderId}:${itemId}`;
    setError("");
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await workerSetItemPacked(token, orderId, itemId, packed);
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to update item");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  }

  return (
    <main className="container container--wide">
      <div className="card">
        <div className="toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Worker Queue</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Pack items. Order becomes <b>READY</b> when all items are packed.
            </p>
          </div>

          <div className="toolbar__group">
            <input
              className="search"
              placeholder="Search (id, partner, product...)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
            </select>

            <button className="btn btn--ghost" onClick={refresh} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <OrderList
          orders={filtered}
          showPartner={true}
          renderItemAction={(order, item) => {
            const key = `${order.id}:${item.id}`;
            const disabled = !!saving[key];

            // If backend doesn't return packed yet, this will just be false.
            const packed = !!item.packed;

            return (
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={packed}
                  disabled={disabled}
                  onChange={(e) => setPacked(order.id, item.id, e.target.checked)}
                />
                <span className="muted" style={{ fontSize: 13 }}>
                  {disabled ? "Saving..." : packed ? "Packed" : "Not packed"}
                </span>
              </label>
            );
          }}
        />
      </div>
    </main>
  );
}
