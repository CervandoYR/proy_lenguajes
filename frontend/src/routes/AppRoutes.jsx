import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import StorePage from "../features/tienda/pages/StorePage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProductDetail from "../features/productos/pages/ProductDetail";
import ClienteDashboard from "../features/dashboard-cliente/pages/Dashboard";
import AccountSettingsPage from "../features/dashboard-cliente/pages/AccountSettingsPage";
import Checkout from "../features/carrito/pages/Checkout";

import AdminDashboard from "../features/dashboard-admin/pages/Dashboard";
import AdminProductos from "../features/productos/pages/admin/AdminProductos";
import AdminCategorias from "../features/categorias/pages/AdminCategorias";
import AdminUsuarios from "../features/usuarios/pages/AdminUsuarios";
import AdminPedidos from "../features/pedidos/pages/AdminPedidos";

import AboutUs from "../pages/AboutUs";
import Support from "../pages/Support";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quienes-somos" element={<AboutUs />} />
      <Route path="/soporte" element={<Support />} />
      <Route path="/producto/:id/:slug?" element={<ProductDetail />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <ClienteDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/cuenta/ajustes"
        element={
          <PrivateRoute>
            <AccountSettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute soloAdmin>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <PrivateRoute soloAdmin>
            <AdminProductos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <PrivateRoute soloAdmin>
            <AdminCategorias />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <PrivateRoute soloAdmin>
            <AdminUsuarios />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/pedidos"
        element={
          <PrivateRoute soloAdmin>
            <AdminPedidos />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
