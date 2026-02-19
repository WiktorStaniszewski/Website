import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiChevronRight } from "react-icons/fi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div className="text-white/50 text-center mt-20">Ładowanie zamówień...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-serif font-bold text-white">Zamówienia</h1>
      
      <div className="rounded-4xl border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6">
        <div className="flex flex-col gap-4">
          {orders.map(o => (
            <div 
              key={o.id} 
              onClick={() => navigate(`/admin/orders/${o.id}`)}
              className="group cursor-pointer p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 flex justify-between items-center transition-all"
            >
              <div>
                <p className="font-bold text-lg group-hover:text-(--medium-shade) transition-colors">Zamówienie #{o.id}</p>
                <p className="text-sm opacity-50">{o.customer?.email} | {o.shipping?.method}</p>
                <p className="text-xs text-(--medium-shade) mt-1">{o.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold">{o.total} PLN</p>
                  <span className="text-xs uppercase bg-white/10 px-2 py-1 rounded-full">{o.status}</span>
                </div>
                {/* The Arrow Icon - Hidden by default, shows on row hover */}
                <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-transform transform group-hover:translate-x-1 text-2xl text-(--medium-shade)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}