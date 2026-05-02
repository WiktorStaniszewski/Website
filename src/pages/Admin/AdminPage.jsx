import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";
import { FiGrid, FiBox, FiUsers, FiShoppingCart, FiLogOut, FiTruck } from "react-icons/fi";

export default function AdminLayout() {
  const { logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    isSuperAdmin && { path: "/admin", label: "Dashboard", icon: <FiGrid size={20} />, end: true },
    isSuperAdmin && { path: "/admin/products", label: "Zasoby", icon: <FiBox size={20} /> },
    isSuperAdmin && { path: "/admin/deliveries", label: "Dostawy", icon: <FiTruck size={20} /> },
    { path: "/admin/orders", label: "Zamówienia", icon: <FiShoppingCart size={20} /> },
    isSuperAdmin && { path: "/admin/users", label: "Użytkownicy", icon: <FiUsers size={20} /> },
  ].filter(Boolean);

  return (
    <div className="lg:grid lg:grid-cols-[288px_1fr] min-h-screen bg-(--80-shade) text-[#F2EAE1] relative">
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-[#5C4A3D] bg-(--medium-shade)/20 z-20 pt-25 shadow-xl">
        <div className="p-8 text-center border-b border-[#5C4A3D]">
          <h1 className="font-serif font-bold tracking-widest text-xl text-(--medium-shade)">SOMNIUM</h1>
          <span className="text-xs uppercase tracking-[0.3em] text-[#F2EAE1]/70 font-bold">Admin</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              end={item.end}
              className={({isActive}) => `
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold
                ${isActive 
                  ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_4px_15px_rgba(143,120,93,0.4)]' 
                  : 'hover:bg-[#5C4A3D]/50 text-[#F2EAE1]/70 hover:text-[#F2EAE1] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(143,120,93,0.1)]'
                }
              `}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-[#5C4A3D]">
          <button 
            onClick={() => { logout(); navigate("/"); }} 
            className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-red-500/20 hover:text-red-400 text-[#F2EAE1]/70 font-bold transition-colors cursor-pointer"
          >
            <FiLogOut size={20} /> Wyloguj
          </button>
        </div>
      </aside>

      <main className="p-4 pb-28 lg:p-10 lg:mt-0 lg:pt-25 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav - Reduced z-index to stay below main sidebar */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-[#4a3f35]/98 backdrop-blur-2xl border-t border-white/10 z-30 flex overflow-x-auto custom-scrollbar-hide justify-start p-2 px-4 pb-safe-area shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 min-w-max mx-auto">
            {navItems.map((item) => (
                <NavLink 
                  key={item.path}
                  to={item.path} 
                  end={item.end}
                  className={({isActive}) => `
                    flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all min-w-[85px] shrink-0
                    ${isActive 
                        ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_4px_15px_rgba(217,182,140,0.4)]' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white/60'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold whitespace-nowrap">{item.label}</span>
                </NavLink>
            ))}
        </div>
      </nav>
    </div>
  );
}