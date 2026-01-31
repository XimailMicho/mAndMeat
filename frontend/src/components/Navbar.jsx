import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth(); // adjust to your context

  return (
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    <header className="nav">
      <Link className="nav__brand" to="/">M&M</Link>

      <nav className="nav__right">
        <Link to="/">Home</Link>

=======
    <header className="nav">
      <Link className="nav__brand" to="/">M&M</Link>

      <nav className="nav__right">
        <Link to="/">Home</Link>

>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
        {!user && <Link to="/login">Login</Link>}

        {user?.role === "PARTNER" && (
          <>
            <Link to="/app/order/new">New Order</Link>
            <Link to="/app/orders">My Orders</Link>
          </>
<<<<<<< HEAD
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
=======
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
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
            <button className="btn btn--small" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
