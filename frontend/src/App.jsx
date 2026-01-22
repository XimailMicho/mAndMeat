import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RequireRole from "./components/RequireRole.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin/users"
          element={
          <RequireRole role="ADMIN">
          <AdminUsers />
          </RequireRole>
          }
          />


        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminDashboard />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
