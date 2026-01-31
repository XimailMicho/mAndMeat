<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

<<<<<<< HEAD
import RequireAuth from "./components/RequireAuth.jsx";
import RequireRole from "./components/RequireRole.jsx";

import AppLayout from "./pages/app/AppLayout.jsx";
import Orders from "./pages/app/Orders.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminWorkers from "./pages/admin/AdminWorkers.jsx";
import AdminPartners from "./pages/admin/AdminPartners.jsx";
=======
import RequireRole from "./components/RequireRole.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminWorkers from "./pages/admin/AdminWorkers.jsx";
import AdminPartners from "./pages/admin/AdminPartners.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

import PartnerNewOrder from "./pages/app/PartnerNewOrder.jsx";
import PartnerOrders from "./pages/app/PartnerOrders.jsx";
import WorkerQueue from "./pages/app/WorkerQueue.jsx";
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

<<<<<<< HEAD
        {/* Authenticated app area */}
=======
        {/* ADMIN shell + nested pages */}
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
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
<<<<<<< HEAD
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

=======
          <Route index element={<div />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
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
>>>>>>> 78c02e7 (Setup the skeleton for Orders and Products all their repositories and services, created frontend placeholders and the orderService in the frontend.)
      </Routes>
    </BrowserRouter>
  );
}
