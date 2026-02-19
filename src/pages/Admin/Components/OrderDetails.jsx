import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiArrowLeft, FiUser, FiTruck, FiBox } from "react-icons/fi";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`orders/${id}`);
        setOrder(res);
      } catch (e) {
        console.error("Error fetching order:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="text-white/50 text-center mt-20">Ładowanie szczegółów zamówienia...</div>;
  if (!order) return <div className="text-red-400 text-center mt-20">Nie znaleziono zamówienia.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/orders')}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Zamówienie #{order.id}</h1>
          <p className="text-sm opacity-50 mt-1">Złożone: {order.date}</p>
        </div>
        <span className="ml-auto px-4 py-2 bg-(--medium-shade)/20 text-(--medium-shade) border border-(--medium-shade)/30 rounded-full text-sm font-bold uppercase">
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Customer & Shipping */}
        <div className="space-y-6 lg:col-span-1">
          {/* Customer Card */}
          <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <FiUser className="text-(--medium-shade)" /> Klient
            </h2>
            <div className="space-y-2 text-sm opacity-80">
              <p className="font-bold text-white text-base">{order.customer?.firstName}</p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <FiTruck className="text-(--medium-shade)" /> Dostawa
            </h2>
            <div className="space-y-2 text-sm opacity-80">
              <p className="font-bold text-white text-base">{order.shipping?.details?.label || order.shipping?.method}</p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.zip} {order.customer?.city}</p>
              <p className="mt-4 pt-4 border-t border-white/5">
                Koszt: <span className="font-bold text-white">{order.shipping?.cost} PLN</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Items */}
        <div className="lg:col-span-2 bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <FiBox className="text-(--medium-shade)" /> Zamówione Produkty
          </h2>
          
          <div className="flex flex-col gap-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-black/20 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={item.image ? `images/tempProducts/${item.image}` : item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{item.name || item.title}</p>
                  <p className="text-sm opacity-60">Ilość: {item.quantity} x {item.price} PLN</p>
                </div>
                <div className="text-xl font-bold text-(--medium-shade)">
                  {(item.price * item.quantity).toFixed(2)} PLN
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
            <p className="text-lg opacity-70">Suma całkowita</p>
            <p className="text-3xl font-bold text-white">{order.total?.toFixed(2)} PLN</p>
          </div>
        </div>

      </div>
    </div>
  );
}