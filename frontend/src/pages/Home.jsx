import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <h1>mAndMeat 🥩</h1>
      <p className="muted">Order tracking system</p>

      <div className="card">
        <p>This is a placeholder homepage.</p>
        <button className="btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </main>
  );
}
