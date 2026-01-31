import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { partnerListOrders } from "../../services/orderService.js";
import OrderList from "../../components/OrderList.jsx";

export default function PartnerOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await partnerListOrders(token);
      setOrders(Array.isArray(data) ? data : []);
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    // newest first (ISO strings compare fine)
    let arr = [...orders].sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );

    if (statusFilter !== "ALL") {
      arr = arr.filter((o) => o.status === statusFilter);
    }

    if (s) {
      arr = arr.filter((o) => {
        return (
          String(o.id).includes(s) ||
          (o.status ?? "").toLowerCase().includes(s) ||
          (o.notes ?? "").toLowerCase().includes(s)
        );
      });
    }

    return arr;
  }, [orders, q, statusFilter]);

  return (
    <main className="container container--wide">
      <div className="card">
        <div className="toolbar">
          <div>
            <h2 style={{ margin: 0 }}>My Orders</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Click an order row to view items.
            </p>
          </div>

          <div className="toolbar__group">
            <input
              className="search"
              placeholder="Search (id, notes, status...)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by status"
            >
              <option value="ALL">All statuses</option>
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

        <OrderList orders={filtered} showPartner={false} />
      </div>
    </main>
  );
}
