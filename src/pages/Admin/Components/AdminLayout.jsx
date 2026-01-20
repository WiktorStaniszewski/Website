import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";
import { FiGrid, FiBox, FiLogOut, FiMenu } from "react-icons/fi";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <FiGrid size={20} />, end: true },
    { path: "/admin/products", label: "Produkty", icon: <FiBox size={20} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a1816] text-[#e0e0e0]">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed h-full border-r border-white/5 bg-[#24201d]/90 backdrop-blur-xl z-20 pt-25">
        <div className="p-8 text-center border-b border-white/5">
          <h1 className="font-serif font-bold tracking-widest text-xl text-(--font-color)">SOMNIUM</h1>
          <span className="text-xs uppercase tracking-[0.3em] text-(--medium-shade)">Admin</span>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              end={item.end}
              className={({isActive}) => `
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-medium
                ${isActive 
                  ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)]' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }
              `}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => { logout(); navigate("/"); }} 
            className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors cursor-pointer"
          >
            <FiLogOut size={20} /> Wyloguj
          </button>
        </div>
      </aside>

      {/* --- Mobile Top Bar --- */}
      <div className="lg:hidden fixed top-0 w-full z-30 bg-[#24201d]/90 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center mt-20">
         <div>
            <span className="font-serif font-bold tracking-widest text-lg">SOMNIUM</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-(--medium-shade) ml-2">Admin</span>
         </div>
         <button onClick={() => { logout(); navigate("/"); }} className="p-2 text-gray-400 hover:text-white">
            <FiLogOut size={20} />
         </button>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 lg:ml-72 p-4 pb-24 lg:p-10 mt-20 lg:pt-10 overflow-x-hidden">
        <Outlet />
      </main>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-[#24201d] border-t border-white/10 z-30 flex justify-around p-2 pb-safe-area">
        {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              end={item.end}
              className={({isActive}) => `
                flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-full
                ${isActive ? 'text-(--medium-shade)' : 'text-gray-500'}
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