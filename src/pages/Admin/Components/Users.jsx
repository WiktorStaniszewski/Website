import { useState, useEffect } from "react";
import api from "services/api"; 
import { FaUserShield, FaUser, FaSearch, FaBox } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPendingFirst, setSortPendingFirst] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
          api.get("users"),
          api.get("orders")
      ]);
      
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(ordersRes)) setOrders(ordersRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const changeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if(window.confirm(`Zmienić uprawnienia na ${newRole.toUpperCase()}?`)) {
      try {
        await api.put("users", `${id}/role`, { role: newRole });
        fetchData();
      } catch (err) {
        alert("Błąd zmiany uprawnień");
      }
    }
  };

  const usersWithOrderInfo = users.map(u => {
      const hasPendingOrder = orders.some(
          o => String(o.userId) === String(u.id) && (o.status === 'new' || o.status === 'processing')
      );
      return { ...u, hasPendingOrder };
  });

  const filteredUsers = usersWithOrderInfo.filter(u => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminUsers = filteredUsers.filter(u => u.role === 'admin');
  let customerUsers = filteredUsers.filter(u => u.role !== 'admin');

  if (sortPendingFirst) {
      customerUsers.sort((a, b) => (b.hasPendingOrder === true) - (a.hasPendingOrder === true));
  }

  if (loading) return <div className="text-(--medium-shade) font-bold text-center mt-20">Ładowanie użytkowników...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pt-20">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">Użytkownicy</h1>
            <p className="text-[#F2EAE1]/60 text-sm mt-1">Zarządzaj dostępem i podglądaj klientów</p>
        </div>
        
        {/* Wyszukiwarka */}
        <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--medium-shade)" />
            <input 
                type="text" 
                placeholder="Szukaj (nazwa, email)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#46382E] border border-[#5C4A3D] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-(--medium-shade) text-[#F2EAE1] placeholder-[#F2EAE1]/30 transition-colors"
            />
        </div>
      </div>
      
      {/* SEKCJA 1: ADMINISTRATORZY */}
      <div className="bg-[#46382E] border border-[#5C4A3D] rounded-4xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-(--medium-shade) mb-4 flex items-center gap-2 border-b border-[#5C4A3D] pb-3">
            <FaUserShield /> Zespół (Administratorzy)
        </h2>
        <div className="flex flex-col gap-4">
          {adminUsers.length === 0 ? <p className="text-[#F2EAE1]/50 text-sm">Brak wyników w tej sekcji.</p> : adminUsers.map(u => (
            <div 
              key={u.id} 
              onClick={() => navigate(`/admin/users/${u.id}`)}
              className="flex justify-between items-center p-4 bg-[#352A21] hover:bg-[#5C4A3D]/50 cursor-pointer rounded-2xl border border-[#5C4A3D] transition-colors"
            >
              <div>
                <p className="font-bold text-lg text-[#F2EAE1]">{u.username}</p>
                <p className="text-sm text-[#F2EAE1]/50">{u.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  ADMIN
                </span>
                <button 
                  onClick={() => changeRole(u.id, u.role)}
                  className="p-3 bg-[#46382E] border border-[#5C4A3D] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-[#F2EAE1]/70 rounded-xl transition-all cursor-pointer"
                  title="Odbierz uprawnienia"
                >
                  <FaUser />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEKCJA 2: KLIENCI */}
      <div className="bg-[#46382E] border border-[#5C4A3D] rounded-4xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b border-[#5C4A3D] pb-3">
            <h2 className="text-xl font-bold text-[#F2EAE1] flex items-center gap-2">
                <FaUser className="text-(--medium-shade)" /> Klienci
            </h2>
            <button 
                onClick={() => setSortPendingFirst(!sortPendingFirst)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer border
                ${sortPendingFirst ? 'bg-(--medium-shade)/20 text-(--medium-shade) border-(--medium-shade)/50' : 'bg-[#352A21] text-[#F2EAE1]/50 border-[#5C4A3D] hover:text-[#F2EAE1]'}
                `}
            >
                <FiFilter /> Z oczekującym zamówieniem
            </button>
        </div>

        <div className="flex flex-col gap-4">
          {customerUsers.length === 0 ? <p className="text-[#F2EAE1]/50 text-sm">Brak wyników w tej sekcji.</p> : customerUsers.map(u => (
            <div 
              key={u.id} 
              onClick={() => navigate(`/admin/users/${u.id}`)}
              className="flex justify-between items-center p-4 bg-[#352A21] hover:bg-[#5C4A3D]/50 cursor-pointer rounded-2xl border border-[#5C4A3D] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <div>
                    <p className="font-bold text-lg text-[#F2EAE1]">{u.username}</p>
                    <p className="text-sm text-[#F2EAE1]/50">{u.email}</p>
                  </div>
                  {/* Status oczekującego zamówienia */}
                  {u.hasPendingOrder && (
                      <div className="flex items-center gap-2 text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full w-fit">
                          <FaBox /> Oczekuje na zamówienie
                      </div>
                  )}
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#46382E] text-[#F2EAE1]/60 border border-[#5C4A3D] hidden md:inline-block">
                  CUSTOMER
                </span>
                <button 
                  onClick={() => changeRole(u.id, u.role)}
                  className="p-3 bg-[#46382E] border border-[#5C4A3D] hover:bg-(--medium-shade)/20 hover:text-(--medium-shade) hover:border-(--medium-shade)/30 text-[#F2EAE1]/70 rounded-xl transition-all cursor-pointer"
                  title="Nadaj uprawnienia Admina"
                >
                  <FaUserShield />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}