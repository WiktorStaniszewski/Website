import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiPlusCircle } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await api.get("orders");
        const safeOrders = Array.isArray(orders) ? orders : [];
        const revenue = safeOrders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? Number(o.total) : 0), 0);
        const activeOrders = safeOrders.filter(o => o.status === 'new' || o.status === 'processing').length;
        setStats({ revenue, orders: activeOrders });
      } catch (e) {
        console.error("Dashboard Error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-[50vh] text-(--medium-shade) animate-pulse font-bold">Ładowanie danych...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 not-lg:pt-20">
      <header>
        <h1 className="text-3xl font-serif font-bold text-[#F2EAE1] mb-1">Dzień dobry!</h1>
        <p className="text-[#F2EAE1]/60 text-sm font-medium">Oto podsumowanie twojego sklepu.</p>
      </header>
      
      <div 
        onClick={() => navigate('/admin/products?add=true')}
        className="w-full bg-[#46382E] border-2 border-dashed border-(--medium-shade)/50 hover:border-(--medium-shade) hover:bg-[#5C4A3D] rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group shadow-lg"
      >
        <FiPlusCircle className="text-5xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
        <h2 className="text-2xl font-bold text-[#F2EAE1]">Dodaj nowy produkt</h2>
        <p className="text-[#F2EAE1]/60 text-sm">Kliknij tutaj, aby natychmiast uzupełnić asortyment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden p-8 rounded-3xl bg-[#46382E] border border-[#5C4A3D] shadow-lg">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-(--medium-shade)">
             <FiDollarSign size={80} />
          </div>
          <div className="text-[#F2EAE1]/60 text-xs uppercase tracking-widest font-bold mb-2">Dzisiejszy Przychód</div>
          <div className="text-4xl font-bold text-[#F2EAE1] flex items-baseline gap-1">
            {stats.revenue.toFixed(2)} <span className="text-lg font-normal text-(--medium-shade)">PLN</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 w-fit px-3 py-1.5 rounded-full border border-green-400/20">
            <FiTrendingUp /> +12% vs wczoraj
          </div>
        </div>

        {/* --- TUTAJ JEST ZMIANA - Dodano onClick, cursor-pointer i hover:bg --- */}
        <div 
            onClick={() => navigate('/admin/orders')}
            className="relative overflow-hidden p-8 rounded-3xl bg-[#46382E] border border-[#5C4A3D] shadow-lg cursor-pointer hover:bg-[#5C4A3D] transition-colors group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-(--medium-shade)">
             <FiShoppingCart size={80} />
          </div>
          <div className="text-[#F2EAE1]/60 text-xs uppercase tracking-widest font-bold mb-2">Do realizacji</div>
          <div className="text-4xl font-bold text-[#F2EAE1] group-hover:text-(--medium-shade) transition-colors">
            {stats.orders}
          </div>
           <div className="mt-4 text-xs font-bold text-(--medium-shade) bg-(--medium-shade)/10 border border-(--medium-shade)/20 w-fit px-3 py-1.5 rounded-full">
             Kliknij, aby przejść do zamówień
          </div>
        </div>
      </div>
    </div>
  );
}