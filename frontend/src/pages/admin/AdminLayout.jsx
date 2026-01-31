import { NavLink, Outlet } from "react-router-dom";

function SideLink({ to, title, desc }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => (isActive ? "sideBox active" : "sideBox")}
    >
      <div className="sideBox__title">{title}</div>
      <div className="sideBox__desc">{desc}</div>
    </NavLink>
  );
}

export default function AdminLayout() {
  return (
    <main className="container">
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar__title">Admin</div>

          <div className="sideBoxGroup">
            <SideLink
              to="orders"
              title="Orders"
              desc="View and approve submitted orders."
            />
            <SideLink
              to="products"
              title="Products"
              desc="Manage catalogue and price history."
            />
            <SideLink
              to="partners"
              title="Partners"
              desc="Add and list partner accounts."
            />
            <SideLink
              to="workers"
              title="Workers"
              desc="Add and list worker accounts."
            />
          </div>
        </aside>

        <section className="content">
          {/* Right-side area */}
          <Outlet />
        </section>
      </div>
    </main>
  );
}
