import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { workerListQueue } from "../../services/orderService.js";
import OrderList from "../../components/OrderList.jsx";

export default function WorkerQueue() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await workerListQueue(token);
      setOrders(data);
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

  return (
    <main className="container">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Worker Queue</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Approved orders ready for processing. Click to view items.
            </p>
          </div>

          <button className="btn btn--ghost" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <OrderList orders={orders} showPartner={true} />
      </div>
    </main>
  );
}
