import React, { useState, useEffect } from 'react';
import api from "services/api";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function AddressTab() {
    const [addresses, setAddresses] = useState([]);
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
    }, []);

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

    if (editingId) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">
                    {editingId === 'new' ? "Dodaj nowy adres" : "Edytuj adres"}
                </h2>
                <form onSubmit={handleSaveForm} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Nazwa adresu</label>
                            <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="np. Dom, Praca..." required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Ulica i numer</label>
                            <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="Wpisz adres doręczenia..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Kod pocztowy</label>
                            <input type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="00-000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Miasto</label>
                            <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="Wpisz miasto..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1">Numer telefonu</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="+48 000 000 000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-1 text-(--medium-shade) font-bold">Domyślny Paczkomat</label>
                            <input type="text" value={formData.paczkomat} onChange={e => setFormData({...formData, paczkomat: e.target.value})} className="w-full bg-(--medium-shade)/5 border border-(--medium-shade)/30 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) transition-colors" placeholder="KRA123M" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-xl font-bold transition-all cursor-pointer">Anuluj</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] py-3 px-6 rounded-xl font-bold transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50">
                            {isLoading ? <FaSpinner className="animate-spin" /> : "Zapisz adres"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-serif">Książka Adresowa</h2>
                <button onClick={openAdd} className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer">
                    <FiPlus /> Dodaj
                </button>
            </div>
            
            {addresses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 text-center py-10">
                    <FaMapMarkerAlt className="text-6xl mb-4 opacity-20" />
                    <p className="text-lg">Nie masz jeszcze zapisanych żadnych adresów.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FaMapMarkerAlt className="text-(--medium-shade)" />
                                    <h3 className="font-bold text-lg text-white">{addr.label}</h3>
                                </div>
                                <div className="text-sm opacity-70 space-y-1">
                                    <p>{addr.street}</p>
                                    <p>{addr.zip} {addr.city}</p>
                                    <p>{addr.phone}</p>
                                    {addr.paczkomat && <p className="text-(--medium-shade) font-bold mt-2">Paczkomat: {addr.paczkomat}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                <button onClick={() => openEdit(addr)} className="flex-1 py-2 bg-white/5 rounded-lg text-sm font-bold text-white/80 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                    <FiEdit2 /> Edytuj
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="flex-1 py-2 bg-red-500/10 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
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