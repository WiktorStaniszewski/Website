import { createPortal } from "react-dom";
import { FiAlertCircle, FiX } from "react-icons/fi";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, confirmText = "Potwierdź", cancelText = "Anuluj" }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#24201d] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <FiAlertCircle size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{title || "Potwierdź operację"}</h3>
                <p className="text-white/60 mb-6 leading-relaxed text-sm">
                    {description}
                </p>

                <div className="flex gap-3 w-full mt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                        {cancelText}
                    </button>
                    <button type="button" onClick={onConfirm} className="flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg bg-[var(--medium-shade)] hover:brightness-110 text-[#24201d]">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
