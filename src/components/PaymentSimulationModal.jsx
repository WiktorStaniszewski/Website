import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCreditCard, FiX, FiCheck } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import api from 'services/api';

export default function PaymentSimulationModal({ isOpen, onClose, orderId, onSuccess }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (inputValue.toUpperCase() !== 'TAK') {
      setError('Wpisz słowo TAK, aby zatwierdzić płatność.');
      return;
    }

    setLoading(true);
    try {
      await api.post('integrations/p24/webhook', {
        orderId: orderId,
        sessionId: 'test_session_123',
        sign: 'test_sign'
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Błąd serwera. Nie udało się zasymulować wpłaty.');
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#24201d] w-full max-w-md rounded-3xl border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] p-8 flex flex-col animate-in zoom-in-95">
        
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3 text-green-400">
                <div className="p-3 bg-green-500/20 rounded-xl">
                    <FiCreditCard size={24} />
                </div>
                <h2 className="text-xl font-bold font-serif">Symulacja Bramki P24</h2>
            </div>
            <button onClick={onClose} disabled={loading} className="text-white/50 hover:text-white transition-colors disabled:opacity-50 cursor-pointer">
                <FiX size={24} />
            </button>
        </div>

        <p className="text-sm text-white/70 mb-6 leading-relaxed">
            Ten komunikat wyświetla się tylko w trybie testowym. <br/><br/>
            Twoje zamówienie zostało poprawnie zapisane i ma status <span className="font-bold text-(--medium-shade)">Oczekujące na płatność</span>. Logistyka go jeszcze nie widzi.<br/><br/>
            Aby zasymulować udany przelew i uruchomić webhook P24, wpisz słowo <span className="font-bold text-green-400">TAK</span> poniżej.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Wpisz TAK..."
            disabled={loading}
            autoFocus
            className={`w-full bg-black/40 border p-4 rounded-xl text-white outline-none focus:border-green-400 transition-colors uppercase font-bold text-center tracking-widest ${error ? 'border-red-500/50' : 'border-white/10'}`}
          />
          
          {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading || !inputValue}
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:scale-100 hover:scale-105"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <><FiCheck /> Potwierdź wpłatę</>}
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full text-xs text-white/40 hover:text-white/70 mt-2 font-bold cursor-pointer"
          >
            Zamknij (zostaw jako nieopłacone)
          </button>
        </form>

      </div>
    </div>,
    document.body
  );
}
