import React, { useState, useEffect } from 'react';
import api from "src/services/api";
import { FaSpinner, FaSearch, FaBoxOpen } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export default function StatusTab() {
    const [searchParams] = useSearchParams();
    const urlTrackingNumber = searchParams.get("track") || "";

    const [searchId, setSearchId] = useState(urlTrackingNumber);
    const[trackingResult, setTrackingResult] = useState(null);
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

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(searchId);
    };

    useEffect(() => {
        if (urlTrackingNumber) {
            performSearch(urlTrackingNumber);
        }
    },[urlTrackingNumber]);

    const isPickup = trackingResult?.isPickup;

    const stepsTemplate = isPickup 
        ?[
            { id: 'new', label: "Przyjęto" },
            { id: 'processing', label: "W przygotowaniu" },
            { id: 'shipped', label: "Gotowe na miejscu" },
            { id: 'completed', label: "Odebrano" },
          ]
        :[
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
    const progressPercent = trackingResult ? (Math.max(0, currentStepIndex) / (stepsTemplate.length - 1)) * 100 : 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 pb-6 border-b border-white/5">
                <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Logistyka</span>
                <h2 className="text-4xl font-serif font-bold text-white mt-2">Śledzenie Zamówienia</h2>
            </div>
            
            <div className="bg-[#1a1715]/60 p-6 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--medium-shade) rounded-full opacity-5 blur-3xl pointer-events-none"></div>
                
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                        <input 
                            type="text" 
                            value={searchId} 
                            onChange={(e) => setSearchId(e.target.value)} 
                            placeholder="Wpisz numer przesyłki (np. SOM-A1B2C3)" 
                            className="w-full bg-[#24201d] border border-white/10 py-4 pl-14 pr-6 rounded-2xl focus:outline-none focus:border-(--medium-shade) focus:ring-1 focus:ring-(--medium-shade)/50 transition-all text-lg text-white uppercase tracking-widest" 
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-(--medium-shade) hover:brightness-110 text-[#1a1715] px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer flex justify-center items-center disabled:opacity-50 hover:-translate-y-0.5">
                        {loading ? <FaSpinner className="animate-spin text-xl" /> : "Szukaj"}
                    </button>
                </form>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg mt-4 animate-in fade-in">
                        {error}
                    </div>
                )}

                {!trackingResult && !loading && !error && (
                    <div className="flex flex-col items-center justify-center opacity-40 py-10">
                        <FaBoxOpen className="text-5xl mb-4 text-(--medium-shade)" />
                        <p className="font-serif">Wprowadź numer zamówienia, aby sprawdzić jego status.</p>
                    </div>
                )}

                {trackingResult && trackingResult.status !== 'cancelled' && (
                    <div className="animate-in zoom-in-95 duration-500 mt-12 bg-[#24201d]/50 p-8 rounded-3xl border border-white/5 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-6 border-b border-white/5 pb-8">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-(--medium-shade) font-bold mb-1">Numer Przesyłki</p>
                                <p className="text-3xl font-serif font-bold text-white tracking-wider">{trackingResult.trackingNumber}</p>
                            </div>
                            <div className="sm:text-right bg-[#1a1715]/60 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-1">
                                    {isPickup ? 'Gotowość do odbioru' : 'Szacowana dostawa'}
                                </p>
                                <p className="text-xl font-bold text-white">{trackingResult.estimatedDelivery}</p>
                            </div>
                        </div>

                        <div className="relative mt-12 mb-4 px-4 sm:px-12">
                            {/* Ścieżka tła */}
                            <div className="hidden sm:block absolute top-5 left-0 w-full h-1.5 bg-[#1a1715] -translate-y-1/2 rounded-full z-0 border border-white/5"></div>
                            {/* Ścieżka wypełniona */}
                            <div className="hidden sm:block absolute top-5 left-0 h-1.5 bg-linear-to-r from-(--medium-shade) to-[#d4a373] -translate-y-1/2 rounded-full transition-all duration-1000 z-0 shadow-[0_0_15px_rgba(143,120,93,0.5)]" style={{ width: `${progressPercent}%` }}></div>

                            {/* Wersja mobilna ścieżki */}
                            <div className="sm:hidden absolute top-4 bottom-[30px] left-[23px] w-1.5 bg-[#1a1715] border border-white/5 rounded-full z-0"></div>
                            <div className="sm:hidden absolute top-4 left-[23px] w-1.5 bg-linear-to-b from-(--medium-shade) to-[#d4a373] rounded-full transition-all duration-1000 z-0 shadow-[0_0_15px_rgba(143,120,93,0.5)]" style={{ height: `${progressPercent}%` }}></div>
                            
                            <div className="relative flex flex-col sm:flex-row justify-between gap-12 sm:gap-0">
                                {stepsTemplate.map((step, index) => {
                                    const timestamp = getTimestampForStep(step.id);
                                    const isReached = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={index} className="flex flex-row sm:flex-col items-start sm:items-center gap-6 sm:gap-4 relative z-10 sm:-top-5 sm:w-1/4 group">
                                            {/* Kropki na osi czasu */}
                                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-500 relative mt-1 sm:mt-0 
                                                ${isCurrent ? "bg-[#1a1715] border-4 border-(--medium-shade) shadow-[0_0_20px_rgba(143,120,93,0.6)] scale-125" : 
                                                isReached ? "bg-(--medium-shade) border-4 border-(--medium-shade)" : 
                                                "bg-[#1a1715] border-2 border-white/10"}`}>
                                                {isCurrent && <div className="w-2 h-2 bg-(--medium-shade) rounded-full animate-pulse"></div>}
                                                {isReached && !isCurrent && <FaBoxOpen className="text-[#1a1715] text-xs" />}
                                            </div>
                                            
                                            <div className={`text-left sm:text-center transition-all duration-500 ${isReached ? "opacity-100" : "opacity-40"}`}>
                                                <p className={`text-lg sm:text-base font-bold sm:whitespace-nowrap sm:pt-4 tracking-wide ${isCurrent ? 'text-(--medium-shade)' : 'text-white'}`}>{step.label}</p>
                                                <p className="text-sm sm:text-xs font-mono text-white/50 mt-1 bg-[#1a1715] sm:bg-transparent inline-block px-2 py-1 sm:p-0 rounded-md border sm:border-0 border-white/5">{timestamp || 'Oczekuje'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {trackingResult && trackingResult.status === 'cancelled' && (
                     <div className="animate-in fade-in p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center mt-8 relative z-10">
                         <p className="text-red-400 font-serif font-bold text-2xl mb-2">Zamówienie zostało anulowane</p>
                         <p className="text-white/70">Skontaktuj się z obsługą sklepu, jeśli to pomyłka.</p>
                     </div>
                )}
            </div>
        </div>
    );
}