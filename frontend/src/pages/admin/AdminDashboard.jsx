import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <main className="container">
      <h2>Admin Dashboard</h2>
      <p className="muted">
        Logged in as: {user?.email} ({user?.role})
      </p>

      <div className="grid">
        <div className="card">
          <h3>Users</h3>
          <p>Create and list workers and partners.</p>

          <Link className="btn" to="/admin/users">
            Manage Workers & Partners
          </Link>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <p>Coming next: create and track meat orders.</p>
          <button className="btn" disabled>
            Orders (soon)
          </button>
        </div>
      </div>
    </main>
  );
}
