import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setTokenAndLoadUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password.trim()) {
    setError("Please enter email and password.");
    return;
  }

  setLoading(true);
  try {
    const token = await login(email, password);
    await setTokenAndLoadUser(token);
    navigate("/");
  } catch (err) {
    // show backend messages if any
    setError(err?.message || "Bad credentials");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="containerLogin">
      <h2>Login</h2>

      <form className="card" onSubmit={onSubmit}>
        <label className="label">
          Email
          <input
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@provider.com"
          />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            autoComplete="current-password"
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
