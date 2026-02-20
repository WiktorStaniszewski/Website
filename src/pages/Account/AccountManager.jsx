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
      navigate("/"); 
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

  const tabs = [
    { id: "profile", label: "Profil", icon: <FaUser /> },
    { id: "address", label: "Adresy", icon: <FaMapMarkerAlt /> },
    { id: "history", label: "Historia", icon: <FaBox /> },
    { id: "status", label: "Śledzenie", icon: <FaTruck /> },
    { id: "security", label: "Hasło", icon: <FaLock /> },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 text-(--font-color)">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        <aside className="h-fit lg:sticky lg:top-32 space-y-2 z-20">
            <div className="bg-[#24201d]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl mb-4">
                <p className="text-sm opacity-50 mb-1">Witaj,</p>
                <p className="text-xl font-bold truncate text-white">{user?.username || "Guest"}</p>
            </div>

            <nav className="bg-[#24201d]/80 backdrop-blur-md p-3 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSearchParams({ tab: tab.id })}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group cursor-pointer text-left ${
                            activeTab === tab.id 
                            ? "bg-(--80-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)] translate-x-1 font-bold" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                    >
                        <span className={`text-xl ${activeTab === tab.id ? "text-[#24201d]" : "group-hover:text-(--medium-shade)"}`}>
                            {tab.icon}
                        </span>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
                
                <div className="h-px bg-white/10 my-2 mx-4"></div>
                
                <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-all cursor-pointer text-left group">
                    <span className="text-xl group-hover:scale-110 transition-transform"><FaSignOutAlt /></span>
                    <span className="font-medium">Wyloguj</span>
                </button>
            </nav>
        </aside>

        <main className="min-h-[600px] bg-[#24201d]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-(--medium-shade)/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10">
                {activeTab === "profile" && <ProfileTab user={user} />}
                {activeTab === "address" && <AddressTab user={user} />}
                {activeTab === "history" && <HistoryTab orders={orders} loading={loadingOrders} navigate={navigate} />}
                {activeTab === "security" && <SecurityTab />}
                {activeTab === "status" && <StatusTab />}
            </div>
        </main>
      </div>
    </div>
  );
}