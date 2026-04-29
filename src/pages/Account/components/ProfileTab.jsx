import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaCoffee, FaPhone, FaSave } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import api from 'services/api';
import { useAuth } from 'context/AuthProvider';

export default function ProfileTab({ user }) {
    const { updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            email: user?.email || '',
            phone: user?.phone || ''
        }
    });

    const onSubmit = async (data) => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await api.put('users/profile', null, data);
            updateUser(res.user);
            setMessage({ type: 'success', text: 'Profil zaktualizowany!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Błąd podczas aktualizacji profilu' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 pb-6 border-b border-white/5 flex justify-between items-end">
                <div>
                    <span className="text-(--medium-shade) uppercase tracking-[0.2em] text-xs font-bold">Konto</span>
                    <h2 className="text-4xl font-serif font-bold text-white mt-2">Twój Profil</h2>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold text-sm border border-white/10 cursor-pointer"
                    >
                        Edytuj dane
                    </button>
                )}
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border font-bold text-sm ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-[3px] border-(--medium-shade) p-1 shadow-[0_0_30px_rgba(143,120,93,0.2)] bg-[#1a1715]">
                        <img 
                            src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || user?.username}&backgroundColor=8f785d`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#1a1715]/50 p-8 rounded-3xl border border-white/5 relative">
                        <div className="md:col-span-2 mb-2">
                            <h3 className="text-xl font-serif font-bold text-white">Edycja danych</h3>
                            <p className="text-white/50 text-sm">Zmień dane, które będą używane przy składaniu zamówień.</p>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-2 font-bold">Imię i Nazwisko</label>
                            <input 
                                {...register("firstName")}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-white"
                                placeholder="Wpisz swoje imię i nazwisko"
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-2 font-bold">Adres Email</label>
                            <input 
                                {...register("email", { 
                                    required: "Email jest wymagany",
                                    pattern: { value: /^\S+@\S+$/i, message: "Niepoprawny email" }
                                })}
                                className={`w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-white ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Wpisz email"
                            />
                            {errors.email && <span className="text-red-400 text-xs mt-1 ml-2 block">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest opacity-70 ml-2 font-bold">Telefon</label>
                            <input 
                                {...register("phone")}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-white"
                                placeholder="+48 000 000 000"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold cursor-pointer"
                            >
                                Anuluj
                            </button>
                            <button 
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-3 bg-(--medium-shade) hover:brightness-110 text-[#1a1715] rounded-xl transition-colors font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                            >
                                <FaSave />
                                {isSaving ? "Zapisywanie..." : "Zapisz Zmiany"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#1a1715]/50 p-6 rounded-3xl border border-white/5 hover:border-(--medium-shade)/30 transition-colors flex items-start gap-4">
                            <FaUserCircle className="text-3xl text-(--medium-shade) opacity-80 shrink-0 mt-1" />
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-1 font-bold">Użytkownik</p>
                                <p className="text-xl font-serif text-white truncate">{user?.firstName || user?.username || "Gość"}</p>
                                {user?.firstName && <p className="text-sm text-white/50 truncate">@{user?.username}</p>}
                            </div>
                        </div>
                        
                        <div className="bg-[#1a1715]/50 p-6 rounded-3xl border border-white/5 hover:border-(--medium-shade)/30 transition-colors flex items-start gap-4">
                            <FaEnvelope className="text-3xl text-(--medium-shade) opacity-80 shrink-0 mt-1" />
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-1 font-bold">Adres Email</p>
                                <p className="text-lg font-medium text-white truncate">{user?.email || "brak@email.com"}</p>
                            </div>
                        </div>

                        <div className="bg-[#1a1715]/50 p-6 rounded-3xl border border-white/5 hover:border-(--medium-shade)/30 transition-colors flex items-start gap-4">
                            <FaPhone className="text-3xl text-(--medium-shade) opacity-80 shrink-0 mt-1" />
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-1 font-bold">Telefon</p>
                                <p className="text-lg font-medium text-white truncate">{user?.phone || "Nie podano telefonu"}</p>
                            </div>
                        </div>

                        <div className="bg-[#1a1715]/50 p-6 rounded-3xl border border-white/5 hover:border-(--medium-shade)/30 transition-colors flex items-start gap-4">
                            <FaCoffee className="text-3xl text-(--medium-shade) opacity-80 shrink-0 mt-1" />
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-widest opacity-50 mb-1 font-bold">Status Konta</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <p className="text-sm font-medium text-white">Aktywne, gotowe na kawę</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}