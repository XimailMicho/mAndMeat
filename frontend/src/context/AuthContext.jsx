import React, { createContext, useContext, useState } from "react";
import { me as fetchMe } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  async function setTokenAndLoadUser(newToken) {
    setToken(newToken);

    // load /me using the token
    const profile = await fetchMe(newToken);
    setUser(profile);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, setTokenAndLoadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
