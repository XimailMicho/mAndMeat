import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

import RequireAuth from "./components/RequireAuth.jsx";
import RequireRole from "./components/RequireRole.jsx";

import AppLayout from "./pages/app/AppLayout.jsx";
import Orders from "./pages/app/Orders.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminWorkers from "./pages/admin/AdminWorkers.jsx";
import AdminPartners from "./pages/admin/AdminPartners.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated app area */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <div className="container">
                <AppLayout />
              </div>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/app/orders" replace />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* Admin area */}
        <Route path="/admin" element={<RequireRole role="ADMIN"><AdminLayout /></RequireRole>}>
  {/* TEMP: empty main area */}
  <Route index element={<div />} />

  <Route path="partners" element={<AdminPartners />} />
  <Route path="workers" element={<AdminWorkers />} />

  {/* FUTURE */}
  {/* <Route index element={<AdminOrders />} /> */}
</Route>

      </Routes>
    </BrowserRouter>
  );
}
