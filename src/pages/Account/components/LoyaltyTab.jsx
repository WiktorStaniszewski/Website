import React, { useState, useEffect } from 'react';
import api from 'services/api';
import { FiStar, FiGift, FiTrendingUp, FiTrendingDown, FiClock, FiAward } from 'react-icons/fi';

export default function LoyaltyTab() {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balance, hist] = await Promise.all([
          api.get('loyalty/balance'),
          api.get('loyalty/history')
        ]);
        setLoyaltyData(balance);
        if (Array.isArray(hist)) setHistory(hist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-3 border-white/20 border-t-(--medium-shade) rounded-full animate-spin mb-4"></div>
        <p className="text-white/40 text-sm">Ładowanie programu lojalnościowego...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Program lojalnościowy</h2>
        <p className="text-white/50 text-sm">Za każde zamówienie zbierasz punkty. 1 zł = 1 punkt.</p>
      </div>

      {/* Saldo */}
      <div className="relative overflow-hidden bg-linear-to-br from-(--medium-shade)/20 to-transparent border border-(--medium-shade)/30 rounded-3xl p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-(--medium-shade) rounded-full opacity-10 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-(--medium-shade)/10 border border-(--medium-shade)/20 flex items-center justify-center">
            <FiAward className="text-4xl text-(--medium-shade)" />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Twoje saldo</p>
            <p className="text-5xl font-bold text-(--medium-shade)">
              {loyaltyData?.points || 0}
            </p>
            <p className="text-sm text-white/40 mt-1">punktów lojalnościowych</p>
          </div>
        </div>
      </div>

      {/* Dostępne nagrody */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiGift className="text-(--medium-shade)" /> Dostępne nagrody
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loyaltyData?.allRewards?.map((reward, idx) => {
            const canRedeem = (loyaltyData?.points || 0) >= reward.threshold;
            const progress = Math.min(((loyaltyData?.points || 0) / reward.threshold) * 100, 100);

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${
                  canRedeem
                    ? 'bg-(--medium-shade)/10 border-(--medium-shade)/30 shadow-lg'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-white text-lg">-{reward.discount}%</p>
                    <p className="text-xs text-white/40">na następne zamówienie</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                    canRedeem
                      ? 'bg-(--medium-shade)/20 text-(--medium-shade) border border-(--medium-shade)/30'
                      : 'bg-white/5 text-white/30'
                  }`}>
                    {reward.threshold} pkt
                  </span>
                </div>

                <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      canRedeem ? 'bg-(--medium-shade)' : 'bg-white/20'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-2">
                  {canRedeem
                    ? '✓ Dostępna — wykorzystaj przy następnym zamówieniu w kasie'
                    : `Brakuje ${reward.threshold - (loyaltyData?.points || 0)} pkt`
                  }
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historia */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FiClock className="text-(--medium-shade)" /> Historia punktów
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-10 text-white/30">
            <FiStar className="text-4xl mx-auto mb-3 opacity-30" />
            <p className="text-sm italic">Brak historii punktów. Złóż pierwsze zamówienie!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {history.map((entry) => {
              const isPositive = entry.points > 0;

              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/8 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isPositive
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isPositive ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{entry.description}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">
                      {new Date(entry.createdAt).toLocaleString('pl-PL')}
                      {entry.Order && ` • ${entry.Order.trackingNumber || `#${entry.Order.id}`}`}
                    </p>
                  </div>

                  <div className={`font-bold text-lg whitespace-nowrap ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{entry.points} pkt
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
