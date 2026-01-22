import { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  // placeholder partners (later fetch from backend)
  const partners = useMemo(
    () => [
      { name: "Partner A", city: "Skopje" },
      { name: "Partner B", city: "Tetovo" },
      { name: "Partner C", city: "Kumanovo" },
    ],
    []
  );

  return (
    <main className="container">
      <div className="homeGrid">
        <section className="card">
          <h1>mAndMeat </h1>
          <p className="muted">
            Order tracking for the meat industry — partners place orders, workers process them, admins manage the system.
          </p>

          {!user ? (
            <p className="muted">Login to continue.</p>
          ) : (
            <div className="ok">
              You are logged in as <b>{user.email}</b> ({user.role})
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <h3>What you can do</h3>
            <ul className="list">
              <li>Partners: create and track orders</li>
              <li>Workers: process and update order status</li>
              <li>Admins: manage partners/workers</li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2>Our Partners</h2>
          <p className="muted">A quick preview (will be dynamic soon).</p>

          <div className="partnerGrid">
            {partners.map((p) => (
              <div key={p.name} className="partnerCard">
                <div className="partnerName">{p.name}</div>
                <div className="muted">{p.city}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
