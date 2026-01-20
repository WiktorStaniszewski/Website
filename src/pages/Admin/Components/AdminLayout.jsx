import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";
import { FiGrid, FiBox, FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen text-[#e0e0e0] lg:flex-row flex-col not-lg:items-center lg:mt-20">
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col">
        <div className="p-6 text-center border-b border-white/5 font-bold tracking-widest">
          SOMNIUM ADMIN
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin" end className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-[#33333a] text-white' : 'hover:bg-white/5 text-gray-400'}`}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-[#33333a] text-white' : 'hover:bg-white/5 text-gray-400'}`}>
            <FiBox /> Produkty
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center not-lg:justify-center gap-2 w-full p-2 cursor-pointer">
            <FiLogOut /> Wyloguj
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}