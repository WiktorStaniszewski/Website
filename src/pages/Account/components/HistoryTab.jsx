import React from 'react';
import { FaBox, FaChevronRight, FaCheck, FaSpinner } from "react-icons/fa";

export default function HistoryTab({ orders, loading, navigate }) {
    
    const sortedOrders = [...orders].sort((a, b) => {
        const isAActive = a.status !== 'completed' && a.status !== 'cancelled';
        const isBActive = b.status !== 'completed' && b.status !== 'cancelled';

        if (isAActive && !isBActive) return -1;
        if (!isAActive && isBActive) return 1;

        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return dateB - dateA;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-10">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Historia Zamówień</h2>
            
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-4">
                    <FaSpinner className="animate-spin text-4xl text-(--medium-shade)" />
                    <p>Ładowanie historii...</p>
                </div>
            ) : sortedOrders.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {sortedOrders.map((order) => (
                        <div 
                            key={order.id} 
                            onClick={() => navigate(`/account/orders/${order.id}`)} 
                            className={`group cursor-pointer p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                                ${order.status === 'completed' || order.status === 'cancelled' 
                                    ? 'bg-black/20 border-white/5 opacity-70 hover:opacity-100' // Lekko wyszarzone dla starych
                                    : 'bg-white/5 hover:bg-white/10 border-white/10 shadow-lg' // Wyróżnione dla aktywnych
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">
                                    <FaBox className="text-(--medium-shade)" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg group-hover:text-(--medium-shade) transition-colors text-white">
                                        Zamówienie {order.trackingNumber || `#${order.id}`}
                                    </p>
                                    <p className="text-sm opacity-60 font-mono">{order.date}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                    <p className="font-bold text-xl text-(--medium-shade)">{order.total} PLN</p>
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border 
                                        ${order.status === 'completed' ? 'border-green-500/30 text-green-300 bg-green-500/10' : 
                                          order.status === 'cancelled' ? 'border-red-500/30 text-red-300 bg-red-500/10' :
                                          'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'}`}
                                    >
                                        {order.status === 'completed' && <FaCheck size={10} />}
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all p-2 hover:bg-white/10 rounded-full cursor-pointer text-(--medium-shade)">
                                    <FaChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                    <FaBox className="text-6xl mb-4 opacity-20" />
                    <p className="text-lg">Nie masz jeszcze żadnych zamówień.</p>
                    <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] font-bold rounded-xl transition-colors cursor-pointer">
                        Przejdź do sklepu
                    </button>
                </div>
            )}
        </div>
    );
}