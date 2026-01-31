import { Link } from "react-router-dom";

const demoImages = [
  { src: "https://picsum.photos/seed/meat1/900/600", label: "Fresh cuts & reliable supply" },
  { src: "https://picsum.photos/seed/meat2/900/600", label: "Consistent quality control" },
  { src: "https://picsum.photos/seed/meat3/900/600", label: "Fast delivery & pickup" },
];

const demoProducts = [
  { name: "Beef (Premium)", unit: "KG", note: "Fresh, trimmed, ready for sale." },
  { name: "Chicken Fillet", unit: "KG", note: "Daily availability, clean packaging." },
  { name: "Sausage Pack", unit: "UNIT", note: "Per unit packs, consistent weight." },
  { name: "Minced Meat", unit: "KG", note: "Popular choice for restaurants." },
];

export default function Home() {
  return (
    <main className="container">
      {/* HERO */}
      <section className="hero">
        <div className="hero__left">
          <div className="kicker">M&M • Meat Supply & Distribution</div>
          <h1 className="hero__title">
            Reliable meat supply for partners who need consistency.
          </h1>
          <p className="hero__subtitle">
            We help restaurants, markets, and partners order faster, track delivery, and keep pricing transparent.
          </p>

          <div className="hero__cta">
            <Link className="btn btn--primary" to="/login">
              Partner Login
            </Link>
            <a className="btn btn--ghost" href="#catalogue">
              View Catalogue
            </a>
          </div>

          <div className="hero__stats">
            <div className="stat">
              <div className="stat__num">24/7</div>
              <div className="stat__label">Order tracking</div>
            </div>
            <div className="stat">
              <div className="stat__num">Fast</div>
              <div className="stat__label">Approvals & packing</div>
            </div>
            <div className="stat">
              <div className="stat__num">Clear</div>
              <div className="stat__label">Pricing snapshot</div>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="imageGrid">
            {demoImages.map((img) => (
              <div className="imageTile" key={img.src}>
                <img src={img.src} alt={img.label} />
                <div className="imageTile__cap">{img.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="sectionHead">
          <h2 className="sectionTitle">How we work</h2>
          <p className="muted">Simple flow: order → approval → packing → ready.</p>
        </div>

        <div className="cards3">
          <div className="card card--feature">
            <h3>Transparent pricing</h3>
            <p className="muted">
              Prices are locked at submission/creation so everyone knows the exact snapshot for each order item.
            </p>
          </div>
          <div className="card card--feature">
            <h3>Fast operations</h3>
            <p className="muted">
              Admin approves, workers pack, and status updates keep partners informed automatically.
            </p>
          </div>
          <div className="card card--feature">
            <h3>Partner-first</h3>
            <p className="muted">
              Partners can submit orders anytime, view history, and see item breakdowns clearly.
            </p>
          </div>
        </div>
      </section>

      {/* CATALOGUE PREVIEW */}
      <section id="catalogue" className="section section--alt">
        <div className="sectionHead">
          <h2 className="sectionTitle">Catalogue preview</h2>
          <p className="muted">A clean overview of products (full list inside the system).</p>
        </div>

        <div className="productGrid">
          {demoProducts.map((p) => (
            <div className="card productCard" key={p.name}>
              <div className="productCard__top">
                <div className="productCard__name">{p.name}</div>
                <span className="tag">{p.unit}</span>
              </div>
              <div className="muted">{p.note}</div>
              <div className="productCard__bottom">
                <span className="hint">Pricing shown after login</span>
                <Link className="link" to="/login">Login →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section">
        <div className="sectionHead">
          <h2 className="sectionTitle">Trusted by partners</h2>
          <p className="muted">Your partners list can be loaded from backend later.</p>
        </div>

        <div className="partnerStrip">
          <div className="partnerPill">Partner A</div>
          <div className="partnerPill">Partner B</div>
          <div className="partnerPill">Partner C</div>
          <div className="partnerPill">Partner D</div>
        </div>
      </section>

      {/* CTA */}
      <section className="ctaStrip">
        <div>
          <h3 style={{ margin: 0 }}>Want to partner with M&M?</h3>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Contact us for onboarding and account setup.
          </p>
        </div>
        <div className="ctaStrip__actions">
          <a className="btn btn--primary" href="mailto:info@mandm.example">Contact</a>
          <Link className="btn btn--ghost" to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}
