import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav__brand">
        <Link to="/">mAndMeat</Link>
      </div>

      <div className="nav__links">
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        {user && (
          <button className="btn btn--small" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
