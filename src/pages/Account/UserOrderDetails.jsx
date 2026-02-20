import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api";
import { FaArrowLeft, FaBox, FaTruck, FaMapMarkerAlt, FaSearchLocation } from "react-icons/fa";

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
      <div className="min-h-screen pt-40 flex justify-center text-(--medium-shade) animate-pulse font-bold text-xl">
          Ładowanie szczegółów zamówienia...
      </div>
  );

  if (!order) return (
      <div className="min-h-screen pt-40 flex flex-col items-center gap-4 text-red-400">
          <FaBox className="text-6xl opacity-50" />
          <p className="text-xl font-bold">Nie znaleziono zamówienia lub nie masz do niego dostępu.</p>
          <button onClick={() => navigate('/account?tab=history')} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer">Wróć do historii</button>
      </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 text-(--font-color)">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => navigate('/account?tab=history')}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-(--medium-shade)"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    Zamówienie {order.trackingNumber || `#${order.id}`}
                </h1>
                <p className="text-sm opacity-50 mt-1">Data złożenia: {order.date}</p>
              </div>
          </div>
          
          <div className="flex items-center gap-4 self-end md:self-auto">
              <span className={`px-4 py-2 bg-white/5 border rounded-full text-sm font-bold uppercase tracking-wider
                  ${order.status === 'completed' ? 'border-green-500/30 text-green-400' : 
                    order.status === 'cancelled' ? 'border-red-500/30 text-red-400' :
                    'border-yellow-500/30 text-yellow-400'}`}
              >
                {order.status}
              </span>
          </div>
        </div>

        {order.status !== 'cancelled' && (
            <div className="bg-(--medium-shade)/10 backdrop-brightness-65 border border-(--medium-shade)/30 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Gdzie jest moja paczka?</h3>
                    <p className="text-sm opacity-70">Sprawdź aktualny etap realizacji zamówienia i szacowany czas dostawy.</p>
                </div>
                <button 
                    onClick={() => navigate(`/account?tab=status&track=${order.trackingNumber}`)}
                    className="w-full sm:w-auto px-6 py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(143,120,93,0.3)]"
                >
                    <FaSearchLocation size={18} />
                    Śledź przesyłkę
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <FaTruck className="text-(--medium-shade)" /> Dostawa
            </h2>
            <div className="text-sm opacity-80 space-y-1">
              <p className="font-bold text-white">{order.shipping?.details?.label || order.shipping?.method}</p>
              <p>Koszt: {order.shipping?.cost === 0 ? 'Gratis' : `${order.shipping?.cost} PLN`}</p>
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
              <p>{order.customer?.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <FaBox className="text-(--medium-shade)" /> Zamówione Produkty
          </h2>
          
          <div className="flex flex-col gap-4">
            {order.items?.map((item, idx) => {
               const imageName = item.image || item.img;
               const finalImageSrc = imageName?.includes('images/') 
                   ? (imageName.startsWith('/') ? imageName : `/${imageName}`)
                   : `images/tempProducts/${imageName}`;

               return (
                <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-16 h-16 bg-black/30 rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img 
                        src={finalImageSrc} 
                        alt={item.name || item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    </div>
                    <div className="flex-1">
                    <p className="font-bold text-lg text-white">{item.name || item.title}</p>
                    <p className="text-sm opacity-60">Ilość: {item.quantity} x {item.price} PLN</p>
                    </div>
                    <div className="text-xl font-bold text-(--medium-shade)">
                    {(item.price * item.quantity).toFixed(2)} PLN
                    </div>
                </div>
              );
            })}
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