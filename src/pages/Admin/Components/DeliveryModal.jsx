import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiPlus, FiBox, FiEdit2, FiUploadCloud, FiTrash2 } from "react-icons/fi";
import api from "services/api";

export default function DeliveryModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [deliveryData, setDeliveryData] = useState({
      name: "",
      notes: "",
      locationId: ""
  });
  
  const [actions, setActions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeForm, setActiveForm] = useState(null); 
  
  const defaultProductState = {
      name: "", producent: "", category: "Ziarna", price: "", stockQuantity: "", image: "", description: "",
      size: "", purpose: "", flavours: "", processingMethod: "", variety: "", farm: "", roastDate: "", teaType: ""
  };
  
  const [formData, setFormData] = useState(defaultProductState);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }
    
    return () => {
        document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
      if (isOpen) {
          api.get("locations").then(res => setLocations(res)).catch(console.error);
          api.get("products").then(res => setProducts(res)).catch(console.error);
          
          setDeliveryData({ name: `Dostawa ${new Date().toLocaleDateString('pl-PL')}`, notes: "", locationId: "" });
          setActions([]);
          setStep(1);
          closeSubForm();
      }
  }, [isOpen]);

  const closeSubForm = () => {
      setActiveForm(null);
      setFormData(defaultProductState);
      setSelectedProductId("");
      setSelectedFile(null);
      setPreviewUrl(null);
  };

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

  const handleAddAction = async (e) => {
      e.preventDefault();
      
      let actionPayload = { id: Date.now(), type: activeForm };

      if (activeForm === 'ADD_STOCK') {
          const prod = products.find(p => String(p.id) === String(selectedProductId));
          actionPayload = { ...actionPayload, productId: prod.id, productName: prod.name, quantity: parseInt(formData.stockQuantity) };
      } 
      
      else if (activeForm === 'CREATE_PRODUCT' || activeForm === 'EDIT_PRODUCT') {
          const cleanData = { ...formData };
          if (cleanData.category !== "Ziarna") {
              cleanData.flavours = ""; cleanData.processingMethod = ""; cleanData.variety = ""; cleanData.farm = ""; cleanData.roastDate = "";
          }
          if (cleanData.category !== "Herbaty") cleanData.teaType = "";
          if (cleanData.category === "Kubki") { cleanData.size = ""; cleanData.purpose = ""; }

          actionPayload = { 
              ...actionPayload, 
              productName: cleanData.name || "Nowy produkt",
              productData: cleanData,
              file: selectedFile 
          };

          if (activeForm === 'EDIT_PRODUCT') {
              actionPayload.productId = selectedProductId;
          }
      }

      setActions([...actions, actionPayload]);
      closeSubForm();
  };

  const removeAction = (id) => {
      setActions(actions.filter(a => a.id !== id));
  };

  const handleSubmitDelivery = async () => {
      if (!deliveryData.locationId) return alert("Wybierz docelowy magazyn!");
      if (actions.length === 0) return alert("Dodaj przynajmniej jedną akcję do dostawy!");

      setIsSubmitting(true);
      try {
          let processedActions = [];

          for (const action of actions) {
              if (action.type === 'CREATE_PRODUCT') {
                  const payload = new FormData();
                  Object.keys(action.productData).forEach(key => payload.append(key, action.productData[key]));
                  if (action.file) payload.append('image', action.file);
                  
                  const newProd = await api.post('products', payload);
                  processedActions.push({ type: 'ADD_STOCK', productId: newProd.id, quantity: action.productData.stockQuantity });
              } 
              else if (action.type === 'EDIT_PRODUCT') {
                  const payload = new FormData();
                  Object.keys(action.productData).forEach(key => payload.append(key, action.productData[key]));
                  if (action.file) payload.append('image', action.file);
                  
                  await api.put('products', action.productId, payload);
              }
              else {
                  processedActions.push({ type: action.type, productId: action.productId, quantity: action.quantity });
              }
          }

          await api.post('deliveries', {
              ...deliveryData,
              actions: processedActions
          });

          onSuccess();
          onClose();
      } catch (err) {
          console.error(err);
          alert("Wystąpił błąd podczas rejestracji dostawy.");
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

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#24201d] border border-white/10 rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#2D231C] rounded-t-3xl shrink-0">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
              <FiBox className="text-(--medium-shade)" /> Rejestracja Dostawy
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer"><FiX size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-8 text-white">
            
            <div className={`transition-opacity ${step !== 1 ? 'opacity-50 pointer-events-none hidden' : ''}`}>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Identyfikator / Nazwa dostawy</label>
                        <input type="text" value={deliveryData.name} onChange={(e) => setDeliveryData({...deliveryData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                    </div>
                    <div>
                        <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Cel dostawy (Magazyn)</label>
                        <select value={deliveryData.locationId} onChange={(e) => setDeliveryData({...deliveryData, locationId: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) cursor-pointer">
                            <option value="" disabled>Wybierz placówkę...</option>
                            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Notatki (opcjonalnie)</label>
                        <textarea value={deliveryData.notes} onChange={(e) => setDeliveryData({...deliveryData, notes: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) resize-none" rows="2" />
                    </div>
                    
                    <button 
                        onClick={() => setStep(2)} disabled={!deliveryData.locationId || !deliveryData.name}
                        className="w-full py-3 bg-(--medium-shade) text-[#24201d] font-bold rounded-xl mt-4 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        Przejdź do dodawania towaru
                    </button>
                </div>
            </div>

            {step === 2 && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-right-4">
                    
                    {!activeForm ? (
                        <>
                            <div className="flex gap-4">
                                <button onClick={() => setActiveForm('ADD_STOCK')} className="flex-1 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer">
                                    <FiPlus className="text-2xl text-(--medium-shade)" />
                                    <span className="font-bold text-sm">Dodaj sztuki (Istniejący produkt)</span>
                                </button>
                                <button onClick={() => setActiveForm('CREATE_PRODUCT')} className="flex-1 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer">
                                    <FiBox className="text-2xl text-(--medium-shade)" />
                                    <span className="font-bold text-sm">Utwórz całkowicie nowy produkt</span>
                                </button>
                            </div>

                            {actions.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-bold text-lg mb-3 border-b border-white/10 pb-2">Zawartość Dostawy:</h3>
                                    <div className="space-y-2">
                                        {actions.map(action => (
                                            <div key={action.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded border mr-3
                                                        ${action.type === 'ADD_STOCK' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                        {action.type === 'ADD_STOCK' ? '+ SZTUKI' : 'NOWY PRODUKT'}
                                                    </span>
                                                    <span className="font-bold">{action.productName}</span>
                                                    {action.type === 'ADD_STOCK' && <span className="ml-2 text-white/50">+{action.quantity} szt.</span>}
                                                </div>
                                                <button onClick={() => removeAction(action.id)} className="text-red-400 hover:text-red-300 p-2 cursor-pointer"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleAddAction} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-4 animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                                <h3 className="font-bold text-(--medium-shade)">
                                    {activeForm === 'ADD_STOCK' ? 'Dodaj stan magazynowy' : 'Definiowanie nowego produktu'}
                                </h3>
                                <button type="button" onClick={closeSubForm} className="text-white/50 hover:text-white"><FiX /></button>
                            </div>

                            {activeForm === 'ADD_STOCK' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold opacity-70 uppercase">Wybierz produkt</label>
                                        <select required value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)">
                                            <option value="" disabled>Z listy...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold opacity-70 uppercase">Ilość dostarczona</label>
                                        <input type="number" required min="1" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                                    </div>
                                </div>
                            )}

                            {activeForm === 'CREATE_PRODUCT' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold opacity-70 uppercase">Nazwa Produktu</label>
                                        <input type="text" required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold opacity-70 uppercase">Kategoria</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) font-bold">
                                            <option value="Ziarna">Ziarna do kawy</option>
                                            <option value="Zaparzacze">Zaparzacze</option>
                                            <option value="Herbaty">Herbaty / Matcha</option>
                                            <option value="Filtry">Filtry</option>
                                            <option value="Kubki">Kubki</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs font-bold opacity-70 uppercase">Cena (PLN)</label>
                                            <input type="number" step="0.01" required name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold opacity-70 uppercase">Sztuk w dostawie</label>
                                            <input type="number" required name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade)" />
                                        </div>
                                    </div>
                                    
                                    {renderDynamicFields()}

                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Zdjęcie</label>
                                        <div onClick={() => fileInputRef.current.click()} className="mt-2 border-2 border-dashed border-white/20 hover:border-(--medium-shade) rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer h-32 relative overflow-hidden">
                                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" />
                                            {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full object-contain" /> : <><FiUploadCloud className="text-2xl text-white/40 mb-1" /><span className="text-xs text-white/50">Wgraj zdjęcie</span></>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={closeSubForm} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold cursor-pointer">Anuluj</button>
                                <button type="submit" className="flex-1 py-3 bg-(--medium-shade) text-[#24201d] rounded-xl font-bold cursor-pointer">Dodaj do listy operacji</button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>

        <div className="p-6 border-t border-white/10 bg-[#2D231C] rounded-b-3xl shrink-0 flex justify-between items-center">
            {step === 2 && (
                <button onClick={() => setStep(1)} className="text-white/50 hover:text-white font-bold px-4 py-2 cursor-pointer">
                    &larr; Wróć
                </button>
            )}
            <div className="flex gap-3 ml-auto">
                <button onClick={onClose} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold cursor-pointer">Anuluj</button>
                <button 
                    onClick={handleSubmitDelivery} 
                    disabled={isSubmitting || actions.length === 0}
                    className="px-8 py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] rounded-xl font-bold disabled:opacity-50 cursor-pointer shadow-lg"
                >
                    {isSubmitting ? "Zapisywanie..." : "Zatwierdź całą dostawę"}
                </button>
            </div>
        </div>

      </div>
    </div>,
    document.body
  );
}