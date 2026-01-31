import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container">
      <div className="homeGrid">
        <section className="card">
          <h1 style={{ marginTop: 0 }}>M&amp;M Meat Industry</h1>
          <p className="muted">
            Order tracking for partners, operational queue for workers, and full oversight for admins.
          </p>

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>What you can do</h3>
            <ul className="list">
              <li>Partners submit orders with per-KG and per-Unit products.</li>
              <li>Admins approve/reject and manage products & users.</li>
              <li>Workers see the approved queue and process orders.</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            {!user && (
              <Link className="btn" to="/login">
                Login
              </Link>
            )}

            {user?.role === "PARTNER" && (
              <>
                <Link className="btn" to="/app/order/new">New Order</Link>
                <Link className="btn btn--ghost" to="/app/orders">My Orders</Link>
              </>
            )}

            {user?.role === "WORKER" && (
              <Link className="btn" to="/app/queue">Queue</Link>
            )}

            {user?.role === "ADMIN" && (
              <Link className="btn" to="/admin">Admin</Link>
            )}
          </div>
        </section>

        <aside className="card">
          <h3 style={{ marginTop: 0 }}>Partners</h3>
          <p className="muted">
            This section will later show partner logos/cards and a rotating gallery.
          </p>

          <div className="partnerGrid" style={{ marginTop: 12 }}>
            <div className="partnerCard">
              <div className="partnerName">Partner A</div>
              <div className="muted">Wholesale</div>
            </div>
            <div className="partnerCard">
              <div className="partnerName">Partner B</div>
              <div className="muted">Retail</div>
            </div>
            <div className="partnerCard">
              <div className="partnerName">Partner C</div>
              <div className="muted">Restaurant</div>
            </div>
            <div className="partnerCard">
              <div className="partnerName">Partner D</div>
              <div className="muted">Distributor</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
