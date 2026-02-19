import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiEdit2, FiTrash2, FiPlus, FiTag, FiX, FiUploadCloud } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    producent: "",
    category: "Kawa", 
    price: "",
    image: "",
    flavours: "",
    description: ""
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
        const res = await api.get("products");
        if(Array.isArray(res)) setProducts(res);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    if (searchParams.get("add") === "true") {
        openAddModal();
        setSearchParams({});
    }
  }, [searchParams]);

  const handleDelete = async (id) => {
    if(window.confirm("Czy na pewno usunąć ten produkt?")) {
      try {
        await api.delete("products", id); 
        fetchProducts(); 
      } catch (error) {
        alert("Błąd podczas usuwania");
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", producent: "", category: "Kawa", price: "", image: "", flavours: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      producent: product.producent || "",
      category: product.category || "Kawa",
      price: product.price || "",
      image: product.image || "",
      flavours: product.flavours || "",
      description: product.description || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, image: e.dataTransfer.files[0].name }));
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0].name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = { ...formData };
      if (finalData.category !== "Kawa") finalData.flavours = ""; 

      if (editingProduct) {
        await api.put("products", editingProduct.id, finalData);
      } else {
        await api.post("products", finalData);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisywania produktu.");
    }
  };

  if (loading) return <div className="text-(--medium-shade) font-bold text-center mt-20">Ładowanie produktów...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 not-lg:pt-20">
      
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">Produkty</h1>
            <p className="text-[#F2EAE1]/60 font-medium text-sm mt-1">Zarządzaj asortymentem ({products.length})</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <FiPlus /> <span className="hidden sm:inline">Dodaj Produkt</span>
        </button>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden md:block rounded-3xl border border-[#5C4A3D] overflow-hidden bg-[#46382E] shadow-xl">
        <table className="w-full text-left text-sm text-[#F2EAE1]">
          <thead className="bg-[#352A21] text-(--medium-shade) uppercase text-xs tracking-wider border-b border-[#5C4A3D]">
            <tr>
              <th className="p-6 font-bold">ZDJĘCIE & NAZWA</th>
              <th className="p-6 font-bold">PRODUCENT</th>
              <th className="p-6 font-bold">KATEGORIA</th>
              <th className="p-6 font-bold">CENA</th>
              <th className="p-6 text-right font-bold">AKCJE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#846f60] bg-(--medium-shade)/20">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#5C4A3D]/50 transition-colors group">
                <td className="p-6 font-medium text-base flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2D231C] border border-[#5C4A3D]">
                     <img src={`images/tempProducts/${p.image || p.img}`} alt={p.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'}/>
                  </div>
                  {p.name}
                </td>
                <td className="p-6 text-[#F2EAE1]/60 font-medium">{p.producent || "Brak"}</td>
                <td className="p-6">
                    <span className="bg-[#2D231C] px-3 py-1 rounded-full text-xs font-bold border border-[#5C4A3D] text-[#F2EAE1]/80">
                        {p.category}
                    </span>
                </td>
                <td className="p-6 font-mono font-bold text-(--medium-shade)">{p.price} PLN</td>
                <td className="p-6 text-right flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity items-center">
                  <button onClick={() => openEditModal(p)} className="p-2 hover:bg-(--medium-shade) hover:text-[#24201d] rounded-lg transition-colors cursor-pointer" title="Edytuj">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer" title="Usuń">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Card View --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((p) => (
            <div key={p.id} className="bg-[#46382E] border border-[#5C4A3D] p-5 rounded-3xl shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-[#F2EAE1] mb-1">{p.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-[#F2EAE1]/50">
                            <FiTag /> {p.category}
                        </div>
                    </div>
                    <div className="font-mono text-(--medium-shade) font-bold text-lg">
                        {p.price} <span className="text-xs">PLN</span>
                    </div>
                </div>
                
                <div className="flex gap-2 mt-2 pt-4 border-t border-[#5C4A3D]">
                    <button onClick={() => openEditModal(p)} className="flex-1 py-3 bg-[#352A21] rounded-xl text-sm font-bold text-[#F2EAE1]/80 hover:bg-[#5C4A3D] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <FiEdit2 /> Edytuj
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="flex-1 py-3 bg-red-500/10 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <FiTrash2 /> Usuń
                    </button>
                </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
          
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-101 w-[95%] max-w-2xl max-h-[90vh] bg-[#46382E] border border-[#5C4A3D] rounded-3xl flex flex-col shadow-[0_10px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center p-6 border-b border-[#5C4A3D] bg-[#352A21] rounded-t-3xl">
              <h2 className="text-2xl font-serif font-bold text-(--medium-shade)">
                {editingProduct ? "Edytuj produkt" : "Dodaj nowy produkt"}
              </h2>
              <button onClick={closeModal} className="text-[#F2EAE1]/50 hover:text-red-400 transition-colors cursor-pointer">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5 custom-scrollbar text-[#F2EAE1]">
              
              {/* DRAG AND DROP ZONE */}
              <div className="w-full">
                 <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Zdjęcie produktu</label>
                 <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`mt-2 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                      ${isDragging ? 'border-(--medium-shade) bg-(--medium-shade)/10' : 'border-[#5C4A3D] hover:bg-[#5C4A3D]/50 hover:border-[#8f785d]'}
                    `}
                 >
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" />
                    <FiUploadCloud className={`text-4xl mb-3 ${isDragging ? 'text-(--medium-shade)' : 'text-[#F2EAE1]/40'}`} />
                    {formData.image ? (
                        <p className="font-bold text-(--medium-shade)">Wybrano: {formData.image}</p>
                    ) : (
                        <div>
                          <p className="font-bold">Przeciągnij i upuść plik tutaj</p>
                          <p className="text-xs text-[#F2EAE1]/50 mt-1">lub kliknij, aby przeglądać</p>
                        </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Nazwa produktu</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                    className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Producent</label>
                  <input 
                    type="text" name="producent" value={formData.producent} onChange={handleInputChange} placeholder="np. Roastains"
                    className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1] placeholder-[#F2EAE1]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Kategoria</label>
                  <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1] font-bold"
                  >
                    <option value="Kawa">Kawa</option>
                    <option value="Herbata">Herbata</option>
                    <option value="Akcesoria">Akcesoria</option>
                    <option value="Inne">Inne</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Cena (PLN)</label>
                  <input 
                    type="number" name="price" step="0.01" required value={formData.price} onChange={handleInputChange}
                    className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1]"
                  />
                </div>
              </div>

              {formData.category === "Kawa" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Nuty smakowe (oddziel przecinkami)</label>
                  <input 
                    type="text" name="flavours" value={formData.flavours} onChange={handleInputChange} placeholder="np. Czekolada, Orzechy, Wiśnia"
                    className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1] placeholder-[#F2EAE1]/30"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Opis produktu</label>
                <textarea 
                  name="description" rows="3" value={formData.description} onChange={handleInputChange}
                  className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors text-[#F2EAE1] resize-none"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#5C4A3D] flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-3 bg-[#352A21] hover:bg-[#2D231C] border border-[#5C4A3D] text-[#F2EAE1] rounded-xl font-bold transition-colors cursor-pointer">
                  Anuluj
                </button>
                <button type="submit" className="flex-1 py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] rounded-xl font-bold transition-colors cursor-pointer">
                  {editingProduct ? "Zapisz zmiany" : "Dodaj produkt"}
                </button>
              </div>
            </form>

          </div>
        </>
      )}
    </div>
  );
}