import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiMail, FiCheck, FiCoffee, FiInfo } from "react-icons/fi";
import { AddToCartButton } from "./components/ShopButtons";
import api from 'services/api';
import { useAuth } from 'context/AuthProvider';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(user?.email || ''); 
    const [waitlistStatus, setWaitlistStatus] = useState('idle');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`products/${id}`);
                setProduct(res);
            } catch (err) {
                console.error("Błąd pobierania produktu", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleWaitlist = async (e) => {
        e.preventDefault();
        setWaitlistStatus('loading');
        try {
            await api.post('waitlist', { productId: product.id, email });
            setWaitlistStatus('success');
        } catch (error) {
            console.error(error);
            setWaitlistStatus('idle');
            alert("Wystąpił błąd zapisu.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-(--80-shade) pt-32 flex items-center justify-center text-(--medium-shade)">
                <div className="flex flex-col items-center gap-4">
                    <FiCoffee className="animate-bounce text-4xl" />
                    <p className="animate-pulse font-serif text-lg text-(--font-color)">Parzenie szczegółów...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-(--80-shade) pt-32 flex items-center justify-center text-(--font-color) font-serif text-2xl">
                Nie znaleziono produktu.
            </div>
        );
    }

    const available = product.availableStock !== undefined ? product.availableStock : (product.stockQuantity || 0);
    const isSoldOut = available <= 0;
    const isLowStock = available > 0 && available <= 5;

    const getImageUrl = (imageName) => {
        if (!imageName) return 'https://placehold.co/400x400?text=Brak+foto';
        if (/^\d{10,}-/.test(imageName)) return `http://localhost:5000/images/products/${imageName}`;
        return `images/tempProducts/${imageName}`;
    };

    const SpecItem = ({ label, value }) => {
        if (!value) return null;
        return (
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex flex-col gap-1 transition-colors hover:bg-white/10">
                <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">{label}</span>
                <span className="text-sm text-(--font-color) font-medium">{value}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-(--80-shade) pt-32 pb-24 lg:pb-12">
            
            {/* Nawigacja Top (Usunięto sticky, by nie nachodziło na globalny Header) */}
            <div className="max-w-6xl mx-auto px-4 lg:px-12 mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-(--font-color) transition-all border border-white/20 shadow-lg hover:shadow-xl cursor-pointer"
                >
                    <FiArrowLeft size={22} />
                </button>
                <div className="flex flex-col">
                    <span className="font-bold text-(--medium-shade) uppercase tracking-[0.2em] text-xs">Sklep</span>
                    <span className="font-serif font-bold text-(--font-color) opacity-80">{product.category}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 px-4 lg:px-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Lewa kolumna: Zdjęcie */}
                <div className="w-full lg:w-1/2 relative">
                    <div className="aspect-square bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden relative border border-white/20 flex items-center justify-center p-8 shadow-2xl">
                        {isSoldOut && (
                            <div className="absolute top-6 left-6 z-10 bg-red-500/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg border border-red-400/50">
                                Wyprzedane
                            </div>
                        )}
                        {/* Subtelny glow pod zdjęciem */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-(--medium-shade) rounded-full opacity-20 blur-[80px] pointer-events-none"></div>
                        
                        <img 
                            src={getImageUrl(product.image || product.img)} 
                            alt={product.name} 
                            className={`w-full h-full object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 hover:scale-105 ${isSoldOut ? 'grayscale opacity-80' : ''}`}
                        />
                    </div>
                </div>

                {/* Prawa kolumna: Detale */}
                <div className="w-full lg:w-1/2 flex flex-col gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-(--font-color) mb-3 leading-tight">{product.name}</h1>
                        <p className="text-xl text-(--medium-shade) font-bold">{product.company}</p>
                    </div>

                    {/* Profil Sensoryczny */}
                    {product.flavours && (
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-(--font-color)/50 font-bold mb-3 flex items-center gap-2"><FiCoffee /> Profil Sensoryczny</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.flavours.split(',').map((flavor, idx) => (
                                    <span key={idx} className="bg-white/10 text-(--font-color) border border-white/20 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                        {flavor.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specyfikacja Grid */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-(--font-color)/50 font-bold mb-3 flex items-center gap-2"><FiInfo /> Specyfikacja</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SpecItem label="Kraj / Region" value={product.farm} />
                            <SpecItem label="Odmiana Botaniczna" value={product.variety} />
                            <SpecItem label="Obróbka" value={product.processingMethod} />
                            <SpecItem label="Przeznaczenie" value={product.purpose} />
                            <SpecItem label="Rozmiar / Waga" value={product.size} />
                            <SpecItem label="Rodzaj" value={product.teaType} />
                        </div>
                    </div>

                    {/* Opis */}
                    {product.description && (
                        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-inner">
                            <p className="text-(--font-color)/80 font-light leading-relaxed text-justify text-sm">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Sekcja Desktop Add to Cart (ukryta na mobile, przeniesiona na sticky bar) */}
                    <div className="hidden lg:block mt-auto border-t border-white/10 pt-8">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm uppercase text-(--font-color)/50 tracking-widest font-bold">Cena</span>
                            <div className="text-5xl font-bold text-(--medium-shade) drop-shadow-sm">
                                {product.price} <span className="text-xl text-(--font-color)">PLN</span>
                            </div>
                        </div>
                        {isSoldOut 
                            ? <WaitlistForm email={email} setEmail={setEmail} status={waitlistStatus} onSubmit={handleWaitlist} /> 
                            : <AddToCartButton product={product} className="w-full py-5 text-lg font-bold shadow-xl" />
                        }
                    </div>
                </div>
            </div>

            {/* Sticky Bar dla Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-(--80-shade)/95 backdrop-blur-xl border-t border-white/10 p-4 z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                {isSoldOut ? (
                     <WaitlistForm email={email} setEmail={setEmail} status={waitlistStatus} onSubmit={handleWaitlist} isMobile />
                ) : (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-(--font-color)/60 font-bold">Do zapłaty</span>
                            <span className="text-2xl font-bold text-(--medium-shade)">{product.price} <span className="text-sm text-(--font-color)">PLN</span></span>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                            <AddToCartButton product={product} className="w-full py-3.5 shadow-lg" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Komponent pomocniczy dla formularza powiadomień
const WaitlistForm = ({ email, setEmail, status, onSubmit, isMobile }) => (
    <div className={`w-full ${isMobile ? '' : 'bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-lg'}`}>
        {!isMobile && <h4 className="text-red-400 font-bold flex items-center gap-2 mb-3 text-sm"><FiAlertTriangle /> Produkt chwilowo niedostępny</h4>}
        
        {status === 'success' ? (
            <div className="bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-inner">
                <FiCheck /> Zapisano na listę!
            </div>
        ) : (
            <form onSubmit={onSubmit} className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-(--font-color)/40" />
                    <input 
                        type="email" required placeholder="Powiadom mnie" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/20 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-(--font-color) placeholder:text-(--font-color)/50 focus:outline-none focus:border-(--medium-shade) text-sm shadow-inner transition-colors"
                    />
                </div>
                <button type="submit" disabled={status === 'loading'} className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-6 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50">
                    {status === 'loading' ? '...' : 'Zapisz'}
                </button>
            </form>
        )}
    </div>
);