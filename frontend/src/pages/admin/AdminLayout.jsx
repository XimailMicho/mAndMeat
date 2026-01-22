import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <main className="container">
      <div className="shell">
        <aside className="sidebar">
          <nav className="sidebar__nav">
            <NavLink
              to="/admin/partners"
              className={({ isActive }) => (isActive ? "sideLink active" : "sideLink")}
            >
              Partners
            </NavLink>

            <NavLink
              to="/admin/workers"
              className={({ isActive }) => (isActive ? "sideLink active" : "sideLink")}
            >
              Workers
            </NavLink>
          </nav>
        </aside>

        <section className="content">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
