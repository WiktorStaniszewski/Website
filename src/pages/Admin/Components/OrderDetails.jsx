import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiArrowLeft, FiUser, FiTruck, FiBox, FiCheckCircle } from "react-icons/fi";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const statusWeights = { 'new': 0, 'processing': 1, 'shipped': 2, 'completed': 3 };
  const isTerminalState = order?.status === 'completed' || order?.status === 'cancelled';

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

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdatingStatus(true);
    setStatusMessage(null);

    try {
      await api.put("orders", id, { status: newStatus });
      setOrder(prev => ({ ...prev, status: newStatus }));
      
      setStatusMessage("Status zaktualizowany!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusMessage("Błąd zapisu!");
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="text-(--medium-shade) text-center mt-20 font-bold">Ładowanie szczegółów zamówienia...</div>;
  if (!order) return <div className="text-red-400 text-center mt-20">Nie znaleziono zamówienia.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-5 pt-20">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate('/admin/orders')}
            className="p-3 bg-[#46382E] border border-[#5C4A3D] hover:bg-[#5C4A3D] rounded-xl transition-colors cursor-pointer text-[#F2EAE1]"
            >
            <FiArrowLeft size={20} />
            </button>
            <div>
            <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">
                Zamówienie {order.trackingNumber || `#${order.id}`}
            </h1>
            <p className="text-sm opacity-50 mt-1 text-[#F2EAE1]/70">Złożone: {order.date}</p>
            </div>
        </div>

        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
                {statusMessage && (
                    <span className={`text-xs font-bold flex items-center gap-1 animate-in fade-in ${statusMessage.includes('Błąd') ? 'text-red-400' : 'text-green-400'}`}>
                        <FiCheckCircle /> {statusMessage}
                    </span>
                )}
                
                <select 
                    value={order.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus || isTerminalState}
                    className={`ml-auto px-4 py-2 bg-[#46382E] text-[#F2EAE1] border border-[#5C4A3D] rounded-full text-sm font-bold tracking-wider focus:outline-none focus:border-(--medium-shade)
                        ${(updatingStatus || isTerminalState) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    <option 
                      value="new" 
                      disabled={statusWeights['new'] < statusWeights[order.status]}
                    >Nowe (Przyjęte)</option>
                    
                    <option 
                      value="processing" 
                      disabled={statusWeights['processing'] < statusWeights[order.status]}
                    >W realizacji (Spakowane)</option>
                    
                    <option 
                      value="shipped" 
                      disabled={statusWeights['shipped'] < statusWeights[order.status]}
                    >Wysłane</option>
                    
                    <option 
                      value="completed" 
                      disabled={statusWeights['completed'] < statusWeights[order.status]}
                    >Dostarczone</option>
                    
                    <option 
                      value="cancelled" 
                      disabled={order.status === 'shipped' || isTerminalState}
                    >Anulowane</option>
                </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
              <FiUser className="text-(--medium-shade)" /> Klient
            </h2>
            <div className="space-y-2 text-sm text-[#F2EAE1]/80">
              <p className="font-bold text-[#F2EAE1] text-base">{order.customer?.firstName}</p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
            </div>
          </div>

          <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
              <FiTruck className="text-(--medium-shade)" /> Dostawa
            </h2>
            <div className="space-y-2 text-sm text-[#F2EAE1]/80">
              <p className="font-bold text-[#F2EAE1] text-base">{order.shipping?.details?.label || order.shipping?.method}</p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.zip} {order.customer?.city}</p>
              <p className="mt-4 pt-4 border-t border-[#5C4A3D]">
                Koszt: <span className="font-bold text-[#F2EAE1]">{order.shipping?.cost} PLN</span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
            <FiBox className="text-(--medium-shade)" /> Zamówione Produkty
          </h2>
          
          <div className="flex flex-col gap-4">
            {order.items?.map((item, idx) => {
              const imageName = item.image || item.img;
              const finalImageSrc = imageName?.includes('images/') 
                  ? (imageName.startsWith('/') ? imageName : `/${imageName}`)
                  : `images/tempProducts/${imageName}`;

              return (
                <div key={idx} className="flex items-center gap-4 bg-[#352A21] p-4 rounded-2xl border border-[#5C4A3D]">
                    <div className="w-16 h-16 bg-[#2D231C] rounded-xl overflow-hidden shrink-0 border border-[#5C4A3D]">
                    <img 
                        src={finalImageSrc} 
                        alt={item.name || item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    </div>
                    <div className="flex-1">
                    <p className="font-bold text-lg text-[#F2EAE1]">{item.name || item.title}</p>
                    <p className="text-sm text-[#F2EAE1]/60">Ilość: {item.quantity} x {item.price} PLN</p>
                    </div>
                    <div className="text-xl font-bold text-(--medium-shade)">
                    {(item.price * item.quantity).toFixed(2)} PLN
                    </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[#5C4A3D] flex justify-between items-end">
            <p className="text-lg text-[#F2EAE1]/70">Suma całkowita</p>
            <p className="text-3xl font-bold text-[#F2EAE1]">{order.total?.toFixed(2)} PLN</p>
          </div>
        </div>

      </div>
    </div>
  );
}