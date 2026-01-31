<<<<<<< HEAD
import { useMemo } from "react";
=======
import { Link } from "react-router-dom";
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

<<<<<<< HEAD
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
=======
  const offerings = [
    {
      title: "Partner Ordering Portal",
      desc: "Partners submit orders in seconds, track status, and receive confirmations.",
      tag: "For Partners",
    },
    {
      title: "Worker Processing Console",
      desc: "Workers see incoming orders, update status, and ensure fulfillment accuracy.",
      tag: "For Workers",
    },
    {
      title: "Admin Operations Suite",
      desc: "Manage partners/workers, audit activity, and oversee every order end-to-end.",
      tag: "For Admins",
    },
  ];

  const showcase = [
    { name: "Real-time status tracking", detail: "Clear lifecycle: Submitted → Processing → Ready → Delivered" },
    { name: "Role-based access", detail: "Partners, workers, admins each see the right tools" },
    { name: "Clean audit trail", detail: "Every status change is traceable" },
  ];

  return (
    <main className="container">
      <section className="hero">
        <div className="hero__left">
          <p className="hero__kicker">MEAT INDUSTRY • ORDER TRACKING</p>
          <h1 className="hero__title">M&amp;M OrderFlow</h1>
          <p className="hero__subtitle muted">
            A professional system to connect partners, production, and operations — with clear order statuses and
            accountability.
          </p>

          <div className="hero__cta">
            {!user ? (
              <>
                <Link className="btn" to="/login">Request a demo</Link>
                <a className="btn btn--ghost" href="#catalogue">View catalogue</a>
              </>
            ) : (
              <>
                <Link className="btn" to="/app/orders">Go to Orders</Link>
                {user.role === "ADMIN" && <Link className="btn btn--ghost" to="/admin">Admin</Link>}
              </>
            )}
          </div>

          <div className="hero__badges">
            <span className="badge">Fast onboarding</span>
            <span className="badge">Simple workflow</span>
            <span className="badge">Built for accountability</span>
          </div>
        </div>

        <div className="hero__right">
          <div className="heroPanel">
            <div className="heroPanel__title">What you get</div>
            {showcase.map((s) => (
              <div key={s.name} className="heroPanel__row">
                <div className="heroPanel__name">{s.name}</div>
                <div className="muted">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogue" className="catalogue">
        <div className="sectionHead">
          <h2>Catalogue</h2>
          <p className="muted">A quick overview of our platform modules.</p>
        </div>

        <div className="cards3">
          {offerings.map((o) => (
            <div key={o.title} className="card productCard">
              <div className="productTag">{o.tag}</div>
              <h3 className="productTitle">{o.title}</h3>
              <p className="muted">{o.desc}</p>
              <button className="btn btn--ghost" type="button">Learn more</button>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaStrip">
        <div>
          <h2 style={{ margin: 0 }}>Want to work with M&amp;M?</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Contact us and we’ll set up a tailored demo for your workflow.
          </p>
        </div>

        {/* We can wire this to a contact page later */}
        <a className="btn" href="mailto:contact@mm-orderflow.example">Contact</a>
      </section>
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
    </main>
  );
}
