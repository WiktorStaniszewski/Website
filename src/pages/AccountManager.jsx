import React, { useState, useEffect } from 'react';
import { useAuth } from "src/context/AuthProvider"; // Fixed path
import { useSearchParams } from "react-router-dom";
import api from "src/services/api"; // Import API
import { FaBoxOpen, FaSpinner } from "react-icons/fa";

function AccountManager() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  // --- Async States ---
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // --- Fetch Orders when History tab is active ---
  useEffect(() => {
    if (activeTab === "history") {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          // Fetch all orders (In a real app, backend filters by user token)
          const response = await api.get("orders");
          if (response && response.data) {
             // Optional: Filter client-side if backend sends all (for demo)
             // const myOrders = response.data.filter(o => o.customer === user.username);
             setOrders(response.data); 
          }
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
    { id: "profile", label: "Mój Profil", icon: "👤" },
    { id: "history", label: "Historia zamówień", icon: "📦" },
    { id: "security", label: "Hasło i Bezpieczeństwo", icon: "🔒" },
    { id: "status", label: "Status zamówienia", icon: "🚚" },
  ];

  return (
    <div className="lg:min-h-156 text-(--font-color) p-4 lg:p-10 pt-24">
      <div className="lg:max-w-6xl w-9/10 mx-auto flex flex-col lg:flex-row gap-8 p-8 rounded-3xl border border-white/5 shadow-xl">
        
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-6 px-2">Konto</h1>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id 
                ? "bg-(--80-shade) shadow-lg" 
                : "hover:bg-white/5 opacity-80 hover:opacity-120"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 rounded-3xl p-6 lg:p-10 shadow-xl border border-white/5 backdrop-brightness-85 backdrop-blur-lg min-h-[400px]">

          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Dane profilu</h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs opacity-50">Email</p>
                  <p className="text-lg">{user?.email || "brak@email.com"}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs opacity-50">Użytkownik</p>
                  <p className="text-lg">{user?.username || "Gość"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 h-full">
              <h2 className="text-xl font-semibold mb-4">Historia zamówień</h2>
              
              {loadingOrders ? (
                <div className="flex h-64 items-center justify-center text-white/50">
                  <FaSpinner className="animate-spin text-3xl" />
                </div>
              ) : orders.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors">
                      <div>
                        <p className="font-bold">Zamówienie #{order.id}</p>
                        <p className="text-sm opacity-60">{order.date || "2024-01-01"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-(--80-shade)">{order.total} PLN</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                  <FaBoxOpen className="text-4xl mb-2" />
                  <p>Nie masz jeszcze żadnych zamówień.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Zmień hasło</h2>
              <form className="flex flex-col gap-4 max-w-sm">
                <input type="password" placeholder="Obecne hasło" className="loginInput" />
                <input type="password" placeholder="Nowe hasło" className="loginInput" />
                <button type="button" className="bg-(--80-shade) p-3 rounded-2xl cursor-pointer hover:bg-(--button-hover-bg) transition-colors">
                  Zaktualizuj hasło
                </button>
              </form>
            </div>
          )}

          {activeTab === "status" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Śledzenie zamówienia</h2>
              <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center">
                 🔍 Wpisz numer zamówienia, aby sprawdzić status.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AccountManager;