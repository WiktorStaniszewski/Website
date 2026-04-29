import React from 'react';
import { FaBox, FaChevronRight, FaCheck, FaSpinner, FaTimes } from "react-icons/fa";

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

    const getStatusStyle = (status) => {
        switch(status) {
            case 'completed': return 'border-green-500/30 text-green-400 bg-green-500/10';
            case 'cancelled': return 'border-red-500/30 text-red-400 bg-red-500/10';
            default: return 'border-(--medium-shade)/50 text-(--medium-shade) bg-(--medium-shade)/10';
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-10">
            <div className="mb-10 pb-6 border-b border-white/5">
                <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Zakupy</span>
                <h2 className="text-4xl font-serif font-bold text-white mt-2">Historia Zamówień</h2>
            </div>
            
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 gap-4 py-20">
                    <FaSpinner className="animate-spin text-5xl text-(--medium-shade)" />
                    <p className="font-serif text-lg tracking-wide">Pobieranie historii...</p>
                </div>
            ) : sortedOrders.length > 0 ? (
                <div className="flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
                    {sortedOrders.map((order) => (
                        <div 
                            key={order.id} 
                            onClick={() => navigate(`/account/orders/${order.id}`)} 
                            className={`group cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative overflow-hidden
                                ${order.status === 'completed' || order.status === 'cancelled' 
                                    ? 'bg-[#1a1715]/60 border-white/5 hover:bg-[#1a1715]'
                                    : 'bg-[#1a1715]/60 hover:bg-[#1a1715]/80 border-(--medium-shade)/30 shadow-[0_5px_30px_rgba(0,0,0,0.3)]' 
                                }
                            `}
                        >
                            {/* Subtelny akcent po lewej dla aktywnych zamówień */}
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-(--medium-shade)"></div>
                            )}

                            <div className="flex items-center gap-5 pl-2 sm:pl-0">
                                <div className={`p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform duration-300 shrink-0
                                    ${order.status === 'completed' ? 'bg-green-500/10 text-green-500/50' : 
                                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-500/50' : 
                                      'bg-(--medium-shade)/10 text-(--medium-shade)'}`}
                                >
                                    <FaBox />
                                </div>
                                <div>
                                    <p className="font-bold text-xl group-hover:text-(--medium-shade) transition-colors text-white tracking-wide">
                                        Zamówienie <span className="text-white/70 text-base ml-1">{order.trackingNumber || `#${order.id}`}</span>
                                    </p>
                                    <p className="text-sm text-white/40 font-mono mt-1">{order.date}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                                <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5 w-full sm:w-auto">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-bold tracking-wider ${getStatusStyle(order.status)}`}>
                                        {order.status === 'completed' && <FaCheck size={12} />}
                                        {order.status === 'cancelled' && <FaTimes size={12} />}
                                        {order.status.toUpperCase()}
                                    </span>
                                    <p className="font-bold text-2xl text-white ml-auto sm:ml-0">{order.total} <span className="text-sm font-normal text-white/50">PLN</span></p>
                                </div>
                                <div className="hidden sm:flex w-10 h-10 bg-white/5 rounded-full items-center justify-center group-hover:bg-(--medium-shade) group-hover:text-[#1a1715] transition-colors text-white/50">
                                    <FaChevronRight size={16} className="ml-0.5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 py-16 bg-[#1a1715]/50 rounded-3xl border border-white/5 border-dashed">
                    <FaBox className="text-7xl mb-6 opacity-20 text-(--medium-shade)" />
                    <p className="text-xl font-serif">Nie masz jeszcze żadnych zamówień.</p>
                    <p className="text-sm mt-2 font-light">Czas na pierwszą kawę?</p>
                    <button onClick={() => navigate('/shop')} className="mt-8 px-8 py-3 bg-(--medium-shade) hover:brightness-110 text-[#1a1715] font-bold uppercase tracking-widest text-sm rounded-2xl transition-all cursor-pointer hover:-translate-y-0.5">
                        Przejdź do sklepu
                    </button>
                </div>
            )}
        </div>
    );
}