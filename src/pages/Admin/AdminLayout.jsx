import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";
import { FiGrid, FiBox, FiUsers, FiShoppingCart, FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FiGrid size={20} />, end: true },
    { path: "/admin/products", label: "Produkty", icon: <FiBox size={20} /> },
    { path: "/admin/orders", label: "Zamówienia", icon: <FiShoppingCart size={20} /> },
    { path: "/admin/users", label: "Użytkownicy", icon: <FiUsers size={20} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-(--80-shade) text-[#F2EAE1]">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed h-full border-r border-[#5C4A3D] bg-(--medium-shade)/20 z-20 pt-25 shadow-xl">
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
                  : 'hover:bg-[#5C4A3D] text-[#F2EAE1]/70 hover:text-[#F2EAE1]'
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

      {/* --- Mobile Top Bar --- */}
      <div className="lg:hidden fixed top-3 w-full z-30 bg-[#46382E] border-b border-[#5C4A3D] p-4 flex justify-between items-center mt-20 shadow-md">
         <div>
            <span className="font-serif font-bold tracking-widest text-lg text-(--medium-shade)">SOMNIUM</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#F2EAE1]/70 ml-2 font-bold">Admin</span>
         </div>
         <button onClick={() => { logout(); navigate("/"); }} className="p-2 text-[#F2EAE1]/70 hover:text-red-400">
            <FiLogOut size={20} />
         </button>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 lg:ml-72 p-4 pb-24 lg:p-10 mt-20 lg:pt-10 overflow-x-hidden">
        <Outlet />
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-[#46382E] border-t border-[#5C4A3D] z-30 flex justify-around p-2 pb-safe-area shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
        {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              end={item.end}
              className={({isActive}) => `
                flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-full
                ${isActive ? 'text-(--medium-shade)' : 'text-[#F2EAE1]/50'}
              `}
            >
              {item.icon}
              <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
            </NavLink>
        ))}
      </nav>

    </div>
  );
}