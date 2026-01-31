import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="nav">
      <Link className="nav__brand" to="/">
        M&amp;M
      </Link>

      <nav className="nav__right">
        <Link to="/">Home</Link>

        {!user && <Link to="/login">Login</Link>}

        {user?.role === "PARTNER" && (
          <>
            <Link to="/app/order/new">New Order</Link>
            <Link to="/app/orders">My Orders</Link>
          </>
        )}

        {user?.role === "WORKER" && (
          <Link to="/app/queue">Queue</Link>
        )}

        {user?.role === "ADMIN" && (
          <Link to="/admin">Admin</Link>
        )}

        {user && (
          <>
            <span className="nav__hello">Hello {user.email}</span>
            <button className="btn btn--small" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
