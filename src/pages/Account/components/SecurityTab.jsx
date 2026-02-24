import React, { useState } from "react";
import api from "src/services/api"; 
import { FaLock, FaExclamationTriangle, FaSpinner, FaCheck } from "react-icons/fa";

export default function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); 
    const [serverMessage, setServerMessage] = useState("");
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Bezpieczeństwo</h2>
            
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5 text-white">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-70 ml-1 font-bold">Obecne hasło</label>
                    <div className="relative">
                        {passwords.current === "" && (
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none transition-opacity duration-300" />
                        )}
                        <input 
                            type="password" 
                            required 
                            value={passwords.current} 
                            onChange={e => setPasswords({...passwords, current: e.target.value})} 
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pr-4 focus:outline-none focus:border-(--medium-shade) transition-all duration-300" 
                            style={{ paddingLeft: passwords.current === "" ? "2.8rem" : "1rem" }}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-70 ml-1 font-bold">Nowe hasło</label>
                    <div className="relative">
                        {passwords.new === "" && (
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none transition-opacity duration-300" />
                        )}
                        <input 
                            type="password" 
                            required 
                            value={passwords.new} 
                            onChange={e => setPasswords({...passwords, new: e.target.value})} 
                            className={`w-full bg-black/30 border rounded-xl py-3 pr-4 focus:outline-none transition-all duration-300 ${status === 'mismatch' ? 'border-red-500' : 'border-white/10 focus:border-(--medium-shade)'}`} 
                            style={{ paddingLeft: passwords.new === "" ? "2.8rem" : "1rem" }}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest opacity-70 ml-1 font-bold">Potwierdź nowe hasło</label>
                    <div className="relative">
                        {passwords.confirm === "" && (
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none transition-opacity duration-300" />
                        )}
                        <input 
                            type="password" 
                            required 
                            value={passwords.confirm} 
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                            className={`w-full bg-black/30 border rounded-xl py-3 pr-4 focus:outline-none transition-all duration-300 ${status === 'mismatch' ? 'border-red-500' : 'border-white/10 focus:border-(--medium-shade)'}`} 
                            style={{ paddingLeft: passwords.confirm === "" ? "2.8rem" : "1rem" }}
                        />
                    </div>
                </div>

                {(status === 'mismatch' || status === 'error') && (
                    <div className="text-red-400 text-sm font-bold flex items-center gap-2 mt-1 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in">
                        <FaExclamationTriangle /> {serverMessage}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="mt-4 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] py-3.5 px-6 rounded-xl font-bold shadow-[0_0_15px_rgba(143,120,93,0.3)] transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? <FaSpinner className="animate-spin" /> : "Zaktualizuj hasło"}
                </button>

                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg animate-in zoom-in-95">
                        <FaCheck /> Hasło zostało pomyślnie zmienione!
                    </div>
                )}
            </form>
        </div>
    );
}