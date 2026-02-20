import React, { useState, useEffect } from 'react';
import api from "services/api";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export default function StatusTab() {
    const [searchParams] = useSearchParams();
    
    const urlTrackingNumber = searchParams.get("track") || "";

    const [searchId, setSearchId] = useState(urlTrackingNumber);
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performSearch = async (trackingNumber) => {
        if (!trackingNumber) return;
        
        setLoading(true);
        setError(null);
        setTrackingResult(null);

        try {
            const res = await api.get(`orders/track/${trackingNumber.trim()}`);
            setTrackingResult(res);
        } catch (err) {
            setError("Nie znaleziono zamówienia o podanym numerze.");
        } finally {
            setLoading(false);
        }
    };

    // Obsługa ręcznego formularza
    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(searchId);
    };

    useEffect(() => {
        if (urlTrackingNumber) {
            performSearch(urlTrackingNumber);
        }
    }, [urlTrackingNumber]);

    const stepsTemplate = [
        { id: 'new', label: "Przyjęto" },
        { id: 'processing', label: "Spakowano" },
        { id: 'shipped', label: "Wysłano" },
        { id: 'completed', label: "Dostarczono" },
    ];

    const getTimestampForStep = (stepId) => {
        if (!trackingResult || !trackingResult.statusHistory) return null;
        const historyItem = trackingResult.statusHistory.find(h => h.status === stepId);
        if (historyItem) {
            const dateObj = new Date(historyItem.timestamp);
            return dateObj.toLocaleDateString('pl-PL') + ' ' + dateObj.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        }
        return null;
    };

    const currentStepIndex = trackingResult ? stepsTemplate.findIndex(s => s.id === trackingResult.status) : -1;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Śledzenie Zamówienia</h2>
            
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-inner">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input 
                        type="text" 
                        value={searchId} 
                        onChange={(e) => setSearchId(e.target.value)} 
                        placeholder="Numer przesyłki (np. SOM-A1B2C3)" 
                        className="flex-1 bg-black/20 border-b-2 border-white/10 py-3 px-4 focus:outline-none focus:border-(--medium-shade) transition-colors text-lg text-white uppercase" 
                    />
                    <button type="submit" disabled={loading} className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-8 py-3 rounded-xl font-bold transition-all cursor-pointer flex justify-center items-center disabled:opacity-50">
                        {loading ? <FaSpinner className="animate-spin" /> : "Sprawdź status"}
                    </button>
                </form>
                
                {error && <p className="text-red-400 font-bold mb-6">{error}</p>}

                {trackingResult && trackingResult.status !== 'cancelled' && (
                    <div className="animate-in zoom-in-95 duration-300 mt-10">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-sm opacity-50 uppercase tracking-widest">Numer Przesyłki</p>
                                <p className="text-2xl font-bold text-(--medium-shade)">{trackingResult.trackingNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-50 uppercase tracking-widest">Szacowana dostawa</p>
                                <p className="text-lg font-medium">{trackingResult.estimatedDelivery}</p>
                            </div>
                        </div>

                        <div className="relative mt-12 mb-8 px-4 sm:px-10">
                            <div className="absolute top-4 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-4 left-0 h-1 bg-(--medium-shade) -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${(Math.max(0, currentStepIndex) / (stepsTemplate.length - 1)) * 100}%` }}></div>
                            
                            <div className="relative flex justify-between">
                                {stepsTemplate.map((step, index) => {
                                    const timestamp = getTimestampForStep(step.id);
                                    const isReached = index <= currentStepIndex;

                                    return (
                                        <div key={index} className="flex flex-col items-center gap-3 relative -top-4 w-1/4">
                                            <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500 ${isReached ? "bg-(--medium-shade) border-(--medium-shade) shadow-[0_0_15px_rgba(143,120,93,0.6)]" : "bg-[#24201d] border-white/20"}`}></div>
                                            <div className={`text-center transition-opacity duration-500 ${isReached ? "opacity-100" : "opacity-30"}`}>
                                                <p className="text-sm font-bold whitespace-nowrap">{step.label}</p>
                                                <p className="text-[10px] sm:text-xs font-mono text-(--medium-shade) mt-1">{timestamp || '--:--'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {trackingResult && trackingResult.status === 'cancelled' && (
                     <div className="animate-in fade-in p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center mt-8">
                         <p className="text-red-400 font-bold text-xl mb-2">Zamówienie zostało anulowane</p>
                         <p className="text-sm opacity-70">Skontaktuj się ze sklepem, jeśli to pomyłka.</p>
                     </div>
                )}
            </div>
        </div>
    );
}