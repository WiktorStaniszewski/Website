import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiChevronRight, FiBox, FiChevronDown, FiCheck } from "react-icons/fi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);
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
  }, []);

  const statusWeights = { 'new': 0, 'processing': 1, 'shipped': 2, 'completed': 3, 'cancelled': 99 };

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const archivedOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  activeOrders.sort((a, b) => {
    if (statusWeights[a.status] !== statusWeights[b.status]) {
        return statusWeights[a.status] - statusWeights[b.status];
    }
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateA - dateB;
  });

  archivedOrders.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime();
    const dateB = new Date(b.createdAt || b.date).getTime();
    return dateB - dateA;
  });

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
        <p className="text-sm opacity-50">{o.customer?.email} | {o.shipping?.method}</p>
        <p className="text-xs text-(--medium-shade) mt-1">{o.date}</p>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-right">
          <p className="text-xl font-bold text-white">{o.total} PLN</p>
          <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border
              ${o.status === 'completed' ? 'border-green-500/30 text-green-300 bg-green-500/10' : 
                o.status === 'cancelled' ? 'border-red-500/30 text-red-300 bg-red-500/10' :
                'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'}`}
          >
              {o.status === 'completed' && <FiCheck size={10} />}
              {o.status.toUpperCase()}
          </span>
        </div>
        <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-transform transform group-hover:translate-x-1 text-2xl text-(--medium-shade)" />
      </div>
    </div>
  );

  if (loading) return <div className="text-(--medium-shade) text-center mt-20 font-bold">Ładowanie zamówień...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 not-lg:pt-20 pb-20">
      
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Zamówienia</h1>
        <p className="text-white/50 text-sm mt-1">Zarządzaj zamówieniami ze sklepu ({orders.length})</p>
      </div>
      
      <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8">
        
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBox className="text-6xl text-white/10 mb-4" />
            <h3 className="text-xl font-bold text-white">Brak zamówień</h3>
            <p className="text-white/50 mt-2">Gdy klienci coś kupią, lista pojawi się tutaj.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {activeOrders.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {activeOrders.map(renderOrderRow)}
                </div>
            ) : (
                <p className="text-sm opacity-50 italic text-center py-4">Brak aktywnych zamówień w toku.</p>
            )}

            {archivedOrders.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                    <button 
                        onClick={() => setIsArchivedOpen(!isArchivedOpen)}
                        className="flex items-center gap-3 text-lg font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer w-full text-left text-white"
                    >
                        <FiChevronDown className={`transition-transform duration-300 ${isArchivedOpen ? 'rotate-180' : ''}`} />
                        Zrealizowane i anulowane ({archivedOrders.length})
                    </button>
                    
                    <div className={`grid transition-all duration-500 ease-in-out ${isArchivedOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden flex flex-col gap-4">
                            {archivedOrders.map(renderOrderRow)}
                        </div>
                    </div>
                </div>
            )}

          </div>
        )}
        
      </div>
    </div>
  );
}