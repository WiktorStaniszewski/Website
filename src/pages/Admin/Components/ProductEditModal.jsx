import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FiUpload } from 'react-icons/fi';
import { FiSave } from 'react-icons/fi';
import { FiImage } from 'react-icons/fi';
import { FiPackage } from 'react-icons/fi';
import { FiCoffee } from 'react-icons/fi';
import { FiTag } from 'react-icons/fi';
import api from 'services/api';

export default function ProductEditModal({ isOpen, onClose, product, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    company: '',
    category: 'Kawa',
    flavours: '',
    size: '',
    purpose: '',
    processingMethod: '',
    variety: '',
    farm: '',
    roastDate: '',
    teaType: '',
    variantGroup: '',
    stockQuantity: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        company: product.company || '',
        category: product.category || 'Kawa',
        flavours: product.flavours || '',
        size: product.size || '',
        purpose: product.purpose || '',
        processingMethod: product.processingMethod || '',
        variety: product.variety || '',
        farm: product.farm || '',
        roastDate: product.roastDate ? new Date(product.roastDate).toISOString().split('T')[0] : '',
        teaType: product.teaType || '',
        variantGroup: product.variantGroup || '',
        stockQuantity: product.stockQuantity || ''
      });
      if (product.image) {
        setImagePreview(`${import.meta.env.VITE_BACKEND_URL}/images/products/${product.image}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        name: '', description: '', price: '', company: '', category: 'Kawa',
        flavours: '', size: '', purpose: '', processingMethod: '', variety: '',
        farm: '', roastDate: '', teaType: '', variantGroup: '', stockQuantity: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      if (product) {
        await api.put('products', product.id, submitData);
      } else {
        await api.post('products', submitData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd podczas zapisywania produktu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[#24201d] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#2D231C]">
          <h2 className="text-xl font-bold text-[#F2EAE1] flex items-center gap-3">
            <FiPackage className="text-(--medium-shade)" />
            {product ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Lewa kolumna - Podstawowe dane i zdjęcie */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Zdjęcie produktu</label>
                <div className="relative aspect-square rounded-2xl border-2 border-dashed border-white/10 overflow-hidden group bg-black/20 flex flex-col items-center justify-center hover:border-(--medium-shade) transition-colors">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-white/20">
                      <FiImage size={48} className="mb-2" />
                      <span className="text-sm">Brak zdjęcia</span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex items-center gap-2 bg-(--medium-shade) text-[#24201d] px-4 py-2 rounded-xl font-bold">
                      <FiUpload /> Zmień zdjęcie
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-(--medium-shade) border-b border-white/5 pb-2">Dane podstawowe</h3>
                
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Nazwa produktu *</label>
                  <input 
                    required type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Cena (PLN) *</label>
                    <input 
                      required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange}
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Kategoria *</label>
                    <select 
                      required name="category" value={formData.category} onChange={handleChange}
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none"
                    >
                      <option value="Kawa">Kawa</option>
                      <option value="Herbata">Herbata</option>
                      <option value="Akcesoria">Akcesoria</option>
                      <option value="Słodycze">Słodycze</option>
                      <option value="Inne">Inne</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block">Producent</label>
                  <input 
                    type="text" name="company" value={formData.company} onChange={handleChange}
                    className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Opis</label>
                  <textarea 
                    name="description" rows={3} value={formData.description} onChange={handleChange}
                    className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none resize-none custom-scrollbar"
                  />
                </div>
              </div>
            </div>

            {/* Prawa kolumna - Detale i magazyn */}
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-(--medium-shade) border-b border-white/5 pb-2 flex items-center gap-2">
                  <FiCoffee /> Cechy specyficzne
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Smak (nuty)</label>
                    <input 
                      type="text" name="flavours" value={formData.flavours} onChange={handleChange} placeholder="np. czekolada, orzech"
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Rozmiar/Waga</label>
                    <input 
                      type="text" name="size" value={formData.size} onChange={handleChange} placeholder="np. 250g, 1kg"
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Przeznaczenie</label>
                    <input 
                      type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="np. Espresso"
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Metoda obróbki</label>
                    <input 
                      type="text" name="processingMethod" value={formData.processingMethod} onChange={handleChange} placeholder="np. Washed, Natural"
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Odmiana (Variety)</label>
                    <input 
                      type="text" name="variety" value={formData.variety} onChange={handleChange}
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Farma/Pochodzenie</label>
                    <input 
                      type="text" name="farm" value={formData.farm} onChange={handleChange}
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Data wypalenia</label>
                    <input 
                      type="date" name="roastDate" value={formData.roastDate} onChange={handleChange}
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Rodzaj herbaty</label>
                    <input 
                      type="text" name="teaType" value={formData.teaType} onChange={handleChange} placeholder="np. Czarna, Zielona"
                      className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#2D231C]/30 rounded-xl border border-white/5">
                  <label className="text-xs text-white/50 mb-1 block">Grupa wariantowa</label>
                  <input 
                    type="text" name="variantGroup" value={formData.variantGroup} onChange={handleChange} placeholder="np. gwatemala-meissa (puste = brak wariantów)"
                    className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-(--medium-shade) outline-none"
                  />
                  <p className="text-[10px] text-white/30 mt-1">Produkty z tą samą grupą wyświetlą się jako warianty rozmiarowe w sklepie.</p>
                </div>
              </div>

              <div className="space-y-4 bg-[#2D231C]/50 p-5 rounded-2xl border border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FiTag /> Stan początkowy / Aktualizacja na Magazynie
                </h3>
                <p className="text-xs text-white/40">Zaktualizowanie tej wartości dopisze wpis do Magazynu Głównego (Globalnie). Pozostaw puste, jeśli nie zmieniasz stanu.</p>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Całkowity stan magazynowy</label>
                  <input 
                    type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange}
                    className="w-full bg-[#1a1614] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-(--medium-shade) outline-none"
                  />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#2D231C] flex justify-end gap-4">
          <button 
            type="button" onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Anuluj
          </button>
          <button 
            type="submit" form="productForm" disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-(--medium-shade) text-[#24201d] hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(215,185,148,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? 'Zapisywanie...' : <><FiSave /> Zapisz produkt</>}
          </button>
        </div>

      </div>
    </div>
  );
}
