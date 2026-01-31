import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminApproveOrder, adminListAllOrders } from "../../services/orderService.js";
import { listPartners } from "../../services/adminService.js";
import OrderList from "../../components/OrderList.jsx";

export default function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState({}); // orderId -> boolean

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL"); // email

  async function refreshOrders() {
    setError("");
    setLoadingOrders(true);
    try {
      const data = await adminListAllOrders(token);
      setOrders(data);
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
      // sort partners nicely in dropdown
      const sorted = [...data].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
      setPartners(sorted);
    } catch (e) {
      setError(e?.message ?? "Failed to load partners");
    } finally {
      setLoadingPartners(false);
    }
  }

  useEffect(() => {
    refreshOrders();
    refreshPartners();
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    // copy + sort newest first (fallback if backend doesn't sort)
    let arr = [...orders].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    if (statusFilter !== "ALL") {
      arr = arr.filter((o) => o.status === statusFilter);
    }

    if (partnerFilter !== "ALL") {
      arr = arr.filter((o) => o.partnerEmail === partnerFilter);
    }

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

  return (
    <main className="container container--wide">
      <div className="card">
        <div className="toolbar">
          <div>
            <h2 className="h2">Orders</h2>
             <p className="muted pSub">
              Filter by partner/status. Click an order row to view items. Approve only <b>SUBMITTED</b> orders.
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
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <OrderList
          orders={filtered}
          showPartner={true}
          renderStatus={(status) => (
            <span className="badge">{status}</span>
          )}
          actionsForOrder={(o) =>
            o.status === "SUBMITTED" ? (
              <button
                className="btn btn--small btn--primary"
                disabled={!!saving[o.id]}
                onClick={(e) => {
                  e.stopPropagation();
                  approve(o.id);
                }}
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
