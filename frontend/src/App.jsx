import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

import RequireRole from "./components/RequireRole.jsx";



import AdminWorkers from "./pages/admin/AdminWorkers.jsx";
import AdminPartners from "./pages/admin/AdminPartners.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

import PartnerNewOrder from "./pages/app/PartnerNewOrder.jsx";
import PartnerOrders from "./pages/app/PartnerOrders.jsx";
import WorkerQueue from "./pages/app/WorkerQueue.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN shell + nested pages */}
        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminLayout />
            </RequireRole>
          }
        >
          {/* /admin shows just the sidebar + empty content */}
          <Route index element={<div />} />

          {/* Right-side outlet pages */}
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* PARTNER */}
        <Route
          path="/app/order/new"
          element={
            <RequireRole role="PARTNER">
              <PartnerNewOrder />
            </RequireRole>
          }
        />
        <Route
          path="/app/orders"
          element={
            <RequireRole role="PARTNER">
              <PartnerOrders />
            </RequireRole>
          }
        />

        {/* WORKER */}
        <Route
          path="/app/queue"
          element={
            <RequireRole role="WORKER">
              <WorkerQueue />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
