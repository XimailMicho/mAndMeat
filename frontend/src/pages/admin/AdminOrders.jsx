import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  adminApproveOrder,
  adminListAllOrders,
} from "../../services/orderService.js";
import OrderList from "../../components/OrderList.jsx";

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState({}); // orderId -> boolean

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

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>All Orders</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Click an order to view items. You can approve only SUBMITTED orders.
          </p>
        </div>

        <button className="btn btn--ghost" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <OrderList
        orders={orders}
        showPartner={true}
        actionsForOrder={(o) =>
          o.status === "SUBMITTED" ? (
            <button
              className="btn btn--small"
              disabled={!!saving[o.id]}
              onClick={() => approve(o.id)}
            >
              {saving[o.id] ? "Approving..." : "Approve"}
            </button>
          ) : null
        }
      />
    </div>
  );
}
