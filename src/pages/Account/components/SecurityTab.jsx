import React, { useState } from "react";
import api from "src/services/api"; 
import { FaLock, FaExclamationTriangle, FaSpinner, FaCheck, FaKey } from "react-icons/fa";

export default function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); 
    const [serverMessage, setServerMessage] = useState("");
    const[passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (passwords.new !== passwords.confirm) {
            setStatus('mismatch');
            setServerMessage("Nowe hasło i potwierdzenie nie są identyczne!");
            return;
        }

        if (passwords.new.length < 6) {
            setStatus('error');
            setServerMessage("Nowe hasło musi mieć co najmniej 6 znaków.");
            return;
        }

        setIsLoading(true);
        setStatus(null);
        setServerMessage("");
        
        try {
            await api.put('users/profile/password', undefined, {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            
            setStatus('success');
            setPasswords({ current: "", new: "", confirm: "" });
            setTimeout(() => setStatus(null), 5000);
        } catch (error) {
            setStatus('error');
            setServerMessage(error.response?.data?.message || "Wystąpił błąd podczas zmiany hasła.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full bg-[#1a1715] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-(--medium-shade) focus:ring-1 focus:ring-(--medium-shade)/50 transition-all duration-300";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg">
            <div className="mb-10 pb-6 border-b border-white/5">
                <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Ustawienia</span>
                <h2 className="text-4xl font-serif font-bold text-white mt-2">Bezpieczeństwo</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6">
                <div className="space-y-2 relative group">
                    <label className="text-xs uppercase tracking-widest text-(--medium-shade) ml-1 font-bold">Obecne hasło</label>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-(--medium-shade) transition-colors duration-300" />
                        <input 
                            type="password" 
                            required 
                            placeholder="Wpisz obecne hasło"
                            value={passwords.current} 
                            onChange={e => setPasswords({...passwords, current: e.target.value})} 
                            className={inputClass} 
                        />
                    </div>
                </div>
                
                <div className="space-y-2 relative group">
                    <label className="text-xs uppercase tracking-widest text-(--medium-shade) ml-1 font-bold">Nowe hasło</label>
                    <div className="relative">
                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-(--medium-shade) transition-colors duration-300" />
                        <input 
                            type="password" 
                            required 
                            placeholder="Minimum 6 znaków"
                            value={passwords.new} 
                            onChange={e => setPasswords({...passwords, new: e.target.value})} 
                            className={`${inputClass} ${status === 'mismatch' ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : ''}`} 
                        />
                    </div>
                </div>
                
                <div className="space-y-2 relative group">
                    <label className="text-xs uppercase tracking-widest text-(--medium-shade) ml-1 font-bold">Potwierdź nowe hasło</label>
                    <div className="relative">
                        <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-(--medium-shade) transition-colors duration-300" />
                        <input 
                            type="password" 
                            required 
                            placeholder="Powtórz nowe hasło"
                            value={passwords.confirm} 
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                            className={`${inputClass} ${status === 'mismatch' ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : ''}`} 
                        />
                    </div>
                </div>

                {(status === 'mismatch' || status === 'error') && (
                    <div className="text-red-400 text-sm font-bold flex items-center gap-3 mt-2 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in">
                        <FaExclamationTriangle className="text-lg shrink-0" /> {serverMessage}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="mt-6 bg-(--medium-shade) hover:brightness-110 text-[#1a1715] py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(143,120,93,0.2)] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
                >
                    {isLoading ? <FaSpinner className="animate-spin text-xl" /> : "Zaktualizuj hasło"}
                </button>

                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold shadow-lg animate-in zoom-in-95 mt-2">
                        <FaCheck className="text-lg shrink-0" /> Hasło zostało pomyślnie zmienione!
                    </div>
                )}
            </form>
        </div>
    );
}