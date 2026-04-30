import React, { useState } from 'react';
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function BugReportSection() {
    const [status, setStatus] = useState('idle'); 
    const [formData, setFormData] = useState({
        type: 'bug',
        description: '',
        contact: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ type: 'bug', description: '', contact: '' });
        }, 1500);
    };

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-(--medium-shade) rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <FiAlertCircle /> Zgłoś Błąd
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 mb-4">Coś nie działa?</h2>
                    <p className="text-white/60 font-light max-w-xl mx-auto">
                        Pomóż nam ulepszyć Somnium. Jeśli zauważyłeś problem na stronie, daj nam znać – naprawimy to jak najszybciej!
                    </p>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-(--medium-shade)/5 to-transparent pointer-events-none"></div>
                    {status === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Dziękujemy za zgłoszenie!</h3>
                            <p className="text-white/60 mb-8">Twoja wiadomość została wysłana. Nasi bariści od kodu już się tym zajmują.</p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-sm font-bold uppercase tracking-widest"
                            >
                                Wyślij kolejne
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Typ zgłoszenia</label>
                                    <select 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-(--medium-shade) transition-colors appearance-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="bug">Błąd na stronie</option>
                                        <option value="ui">Problem z wyglądem</option>
                                        <option value="feature">Sugestia ulepszenia</option>
                                        <option value="other">Inne</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">E-mail (opcjonalnie)</label>
                                    <input 
                                        type="email" 
                                        placeholder="twoj@email.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-(--medium-shade) transition-colors"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1">Opis problemu</label>
                                <textarea 
                                    required
                                    rows="4"
                                    placeholder="Opisz co się stało..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-(--medium-shade) transition-colors resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-4 bg-(--medium-shade) hover:bg-white text-[#24201d] rounded-xl font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                            >
                                {status === 'sending' ? (
                                    <span className="w-6 h-6 border-2 border-[#24201d]/30 border-t-[#24201d] rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        Wyślij Zgłoszenie <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
