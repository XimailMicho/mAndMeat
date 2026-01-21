import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("admin@email.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await login(email, password);
      setToken(token);
      navigate("/");
    } catch (err) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h2>Login</h2>

      <form className="card" onSubmit={onSubmit}>
        <label className="label">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
