import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from 'src/services/api';
import { FiTruck, FiBox, FiArrowLeft, FiClock, FiPlusCircle, FiEdit, FiFileText, FiInfo, FiEye, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import usePagination from 'src/hooks/usePagination';

import DeliveryModal from './DeliveryModal'; 

export default function AdminDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedDelivery, setSelectedDelivery] = useState(null); 
    const [hoveredDelivery, setHoveredDelivery] = useState(null); 
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

    const {
        visibleItems,
        totalPages,
        currentPage,
        goToPage,
        getPageNumbers,
        startIndex,
        totalItems,
        itemsPerPage
    } = usePagination(deliveries, { itemsPerPage: 10, storageKey: 'admin_deliveries_page' });

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const data = await api.get('deliveries');
            setDeliveries(data);
        } catch (err) {
            console.error("Błąd pobierania historii dostaw:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMouseMove = (e, delivery) => {
        setHoveredDelivery(delivery);
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredDelivery(null);
    };

    const getActionIcon = (type) => {
        switch (type) {
            case 'ADD_STOCK': return <span className="text-green-400 bg-green-500/10 p-1.5 rounded-lg"><FiBox /></span>;
            case 'CREATE_PRODUCT': return <span className="text-(--medium-shade) bg-(--medium-shade)/10 p-1.5 rounded-lg"><FiPlusCircle /></span>;
            case 'EDIT_PRODUCT': return <span className="text-blue-400 bg-blue-500/10 p-1.5 rounded-lg"><FiEdit /></span>;
            default: return <FiInfo />;
        }
    };

    const getActionText = (action) => {
        const pName = action.Product ? action.Product.name : action.details.name;
        switch (action.actionType) {
            case 'ADD_STOCK': return `Dodano ${action.details.added} szt. do: ${pName}`;
            case 'CREATE_PRODUCT': return `Zarejestrowano nowy produkt: ${pName}`;
            case 'EDIT_PRODUCT': return `Zaktualizowano dane produktu: ${pName}`;
            default: return "Nieznana akcja";
        }
    };

    if (loading) return <div className="text-(--medium-shade) font-bold text-center mt-20">Ładowanie historii dostaw...</div>;

    if (selectedDelivery) {
        return (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 overflow-x-auto not-lg:pt-20">
                <button 
                    onClick={() => setSelectedDelivery(null)}
                    className="flex items-center gap-2 text-[#F2EAE1]/60 hover:text-(--medium-shade) transition-colors font-bold cursor-pointer w-max"
                >
                    <FiArrowLeft /> Wróć do listy dostaw
                </button>

                <div className="bg-[#46382E] border border-[#5C4A3D] rounded-3xl p-6 md:p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5C4A3D] pb-6 mb-6">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-[#F2EAE1] flex items-center gap-3">
                                <FiTruck className="text-(--medium-shade)" /> {selectedDelivery.name}
                            </h1>
                            <p className="text-[#F2EAE1]/50 mt-2 flex items-center gap-2">
                                <FiClock /> Zarejestrowano: {new Date(selectedDelivery.createdAt).toLocaleString('pl-PL')}
                            </p>
                        </div>
                        <div className="bg-[#2D231C] px-6 py-3 rounded-2xl border border-[#5C4A3D] text-center">
                            <span className="block text-xs uppercase tracking-widest text-[#F2EAE1]/50 font-bold mb-1">Ilość modyfikacji</span>
                            <span className="text-2xl font-mono font-bold text-(--medium-shade)">{selectedDelivery.DeliveryActions?.length || 0}</span>
                        </div>
                    </div>

                    {selectedDelivery.notes && (
                        <div className="mb-8 bg-[#352A21] border border-[#5C4A3D] p-5 rounded-2xl">
                            <h3 className="text-sm uppercase tracking-widest text-[#F2EAE1]/50 font-bold mb-2 flex items-center gap-2">
                                <FiFileText /> Notatki do dostawy
                            </h3>
                            <p className="text-[#F2EAE1]/90 italic">{selectedDelivery.notes}</p>
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-[#F2EAE1] mb-4">Szczegóły operacji magazynowych</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {selectedDelivery.DeliveryActions?.map((action, idx) => (
                            <div key={idx} className="bg-[#2D231C] border border-[#5C4A3D] p-4 rounded-xl flex items-start gap-4">
                                <div className="mt-1">{getActionIcon(action.actionType)}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-[#F2EAE1]">{getActionText(action)}</p>
                                    
                                    {action.actionType === 'ADD_STOCK' && (
                                        <p className="text-sm text-[#F2EAE1]/50 mt-1">Stan magazynowy: {action.details.stockBefore} ➔ {action.details.stockAfter} szt.</p>
                                    )}
                                    {action.actionType === 'CREATE_PRODUCT' && (
                                        <p className="text-sm text-[#F2EAE1]/50 mt-1">Początkowy stan: {action.details.initialStock} szt.</p>
                                    )}
                                    {action.actionType === 'EDIT_PRODUCT' && (
                                        <div className="mt-2">
                                            {action.details.changes && action.details.changes.length > 0 ? (
                                                <ul className="text-sm text-[#F2EAE1]/60 list-disc list-inside ml-2">
                                                    {action.details.changes.map((c, i) => <li key={i}>{c}</li>)}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-[#F2EAE1]/50">Zaktualizowano zdjęcie lub opis produktu.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DeliveryModal 
                    isOpen={isDeliveryModalOpen} 
                    onClose={() => setIsDeliveryModalOpen(false)} 
                    onSuccess={() => fetchDeliveries()} 
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative not-lg:pt-20 overflow-x-auto pb-10">
            
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">Historia Dostaw</h1>
                    <p className="text-[#F2EAE1]/60 font-medium text-sm mt-1">Śledź wszystkie przyjęcia i zmiany w magazynie</p>
                </div>
                <button
                    onClick={() => setIsDeliveryModalOpen(true)}
                    className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer w-12 h-12 sm:w-auto sm:h-auto shrink-0"
                >
                    <FiTruck size={20} className="shrink-0" /> <span className="hidden sm:inline">Rejestruj Dostawę</span>
                </button>
            </div>

            <div className="rounded-3xl border border-[#5C4A3D] overflow-hidden bg-[#46382E] shadow-xl">
                <table className="w-full text-left text-sm text-[#F2EAE1]">
                    <thead className="bg-[#352A21] text-(--medium-shade) uppercase text-xs tracking-wider border-b border-[#5C4A3D]">
                        <tr>
                            <th className="p-6 font-bold">DATA</th>
                            <th className="p-6 font-bold">IDENTYFIKATOR DOSTAWY</th>
                            <th className="p-6 font-bold">CEL DOSTAWY</th>
                            <th className="p-6 font-bold">ZMIANY</th>
                            <th className="p-6 font-bold hidden md:table-cell">NOTATKI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#846f60] bg-(--medium-shade)/10">
                        {deliveries.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-[#F2EAE1]/50">Brak zarejestrowanych dostaw.</td></tr>
                        )}
                        {visibleItems.map((delivery) => (
                            <tr 
                                key={delivery.id} 
                                onClick={() => setSelectedDelivery(delivery)}
                                onMouseMove={(e) => handleMouseMove(e, delivery)}
                                onMouseLeave={handleMouseLeave}
                                className="hover:bg-[#5C4A3D]/80 transition-colors cursor-pointer group"
                            >
                                <td className="p-6 text-[#F2EAE1]/60 font-medium whitespace-nowrap">
                                    {new Date(delivery.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-6 font-bold text-[#F2EAE1] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#352A21] border border-[#5C4A3D] flex items-center justify-center group-hover:bg-(--medium-shade)/20 group-hover:text-(--medium-shade) transition-colors">
                                        <FiTruck />
                                    </div>
                                    {delivery.name}
                                </td>
                                <td className="p-6 font-bold text-[#F2EAE1]/80">
                                    {delivery.Location ? (
                                        <span className="flex items-center gap-2">
                                            {delivery.Location.type === 'warehouse' ? <FiBox className="text-(--medium-shade)" /> : <FiMapPin className="text-(--medium-shade)" />}
                                            {delivery.Location.name}
                                        </span>
                                    ) : "Brak danych"}
                                </td>
                                <td className="p-6 font-mono font-bold text-(--medium-shade)">
                                    {delivery.DeliveryActions?.length || 0} operacji
                                </td>
                                <td className="p-6 text-[#F2EAE1]/50 truncate max-w-xs hidden md:table-cell">
                                    {delivery.notes || "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginacja */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2 animate-in fade-in duration-500">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-[#5C4A3D] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FiChevronLeft />
                    </button>

                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`dots-${idx}`} className="w-8 text-center text-white/40 text-sm select-none">…</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${page === currentPage
                                    ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)] scale-110'
                                    : 'bg-white/5 hover:bg-white/15 text-white border border-[#5C4A3D]'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-[#5C4A3D] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FiChevronRight />
                    </button>

                    <span className="ml-4 text-xs text-white/40 font-bold hidden sm:inline">
                        {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} z {totalItems}
                    </span>
                </div>
            )}

            {hoveredDelivery && hoveredDelivery.DeliveryActions && !isDeliveryModalOpen && createPortal(
                <div 
                    className="fixed z-9999 bg-[#24201d]/90 backdrop-blur-xl border border-(--medium-shade)/30 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-none animate-in fade-in zoom-in-95 duration-200 min-w-[300px]"
                    style={{ 
                        top: mousePos.y + 15,
                        left: mousePos.x + 15,
                        transform: 'translate(0, 0)'
                    }}
                >
                    <h4 className="text-(--medium-shade) font-bold mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                        <FiEye /> Podgląd zawartości
                    </h4>
                    <ul className="space-y-3">
                        {hoveredDelivery.DeliveryActions.slice(0, 4).map((action, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <div className="mt-0.5">{getActionIcon(action.actionType)}</div>
                                <div>
                                    <p className="text-white font-bold leading-tight">{getActionText(action)}</p>
                                    {action.actionType === 'EDIT_PRODUCT' && action.details.changes && (
                                        <ul className="text-xs text-white/50 list-disc list-inside ml-2 mt-1">
                                            {action.details.changes.slice(0, 2).map((c, idx) => <li key={idx}>{c}</li>)}
                                            {action.details.changes.length > 2 && <li>...</li>}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                        {hoveredDelivery.DeliveryActions.length > 4 && (
                            <li className="text-center text-white/40 text-xs font-bold pt-2 border-t border-white/5">
                                ...i {hoveredDelivery.DeliveryActions.length - 4} innych zmian. Kliknij, aby zobaczyć.
                            </li>
                        )}
                        {hoveredDelivery.DeliveryActions.length === 0 && (
                            <li className="text-white/50 text-sm">Brak modyfikacji w tej dostawie.</li>
                        )}
                    </ul>
                </div>,
                document.body
            )}

            <DeliveryModal 
                isOpen={isDeliveryModalOpen} 
                onClose={() => setIsDeliveryModalOpen(false)} 
                onSuccess={() => fetchDeliveries()} 
            />
        </div>
    );
}