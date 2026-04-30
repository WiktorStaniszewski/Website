import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiChevronRight, FiBox, FiChevronDown, FiCheck, FiMapPin, FiSearch, FiChevronLeft } from "react-icons/fi";
import usePagination from "src/hooks/usePagination";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);
  
  const[searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders");
        if (Array.isArray(res)) setOrders(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  },[]);


  const statusWeights = { 'new': 0, 'processing': 1, 'shipped': 2, 'pending_payment': 3, 'completed': 4, 'cancelled': 5 };

  const searchedOrders = orders.filter(o => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const trackStr = o.trackingNumber ? o.trackingNumber.toLowerCase() : "";
      const idStr = o.id ? String(o.id) : "";
      const emailStr = o.customer?.email ? o.customer.email.toLowerCase() : "";
      const locStr = o.Location?.name ? o.Location.name.toLowerCase() : "";
      
      return trackStr.includes(q) || idStr.includes(q) || emailStr.includes(q) || locStr.includes(q);
  });

  const activeOrders = searchedOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const archivedOrders = searchedOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  activeOrders.sort((a, b) => {
    if (statusWeights[a.status] !== statusWeights[b.status]) return statusWeights[a.status] - statusWeights[b.status];
    return new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime();
  });

  archivedOrders.sort((a, b) => {
      return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
  });

  const activePagination = usePagination(activeOrders, { 
    itemsPerPage: 10, 
    storageKey: 'admin_active_orders_page',
    filterFingerprint: searchQuery
  });

  const archivedPagination = usePagination(archivedOrders, { 
    itemsPerPage: 10, 
    storageKey: 'admin_archived_orders_page',
    filterFingerprint: searchQuery
  });


  const getShippingLabel = (method, location) => {
    if (method === 'pickup') {
      return (
        <span className="flex items-center gap-1 text-(--medium-shade) font-bold">
          <FiMapPin /> Odbiór: {location?.name || 'Nieznana placówka'}
        </span>
      );
    }
    if (method === 'courier') return 'Kurier InPost';
    if (method === 'locker') return 'Paczkomat InPost';
    return method;
  };

  const renderOrderRow = (o) => (
    <div 
      key={o.id} 
      onClick={() => navigate(`/admin/orders/${o.id}`)}
      className="group cursor-pointer p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
    >
      <div>
        <p className="font-bold text-lg group-hover:text-(--medium-shade) transition-colors">
            Zamówienie {o.trackingNumber || `#${o.id}`}
        </p>
        <p className="text-sm opacity-50 flex items-center gap-2">
            {o.customer?.email} | {getShippingLabel(o.shipping?.method, o.Location)}
        </p>
        <p className="text-xs text-(--medium-shade) mt-1">{o.date}</p>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-right">
          <p className="text-xl font-bold text-white">{o.total} PLN</p>
          <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border
              ${o.status === 'completed' ? 'border-green-500/30 text-green-300 bg-green-500/10' : 
                o.status === 'cancelled' ? 'border-red-500/30 text-red-300 bg-red-500/10' :
                o.status === 'pending_payment' ? 'border-blue-500/30 text-blue-300 bg-blue-500/10' :
                'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'}`}
          >
              {o.status === 'completed' && <FiCheck size={10} />}
              {o.status === 'pending_payment' ? 'OCZEKUJE NA WPŁATĘ' : o.status.toUpperCase()}
          </span>
        </div>
        <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-transform transform group-hover:translate-x-1 text-2xl text-(--medium-shade)" />
      </div>
    </div>
  );

  if (loading) return <div className="text-(--medium-shade) text-center mt-20 font-bold">Ładowanie zamówień...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 not-lg:pt-20 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Zamówienia</h1>
          <p className="text-white/50 text-sm mt-1">Zarządzaj zamówieniami ze sklepu ({orders.length})</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input 
              type="text" 
              placeholder="Szukaj (np. SOM-..., email, kawiarnia)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-(--medium-shade) transition-colors placeholder-white/30"
          />
        </div>
      </div>
      
      <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8">
        
        <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Zamówienia Aktywne</h2>
            {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <FiBox className="text-5xl text-white/10 mb-3" />
                    <p className="text-sm opacity-50 italic">Brak aktywnych zamówień.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {activePagination.visibleItems.map(renderOrderRow)}
                    
                    {activePagination.totalPages > 1 && (
                        <PaginationControls pagination={activePagination} />
                    )}
                </div>
            )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
            <div 
                className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors"
                onClick={() => setIsArchivedOpen(!isArchivedOpen)}
            >
                <h2 className="text-xl font-bold text-white/70 group-hover:text-white transition-colors">
                    Archiwum Zakończonych ({archivedOrders.length})
                </h2>
                <FiChevronDown className={`text-2xl text-white/50 transition-transform duration-300 ${isArchivedOpen ? 'rotate-180' : ''}`} />
            </div>

            {isArchivedOpen && (
                <div className="mt-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    {archivedOrders.length === 0 ? (
                        <p className="text-sm opacity-50 italic text-center py-4">Brak zakończonych zamówień.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {archivedPagination.visibleItems.map(renderOrderRow)}
                            
                            {archivedPagination.totalPages > 1 && (
                                <PaginationControls pagination={archivedPagination} />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

function PaginationControls({ pagination }) {
    const { currentPage, totalPages, goToPage, getPageNumbers, startIndex, totalItems, itemsPerPage } = pagination;
    
    return (
        <div className="flex justify-center items-center mt-6 gap-2">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronLeft />
            </button>

            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`dots-${idx}`} className="w-8 text-center text-white/40 text-sm select-none">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${page === currentPage
                            ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)] scale-110'
                            : 'bg-white/5 hover:bg-white/15 text-white border border-white/10'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronRight />
            </button>

            <span className="ml-4 text-xs text-white/40 font-bold hidden sm:inline">
                {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} z {totalItems}
            </span>
        </div>
    );
}