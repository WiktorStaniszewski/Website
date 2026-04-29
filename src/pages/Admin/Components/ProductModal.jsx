import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiUploadCloud, FiBox } from "react-icons/fi";
import api from "services/api";

export default function ProductModal({ isOpen, onClose, onSuccess }) {
  const defaultState = {
      name: "", producent: "", category: "Ziarna", price: "", image: "", description: "",
      size: "", purpose: "", flavours: "", processingMethod: "", variety: "", farm: "", roastDate: "", teaType: ""
  };
  
  const [formData, setFormData] = useState(defaultState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
      if (isOpen) {
          setFormData(defaultState);
          setSelectedFile(null);
          setPreviewUrl(null);
          document.body.style.overflow = "hidden";
      } else {
          document.body.style.overflow = "unset";
      }
      return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const cleanData = { ...formData, stockQuantity: 0 }; // Wymuszamy stan początkowy 0
          if (cleanData.category !== "Ziarna") {
              cleanData.flavours = ""; cleanData.processingMethod = ""; cleanData.variety = ""; cleanData.farm = ""; cleanData.roastDate = "";
          }
          if (cleanData.category !== "Herbaty") cleanData.teaType = "";
          if (cleanData.category === "Kubki") { cleanData.size = ""; cleanData.purpose = ""; }

          const payload = new FormData();
          Object.keys(cleanData).forEach(key => payload.append(key, cleanData[key]));
          if (selectedFile) payload.append('image', selectedFile);

          await api.post('products', payload);
          if (onSuccess) onSuccess();
          onClose();
      } catch (err) {
          console.error(err);
          alert("Wystąpił błąd podczas dodawania produktu.");
      } finally {
          setIsSubmitting(false);
      }
  };

  const renderDynamicFields = () => {
      const cat = formData.category;
      return (
          <div className="bg-[#352A21] p-5 rounded-2xl border border-[#5C4A3D] space-y-4 col-span-1 md:col-span-2 mt-2">
              <h3 className="font-bold text-(--medium-shade) mb-2">Specyfikacja ({cat})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Marka / Producent</label>
                    <input type="text" name="producent" value={formData.producent} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                  </div>

                  {(cat === "Ziarna" || cat === "Herbaty" || cat === "Filtry") && (
                    <div>
                      <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Rozmiar / Waga</label>
                      <input type="text" name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                    </div>
                  )}

                  {(cat === "Zaparzacze" || cat === "Ziarna") && (
                    <div>
                      <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Przeznaczenie</label>
                      <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="np. Filtr, Espresso" className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                    </div>
                  )}

                  {cat === "Herbaty" && (
                    <div>
                      <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Rodzaj</label>
                      <input type="text" name="teaType" value={formData.teaType} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                    </div>
                  )}

                  {cat === "Ziarna" && (
                    <>
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Profil Smakowy</label>
                          <input type="text" name="flavours" value={formData.flavours} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Obróbka</label>
                          <input type="text" name="processingMethod" value={formData.processingMethod} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Odmiana (Variety)</label>
                          <input type="text" name="variety" value={formData.variety} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1">Farma</label>
                          <input type="text" name="farm" value={formData.farm} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Data Wypalenia</label>
                          <input type="date" name="roastDate" value={formData.roastDate} onChange={handleInputChange} className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) text-white" />
                        </div>
                    </>
                  )}
              </div>
          </div>
      );
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#24201d] border border-white/10 rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#2D231C] rounded-t-3xl shrink-0">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <FiBox className="text-(--medium-shade)" /> Szybkie dodawanie produktu
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer"><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Nazwa Produktu</label>
                    <input type="text" required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                </div>
                <div>
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Kategoria</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) font-bold">
                        <option value="Ziarna">Ziarna do kawy</option>
                        <option value="Zaparzacze">Zaparzacze</option>
                        <option value="Herbaty">Herbaty / Matcha</option>
                        <option value="Filtry">Filtry</option>
                        <option value="Kubki">Kubki i Szkło</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Cena (PLN)</label>
                    <input type="number" step="0.01" required name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                </div>

                <div className="md:col-span-2">
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Opis produktu</label>
                    <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) resize-none" />
                </div>
                
                {renderDynamicFields()}

                <div className="md:col-span-2 mt-2">
                    <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Zdjęcie</label>
                    <div onClick={() => fileInputRef.current.click()} className="mt-2 border-2 border-dashed border-white/20 hover:border-(--medium-shade) rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer h-40 relative overflow-hidden transition-colors">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" />
                        {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full object-contain" /> : <><FiUploadCloud className="text-3xl text-white/40 mb-2" /><span className="text-sm font-bold text-white/50">Kliknij, aby wgrać zdjęcie</span></>}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-2 pt-6 border-t border-white/10">
                <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold cursor-pointer transition-colors">Anuluj</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] rounded-xl font-bold cursor-pointer transition-colors shadow-lg disabled:opacity-50">
                    {isSubmitting ? "Zapisywanie..." : "Utwórz produkt"}
                </button>
            </div>
        </form>

      </div>
    </div>,
    document.body
  );
}