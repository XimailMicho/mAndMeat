import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <Link to="/">mAndMeat</Link>
      </div>
      <div className="nav__links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
