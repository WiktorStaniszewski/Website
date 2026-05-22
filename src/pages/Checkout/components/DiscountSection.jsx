import React, { useState, useEffect } from 'react';
import { FiTag } from 'react-icons/fi';
import { FiStar } from 'react-icons/fi';
import { FiMessageSquare } from 'react-icons/fi';
import { FiCheck } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';
import { FiLoader } from 'react-icons/fi';
import { FiGift } from 'react-icons/fi';
import { FiAlertCircle } from 'react-icons/fi';
import api from 'src/services/api';

export const DiscountSection = ({ 
    user, 
    promoCode, setPromoCode,
    promoDiscount, setPromoDiscount,
    loyaltyDiscount, setLoyaltyDiscount,
    baristaNotes, setBaristaNotes
}) => {
    const [promoInput, setPromoInput] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    const [loyaltyData, setLoyaltyData] = useState(null);
    const [loyaltyLoading, setLoyaltyLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('loyalty/balance')
                .then(data => setLoyaltyData(data))
                .catch(() => setLoyaltyData(null))
                .finally(() => setLoyaltyLoading(false));
        } else {
            setLoyaltyLoading(false);
        }
    }, [user]);

    const handleValidatePromo = async () => {
        if (!promoInput.trim()) return;
        setPromoLoading(true);
        setPromoError('');
        setPromoSuccess('');

        try {
            const res = await api.post('promo-codes/validate', { code: promoInput.trim() });
            if (res.valid) {
                setPromoCode(promoInput.trim().toUpperCase());
                setPromoDiscount({ percent: res.discountPercent, promoCodeId: res.promoCodeId });
                setPromoSuccess(res.message);
                setLoyaltyDiscount(null);
            } else {
                setPromoError(res.message);
                setPromoCode('');
                setPromoDiscount(null);
            }
        } catch (err) {
            setPromoError('Błąd walidacji kodu.');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setPromoDiscount(null);
        setPromoSuccess('');
        setPromoError('');
        setPromoInput('');
    };

    const handleRedeemLoyalty = (reward) => {
        // Nie kumuluje się z promo
        if (promoCode) {
            setPromoError('Zniżka lojalnościowa nie łączy się z kodem promocyjnym. Usuń kod, aby użyć punktów.');
            return;
        }
        setLoyaltyDiscount({ threshold: reward.threshold, percent: reward.discount });
    };

    const handleRemoveLoyalty = () => {
        setLoyaltyDiscount(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Kod promocyjny */}
            <div className="bg-[#24201d]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FiTag className="text-(--medium-shade)" /> Kod promocyjny
                </h3>

                {promoDiscount ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <FiCheck className="text-green-400 text-xl" />
                            <div>
                                <p className="font-bold text-green-400">{promoCode}</p>
                                <p className="text-xs text-green-400/70">{promoSuccess}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleRemovePromo}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer text-white/50 hover:text-red-400"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Wpisz kod..."
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleValidatePromo()}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-(--medium-shade) transition-colors uppercase tracking-wider font-mono"
                        />
                        <button
                            onClick={handleValidatePromo}
                            disabled={promoLoading || !promoInput.trim()}
                            className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-6 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {promoLoading ? <FiLoader className="animate-spin" /> : 'Zastosuj'}
                        </button>
                    </div>
                )}

                {promoError && (
                    <div className="mt-3 flex items-center gap-2 text-red-400 text-sm animate-in fade-in">
                        <FiAlertCircle /> {promoError}
                    </div>
                )}
            </div>

            {/* Program lojalnościowy */}
            {user && (
                <div className="bg-[#24201d]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiStar className="text-(--medium-shade)" /> Program lojalnościowy
                    </h3>

                    {loyaltyLoading ? (
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                            <FiLoader className="animate-spin" /> Ładowanie punktów...
                        </div>
                    ) : loyaltyData ? (
                        <div className="space-y-4">
                            {/* Saldo */}
                            <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/5">
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Twoje punkty</p>
                                    <p className="text-2xl font-bold text-(--medium-shade)">{loyaltyData.points} <span className="text-sm text-white/50 font-normal">pkt</span></p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-(--medium-shade)/10 flex items-center justify-center border border-(--medium-shade)/20">
                                    <FiGift className="text-(--medium-shade) text-xl" />
                                </div>
                            </div>

                            {/* Nagrody */}
                            {loyaltyDiscount ? (
                                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4 animate-in zoom-in-95">
                                    <div className="flex items-center gap-3">
                                        <FiCheck className="text-green-400 text-xl" />
                                        <div>
                                            <p className="font-bold text-green-400">Zniżka {loyaltyDiscount.percent}% aktywna</p>
                                            <p className="text-xs text-green-400/70">Zostanie odjętych {loyaltyDiscount.threshold} punktów</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleRemoveLoyalty}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer text-white/50 hover:text-red-400"
                                    >
                                        <FiX size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {loyaltyData.allRewards.map((reward, idx) => {
                                        const canRedeem = loyaltyData.points >= reward.threshold;
                                        const progress = Math.min((loyaltyData.points / reward.threshold) * 100, 100);

                                        return (
                                            <div key={idx} className={`relative overflow-hidden rounded-xl p-4 border transition-all
                                                ${canRedeem 
                                                    ? 'bg-(--medium-shade)/10 border-(--medium-shade)/30 cursor-pointer hover:bg-(--medium-shade)/20' 
                                                    : 'bg-white/5 border-white/5'
                                                }`}
                                                onClick={() => canRedeem && handleRedeemLoyalty(reward)}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-bold text-white">
                                                        -{reward.discount}% na zamówienie
                                                    </span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${canRedeem ? 'bg-(--medium-shade)/20 text-(--medium-shade)' : 'bg-white/5 text-white/30'}`}>
                                                        {reward.threshold} pkt
                                                    </span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-700 ${canRedeem ? 'bg-(--medium-shade)' : 'bg-white/20'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-white/40 mt-1">
                                                    {canRedeem 
                                                        ? 'Kliknij, aby wykorzystać' 
                                                        : `Brakuje ${reward.threshold - loyaltyData.points} pkt`
                                                    }
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-white/40">Zaloguj się, aby korzystać z programu lojalnościowego.</p>
                    )}
                </div>
            )}

            {/* Notatka dla baristy */}
            <div className="bg-[#24201d]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <FiMessageSquare className="text-(--medium-shade)" /> Notatka dla baristy
                </h3>
                <p className="text-xs text-white/40 mb-4">Opcjonalne — dodaj specjalne życzenia dotyczące Twojej kawy.</p>
                <textarea
                    value={baristaNotes}
                    onChange={(e) => setBaristaNotes(e.target.value)}
                    placeholder="np. Mocniejsze espresso, podwójne mleko owsiane, bez cukru..."
                    maxLength={500}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-(--medium-shade) transition-colors resize-none text-sm leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                    <span className={`text-[10px] ${baristaNotes.length > 400 ? 'text-yellow-400' : 'text-white/20'}`}>
                        {baristaNotes.length}/500
                    </span>
                </div>
            </div>
        </div>
    );
};
