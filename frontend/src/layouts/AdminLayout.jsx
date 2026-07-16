import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Package, LogOut, ShoppingBag, FolderTree, Users } from "lucide-react";
import useAuthStore from "../features/auth/authStore";

const NAV = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/productos", icon: Package, label: "Productos" },
  { path: "/admin/categorias", icon: FolderTree, label: "Categorias" },
  { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { path: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
];

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: logoutZustand } = useAuthStore();

  function logout() {
    logoutZustand();
    navigate("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/" className="no-underline text-slate-100">
            SERVITEK<span className="text-brand-400">.</span>
          </Link>
          <span className="text-[0.7rem] text-surface-400 block font-normal mt-0.5">
            Admin panel
          </span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.path}
                to={n.path}
                className={`nav-item ${location.pathname === n.path ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.nombre?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.nombre}</div>
              <div className="user-role">{user?.rol}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Cerrar sesion">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}