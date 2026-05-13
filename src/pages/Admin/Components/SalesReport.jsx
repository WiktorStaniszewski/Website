import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "services/api";
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiDownload, FiCalendar, FiBarChart2, FiPackage, FiActivity } from "react-icons/fi";
import AdminPageLayout, { SkeletonGrid } from './AdminPageLayout';

const API_URL = "http://localhost:5000/api";

export default function SalesReport() {
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('to') || '');
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      let endpoint = 'reports/sales-stats';
      const params = [];
      if (dateFrom) params.push(`from=${dateFrom}`);
      if (dateTo) params.push(`to=${dateTo}`);
      if (params.length > 0) endpoint += '?' + params.join('&');

      const res = await api.get(endpoint);
      setStats(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = () => {
    fetchStats();
  };

  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const token = localStorage.getItem('somnium_token');
      let url = `${API_URL}/reports/sales-pdf`;
      const params = [];
      if (dateFrom) params.push(`from=${dateFrom}`);
      if (dateTo) params.push(`to=${dateTo}`);
      if (params.length > 0) url += '?' + params.join('&');

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        let errMsg = 'Błąd generowania PDF';
        try {
          const errData = await res.json();
          if (errData.message) errMsg = errData.message;
        } catch(e) {}
        throw new Error(errMsg);
      }

      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `raport-sprzedazy-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert(`Nie udało się wygenerować raportu PDF: ${err.message}`);
    } finally {
      setPdfLoading(false);
    }
  };

  const statusLabels = {
    'new': 'Nowe',
    'processing': 'W trakcie',
    'shipped': 'Wysłane',
    'completed': 'Zakończone',
    'cancelled': 'Anulowane',
    'pending_payment': 'Oczekuje wpłaty'
  };

  const statusColors = {
    'new': '#eab308',
    'processing': '#f97316',
    'shipped': '#3b82f6',
    'completed': '#22c55e',
    'cancelled': '#ef4444',
    'pending_payment': '#6366f1'
  };

  // Prosty wykres słupkowy z CSS
  const renderBarChart = (dailySales) => {
    if (!dailySales) return null;
    const entries = Object.entries(dailySales).slice(-14);
    if (entries.length === 0) return null;
    const maxRevenue = Math.max(...entries.map(([_, d]) => d.revenue), 1);
    
    const scaleMax = Math.ceil(maxRevenue / 100) * 100;

    return (
      <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg relative group/chart">
        <h3 className="text-lg font-bold text-[#F2EAE1] mb-6 flex items-center gap-2">
          <FiBarChart2 className="text-(--medium-shade)" /> Sprzedaż dzienna
        </h3>
        
        <div className="relative flex gap-2">
          <div className="flex flex-col justify-between h-[180px] text-[10px] text-white/50 font-mono text-left w-8 -mt-1.5">
            {[1, 0.75, 0.5, 0.25, 0].map((factor) => (
              <span key={factor} className="leading-none">
                {(scaleMax * factor).toFixed(0)}
              </span>
            ))}
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-x-0 top-0 h-[180px] flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-px border-t border-dashed border-white/20" />
              ))}
            </div>

            <div className="flex items-end gap-2 h-[180px] relative z-10 px-2">
              {entries.map(([day, data]) => {
                const height = (data.revenue / scaleMax) * 100;

                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col items-center justify-end group h-full relative"
                  >
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                      <div className="bg-[#1a1614] text-(--medium-shade) text-[10px] font-bold px-2 py-1.5 rounded-lg shadow-2xl border border-white/10 whitespace-nowrap">
                        {data.revenue.toFixed(2)} zł
                      </div>
                    </div>

                    <div
                      className="w-full relative transition-all duration-700 ease-out cursor-pointer group-hover:scale-x-105 origin-bottom"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${day}: ${data.revenue.toFixed(2)} PLN`}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-(--medium-shade)/40 to-(--medium-shade) rounded-t-lg shadow-[0_0_20px_rgba(215,185,148,0.1)] group-hover:shadow-[0_0_25px_rgba(215,185,148,0.3)] group-hover:brightness-110 transition-all" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-lg" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daty pod wykresem */}
            <div className="flex items-center gap-2 px-2 mt-2 h-4">
              {entries.map(([day]) => {
                const shortDay = day.slice(5).replace('-', '.');
                return (
                  <div key={`date-${day}`} className="flex-1 flex justify-center">
                    <span className="text-[9px] text-white/30 font-medium whitespace-nowrap">
                      {shortDay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Prosty wykres statusów
  const renderStatusChart = (statusCounts) => {
    if (!statusCounts) return null;
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    return (
      <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
        <h3 className="text-lg font-bold text-[#F2EAE1] mb-4 flex items-center gap-2">
          <FiActivity className="text-(--medium-shade)" /> Rozkład statusów
        </h3>
        {/* Pasek progresji */}
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className="transition-all"
              style={{ 
                width: `${(count / total) * 100}%`, 
                backgroundColor: statusColors[status] || '#888',
                minWidth: count > 0 ? '4px' : '0'
              }}
              title={`${statusLabels[status] || status}: ${count}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 text-xs bg-[#2D231C] px-3 py-2.5 rounded-xl border border-[#5C4A3D]">
              <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: statusColors[status] || '#888' }} />
              <span className="text-white/60 truncate" title={statusLabels[status] || status}>
                 {statusLabels[status] || status}
              </span>
              <span className="font-black text-white ml-auto bg-black/40 px-2 py-0.5 rounded-md">
                 {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminPageLayout
      title="Raporty sprzedaży"
      subtitle="Analiza statystyk i eksport danych"
      actions={
        <button
          onClick={handleExportPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-6 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <FiDownload /> {pdfLoading ? 'Generowanie...' : 'Eksportuj PDF'}
        </button>
      }
    >
      {/* Filtr dat */}
      <div className="flex flex-col sm:flex-row items-end gap-3 mb-6">
        <div className="flex-1 w-full sm:w-auto">
          <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Od</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-(--medium-shade) transition-colors cursor-pointer"
            />
          </div>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Do</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-(--medium-shade) transition-colors cursor-pointer"
            />
          </div>
        </div>
        <button
          onClick={handleFilter}
          className="bg-[#46382E] hover:bg-[#5C4A3D] border border-[#5C4A3D] text-[#F2EAE1] px-6 py-3 rounded-xl font-bold transition-colors cursor-pointer"
        >
          Filtruj
        </button>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : stats ? (
        <div className="space-y-6">
          {/* Główne kafelki */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<FiDollarSign />} 
              label="Łączny przychód" 
              value={`${stats.totalRevenue.toFixed(2)} PLN`}
              accent 
            />
            <StatCard 
              icon={<FiShoppingCart />} 
              label="Zamówienia ogółem" 
              value={stats.totalOrders} 
            />
            <StatCard 
              icon={<FiTrendingUp />} 
              label="Średnia wartość" 
              value={`${stats.averageOrderValue.toFixed(2)} PLN`} 
            />
            <StatCard 
              icon={<FiDollarSign />} 
              label="Dzisiejszy przychód" 
              value={`${stats.todayRevenue.toFixed(2)} PLN`}
              sub={`${stats.todayOrders} zamówień`}
            />
          </div>

          {/* Kafelki tygodniowe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              icon={<FiBarChart2 />}
              label="Przychód tygodniowy"
              value={`${stats.weekRevenue.toFixed(2)} PLN`}
              sub={`${stats.weekOrders} zamówień`}
            />
            <StatCard
              icon={<FiActivity />}
              label="Średnia dzienna (tydzień)"
              value={`${(stats.weekRevenue / 7).toFixed(2)} PLN`}
              sub={`${(stats.weekOrders / 7).toFixed(1)} zamówień/dzień`}
            />
          </div>

          {/* Wykresy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderBarChart(stats.dailySales)}
            {renderStatusChart(stats.statusCounts)}
          </div>

          {/* Top produkty */}
          {stats.topProducts && stats.topProducts.length > 0 && (
            <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
              <h3 className="text-lg font-bold text-[#F2EAE1] mb-4 flex items-center gap-2">
                <FiPackage className="text-(--medium-shade)" /> Najpopularniejsze produkty
              </h3>
              <div className="space-y-3">
                {stats.topProducts.map((product, idx) => {
                  const maxRev = stats.topProducts[0]?.revenue || 1;
                  const barWidth = (product.revenue / maxRev) * 100;

                  return (
                    <div key={idx} className="group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-[#F2EAE1] truncate max-w-[60%]">
                          {idx + 1}. {product.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span>{product.quantity} szt.</span>
                          <span className="font-bold text-(--medium-shade)">{product.revenue.toFixed(2)} PLN</span>
                        </div>
                      </div>
                      <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-(--medium-shade)/60 rounded-full transition-all duration-700"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-white/50 py-16">Brak danych do wyświetlenia.</div>
      )}
    </AdminPageLayout>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-3xl border shadow-lg transition-all ${
      accent 
        ? 'bg-(--medium-shade)/10 border-(--medium-shade)/30' 
        : 'bg-[#46382E] border-[#5C4A3D]'
    }`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 text-(--medium-shade)">
        <span className="text-5xl">{icon}</span>
      </div>
      <div className="text-[#F2EAE1]/60 text-[10px] uppercase tracking-widest font-bold mb-2">{label}</div>
      <div className={`text-2xl font-bold ${accent ? 'text-(--medium-shade)' : 'text-[#F2EAE1]'}`}>
        {value}
      </div>
      {sub && <p className="text-xs text-[#F2EAE1]/40 mt-1">{sub}</p>}
    </div>
  );
}
