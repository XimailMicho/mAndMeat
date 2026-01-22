import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav__left">
        <Link className="nav__brand" to="/">M&M 🥩</Link>
      </div>

      <div className="nav__right">
        <Link to="/">Home</Link>

        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}

        {user ? (
          <>
            <span className="nav__hello">Hello, {user.email}</span>
            <button className="btn btn--small" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
