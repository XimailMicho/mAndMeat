import { NavLink, Outlet } from "react-router-dom";

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => (isActive ? "tab active" : "tab")}
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  return (
    <main className="container container--wide">
      <div className="adminTop">
        <div>
          <h2 className="h2">Admin</h2>
          <p className="muted pSub">Manage orders, products and users.</p>
        </div>

        <nav className="adminTabs">
          <TabLink to="orders">Orders</TabLink>
          <TabLink to="products">Products</TabLink>
          <TabLink to="partners">Partners</TabLink>
          <TabLink to="workers">Workers</TabLink>
        </nav>
      </div>

      {/* Content below tabs */}
      <Outlet />
    </main>
  );
}
