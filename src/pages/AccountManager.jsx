import React, { useState, useEffect } from 'react';
import { useAuth } from "src/context/AuthProvider";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "src/services/api";
import { 
    FaUser, FaBox, FaLock, FaTruck, FaSignOutAlt, 
    FaSpinner, FaCheck, FaChevronRight 
} from "react-icons/fa";

const ProfileTab = ({ user }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Twój Profil</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                    <img 
                        src={user?.image || "https://robohash.org/placeholder?set=set4"} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-wider">Zmień</span>
                </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Nazwa Użytkownika</p>
                    <p className="text-xl font-medium text-(--font-color)">{user?.username || "Gość"}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Adres Email</p>
                    <p className="text-xl font-medium text-(--font-color)">{user?.email || "brak@email.com"}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors md:col-span-2">
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Status Konta</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                        <p className="text-lg">Aktywne</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// TUTAJ DODANO navigate DO WŁAŚCIWOŚCI
const HistoryTab = ({ orders, loading, navigate }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
        <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Historia Zamówień</h2>
        
        {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-4">
                <FaSpinner className="animate-spin text-4xl text-(--medium-shade)" />
                <p>Ładowanie historii...</p>
            </div>
        ) : orders.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((order) => (
                    <div 
                        key={order.id} 
                        onClick={() => navigate(`/account/orders/${order.id}`)}
                        className="group cursor-pointer bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/5 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">
                                <FaBox className="text-(--medium-shade)" />
                            </div>
                            <div>
                                <p className="font-bold text-lg group-hover:text-(--medium-shade) transition-colors">Zamówienie #{order.id}</p>
                                <p className="text-sm opacity-60 font-mono">{order.date || "Unknown Date"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                                <p className="font-bold text-xl text-(--medium-shade)">{order.total} PLN</p>
                                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                                    order.status === 'completed' 
                                    ? 'border-green-500/30 text-green-300 bg-green-500/10' 
                                    : 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'
                                }`}>
                                    {order.status === 'completed' && <FaCheck size={10} />}
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all p-2 hover:bg-white/10 rounded-full cursor-pointer text-(--medium-shade)">
                                <FaChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                <FaBox className="text-6xl mb-4 opacity-20" />
                <p className="text-lg">Nie masz jeszcze żadnych zamówień.</p>
                <button 
                    onClick={() => navigate('/shop')} 
                    className="mt-4 px-6 py-2 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] font-bold rounded-xl transition-colors cursor-pointer"
                >
                    Przejdź do sklepu
                </button>
            </div>
        )}
    </div>
);

const SecurityTab = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); 

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        
        setTimeout(async () => {
            try {
                setIsLoading(false);
                setStatus('success');
            } catch (err) {
                setIsLoading(false);
                setStatus('error');
            }
        }, 1500);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Bezpieczeństwo</h2>
            
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Obecne hasło</label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input 
                            type="password" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-4 focus:outline-none focus:border-(--medium-shade) transition-colors pl-10!"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Nowe hasło</label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input 
                            type="password" 
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pr-4 focus:outline-none focus:border-(--medium-shade) transition-colors pl-10!"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="mt-4 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] py-3 px-6 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? <FaSpinner className="animate-spin" /> : "Zaktualizuj hasło"}
                </button>

                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-3 rounded-xl flex items-center gap-2 text-sm">
                        <FaCheck /> Hasło zostało pomyślnie zmienione.
                    </div>
                )}
            </form>
        </div>
    );
};

const StatusTab = () => {
    const [searchId, setSearchId] = useState("");
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if(!searchId) return;
        
        setLoading(true);
        setTimeout(() => {
            setTrackingResult({
                id: searchId,
                status: "W drodze",
                step: 2, // 0: Created, 1: Packed, 2: Shipping, 3: Delivered
                estimated: "Jutro, 14:00"
            });
            setLoading(false);
        }, 1000);
    };

    const steps = [
        { label: "Przyjęto", date: "10:00" },
        { label: "Spakowano", date: "12:30" },
        { label: "Wysłano", date: "16:45" },
        { label: "Dostarczono", date: "--:--" },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Śledzenie Zamówienia</h2>
            
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-inner">
                <form onSubmit={handleSearch} className="flex gap-4 mb-10">
                    <input 
                        type="text" 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Wpisz numer zamówienia (np. 101)" 
                        className="flex-1 bg-black/20 border-b-2 border-white/10 py-3 px-4 focus:outline-none focus:border-(--medium-shade) transition-colors text-lg"
                    />
                    <button type="submit" className="bg-(--medium-shade) hover:brightness-110 text-black px-8 rounded-xl font-bold transition-all cursor-pointer flex justify-center items-center">
                        {loading ? <FaSpinner className="animate-spin" /> : "Szukaj"}
                    </button>
                </form>

                {trackingResult && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-sm opacity-50 uppercase tracking-widest">Status</p>
                                <p className="text-2xl font-bold text-(--medium-shade)">{trackingResult.status}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-50 uppercase tracking-widest">Szacowana dostawa</p>
                                <p className="text-xl">{trackingResult.estimated}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-(--medium-shade) -translate-y-1/2 rounded-full transition-all duration-1000"
                                style={{ width: `${(trackingResult.step / (steps.length - 1)) * 100}%` }}
                            ></div>
                            
                            <div className="relative flex justify-between">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors ${
                                            index <= trackingResult.step 
                                            ? "bg-(--medium-shade) border-(--medium-shade) shadow-[0_0_15px_rgba(143,120,93,0.6)]" 
                                            : "bg-[#24201d] border-white/20"
                                        }`}></div>
                                        <div className={`text-center transition-opacity ${index <= trackingResult.step ? "opacity-100" : "opacity-30"}`}>
                                            <p className="text-sm font-bold">{step.label}</p>
                                            <p className="text-xs font-mono">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
          if (Array.isArray(response)) {
             setOrders(response); 
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
    { id: "profile", label: "Profil", icon: <FaUser /> },
    { id: "history", label: "Historia", icon: <FaBox /> },
    { id: "status", label: "Śledzenie", icon: <FaTruck /> },
    { id: "security", label: "Hasło", icon: <FaLock /> },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-32 space-y-2">
            <div className="bg-[#24201d]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl mb-4">
                <p className="text-sm opacity-50 mb-1">Witaj,</p>
                <p className="text-xl font-bold truncate">{user?.username || "Guest"}</p>
            </div>

            <nav className="bg-[#24201d]/80 backdrop-blur-md p-3 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSearchParams({ tab: tab.id })}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group cursor-pointer text-left ${
                            activeTab === tab.id 
                            ? "bg-(--80-shade) text-white shadow-lg translate-x-1" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                    >
                        <span className={`text-xl ${activeTab === tab.id ? "text-(--medium-shade)" : "group-hover:text-(--medium-shade)"}`}>
                            {tab.icon}
                        </span>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                ))}
                
                <div className="h-px bg-white/10 my-2 mx-4"></div>
                
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-white/50 transition-all cursor-pointer text-left group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform"><FaSignOutAlt /></span>
                    <span className="font-medium">Wyloguj</span>
                </button>
            </nav>
        </aside>

        {/* Content Area */}
        <main className="min-h-[600px] bg-[#24201d]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-(--medium-shade)/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative z-10">
                {activeTab === "profile" && <ProfileTab user={user} />}
                {activeTab === "history" && <HistoryTab orders={orders} loading={loadingOrders} navigate={navigate} />}
                {activeTab === "security" && <SecurityTab user={user} />}
                {activeTab === "status" && <StatusTab />}
            </div>
        </main>
      </div>
    </div>
  );
}