import { useState, useEffect } from "react";
import api from "services/api"; 
import { FiBox, FiMapPin, FiTruck, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";
import DeliveryModal from './DeliveryModal';

export default function Inventory() {
  const [locations, setLocations] = useState([]);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [locs, prods] = await Promise.all([
            api.get("locations"),
            api.get("products")
        ]);
        setLocations(locs);
        setGlobalProducts(prods);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="text-(--medium-shade) font-bold text-center mt-20">Ładowanie magazynów...</div>;

  // Widok Szczegółowy Konkretnego Magazynu
  if (selectedLocation) {
      // Łączymy globalne produkty z inwentarzem wybranej lokacji
      const localStock = globalProducts.map(gp => {
          const invRecord = selectedLocation.Inventories?.find(i => i.productId === gp.id);
          return { ...gp, currentStock: invRecord ? invRecord.stockQuantity : 0 };
      });

      return (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 not-lg:pt-20">
              <button 
                  onClick={() => setSelectedLocation(null)}
                  className="flex items-center gap-2 text-[#F2EAE1]/60 hover:text-(--medium-shade) transition-colors font-bold cursor-pointer w-max"
              >
                  <FiArrowLeft /> Wróć do przeglądu lokacji
              </button>

              <div className="flex justify-between items-end mb-4">
                  <div>
                      <h1 className="text-3xl font-serif font-bold text-[#F2EAE1] flex items-center gap-3">
                          <FiMapPin className="text-(--medium-shade)" /> {selectedLocation.name}
                      </h1>
                      <p className="text-[#F2EAE1]/60 mt-1">Podgląd lokalnego stanu zasobów</p>
                  </div>
                  <button
                      onClick={() => setIsDeliveryModalOpen(true)}
                      className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                      <FiTruck /> Zarejestruj dostawę
                  </button>
              </div>

              <div className="bg-[#46382E] border border-[#5C4A3D] rounded-3xl shadow-xl overflow-hidden">
                <table className="w-full text-left text-sm text-[#F2EAE1]">
                  <thead className="bg-[#352A21] text-(--medium-shade) uppercase text-xs tracking-wider border-b border-[#5C4A3D]">
                    <tr>
                      <th className="p-6 font-bold">NAZWA PRODUKTU</th>
                      <th className="p-6 font-bold">KATEGORIA</th>
                      <th className="p-6 font-bold">STAN NA LOKACJI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#846f60]">
                    {localStock.map((item) => (
                      <tr key={item.id} className="hover:bg-[#5C4A3D]/50 transition-colors group">
                        <td className="p-6 font-bold text-base">{item.name}</td>
                        <td className="p-6 opacity-60">{item.category}</td>
                        <td className="p-6 font-bold text-lg">
                            {item.currentStock > 5 ? (
                                <span className="text-green-400">{item.currentStock} szt.</span>
                            ) : item.currentStock > 0 ? (
                                <span className="text-yellow-400 flex items-center gap-2">
                                    <FiAlertTriangle /> {item.currentStock} szt.
                                </span>
                            ) : (
                                <span className="text-red-400 opacity-80">Brak na stanie</span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <DeliveryModal 
                  isOpen={isDeliveryModalOpen} 
                  onClose={() => setIsDeliveryModalOpen(false)} 
                  onSuccess={() => { fetchData(); setSelectedLocation(null); }} 
              />
          </div>
      );
  }

  // Widok Główny: Kafelki Lokacji
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 not-lg:pt-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">Zasoby i Magazyny</h1>
            <p className="text-[#F2EAE1]/60 font-medium text-sm mt-1">Wybierz placówkę, aby sprawdzić stan towaru</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {locations.map(loc => {
              const totalItems = loc.Inventories?.reduce((sum, inv) => sum + inv.stockQuantity, 0) || 0;
              const lowStockCount = loc.Inventories?.filter(inv => inv.stockQuantity > 0 && inv.stockQuantity <= 5).length || 0;
              const outOfStockCount = globalProducts.length - (loc.Inventories?.filter(inv => inv.stockQuantity > 0).length || 0);

              return (
                  <div 
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className="bg-[#46382E] border border-[#5C4A3D] rounded-3xl p-6 hover:bg-[#5C4A3D] cursor-pointer transition-all shadow-lg group relative overflow-hidden flex flex-col"
                  >
                      <div className="absolute -top-6 -right-6 opacity-5 group-hover:scale-110 transition-transform text-(--medium-shade)">
                          {loc.type === 'warehouse' ? <FiBox size={120} /> : <FiMapPin size={120} />}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className={`p-3 rounded-xl text-white ${loc.type === 'warehouse' ? 'bg-(--medium-shade)/80' : 'bg-white/10'}`}>
                              {loc.type === 'warehouse' ? <FiBox size={24} /> : <FiMapPin size={24} />}
                          </div>
                          <div>
                              <h3 className="font-bold text-lg text-white leading-tight">{loc.name}</h3>
                              <span className="text-xs uppercase tracking-wider text-(--medium-shade) font-bold">{loc.type === 'warehouse' ? 'Magazyn Główny' : 'Kawiarnia'}</span>
                          </div>
                      </div>

                      <div className="mt-auto space-y-2 relative z-10 bg-black/20 p-4 rounded-2xl border border-white/5">
                          <p className="text-sm flex justify-between text-white/70">
                              Wszystkich sztuk: <strong className="text-white">{totalItems}</strong>
                          </p>
                          <p className="text-sm flex justify-between text-white/70">
                              Brakujących prod.: <strong className="text-red-400">{outOfStockCount}</strong>
                          </p>
                          {lowStockCount > 0 && (
                              <p className="text-xs text-yellow-400 font-bold mt-2 pt-2 border-t border-white/10 flex items-center gap-1">
                                  <FiAlertTriangle /> {lowStockCount} na wyczerpaniu!
                              </p>
                          )}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
}