import { useState, useEffect } from "react";
import api from "../../services/api"; 
import { FiEdit2, FiTrash2, FiPlus, FiTag } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchProducts(); }, []);

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

  if (loading) return <div className="text-white/50 text-center mt-20">Ładowanie produktów...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 not-lg:pt-20">
      
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-serif font-bold text-white">Produkty</h1>
            <p className="text-white/50 text-sm mt-1">Zarządzaj asortymentem ({products.length})</p>
        </div>
        <button className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <FiPlus /> <span className="hidden sm:inline">Dodaj Produkt</span>
        </button>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden md:block rounded-4xl border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black/20 text-(--medium-shade) uppercase text-xs tracking-wider">
            <tr>
              <th className="p-6 font-bold">Nazwa</th>
              <th className="p-6 font-bold">Kategoria</th>
              <th className="p-6 font-bold">Cena</th>
              <th className="p-6 text-right font-bold">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-6 text-white font-medium text-base">{p.name}</td>
                <td className="p-6">
                    <span className="bg-white/5 px-3 py-1 rounded-full text-xs border border-white/10">
                        {p.category}
                    </span>
                </td>
                <td className="p-6 font-mono text-(--medium-shade)">{p.price} PLN</td>
                <td className="p-6 text-right flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-(--medium-shade) hover:text-[#24201d] rounded-lg transition-colors" title="Edytuj">
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors" 
                    title="Usuń"
                  >
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
            <div key={p.id} className="bg-[#24201d]/60 backdrop-blur-xl border border-white/5 p-5 rounded-3xl shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <FiTag /> {p.category}
                        </div>
                    </div>
                    <div className="font-mono text-(--medium-shade) font-bold text-lg">
                        {p.price} <span className="text-xs">PLN</span>
                    </div>
                </div>
                
                <div className="flex gap-2 mt-2 pt-4 border-t border-white/5">
                    <button className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                        <FiEdit2 /> Edytuj
                    </button>
                    <button 
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 py-3 bg-red-500/10 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiTrash2 /> Usuń
                    </button>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
}