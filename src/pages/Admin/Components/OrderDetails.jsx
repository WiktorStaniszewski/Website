import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiArrowLeft, FiUser, FiTruck, FiBox, FiCheckCircle, FiLink, FiDownload } from "react-icons/fi";
import PasswordPromptModal from "src/components/PasswordPromptModal";
import SomniumSelect from "components/ui/SomniumSelect";
import AdminPageLayout from "./AdminPageLayout";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const[statusMessage, setStatusMessage] = useState(null);
  
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const statusWeights = { 'pending_payment': -1, 'new': 0, 'processing': 1, 'shipped': 2, 'completed': 3, 'cancelled': 99 };
  const isTerminalState = order?.status === 'completed' || order?.status === 'cancelled';
  const isPendingPayment = order?.status === 'pending_payment';

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
    
    if (newStatus === 'cancelled') {
        setPendingStatus(newStatus);
        setPasswordModalOpen(true);
        return;
    }

    await executeStatusUpdate(newStatus);
  };

  const executeStatusUpdate = async (newStatus) => {
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
      setPendingStatus(null);
    }
  };

  const handlePasswordSubmit = async (password) => {
      await api.post('auth/verify-password', { password });
      setPasswordModalOpen(false);
      await executeStatusUpdate(pendingStatus);
  };

  const isOptionDisabled = (val) => {
      if (val === order?.status) return false;
      if (isTerminalState) return true;
      if (val === 'cancelled') return false;
      
      const currentWeight = statusWeights[order?.status];
      const targetWeight = statusWeights[val];
      
      return targetWeight !== currentWeight + 1;
  };

  const getOptionClass = (val) => {
      return isOptionDisabled(val) ? "text-[#F2EAE1]/30 bg-[#2D231C] italic" : "text-[#F2EAE1] bg-[#46382E]";
  };

  if (loading) return <div className="text-(--medium-shade) text-center mt-20 font-bold">Ładowanie szczegółów zamówienia...</div>;
  if (!order) return <div className="text-red-400 text-center mt-20">Nie znaleziono zamówienia.</div>;

  return (
    <AdminPageLayout
        title={`Zamówienie ${order.trackingNumber || `#${order.id}`}`}
        subtitle={`Złożone: ${order.date}`}
        actions={
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={() => navigate('/admin/orders')}
                    className="p-3 bg-[#46382E] border border-[#5C4A3D] hover:bg-[#5C4A3D] rounded-xl transition-colors cursor-pointer text-[#F2EAE1] flex items-center justify-center gap-2 font-bold"
                >
                    <FiArrowLeft size={20} /> <span className="md:hidden">Wróć</span>
                </button>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {statusMessage && (
                        <span className={`text-xs font-bold flex items-center gap-1 animate-in fade-in ${statusMessage.includes('Błąd') ? 'text-red-400' : 'text-green-400'}`}>
                            <FiCheckCircle /> {statusMessage}
                        </span>
                    )}
                    
                    <SomniumSelect 
                        className="flex-1 md:min-w-[200px]"
                        value={order.status}
                        onChange={(val) => handleStatusChange({ target: { value: val } })}
                        disabled={updatingStatus || isTerminalState || isPendingPayment}
                        options={[
                            { label: "Oczekuje na płatność", value: "pending_payment", disabled: true },
                            { label: "Nowe (Przyjęte)", value: "new", disabled: isOptionDisabled('new') },
                            { label: "W realizacji (Spakowane)", value: "processing", disabled: isOptionDisabled('processing') },
                            { label: "Wysłane", value: "shipped", disabled: isOptionDisabled('shipped') },
                            { label: "Dostarczone", value: "completed", disabled: isOptionDisabled('completed') },
                            { label: "Anulowane", value: "cancelled", disabled: isOptionDisabled('cancelled') }
                        ].filter(opt => opt.value !== 'pending_payment' || order.status === 'pending_payment')}
                    />
                </div>
            </div>
        }
    >
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
              <p className="font-bold text-[#F2EAE1] text-base">
                {order.shipping?.method === 'pickup' 
                  ? `Odbiór: ${order.Location?.name || 'Nieznana placówka'}` 
                  : (order.shipping?.details?.label || order.shipping?.method)}
              </p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.zip} {order.customer?.city}</p>
              {order.shipping?.pointId && (
                  <p className="mt-2 text-(--medium-shade) font-bold bg-(--medium-shade)/10 px-3 py-1 rounded-lg inline-block text-xs border border-(--medium-shade)/20 uppercase tracking-widest">
                      ID Punktu: {order.shipping.pointId}
                  </p>
              )}
              <p className="mt-4 pt-4 border-t border-[#5C4A3D]">
                Koszt: <span className="font-bold text-[#F2EAE1]">{order.shipping?.cost} PLN</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sekcja Integracji */}
        {order.integrations && (order.integrations.shipping || order.integrations.payment) && (
            <div className="lg:col-span-1 bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
                  <FiLink className="text-(--medium-shade)" /> Integracje Zewnętrzne
                </h2>
                <div className="space-y-4 text-sm text-[#F2EAE1]/80">
                  {order.integrations.shipping?.trackingNumber && (
                      <div className="bg-[#352A21] p-3 rounded-xl border border-[#5C4A3D]">
                          <p className="text-xs uppercase tracking-widest text-[#F2EAE1]/50 mb-1">InPost / Kurier</p>
                          <p className="font-mono text-[#F2EAE1] mb-2">{order.integrations.shipping.trackingNumber}</p>
                          {order.integrations.shipping.labelUrl && (
                              <a href={order.integrations.shipping.labelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-(--medium-shade) hover:text-white transition-colors">
                                  <FiDownload /> Pobierz etykietę PDF
                              </a>
                          )}
                      </div>
                  )}
                  {order.integrations.payment?.transactionId && (
                      <div className="bg-[#352A21] p-3 rounded-xl border border-[#5C4A3D]">
                          <p className="text-xs uppercase tracking-widest text-[#F2EAE1]/50 mb-1">Przelewy24 / Płatność</p>
                          <p className="font-mono text-[#F2EAE1] text-xs break-all">{order.integrations.payment.transactionId}</p>
                      </div>
                  )}
                </div>
            </div>
        )}

        {/* FEEDBACK SECTION */}
        {order.feedback && (
            <div className={`lg:col-span-1 border p-6 rounded-3xl shadow-lg relative overflow-hidden animate-in zoom-in-95 bg-[#46382E]
                ${order.feedback.everythingOk ? 'border-green-500/30' : 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none ${order.feedback.everythingOk ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
                  <FiCheckCircle className={order.feedback.everythingOk ? 'text-green-400' : 'text-red-400'} /> 
                  Opinia Klienta
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${order.feedback.everythingOk ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {order.feedback.everythingOk ? 'Wszystko OK' : 'Zgłoszono uwagi'}
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                            {new Date(order.feedback.submittedAt).toLocaleString('pl-PL')}
                        </span>
                    </div>
                    {order.feedback.comment && (
                        <div className={`p-4 bg-black/20 rounded-2xl border italic text-sm text-white/80 ${order.feedback.everythingOk ? 'border-white/5' : 'border-red-500/20 text-red-100/70'}`}>
                            "{order.feedback.comment}"
                        </div>
                    )}
                </div>
            </div>
        )}

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

      <PasswordPromptModal 
          isOpen={passwordModalOpen} 
          onClose={() => { setPasswordModalOpen(false); setPendingStatus(null); }} 
          onSubmit={handlePasswordSubmit}
          title="Anulowanie zamówienia"
          description="Podaj hasło administratora, aby potwierdzić anulowanie zamówienia."
      />
    </AdminPageLayout>
  );
}