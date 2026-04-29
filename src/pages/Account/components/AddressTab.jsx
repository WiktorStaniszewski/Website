import React, { useState, useEffect } from 'react';
import api from "services/api";
import { FaMapMarkerAlt, FaSpinner, FaCity, FaPhoneAlt, FaBoxOpen } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function AddressTab() {
    const[addresses, setAddresses] = useState([]);
    const [editingId, setEditingId] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        label: "Dom", street: "", zip: "", city: "", phone: "", paczkomat: ""
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await api.get('users/profile/addresses');
                if (Array.isArray(res)) setAddresses(res);
            } catch (err) {
                console.error("Błąd ładowania adresów", err);
            }
        };
        fetchAddresses();
    },[]);

    const handleSaveForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editingId === 'new') {
                const newAddr = await api.post('users/profile/addresses', formData);
                setAddresses([...addresses, newAddr]);
            } else {
                const updatedAddr = await api.put('users/profile/addresses', editingId, formData);
                setAddresses(addresses.map(a => a.id === editingId ? updatedAddr : a));
            }
            setEditingId(null);
        } catch (error) {
            console.error("Błąd zapisywania adresu:", error);
            alert("Nie udało się zapisać adresu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten adres?")) {
            try {
                await api.delete('users/profile/addresses', id);
                setAddresses(addresses.filter(a => a.id !== id));
            } catch (err) {
                console.error(err);
                alert("Nie udało się usunąć adresu.");
            }
        }
    };

    const openEdit = (addr) => {
        setFormData({
            label: addr.label || "", street: addr.street || "", zip: addr.zip || "",
            city: addr.city || "", phone: addr.phone || "", paczkomat: addr.paczkomat || ""
        });
        setEditingId(addr.id);
    };

    const openAdd = () => {
        setFormData({ label: "Dom", street: "", zip: "", city: "", phone: "", paczkomat: "" });
        setEditingId('new');
    };

    const inputClass = "w-full bg-[#1a1715] border border-white/10 rounded-xl p-3.5 text-white placeholder-white/20 focus:outline-none focus:border-(--medium-shade) focus:ring-1 focus:ring-(--medium-shade)/50 transition-all duration-300";
    const labelClass = "text-xs uppercase tracking-widest text-(--medium-shade) ml-1 font-bold";

    if (editingId) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div className="mb-8 pb-6 border-b border-white/5">
                    <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Formularz</span>
                    <h2 className="text-3xl font-serif font-bold text-white mt-2">
                        {editingId === 'new' ? "Dodaj nowy adres" : "Edytuj adres"}
                    </h2>
                </div>
                <form onSubmit={handleSaveForm} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className={labelClass}>Nazwa adresu</label>
                            <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className={inputClass} placeholder="np. Dom, Praca..." required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className={labelClass}>Ulica i numer</label>
                            <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className={inputClass} placeholder="Wpisz adres doręczenia..." />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Kod pocztowy</label>
                            <input type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className={inputClass} placeholder="00-000" />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Miasto</label>
                            <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={inputClass} placeholder="Wpisz miasto..." />
                        </div>
                        <div className="space-y-2">
                            <label className={labelClass}>Numer telefonu</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="+48 000 000 000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-[#d4a373] ml-1 font-bold">Domyślny Paczkomat (Opcjonalnie)</label>
                            <input type="text" value={formData.paczkomat} onChange={e => setFormData({...formData, paczkomat: e.target.value})} className={`${inputClass} bg-[#d4a373]/5 border-[#d4a373]/30`} placeholder="KRA123M" />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-white/5">
                        <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-bold transition-all cursor-pointer">Anuluj</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-(--medium-shade) hover:brightness-110 text-[#1a1715] py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50">
                            {isLoading ? <FaSpinner className="animate-spin text-xl" /> : "Zapisz adres"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 pb-6 border-b border-white/5 gap-4">
                <div>
                    <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Wysyłka</span>
                    <h2 className="text-4xl font-serif font-bold text-white mt-2">Książka Adresowa</h2>
                </div>
                <button onClick={openAdd} className="bg-(--medium-shade) hover:brightness-110 text-[#1a1715] px-5 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-[0_0_20px_rgba(143,120,93,0.2)]">
                    <FiPlus className="text-lg" /> Nowy Adres
                </button>
            </div>
            
            {addresses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 text-center py-16 bg-[#1a1715]/50 rounded-3xl border border-white/5 border-dashed">
                    <FaMapMarkerAlt className="text-6xl mb-6 opacity-20 text-(--medium-shade)" />
                    <p className="text-xl font-serif">Nie masz jeszcze zapisanych adresów.</p>
                    <p className="text-sm mt-2 font-light">Dodaj adres, aby przyspieszyć proces zamówienia.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-[#1a1715]/80 p-6 rounded-3xl border border-white/5 border-l-4 border-l-(--medium-shade) shadow-lg hover:bg-[#1a1715] hover:shadow-xl transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                                    <div className="p-2 bg-(--medium-shade)/10 rounded-lg">
                                        <FaMapMarkerAlt className="text-(--medium-shade)" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white tracking-wide">{addr.label}</h3>
                                </div>
                                <div className="text-sm text-white/70 space-y-2.5 font-light">
                                    <p className="flex items-start gap-3"><span className="mt-1 opacity-50 w-4"><FaCity /></span> {addr.street}<br/>{addr.zip} {addr.city}</p>
                                    {addr.phone && <p className="flex items-center gap-3"><span className="opacity-50 w-4"><FaPhoneAlt /></span> {addr.phone}</p>}
                                    {addr.paczkomat && (
                                        <div className="mt-4 inline-flex items-center gap-2 bg-[#d4a373]/10 text-[#d4a373] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#d4a373]/20">
                                            <FaBoxOpen size={14} /> Paczkomat: {addr.paczkomat}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(addr)} className="flex-1 py-2.5 bg-white/5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                    <FiEdit2 /> Edytuj
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="flex-1 py-2.5 bg-red-500/10 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                    <FiTrash2 /> Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}