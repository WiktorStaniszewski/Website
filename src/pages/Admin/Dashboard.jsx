import { useState, useEffect } from "react";
import api from "../../services/api"; 
import { FiDollarSign, FiShoppingCart, FiTrendingUp } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.get("orders");
        const orders = ordersRes?.data || [];
        
        const revenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? Number(o.total) : 0), 0);
        const activeOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;

        setStats({ revenue, orders: activeOrders });
      } catch (e) {
        console.error("Dashboard Error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh] text-(--medium-shade) animate-pulse">
        Ładowanie danych...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 not-lg:pt-20">
      <header>
        <h1 className="text-3xl font-serif font-bold text-white mb-1">Dzień dobry!</h1>
        <p className="text-white/50 text-sm">Oto podsumowanie twojego sklepu.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="relative overflow-hidden p-6 rounded-4xl bg-[#24201d]/60 backdrop-blur-xl border border-white/10 group hover:border-(--medium-shade)/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <FiDollarSign size={60} />
          </div>
          <div className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Dzisiejszy Przychód</div>
          <div className="text-4xl font-bold text-white flex items-baseline gap-1">
            {stats.revenue} <span className="text-sm font-normal text-(--medium-shade)">PLN</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 w-fit px-2 py-1 rounded-full">
            <FiTrendingUp /> +12% vs wczoraj
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="relative overflow-hidden p-6 rounded-4xl bg-[#24201d]/60 backdrop-blur-xl border border-white/10 group hover:border-(--medium-shade)/30 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
             <FiShoppingCart size={60} />
          </div>
          <div className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Do realizacji</div>
          <div className="text-4xl font-bold text-white">
            {stats.orders}
          </div>
           <div className="mt-4 text-xs text-white/40">
             Oczekujące zamówienia
          </div>
        </div>

      </div>
    </div>
  );
}