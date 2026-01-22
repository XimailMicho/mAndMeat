import { useAuth } from "../../context/AuthContext.jsx";

export default function Orders() {
  const { user } = useAuth();

  return (
    <div className="card">
      <h2>Orders</h2>
      <p className="muted">
        Logged in as {user?.email} ({user?.role})
      </p>

      <p>
        This page will show different data/actions depending on role:
      </p>
      <ul className="list">
        <li><b>Partner</b>: create orders + see their order status</li>
        <li><b>Worker</b>: see assigned orders + update status</li>
        <li><b>Admin</b>: all orders + management</li>
      </ul>
    </div>
  );
}
