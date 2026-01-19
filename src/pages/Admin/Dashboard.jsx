import { useState, useEffect } from "react";
import api from "../../services/api"; 
import { FiDollarSign, FiShoppingCart } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const ordersRes = await api.get("orders");
      const orders = ordersRes.data;
      
      const revenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
      const activeOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;

      setStats({ revenue, orders: activeOrders });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white">Ładowanie...</div>;

  return (
    <div className="space-y-6 backdrop-blur-sm backdrop-brightness-85 p-4 rounded-2xl border border-white/5">
      <h1 className="text-2xl font-bold text-white">Przegląd</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-white/5">
          <div className="text-gray-400 text-sm">Dzisiejszy Przychód</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2 mt-2">
            <FiDollarSign className="text-green-600/50" /> {stats.revenue} PLN
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/5">
          <div className="text-gray-400 text-sm">Do realizacji</div>
          <div className="text-3xl font-bold text-white flex items-center gap-2 mt-2">
            <FiShoppingCart className="text-blue-400" /> {stats.orders}
          </div>
        </div>
      </div>
    </div>
  );
}