import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Menu from './Menu';
import api from 'src/services/api';
import { useAuth } from 'src/context/AuthProvider';
import { FiEdit3, FiSave, FiX, FiPlusCircle, FiAlertTriangle } from "react-icons/fi";
import PasswordPromptModal from "src/components/PasswordPromptModal";

function Menus() {
    const { isSuperAdmin } = useAuth();
    
    const [menuItems, setMenuItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [activeMenus, setActiveMenus] = useState({});

    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const data = await api.get('menus');
            setMenuItems(data);
            setOriginalItems(JSON.parse(JSON.stringify(data))); 
            
            if (data.length > 0) {
                setActiveMenus({ [data[0].key]: true });
            }
        } catch (err) {
            console.error("Błąd pobierania menu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const toggleMenu = (key) => {
        setActiveMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const enableEditMode = () => {
        const allOpen = {};
        menuItems.forEach(item => allOpen[item.key] = true);
        setActiveMenus(allOpen);
        setIsEditing(true);
    };

    const cancelEditMode = () => {
        setMenuItems(JSON.parse(JSON.stringify(originalItems))); 
        setIsEditing(false);
        if (originalItems.length > 0) {
            setActiveMenus({ [originalItems[0].key]: true });
        } else {
            setActiveMenus({});
        }
    };

    const saveChanges = async () => {
        setPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async (password) => {
        await api.post('auth/verify-password', { password }); // rzuca wyjątek
        setPasswordModalOpen(false);

        try {
            setIsSaving(true);
            await api.post('menus/sync', { menus: menuItems });
            await fetchMenus(); 
            setIsEditing(false);
        } catch (err) {
            alert("Nie udało się zapisać menu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCategoryChange = (catId, field, value) => {
        setMenuItems(prev => prev.map(cat => cat.id === catId ? { ...cat, [field]: value } : cat));
    };

    const handleItemChange = (catId, itemId, field, value) => {
        setMenuItems(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return {
                ...cat,
                data: cat.data.map(item => item.id === itemId ? { ...item, [field]: value } : item)
            };
        }));
    };

    const handleAddCategory = () => {
        const newCatId = `temp-${Date.now()}`;
        const newCat = {
            id: newCatId,
            key: `menu-${Date.now()}`,
            title: "Nowa Kategoria",
            data: []
        };
        setMenuItems(prev => [...prev, newCat]);
        setActiveMenus(prev => ({ ...prev, [newCat.key]: true })); 
    };

    const handleRemoveCategory = (catId) => {
        setCategoryToDelete(catId);
    };

    const executeRemoveCategory = () => {
        setMenuItems(prev => prev.filter(cat => cat.id !== categoryToDelete));
        setCategoryToDelete(null);
    };

    const handleAddItem = (catId) => {
        setMenuItems(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return {
                ...cat,
                data: [...cat.data, { id: `temp-item-${Date.now()}`, name: "", price: "", ingredients: "" }]
            };
        }));
    };

    const handleRemoveItem = (catId, itemId) => {
        setMenuItems(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            return { ...cat, data: cat.data.filter(item => item.id !== itemId) };
        }));
    };

    const handleReorderItem = (catId, fromIndex, toIndex) => {
        setMenuItems(prev => prev.map(cat => {
            if (cat.id !== catId) return cat;
            const newData = [...cat.data];
            const [moved] = newData.splice(fromIndex, 1);
            newData.splice(toIndex, 0, moved);
            return { ...cat, data: newData };
        }));
    };

    return (
        <div className="relative min-h-screen pt-32 pb-20 px-4 lg:px-8 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 60%)' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, var(--medium-shade) 0%, transparent 60%)', opacity: 0.15 }}></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                <div className="text-center relative w-full max-w-4xl flex flex-col md:block items-center">
                     <span className="text-(--medium-shade) uppercase tracking-[0.3em] text-xs font-bold brightness-110">Nasza Oferta</span>
                     <h2 className="font-serif font-bold text-4xl md:text-5xl mt-3 text-white mb-6">Menu</h2>
                     
                     {/* PANEL STEROWANIA EDYCJĄ */}
                     {isSuperAdmin && (
                         <div className="w-full flex flex-col sm:flex-row justify-center md:absolute md:right-0 md:top-0 gap-3 md:w-auto mb-6 md:mb-0">
                             {!isEditing ? (
                                 <button onClick={enableEditMode} className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 md:px-4 md:py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer">
                                     <FiEdit3 /> Edytuj Menu
                                 </button>
                             ) : (
                                 <>
                                     <button onClick={cancelEditMode} className="w-full sm:w-auto bg-red-500/20 hover:bg-red-500/40 text-red-400 px-6 py-3 md:px-4 md:py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                                         <FiX /> Anuluj
                                     </button>
                                     <button onClick={saveChanges} disabled={isSaving} className="w-full sm:w-auto bg-green-500/70 hover:bg-green-400/70 text-black px-6 py-3 md:px-6 md:py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer disabled:opacity-50">
                                         <FiSave /> {isSaving ? "Zapisywanie..." : "Zapisz Zmiany"}
                                     </button>
                                 </>
                             )}
                         </div>
                     )}
                </div>

                {loading ? (
                    <div className="text-(--medium-shade) animate-pulse font-bold mt-20">Wczytywanie oferty...</div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {menuItems.map((item, index) => (
                            <Menu 
                                key={item.id || item.key}
                                index={index}
                                category={item}
                                isActive={activeMenus[item.key] || isEditing} 
                                toggleMenu={toggleMenu} 
                                isEditing={isEditing}
                                onCategoryChange={handleCategoryChange}
                                onItemChange={handleItemChange}
                                onAddItem={handleAddItem}
                                onRemoveItem={handleRemoveItem}
                                onRemoveCategory={handleRemoveCategory}
                                onReorderItem={handleReorderItem}
                            />
                        ))}

                        {isEditing && (
                            <button onClick={handleAddCategory} className="w-full lg:w-3/4 max-w-4xl py-6 my-4 bg-transparent border-2 border-dashed border-(--medium-shade)/50 hover:border-(--medium-shade) hover:bg-(--medium-shade)/10 rounded-3xl text-(--medium-shade) text-lg font-bold flex items-center justify-center gap-3 transition-all cursor-pointer">
                                <FiPlusCircle size={24} /> Dodaj nową kategorię menu
                            </button>
                        )}
                        
                        {!loading && menuItems.length === 0 && !isEditing && (
                             <div className="text-white/50 text-center mt-10 italic">Menu jest aktualnie w przygotowaniu.</div>
                        )}
                    </div>
                )}
            </div>
            
            {categoryToDelete && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#24201d] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-500/10 text-red-400 border border-red-500/20">
                            <FiAlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Usunąć kategorię?</h3>
                        <p className="text-white/60 mb-8 leading-relaxed text-sm">
                            Czy na pewno chcesz trwale usunąć tę kategorię wraz ze wszystkimi jej pozycjami? Zmiany zostaną zachowane dopiero po kliknięciu "Zapisz Zmiany".
                        </p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setCategoryToDelete(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                                Anuluj
                            </button>
                            <button onClick={executeRemoveCategory} className="flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg bg-red-500/50 hover:bg-red-600/80 text-white">
                                Usuń
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            
            <PasswordPromptModal 
                isOpen={passwordModalOpen} 
                onClose={() => setPasswordModalOpen(false)} 
                onSubmit={handlePasswordSubmit}
                title="Zapisywanie Menu"
                description="Podaj hasło administratora, aby potwierdzić zmiany na stronie publicznej."
            />
        </div>
    );
}

export default Menus;''