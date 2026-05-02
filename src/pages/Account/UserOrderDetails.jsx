import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api";
import { getProductImageUrl } from 'src/utils/imageHelpers';
import { FaArrowLeft, FaBox, FaTruck, FaMapMarkerAlt, FaSearchLocation, FaUser, FaCoffee, FaCreditCard, FaSpinner } from "react-icons/fa";
import PaymentSimulationModal from "src/components/PaymentSimulationModal";
import ConfirmModal from "src/components/ConfirmModal";


export default function UserOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  const [feedback, setFeedback] = useState({ comment: "", everythingOk: true });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!order?.feedback);

  const executeCancelOrder = async () => {
    setCancelModalOpen(false);
    setCancelling(true);
    try {
      await api.put(`orders/${order.id}/cancel`);
      setOrder({ ...order, status: 'cancelled' });
    } catch (e) {
      alert(e.message || "Błąd podczas anulowania zamówienia");
    } finally {
      setCancelling(false);
    }
  };

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

  useEffect(() => {
    if (order?.feedback) {
        setFeedbackSubmitted(true);
    }
  }, [order]);

  const handleFeedbackSubmit = async (e) => {
      e.preventDefault();
      setSubmittingFeedback(true);
      try {
          const res = await api.put(`orders/${order.id}/feedback`, null, feedback);
          setOrder(res.order);
          setFeedbackSubmitted(true);
      } catch (err) {
          alert(err.message || "Błąd podczas przesyłania opinii");
      } finally {
          setSubmittingFeedback(false);
      }
  };

  const canLeaveFeedback = () => {
    if (order?.status !== 'completed') return false;
    if (order?.feedback) return false;
    
    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    const completedHistory = history.find(h => h.status === 'completed');
    if (!completedHistory) return false;
    
    const completedDate = new Date(completedHistory.timestamp);
    const diffDays = (new Date() - completedDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  if (loading) return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center text-(--medium-shade) font-serif text-2xl gap-4">
          <FaCoffee className="animate-bounce text-4xl" />
          <p className="animate-pulse">Parzenie szczegółów zamówienia...</p>
      </div>
  );

  if (!order) return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center gap-6 text-red-400 bg-[#1a1715]/50">
          <FaBox className="text-7xl opacity-30" />
          <p className="text-2xl font-serif font-bold">Nie znaleziono zamówienia</p>
          <button onClick={() => navigate('/account?tab=history')} className="px-8 py-3 bg-[#24201d]/70 border border-white/10 hover:border-white/30 text-white rounded-2xl transition-all cursor-pointer">Wróć do historii</button>
      </div>
  );

  const isPickup = order.shipping?.method === 'pickup' || order.locationId !== null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 text-(--font-color) bg-[#1a1715]/50/5">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="flex items-start md:items-center gap-5 min-w-0">
              <button 
                onClick={() => navigate('/account?tab=history')}
                className="p-4 bg-[#24201d]/70 border border-white/5 hover:border-(--medium-shade)/50 rounded-2xl transition-all cursor-pointer text-(--medium-shade) shrink-0 mt-1 md:mt-0 shadow-lg hover:shadow-[0_0_15px_rgba(143,120,93,0.2)]"
              >
                <FaArrowLeft />
              </button>
              <div className="min-w-0 flex-1">
                <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold mb-1 block">Podsumowanie</span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide wrap-break-word">
                    Zamówienie <span className="text-white/80">{order.trackingNumber || `#${order.id}`}</span>
                </h1>
                <p className="text-sm text-white/50 font-mono mt-2 flex items-center gap-2">
                    Złożono: <span className="bg-[#24201d]/70 px-2 py-1 rounded-md">{order.date}</span>
                </p>
              </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 pl-16 md:pl-0">
              <span className="text-xs uppercase tracking-widest opacity-50">Status</span>
              <span className={`px-5 py-2.5 bg-[#24201d]/70 border rounded-xl text-sm font-bold uppercase tracking-wider text-center shadow-lg
                  ${order.status === 'completed' ? 'border-green-500/50 text-green-400' : 
                    order.status === 'cancelled' ? 'border-red-500/50 text-red-400' :
                    'border-(--medium-shade)/50 text-(--medium-shade)'}`}
              >
                {order.status}
              </span>
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        {order.status === 'completed' && (
            <div className={`bg-[#24201d]/70 border ${feedbackSubmitted ? 'border-green-500/30' : 'border-(--medium-shade)/50'} rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all duration-500`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${feedbackSubmitted ? 'bg-green-500' : 'bg-(--medium-shade)'} rounded-full opacity-5 blur-3xl pointer-events-none`}></div>
                
                {feedbackSubmitted ? (
                    <div className="text-center py-4 animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                            <FaCoffee size={24} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Dziękujemy za Twoją opinię!</h3>
                        <p className="text-white/60">Twoje potwierdzenie pomaga nam dbać o najwyższą jakość dostaw Somnium.</p>
                        {order.feedback?.comment && (
                            <div className="mt-6 p-4 bg-black/20 rounded-2xl italic text-sm text-white/80 max-w-lg mx-auto border border-white/5">
                                "{order.feedback.comment}"
                            </div>
                        )}
                    </div>
                ) : canLeaveFeedback() ? (
                    <form onSubmit={handleFeedbackSubmit} className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-1">Dostawa zakończona!</h3>
                                <p className="text-sm text-white/50">Potwierdź czy wszystko dotarło zgodnie z oczekiwaniami.</p>
                            </div>
                            <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
                                <button 
                                    type="button"
                                    onClick={() => setFeedback({ ...feedback, everythingOk: true })}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${feedback.everythingOk ? 'bg-green-500 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    Wszystko OK
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFeedback({ ...feedback, everythingOk: false })}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${!feedback.everythingOk ? 'bg-red-500 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    Są uwagi
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Komentarz (opcjonalnie)</label>
                            <textarea 
                                value={feedback.comment}
                                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                placeholder="Podziel się swoimi wrażeniami z tej dostawy..."
                                className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-(--medium-shade) transition-all resize-none min-h-[120px] placeholder:text-white/10"
                            />
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                type="submit"
                                disabled={submittingFeedback}
                                className="bg-(--medium-shade) hover:brightness-110 text-[#1a1715] px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-3"
                            >
                                {submittingFeedback ? <FaSpinner className="animate-spin" /> : 'Prześlij opinię'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4 opacity-50 italic">
                        Czas na przesłanie opinii (3 dni) wygasł.
                    </div>
                )}
            </div>
        )}

        {/* TRACKING BANNER (Only if not completed or just completed) */}
        {order.status !== 'cancelled' && order.status !== 'completed' && (
            <div className="bg-linear-to-r from-[#24201d]/70 to-[#1a1715]/70 border border-(--medium-shade)/30 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--medium-shade) rounded-full opacity-10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 text-center sm:text-left">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Gdzie jest moja kawa?</h3>
                    <p className="text-sm text-white/70 font-light">Sprawdź na jakim etapie realizacji jest Twoje zamówienie.</p>
                </div>
                <button 
                    onClick={() => navigate(`/account?tab=status&track=${order.trackingNumber}`)}
                    className="relative z-10 w-full sm:w-auto px-8 py-4 bg-(--medium-shade) hover:brightness-110 text-[#1a1715] font-bold uppercase tracking-widest text-sm rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(143,120,93,0.3)] shrink-0 hover:-translate-y-0.5"
                >
                    <FaSearchLocation size={18} />
                    Śledź paczkę
                </button>
            </div>
        )}

        {/* PŁATNOŚĆ P24 */}
        {order.status === 'pending_payment' && (
            <div className="bg-[#24201d]/70 border border-green-500/50 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-[0_10px_40px_rgba(34,197,94,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
                <div className="relative z-10 text-center sm:text-left">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Opłać zamówienie</h3>
                    <p className="text-sm text-white/70 font-light">To zamówienie czeka na płatność. Opłać je, byśmy mogli zacząć realizację.</p>
                </div>
                <button 
                    onClick={() => setSimulationModalOpen(true)}
                    className="relative z-10 w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                    <FaCreditCard size={18} />
                    Opłać przez Przelewy24
                </button>
                <button 
                    onClick={() => setCancelModalOpen(true)}
                    disabled={cancelling}
                    className="relative z-10 w-full sm:w-auto px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold uppercase tracking-widest text-sm rounded-2xl transition-all flex items-center justify-center gap-3 border border-red-500/30 disabled:opacity-50 cursor-pointer"
                >
                    {cancelling ? 'Anulowanie...' : 'Anuluj zamówienie'}
                </button>
            </div>
        )}

        {/* DANE LOGISTYCZNE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#24201d]/70 border border-white/5 p-8 rounded-3xl shadow-xl">
            <h2 className="text-lg uppercase tracking-widest text-(--medium-shade) font-bold mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-(--medium-shade)/10 rounded-lg">
                  {isPickup ? <FaMapMarkerAlt /> : <FaTruck />}
              </div>
              {isPickup ? 'Punkt odbioru' : 'Sposób dostawy'}
            </h2>
            <div className="space-y-2 font-light">
              <p className="font-serif text-2xl text-white mb-3">
                 {isPickup ? `Somnium Roastery` : (order.shipping?.method === 'paczkomat' ? 'Paczkomat InPost' : order.shipping?.details?.label || order.shipping?.method)}
              </p>
              {isPickup && <p className="text-white/60 text-sm">ul. Przykładowa 12, Kraków</p>}
              {!isPickup && order.shipping?.pointId && (
                  <p className="text-(--medium-shade) font-bold bg-(--medium-shade)/10 px-3 py-1 rounded-lg inline-block text-sm border border-(--medium-shade)/20">
                      ID Punktu: {order.shipping.pointId}
                  </p>
              )}
              <div className="block mt-2 px-3 py-1 bg-[#1a1715]/50 rounded-lg border border-white/5 text-sm w-fit">
                  Koszt dostawy: <span className="font-bold text-white ml-1">{order.shipping?.cost === 0 ? 'Gratis' : `${order.shipping?.cost} PLN`}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#24201d]/70 border border-white/5 p-8 rounded-3xl shadow-xl">
            <h2 className="text-lg uppercase tracking-widest text-(--medium-shade) font-bold mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-(--medium-shade)/10 rounded-lg">
                  {isPickup ? <FaUser /> : <FaMapMarkerAlt />}
              </div>
              {isPickup ? 'Dane odbierającego' : 'Adres wysyłki'}
            </h2>
            <div className="space-y-1.5 font-light text-white/80">
              <p className="font-bold text-white text-lg mb-2">{order.customer?.firstName}</p>
              {!isPickup && <p>{order.customer?.address}</p>}
              {!isPickup && <p>{order.customer?.zip} {order.customer?.city}</p>}
              <p className="mt-3 pt-3 border-t border-white/5 inline-block">{order.customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* PRODUKTY */}
        <div className="bg-[#24201d]/70 border border-white/5 p-8 rounded-3xl shadow-xl">
          <h2 className="text-lg uppercase tracking-widest text-(--medium-shade) font-bold mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-(--medium-shade)/10 rounded-lg">
                <FaBox />
            </div>
            Zawartość zamówienia
          </h2>
          
          <div className="flex flex-col gap-5">
            {order.items?.map((item, idx) => {
               const finalImageSrc = getProductImageUrl(item.image || item.img);

               return (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-[#1a1715]/50 p-5 rounded-2xl border border-white/5 hover:border-(--medium-shade)/30 transition-colors group">
                    <div className="w-20 h-20 bg-black/40 rounded-xl overflow-hidden shrink-0 border border-white/5 p-2">
                        <img 
                            src={finalImageSrc} 
                            alt={item.name || item.title} 
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                        <p className="font-serif font-bold text-xl text-white mb-1 truncate">{item.name || item.title}</p>
                        <p className="text-sm text-(--medium-shade) font-bold uppercase tracking-widest bg-(--medium-shade)/10 inline-block px-2 py-1 rounded-md">
                            Ilość: {item.quantity}
                        </p>
                        <p className="text-sm text-white/50 mt-2 block sm:hidden">{item.price} PLN / szt.</p>
                    </div>
                    <div className="text-right shrink-0 w-full sm:w-auto flex sm:block justify-between items-center border-t border-white/5 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                        <p className="text-sm text-white/50 hidden sm:block mb-1">{item.price} PLN / szt.</p>
                        <span className="sm:hidden text-xs uppercase text-white/50 tracking-widest">Suma:</span>
                        <div className="text-2xl font-bold text-white">
                            {(item.price * item.quantity).toFixed(2)} <span className="text-sm font-normal text-(--medium-shade)">PLN</span>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 bg-[#1a1715]/50 p-6 rounded-2xl">
            <p className="text-sm uppercase tracking-widest text-white/50 font-bold">Razem do zapłaty</p>
            <p className="text-4xl font-serif font-bold text-(--medium-shade) drop-shadow-lg">
                {order.total?.toFixed(2)} <span className="text-xl font-normal text-white">PLN</span>
            </p>
          </div>
        </div>

      </div>

      <PaymentSimulationModal 
          isOpen={simulationModalOpen}
          orderId={order.id}
          onClose={() => setSimulationModalOpen(false)}
          onSuccess={() => {
              setSimulationModalOpen(false);
              setOrder({ ...order, status: 'new' });
          }}
      />
      <ConfirmModal 
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={executeCancelOrder}
          title="Anulować zamówienie?"
          description="Ta operacja jest nieodwracalna. Twoja rezerwacja produktów zostanie zwolniona."
          confirmText="Tak, anuluj"
          cancelText="Wróć"
      />
    </div>
  );
}