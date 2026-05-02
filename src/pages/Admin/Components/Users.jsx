import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "src/services/api"; 
import { FaUserShield, FaUser, FaSearch, FaBox, FaCrown } from "react-icons/fa";
import { FiFilter, FiAlertTriangle, FiMapPin, FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import usePagination from "src/hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProvider";
import PaginationControls from "src/components/ui/PaginationControls";
import SomniumSelect from "components/ui/SomniumSelect";
import AdminPageLayout, { SkeletonRow } from './AdminPageLayout';

export default function Users() {
  const[users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const[locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { user: currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortPendingFirst, setSortPendingFirst] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      userId: null,
      currentRole: null
  });

  const [locationModal, setLocationModal] = useState({
      isOpen: false,
      userId: null,
      currentLocationId: ""
  });

  const fetchData = async () => {
    try {
      const [usersRes, ordersRes, locsRes] = await Promise.all([
          api.get("users"),
          api.get("orders"),
          api.get("locations")
      ]);
      
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(ordersRes)) setOrders(ordersRes);
      if (Array.isArray(locsRes)) setLocations(locsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); },[]);

  const requestRoleChange = (id, currentRole) => {
      if (currentRole === 'super_admin') return; 
      setConfirmModal({ isOpen: true, userId: id, currentRole });
  };

  const executeRoleChange = async () => {
    const { userId, currentRole } = confirmModal;
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    
    try {
      await api.put("users", `${userId}/role`, { role: newRole });
      fetchData();
    } catch (err) {
      console.error("Błąd zmiany uprawnień:", err);
      alert("Wystąpił błąd podczas zmiany uprawnień."); 
    } finally {
      setConfirmModal({ isOpen: false, userId: null, currentRole: null });
    }
  };

  const executeLocationChange = async () => {
    try {
        await api.put(`users`, `${locationModal.userId}/location`, { locationId: locationModal.currentLocationId || null });
        fetchData();
    } catch (err) { 
        alert("Wystąpił błąd przypisania lokalizacji."); 
    } finally { 
        setLocationModal({ isOpen: false, userId: null, currentLocationId: "" }); 
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
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.Location && u.Location.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const superAdminUsers = filteredUsers.filter(u => u.role === 'super_admin');
  const adminUsers = filteredUsers.filter(u => u.role === 'admin');
  let customerUsers = filteredUsers.filter(u => u.role !== 'admin' && u.role !== 'super_admin');

  if (sortPendingFirst) {
      customerUsers.sort((a, b) => (b.hasPendingOrder === true) - (a.hasPendingOrder === true));
  }

  const customerPagination = usePagination(customerUsers, { 
    itemsPerPage: 10, 
    storageKey: 'admin_users_page',
    filterFingerprint: searchTerm
  });

  return (
    <AdminPageLayout
        title="Użytkownicy"
        subtitle="Zarządzaj dostępem, pracownikami i klientami"
        actions={
            <div className="relative w-full md:w-72">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--medium-shade)" />
                <input 
                    type="text" 
                    placeholder="Szukaj (nazwa, email, placówka)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#46382E] border border-[#5C4A3D] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-(--medium-shade) text-[#F2EAE1] placeholder-[#F2EAE1]/30 transition-colors"
                />
            </div>
        }
    >
      <div className="space-y-8 min-h-[600px]">
        {loading ? (
            <>
                <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl p-6 md:p-8">
                    <SkeletonRow count={1} />
                </div>
                <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl p-6 md:p-8">
                    <SkeletonRow count={3} />
                </div>
                <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl p-6 md:p-8">
                    <SkeletonRow count={5} />
                </div>
            </>
        ) : (
            <>
              <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-yellow-500 mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                    <FaCrown className="animate-pulse" /> Główny Administrator
                </h2>
                <div className="flex flex-col gap-3">
                  {superAdminUsers.length === 0 ? <p className="text-[#F2EAE1]/30 text-sm italic py-4">Brak wyników w tej sekcji.</p> : superAdminUsers.map(u => {
                    const isMe = currentUser && String(currentUser.id) === String(u.id);

                    return (
                    <div 
                      key={u.id} 
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="flex justify-between items-center p-5 bg-white/5 hover:bg-white/10 cursor-pointer rounded-2xl border border-yellow-500/20 transition-all duration-300 group"
                    >
                      <div>
                        <p className="font-bold text-lg text-[#F2EAE1]">
                           {u.username} {isMe && <span className="text-[10px] uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full ml-2">To Ty</span>}
                        </p>
                        <p className="text-sm text-[#F2EAE1]/40">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          SUPER ADMIN
                        </span>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              
              <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                    <FaUserShield /> Zespół (Administratorzy / Bariści)
                </h2>
                <div className="flex flex-col gap-3">
                  {adminUsers.length === 0 ? <p className="text-[#F2EAE1]/30 text-sm italic py-4">Brak wyników w tej sekcji.</p> : adminUsers.map(u => {
                    const isMe = currentUser && String(currentUser.id) === String(u.id);

                    return (
                    <div 
                      key={u.id} 
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="flex justify-between items-center p-5 bg-white/5 hover:bg-white/10 cursor-pointer rounded-2xl border border-white/5 transition-all duration-300 group"
                    >
                      <div>
                        <p className="font-bold text-lg text-[#F2EAE1]">
                          {u.username} {isMe && <span className="text-[10px] uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full ml-2">To Ty</span>}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#F2EAE1]/40 mt-1.5">
                            <FiMapPin className="text-(--medium-shade)" /> {u.Location ? u.Location.name : "Wszystkie placówki (Globalnie)"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocationModal({ isOpen: true, userId: u.id, currentLocationId: u.locationId || "" });
                          }}
                          className="p-3 bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] text-white/50 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Przypisz placówkę"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            requestRoleChange(u.id, u.role); 
                          }}
                          disabled={isMe}
                          className={`p-3 border rounded-xl transition-all ${
                            isMe 
                            ? 'bg-transparent border-transparent text-white/10 cursor-not-allowed opacity-20' 
                            : 'bg-white/5 border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-white/50 cursor-pointer'
                          }`}
                          title={isMe ? "Nie możesz odebrać uprawnień samemu sobie" : "Odbierz uprawnienia"}
                        >
                          <FaUser size={18} />
                        </button>
                      </div>
                    </div>
                  )})}
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-(--medium-shade) flex items-center gap-2">
                        <FaUser className="text-(--medium-shade)" /> Klienci
                    </h2>
                    <button 
                        onClick={() => setSortPendingFirst(!sortPendingFirst)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border
                        ${sortPendingFirst ? 'bg-(--medium-shade)/20 text-(--medium-shade) border-(--medium-shade)/50 shadow-lg' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'}
                        `}
                    >
                        <FiFilter /> Z oczekującym zamówieniem
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="mb-4">
                     <PaginationControls pagination={customerPagination} scrollBehavior="none" />
                  </div>
                  {customerUsers.length === 0 ? <p className="text-[#F2EAE1]/30 text-sm italic py-4">Brak wyników w tej sekcji.</p> : customerPagination.visibleItems.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="flex justify-between items-center p-5 bg-white/5 hover:bg-white/10 cursor-pointer rounded-2xl border border-white/5 transition-all duration-300 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                          <div>
                            <p className="font-bold text-lg text-[#F2EAE1]">{u.username}</p>
                            <p className="text-sm text-[#F2EAE1]/40">{u.email}</p>
                          </div>
                          {u.hasPendingOrder && (
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full w-fit animate-pulse">
                                  <FaBox /> Oczekuje na zamówienie
                              </div>
                          )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/5 text-white/30 border border-white/5 hidden md:inline-block">
                          CUSTOMER
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            requestRoleChange(u.id, u.role);
                          }}
                          className="p-3 bg-white/5 border border-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] text-white/50 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="Nadaj uprawnienia Admina"
                        >
                          <FaUserShield size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/5 pt-8">
                    <PaginationControls pagination={customerPagination} />
                </div>
              </div>
            </>
        )}
      </div>

      {locationModal.isOpen && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#24201d] w-full max-sm:w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">Miejsce pracy</h3>
            <p className="text-white/60 mb-6 text-sm text-center">Do której placówki przypisać tego pracownika?</p>
            
            <SomniumSelect 
                label="Miejsce pracy"
                placeholder="Brak / Odznacz (Widzi wszystkie)"
                options={[
                    { label: "Brak / Odznacz (Widzi wszystkie)", value: "" },
                    ...locations.map(loc => ({
                        label: `${loc.name} (${loc.type === 'warehouse' ? 'Magazyn' : 'Kawiarnia'})`,
                        value: String(loc.id)
                    }))
                ]}
                value={String(locationModal.currentLocationId || "")}
                onChange={(val) => setLocationModal({...locationModal, currentLocationId: val})}
                className="mb-6"
            />

            <div className="flex gap-3 w-full">
              <button onClick={() => setLocationModal({ isOpen: false, userId: null, currentLocationId: "" })} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold cursor-pointer">
                  Anuluj
              </button>
              <button onClick={executeLocationChange} className="flex-1 py-3 font-bold rounded-xl shadow-lg bg-(--medium-shade) hover:brightness-110 text-[#24201d] cursor-pointer">
                  Zapisz
              </button>
            </div>
          </div>
        </div>, document.body
      )}

      {confirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#24201d] w-full max-sm:w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              confirmModal.currentRole === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-(--medium-shade)/10 text-(--medium-shade) border border-(--medium-shade)/20'
            }`}>
              {confirmModal.currentRole === 'admin' ? <FiAlertTriangle size={32} /> : <FaUserShield size={32} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zmienić uprawnienia?</h3>
            <p className="text-white/60 mb-8 leading-relaxed text-sm">
              {confirmModal.currentRole === 'admin' 
                ? "Czy na pewno chcesz odebrać temu użytkownikowi prawa administratora? Straci on dostęp do panelu." 
                : "Czy na pewno chcesz nadać temu użytkownikowi pełne prawa administratora?"}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmModal({ isOpen: false, userId: null, currentRole: null })} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                Anuluj
              </button>
              <button onClick={executeRoleChange} className={`flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg ${confirmModal.currentRole === 'admin' ? 'bg-red-500/50 hover:bg-red-600/80 text-white' : 'bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d]'}`}>
                Potwierdź
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </AdminPageLayout>
  );
}