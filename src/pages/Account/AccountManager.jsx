import React, { useState, useEffect } from 'react';
import { useAuth } from "context/AuthProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "services/api";

import { FaUser, FaBox, FaLock, FaTruck, FaSignOutAlt, FaMapMarkerAlt } from "react-icons/fa";

import ProfileTab from './components/ProfileTab';
import AddressTab from './components/AddressTab';
import HistoryTab from './components/HistoryTab';
import SecurityTab from './components/SecurityTab';
import StatusTab from './components/StatusTab';

export default function AccountManager() {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "profile";

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleLogout = () => {
      logout();
  };

  useEffect(() => {
    if (activeTab === "history" && user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const response = await api.get("orders/my-orders"); 
          if (Array.isArray(response)) setOrders(response); 
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const tabs =[
    { id: "profile", label: "Twój Profil", icon: <FaUser /> },
    { id: "address", label: "Książka Adresowa", icon: <FaMapMarkerAlt /> },
    { id: "history", label: "Historia Zamówień", icon: <FaBox /> },
    { id: "status", label: "Śledzenie Paczki", icon: <FaTruck /> },
    { id: "security", label: "Bezpieczeństwo", icon: <FaLock /> },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 text-(--font-color)">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        <aside className="h-fit lg:sticky lg:top-32 space-y-4 z-20">
            <div className="bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl flex items-center gap-4 relative overflow-hidden">
                <div className="w-14 h-14 rounded-full border-2 border-(--medium-shade) p-0.5 shrink-0 overflow-hidden">
                    <img 
                        src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || user?.username}&backgroundColor=8f785d`} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-(--medium-shade) font-bold mb-1">Witaj ponownie</p>
                    <p className="text-xl font-serif font-bold truncate text-white">{user?.username || "Kawoszu"}</p>
                </div>
            </div>

            <nav className="bg-black/20 backdrop-blur-md p-3 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSearchParams({ tab: tab.id })}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group text-left relative overflow-hidden cursor-pointer ${
                            activeTab === tab.id 
                            ? "bg-(--medium-shade)/10 text-(--medium-shade) font-bold" 
                            : "hover:bg-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                        {activeTab === tab.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-(--medium-shade) rounded-r-full"></div>}
                        <span className={`text-xl ml-2 transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : "group-hover:translate-x-1"}`}>
                            {tab.icon}
                        </span>
                        <span className="font-medium tracking-wide">{tab.label}</span>
                    </button>
                ))}
                
                <div className="h-px bg-white/5 my-2 mx-4"></div>
                
                <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-all cursor-pointer text-left group">
                    <span className="text-xl ml-2 group-hover:scale-110 transition-transform"><FaSignOutAlt /></span>
                    <span className="font-medium tracking-wide">Wyloguj się</span>
                </button>
            </nav>
        </aside>

        <main className="min-h-[600px] bg-black/25 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden z-10">
            <div 
                className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--medium-shade) 0%, transparent 60%)', opacity: 0.05 }}
            ></div>
            
            <div className="relative z-10">
                {activeTab === "profile" && <ProfileTab user={user} />}
                {activeTab === "address" && <AddressTab />}
                {activeTab === "history" && <HistoryTab orders={orders} loading={loadingOrders} navigate={navigate} />}
                {activeTab === "security" && <SecurityTab />}
                {activeTab === "status" && <StatusTab />}
            </div>
        </main>
      </div>
    </div>
  );
}