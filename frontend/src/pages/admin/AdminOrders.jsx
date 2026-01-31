import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminApproveOrder, adminListAllOrders } from "../../services/orderService.js";
import OrderList from "../../components/OrderList.jsx";

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({}); // orderId -> boolean

  // optional: simple client-side filter later
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await adminListAllOrders(token);
      setOrders(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function approve(orderId) {
    setError("");
    setSaving((prev) => ({ ...prev, [orderId]: true }));
    try {
      await adminApproveOrder(token, orderId);
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to approve order");
    } finally {
      setSaving((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <main className="container container--wide">
      <div className="card card--flat">
        <div className="toolbar">
          <div>
            <h2 className="title" style={{ margin: 0 }}>Orders</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Click an order row to view items. Approve only <b>SUBMITTED</b> orders.
            </p>
          </div>

          <div className="toolbar__right">
            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="ALL">All</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="READY">Ready</option>
              <option value="DELIVERED">Delivered</option>
              <option value="REJECTED">Rejected</option>
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
          // (optional) let OrderList show status with a badge
          renderStatus={(status) => (
            <span className={`badge badge--${String(status).toLowerCase()}`}>
              {status}
            </span>
          )}
          actionsForOrder={(o) =>
            o.status === "SUBMITTED" ? (
              <button
                className="btn btn--small btn--primary"
                disabled={!!saving[o.id]}
                onClick={() => approve(o.id)}
              >
                {saving[o.id] ? "Approving..." : "Approve"}
              </button>
            ) : (
              <span className="muted">—</span>
            )
          }
        />
      </div>
    </main>
  );
}
