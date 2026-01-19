import { useState, useEffect } from "react";
import api from "../../services/api"; 
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get("products");
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (name) => {
    if(window.confirm("Czy na pewno usunąć ten produkt?")) {
      await api.delete("products", name); 
      fetchProducts(); 
    }
  };

  if (loading) return <div className="text-white">Ładowanie produktów...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Produkty ({products.length})</h1>
        <button className="bg-green-600/50 hover:bg-green-500/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <FiPlus /> Dodaj Produkt
        </button>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm backdrop-brightness-85">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-white uppercase text-xs">
            <tr>
              <th className="p-4">Nazwa</th>
              <th className="p-4">Kategoria</th>
              <th className="p-4">Cena</th>
              <th className="p-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.price} PLN</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><FiEdit2 /></button>
                  <button 
                    onClick={() => handleDelete(p.name)}
                    className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                  ><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}