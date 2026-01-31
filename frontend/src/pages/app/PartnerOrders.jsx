import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { partnerListOrders } from "../../services/orderService.js";

export default function PartnerOrders() {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await partnerListOrders(token);
      setItems(data);
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

  return (
    <main className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>My Orders</h2>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>Latest first.</p>
          </div>
          <button className="btn btn--ghost" onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Created</th>
                <th>Delivery</th>
                <th>Total (MKD)</th>
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.status}</td>
                  <td>{o.createdAt}</td>
                  <td>{o.deliveryDate ?? "-"}</td>
                  <td>{o.totalMkd}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr><td colSpan="5" className="muted">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > 0 && (
          <details style={{ marginTop: 12 }}>
            <summary className="muted">Show details (items)</summary>
            {items.map(o => (
              <div key={o.id} className="card" style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <strong>Order #{o.id}</strong>
                  <span className="muted">{o.status}</span>
                </div>
                {o.notes && <p className="muted">{o.notes}</p>}
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th><th>Unit</th><th>Qty</th><th>Price</th><th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map(it => (
                        <tr key={it.id}>
                          <td>{it.productName}</td>
                          <td>{it.unit}</td>
                          <td>{it.quantity}</td>
                          <td>{it.priceMkdSnapshot}</td>
                          <td>{it.lineTotalMkd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </details>
        )}
      </div>
    </main>
  );
}
