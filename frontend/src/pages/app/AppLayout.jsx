import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__title">mAndMeat</div>

        <nav className="sidebar__nav">
          <NavLink to="/app/orders" className={({isActive}) => isActive ? "sideLink active" : "sideLink"}>
            Orders
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink to="/admin/workers" className={({isActive}) => isActive ? "sideLink active" : "sideLink"}>
              Admin
            </NavLink>
          )}
        </nav>
      </aside>

      <section className="content">
        <Outlet />
      </section>
    </div>
  );
}
