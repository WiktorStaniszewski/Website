import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiCopy, FiBox, FiArrowRight } from "react-icons/fi";
import { useState } from "react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const trackingNumber = location.state?.trackingNumber;

  const copyToClipboard = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 flex items-center justify-center relative overflow-hidden text-(--font-color)">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--medium-shade)/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-2xl bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center animate-in zoom-in-95 duration-700">
        
        <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiCheckCircle className="text-5xl text-green-400" />
        </div>

        <h1 className="text-4xl font-serif font-bold text-white mb-4">Dziękujemy za zamówienie!</h1>
        <p className="text-lg opacity-70 mb-10 max-w-md mx-auto">
          Twoje zamówienie zostało pomyślnie przyjęte do realizacji. Powiadomimy Cię e-mailem, gdy wyruszy w drogę.
        </p>

        {/* Sekcja Numeru Śledzenia */}
        {trackingNumber && (
            <div className="bg-black/30 border border-white/5 rounded-3xl p-8 mb-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-(--medium-shade)"></div>
                <p className="text-sm opacity-60 uppercase tracking-widest font-bold mb-2">Twój numer przesyłki</p>
                
                <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl md:text-4xl font-mono font-bold text-(--medium-shade) tracking-wider">
                        {trackingNumber}
                    </span>
                    <button 
                        onClick={copyToClipboard}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-white/80 hover:text-white"
                        title="Kopiuj do schowka"
                    >
                        {copied ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
                    </button>
                </div>
                {copied && <p className="text-green-400 text-xs mt-2 font-bold absolute bottom-3 w-full text-center left-0">Skopiowano!</p>}
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => navigate(trackingNumber ? `/account?tab=status&track=${trackingNumber}` : '/account?tab=status')}
                className="py-4 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
                <FiBox /> Śledź zamówienie
            </button>
            <button 
                onClick={() => navigate('/shop')}
                className="py-4 px-8 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(143,120,93,0.3)] hover:shadow-[0_0_30px_rgba(143,120,93,0.5)] cursor-pointer"
            >
                Wróć do sklepu <FiArrowRight />
            </button>
        </div>

      </div>
    </div>
  );
}