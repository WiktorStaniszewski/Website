import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "services/api"; 
import { FiDollarSign, FiShoppingCart, FiPlusCircle, FiTruck, FiFileText, FiMapPin, FiTag, FiUsers, FiSearch, FiCalendar, FiBox, FiPlus } from "react-icons/fi";
import { useAuth } from "src/context/AuthProvider";

import DeliveryModal from './DeliveryModal'; 
import ProductModal from './ProductModal';
import AdminPageLayout, { SkeletonGrid } from './AdminPageLayout';

export default function Dashboard() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [qaReport, setQaReport] = useState({ from: '', to: '' });
  const [qaLocation, setQaLocation] = useState('');
  const [qaUser, setQaUser] = useState('');
  const [qaPromo, setQaPromo] = useState({ code: '', discountPercent: '' });
  const [promoSubmitting, setPromoSubmitting] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchData = async () => {
      try {
        const [orders, locs] = await Promise.all([
          api.get("orders"),
          api.get("locations")
        ]);
        
        const safeOrders = Array.isArray(orders) ? orders : [];
        const revenue = safeOrders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? Number(o.total) : 0), 0);
        const activeOrders = safeOrders.filter(o => o.status === 'new' || o.status === 'processing').length;
        setStats({ revenue, orders: activeOrders });
        
        if (Array.isArray(locs)) setLocations(locs);
      } catch (e) {
        console.error("Dashboard Error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isSuperAdmin]);

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!qaPromo.code || !qaPromo.discountPercent) return;
    setPromoSubmitting(true);
    try {
      await api.post('promo-codes', {
        code: qaPromo.code.toUpperCase(),
        discountPercent: parseInt(qaPromo.discountPercent),
        usageType: 'single',
        maxUsesPerUser: 1,
        expiresAt: null
      });
      alert('Kod dodany pomyślnie!');
      setQaPromo({ code: '', discountPercent: '' });
    } catch (err) {
      alert(err.message || 'Błąd dodawania kodu.');
    } finally {
      setPromoSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!isSuperAdmin) {
    return <Navigate to="/admin/orders" replace />;
  }

  return (
    <AdminPageLayout
        title="Dzień dobry!"
        subtitle="Oto podsumowanie twojego sklepu."
    >
      <div className="space-y-8 min-h-[400px]">
        {loading ? (
            <SkeletonGrid count={4} />
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setIsProductModalOpen(true)}
                  className="w-full bg-[#46382E] border-2 border-dashed border-(--medium-shade)/50 hover:border-(--medium-shade) hover:bg-[#5C4A3D] rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group shadow-lg"
                >
                  <FiPlusCircle className="text-5xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-[#F2EAE1]">Nowy produkt</h2>
                  <p className="text-[#F2EAE1]/60 text-sm text-center">Dodaj nowy asortyment jednym kliknięciem</p>
                </div>

                <div 
                  onClick={() => setIsDeliveryModalOpen(true)}
                  className="w-full bg-[#46382E] border-2 border-dashed border-(--medium-shade)/50 hover:border-(--medium-shade) hover:bg-[#5C4A3D] rounded-3xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group shadow-lg"
                >
                  <FiTruck className="text-5xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-[#F2EAE1]">Zarejestruj dostawę</h2>
                  <p className="text-[#F2EAE1]/60 text-sm text-center">Uzupełnij stany magazynowe w mgnieniu oka</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden p-8 rounded-3xl bg-[#46382E] border border-[#5C4A3D] shadow-lg">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-(--medium-shade)">
                     <FiDollarSign size={80} />
                  </div>
                  <div className="text-[#F2EAE1]/60 text-xs uppercase tracking-widest font-bold mb-2">Całkowity Przychód</div>
                  <div className="text-4xl font-bold text-[#F2EAE1] flex items-baseline gap-1">
                    {stats.revenue.toFixed(2)} <span className="text-lg font-normal text-(--medium-shade)">PLN</span>
                  </div>
                </div>

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

              {/* SZYBKIE AKCJE */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-[#F2EAE1] mb-6 flex items-center gap-2">
                   Szybkie akcje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Raporty */}
                  <div className="bg-[#46382E] border border-[#5C4A3D] p-5 rounded-3xl shadow-lg flex flex-col h-full group">
                    <div className="flex items-center gap-2 mb-4 text-(--medium-shade) font-bold">
                       <FiFileText /> Raporty
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-center bg-[#2D231C] rounded-xl px-3 py-2 border border-[#5C4A3D]">
                        <FiCalendar className="text-white/30 mr-2" />
                        <input type="date" value={qaReport.from} onChange={e => setQaReport({...qaReport, from: e.target.value})} className="bg-transparent text-white/80 text-xs w-full focus:outline-none cursor-pointer" title="Od" />
                      </div>
                      <div className="flex items-center bg-[#2D231C] rounded-xl px-3 py-2 border border-[#5C4A3D]">
                        <FiCalendar className="text-white/30 mr-2" />
                        <input type="date" value={qaReport.to} onChange={e => setQaReport({...qaReport, to: e.target.value})} className="bg-transparent text-white/80 text-xs w-full focus:outline-none cursor-pointer" title="Do" />
                      </div>
                      <button onClick={() => navigate(`/admin/reports?from=${qaReport.from}&to=${qaReport.to}`)} className="mt-2 w-full py-2.5 bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] text-white/70 font-bold rounded-xl transition-all text-sm cursor-pointer border border-white/5">
                        Przejdź
                      </button>
                    </div>
                  </div>

                  {/* Zasoby i Produkty */}
                  <div className="bg-[#46382E] border border-[#5C4A3D] p-5 rounded-3xl shadow-lg flex flex-col h-full group">
                    <div className="flex items-center gap-2 mb-4 text-(--medium-shade) font-bold">
                       <FiBox /> Produkty i Zasoby
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <button onClick={() => navigate('/admin/products?view=products&action=add')} className="w-full py-2.5 bg-(--medium-shade)/20 text-(--medium-shade) hover:bg-(--medium-shade) hover:text-[#24201d] font-bold rounded-xl transition-all text-sm cursor-pointer border border-(--medium-shade)/30 flex items-center justify-center gap-2">
                        <FiPlus /> Dodaj nowy produkt
                      </button>
                      <div className="flex gap-2 items-stretch mt-2">
                          <select value={qaLocation} onChange={e => setQaLocation(e.target.value)} className="bg-[#2D231C] text-white/80 border border-[#5C4A3D] rounded-xl px-2 py-2 focus:outline-none focus:border-(--medium-shade) w-full text-[10px] cursor-pointer flex-1">
                            <option value="">Wybierz placówkę...</option>
                            {locations.map(loc => (
                               <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                          </select>
                          <button onClick={() => navigate(qaLocation ? `/admin/products?location=${qaLocation}` : '/admin/products')} className="px-3 bg-white/5 hover:bg-white/10 text-white/70 font-bold rounded-xl transition-all text-xs cursor-pointer border border-white/5 flex items-center justify-center">
                            Przejdź
                          </button>
                      </div>
                    </div>
                  </div>

                  {/* Kody promocyjne */}
                  <div className="bg-[#46382E] border border-[#5C4A3D] p-5 rounded-3xl shadow-lg flex flex-col h-full group">
                    <div className="flex items-center gap-2 mb-4 text-(--medium-shade) font-bold">
                       <FiTag /> Kody promo
                    </div>
                    <form onSubmit={handleCreatePromo} className="flex flex-col gap-2 mt-auto">
                      <input type="text" placeholder="Nazwa kodu" value={qaPromo.code} onChange={e => setQaPromo({...qaPromo, code: e.target.value.toUpperCase()})} className="bg-[#2D231C] text-white/80 border border-[#5C4A3D] rounded-xl px-3 py-2 focus:outline-none focus:border-(--medium-shade) w-full text-xs font-mono uppercase tracking-widest placeholder:text-white/30" required />
                      <div className="flex items-center bg-[#2D231C] border border-[#5C4A3D] rounded-xl px-3 py-2">
                        <input type="number" placeholder="Zniżka np. 10" min="1" max="100" value={qaPromo.discountPercent} onChange={e => setQaPromo({...qaPromo, discountPercent: e.target.value})} className="bg-transparent text-white/80 w-full text-xs focus:outline-none placeholder:text-white/30" required />
                        <span className="text-white/30 text-xs ml-2">%</span>
                      </div>
                      <button type="submit" disabled={promoSubmitting} className="mt-2 w-full py-2.5 bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] disabled:opacity-50 text-white/70 font-bold rounded-xl transition-all text-sm cursor-pointer border border-white/5">
                        {promoSubmitting ? 'Dodawanie...' : 'Dodaj szybki kod'}
                      </button>
                    </form>
                  </div>

                  {/* Użytkownicy */}
                  <div className="bg-[#46382E] border border-[#5C4A3D] p-5 rounded-3xl shadow-lg flex flex-col h-full group">
                    <div className="flex items-center gap-2 mb-4 text-(--medium-shade) font-bold">
                       <FiUsers /> Użytkownicy
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); navigate(`/admin/users?search=${encodeURIComponent(qaUser)}`); }} className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center bg-[#2D231C] rounded-xl px-3 py-2.5 border border-[#5C4A3D]">
                        <FiSearch className="text-white/30 mr-2 shrink-0" />
                        <input type="text" placeholder="Szukaj (email, nazwa)..." value={qaUser} onChange={e => setQaUser(e.target.value)} className="bg-transparent text-white/80 text-xs w-full focus:outline-none placeholder:text-white/30" />
                      </div>
                      <button type="submit" className="mt-2 w-full py-2.5 bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] text-white/70 font-bold rounded-xl transition-all text-sm cursor-pointer border border-white/5">
                        Wyszukaj
                      </button>
                    </form>
                  </div>

                </div>
              </div>

              <DeliveryModal 
                isOpen={isDeliveryModalOpen} 
                onClose={() => setIsDeliveryModalOpen(false)} 
                onSuccess={() => {}} 
              />
              <ProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => setIsProductModalOpen(false)} 
              />
            </>
        )}
      </div>
    </AdminPageLayout>
  );
}