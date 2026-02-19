import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "src/services/api"; 
import { FaArrowLeft, FaBox, FaTruck, FaMapMarkerAlt } from "react-icons/fa";

export default function UserOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`orders/my-orders/${id}`);
        setOrder(res);
      } catch (e) {
        console.error("Error fetching order:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return (
      <div className="min-h-screen pt-40 flex justify-center text-(--medium-shade) animate-pulse">
          Ładowanie zamówienia...
      </div>
  );

  if (!order) return (
      <div className="min-h-screen pt-40 flex justify-center text-red-400">
          Nie znaleziono zamówienia lub nie masz do niego dostępu.
      </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 text-(--font-color)">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <button 
            onClick={() => navigate('/account?tab=history')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-(--medium-shade)"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Zamówienie #{order.id}</h1>
            <p className="text-sm opacity-50 mt-1">Data złożenia: {order.date}</p>
          </div>
          <span className="ml-auto px-4 py-2 bg-(--medium-shade)/20 text-(--medium-shade) border border-(--medium-shade)/30 rounded-full text-sm font-bold uppercase tracking-wider">
            {order.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <FaTruck className="text-(--medium-shade)" /> Dostawa
            </h2>
            <div className="text-sm opacity-80 space-y-1">
              <p className="font-bold text-white">{order.shipping?.details?.label || order.shipping?.method}</p>
              <p>Koszt: {order.shipping?.cost} PLN</p>
            </div>
          </div>

          <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <FaMapMarkerAlt className="text-(--medium-shade)" /> Adres wysyłki
            </h2>
            <div className="text-sm opacity-80 space-y-1">
              <p className="font-bold text-white">{order.customer?.firstName}</p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.zip} {order.customer?.city}</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <FaBox className="text-(--medium-shade)" /> Zamówione Produkty
          </h2>
          
          <div className="flex flex-col gap-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-16 h-16 bg-black/30 rounded-xl overflow-hidden shrink-0">
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

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
            <p className="text-lg opacity-70">Razem do zapłaty</p>
            <p className="text-3xl font-bold text-white">{order.total?.toFixed(2)} PLN</p>
          </div>
        </div>

      </div>
    </div>
  );
}