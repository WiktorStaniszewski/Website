import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiX, FiLock } from "react-icons/fi";

export default function PasswordPromptModal({ isOpen, onClose, onSubmit, title, description }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setPassword("");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!password) {
            setError("Hasło jest wymagane");
            return;
        }

        try {
            await onSubmit(password);
        } catch (err) {
            setError("Nieprawidłowe hasło admina!");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#24201d] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-500/10 text-red-400 border border-red-500/20">
                    <FiLock size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{title || "Autoryzacja operacji"}</h3>
                <p className="text-white/60 mb-6 leading-relaxed text-sm">
                    {description || "Wprowadź hasło administratora, aby potwierdzić tę akcję."}
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="w-full text-left">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Hasło admina"
                            autoFocus
                            className={`w-full bg-[#2D231C] border ${error ? 'border-red-500/50' : 'border-[#5C4A3D]'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--medium-shade)] transition-colors placeholder-white/30`}
                        />
                        {error && <span className="text-red-400 text-xs font-bold mt-1 inline-block">{error}</span>}
                    </div>

                    <div className="flex gap-3 w-full mt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                            Anuluj
                        </button>
                        <button type="submit" className="flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg bg-[var(--medium-shade)] hover:brightness-110 text-[#24201d]">
                            Potwierdź
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
