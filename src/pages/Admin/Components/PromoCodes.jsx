import { useState, useEffect } from "react";
import api from "services/api";
import { FiTag, FiPlus, FiX, FiTrash2, FiToggleLeft, FiToggleRight, FiClock, FiUsers, FiPercent, FiAlertCircle } from "react-icons/fi";
import AdminPageLayout, { SkeletonRow } from './AdminPageLayout';
import ConfirmModal from 'src/components/ConfirmModal';

export default function PromoCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, codeId: null, codeName: '' });

  const [form, setForm] = useState({
    code: '', discountPercent: '', usageType: 'single', maxUsesPerUser: 1, expiresAt: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await api.get('promo-codes');
      if (Array.isArray(res)) setCodes(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      if (!form.code.trim() || !form.discountPercent) {
        setFormError('Wypełnij wszystkie wymagane pola.');
        return;
      }

      await api.post('promo-codes', {
        code: form.code,
        discountPercent: parseInt(form.discountPercent),
        usageType: form.usageType,
        maxUsesPerUser: parseInt(form.maxUsesPerUser) || 1,
        expiresAt: form.expiresAt || null
      });

      setForm({ code: '', discountPercent: '', usageType: 'single', maxUsesPerUser: 1, expiresAt: '' });
      setIsModalOpen(false);
      fetchCodes();
    } catch (err) {
      setFormError(err.message || 'Błąd tworzenia kodu.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggle = async (code) => {
    try {
      await api.put('promo-codes', code.id, { isActive: !code.isActive });
      fetchCodes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.codeId) return;
    try {
      await api.delete('promo-codes', deleteModal.codeId);
      setDeleteModal({ isOpen: false, codeId: null, codeName: '' });
      fetchCodes();
    } catch (err) {
      console.error(err);
    }
  };

  const isExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();

  return (
    <AdminPageLayout
      title="Kody promocyjne"
      subtitle={`Zarządzaj kodami rabatowymi (${codes.length})`}
      actions={
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-6 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-lg"
        >
          <FiPlus /> Nowy kod
        </button>
      }
    >
      <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6 md:p-8 min-h-[400px]">
        {loading ? (
          <SkeletonRow count={4} />
        ) : codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiTag className="text-5xl text-white/10 mb-3" />
            <p className="text-sm opacity-50 italic">Brak kodów promocyjnych. Utwórz pierwszy!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {codes.map((code) => {
              const expired = isExpired(code.expiresAt);
              const usageCount = code.PromoCodeUsages?.length || 0;

              return (
                <div
                  key={code.id}
                  className={`group p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    !code.isActive || expired
                      ? 'bg-white/3 border-white/5 opacity-60'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-xl text-(--medium-shade) tracking-widest">
                        {code.code}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        expired
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : code.isActive
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {expired ? 'WYGASŁY' : code.isActive ? 'AKTYWNY' : 'WYŁĄCZONY'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <FiPercent /> {code.discountPercent}% zniżki
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers /> {code.usageType === 'single' ? `1x/osobę` : `${code.maxUsesPerUser}x/osobę`}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTag /> Użyto: {usageCount} razy
                      </span>
                      {code.expiresAt && (
                        <span className="flex items-center gap-1">
                          <FiClock /> Do: {new Date(code.expiresAt).toLocaleDateString('pl-PL')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(code)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                        code.isActive
                          ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                          : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'
                      }`}
                      title={code.isActive ? 'Wyłącz' : 'Włącz'}
                    >
                      {code.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, codeId: code.id, codeName: code.code })}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-white/30 transition-all cursor-pointer"
                      title="Usuń"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal tworzenia kodu */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#24201d] w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiTag className="text-(--medium-shade)" /> Nowy kod promocyjny
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white cursor-pointer">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Nazwa kodu *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="np. LATO2026"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-(--medium-shade) transition-colors uppercase tracking-widest font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Zniżka (%) *</label>
                  <input
                    type="number"
                    min="1" max="100"
                    value={form.discountPercent}
                    onChange={(e) => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                    placeholder="10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-(--medium-shade) transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Max użyć / osobę</label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUsesPerUser}
                    onChange={(e) => setForm(f => ({ ...f, maxUsesPerUser: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-(--medium-shade) transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Typ użycia</label>
                  <select
                    value={form.usageType}
                    onChange={(e) => setForm(f => ({ ...f, usageType: e.target.value, maxUsesPerUser: e.target.value === 'single' ? 1 : f.maxUsesPerUser }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-(--medium-shade) transition-colors cursor-pointer"
                  >
                    <option value="single" className="bg-[#24201d]">Jednorazowy</option>
                    <option value="multi" className="bg-[#24201d]">Wielokrotny</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1 block">Data wygaśnięcia</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-(--medium-shade) transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <FiAlertCircle /> {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-(--medium-shade) hover:brightness-110 text-[#24201d] py-4 rounded-xl font-bold transition-all cursor-pointer disabled:opacity-50 shadow-lg"
              >
                {formSubmitting ? 'Tworzenie...' : 'Utwórz kod'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, codeId: null, codeName: '' })}
        onConfirm={handleDelete}
        title="Usuń kod promocyjny"
        description={`Czy na pewno chcesz usunąć kod "${deleteModal.codeName}"? Tej operacji nie można cofnąć.`}
        confirmText="Usuń"
        cancelText="Anuluj"
      />
    </AdminPageLayout>
  );
}
