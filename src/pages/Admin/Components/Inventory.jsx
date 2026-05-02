import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "services/api"; 
import { FiBox, FiMapPin, FiTruck, FiArrowLeft, FiAlertTriangle, FiPlus, FiX } from "react-icons/fi";
import DeliveryModal from './DeliveryModal';
import SomniumSelect from "components/ui/SomniumSelect";
import AdminPageLayout, { SkeletonGrid, SkeletonRow } from './AdminPageLayout';

export default function Inventory() {
  const [locations, setLocations] = useState([]);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", type: "cafe" });
  const [isSubmittingLocation, setIsSubmittingLocation] = useState(false);

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

  useEffect(() => { fetchData(); },[]);

  const handleAddLocation = async (e) => {
      e.preventDefault();
      setIsSubmittingLocation(true);
      try {
          await api.post("locations", newLocation);
          setIsAddLocationModalOpen(false);
          setNewLocation({ name: "", type: "cafe" });
          fetchData();
      } catch (err) {
          console.error(err);
          alert("Wystąpił błąd podczas dodawania nowej placówki.");
      } finally {
          setIsSubmittingLocation(false);
      }
  };

  if (selectedLocation) {
      const localStock = globalProducts.map(gp => {
          const invRecord = selectedLocation.Inventories?.find(i => i.productId === gp.id);
          return { ...gp, currentStock: invRecord ? invRecord.stockQuantity : 0 };
      });

      return (
          <AdminPageLayout
              title={selectedLocation.name}
              subtitle="Podgląd lokalnego stanu zasobów"
              actions={
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                      <button 
                          onClick={() => setSelectedLocation(null)}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-all cursor-pointer font-bold"
                      >
                          <FiArrowLeft /> Powrót
                      </button>
                      <button
                          onClick={() => setIsDeliveryModalOpen(true)}
                          className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                          <FiTruck size={20} /> Zarejestruj dostawę
                      </button>
                  </div>
              }
          >
              <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-2 sm:p-8 min-h-[400px]">
                {loading ? (
                    <SkeletonRow count={5} />
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#F2EAE1] min-w-[600px]">
                        <thead className="text-(--medium-shade) uppercase text-xs tracking-[0.2em] font-black border-b border-white/5">
                        <tr>
                            <th className="p-6">Produkt</th>
                            <th className="p-6 text-center">Kategoria</th>
                            <th className="p-6 text-right">Stan na lokacji</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {localStock.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-all duration-300 group">
                            <td className="p-6">
                                <span className="font-bold text-lg block">{item.name}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/30">ID: {item.id}</span>
                            </td>
                            <td className="p-6 text-center">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60">{item.category}</span>
                            </td>
                            <td className="p-6 text-right font-bold text-lg">
                                {item.currentStock > 5 ? (
                                    <span className="text-green-400/80">{item.currentStock} szt.</span>
                                ) : item.currentStock > 0 ? (
                                    <span className="text-yellow-400/80 inline-flex items-center gap-2">
                                        <FiAlertTriangle className="animate-pulse" /> {item.currentStock} szt.
                                    </span>
                                ) : (
                                    <span className="text-red-400/60 font-black uppercase text-xs tracking-widest">Brak na stanie</span>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
              </div>

              <DeliveryModal 
                  isOpen={isDeliveryModalOpen} 
                  onClose={() => setIsDeliveryModalOpen(false)} 
                  onSuccess={() => { fetchData(); setSelectedLocation(null); }} 
              />
          </AdminPageLayout>
      );
  }

  return (
    <AdminPageLayout
        title="Zasoby i Magazyny"
        subtitle="Wybierz placówkę lub dodaj nową, aby zarządzać asortymentem"
        actions={
            <button
                onClick={() => setIsAddLocationModalOpen(true)}
                className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md w-full md:w-auto"
            >
                <FiPlus size={20} /> Dodaj Placówkę
            </button>
        }
    >
      <div className="min-h-[400px]">
        {loading ? (
            <SkeletonGrid count={4} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {locations.map(loc => {
                    const totalItems = loc.Inventories?.reduce((sum, inv) => sum + inv.stockQuantity, 0) || 0;
                    const lowStockCount = loc.Inventories?.filter(inv => inv.stockQuantity > 0 && inv.stockQuantity <= 5).length || 0;
                    const outOfStockCount = globalProducts.length - (loc.Inventories?.filter(inv => inv.stockQuantity > 0).length || 0);

                    return (
                        <div 
                            key={loc.id}
                            onClick={() => setSelectedLocation(loc)}
                            className="bg-[#46382E] border border-[#5C4A3D] rounded-3xl p-6 hover:bg-[#5C4A3D] cursor-pointer transition-all shadow-lg group relative overflow-hidden flex flex-col min-h-[220px]"
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
        )}
      </div>

      {/* Modal dodawania nowej lokacji */}
      {isAddLocationModalOpen && createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAddLocationModalOpen(false)}></div>
              <div className="relative z-10 w-full max-w-md bg-[#24201d] border border-white/10 rounded-3xl flex flex-col shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#2D231C] rounded-t-3xl">
                      <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                          <FiPlus className="text-(--medium-shade)" /> Nowa Placówka
                      </h2>
                      <button onClick={() => setIsAddLocationModalOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer"><FiX size={24} /></button>
                  </div>

                  <form onSubmit={handleAddLocation} className="p-6 flex flex-col gap-5 text-white">
                      <div>
                          <label className="text-xs font-bold opacity-70 uppercase tracking-widest ml-1 text-(--medium-shade)">Nazwa lokacji</label>
                          <input 
                              type="text" required placeholder="np. Kawiarnia Rynek"
                              value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} 
                              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 mt-1 focus:outline-none focus:border-(--medium-shade) transition-colors" 
                          />
                      </div>
                        <div>
                            <SomniumSelect 
                                label="Typ placówki"
                                options={[
                                    { label: "Kawiarnia (Sprzedaż / Odbiór)", value: "cafe" },
                                    { label: "Magazyn (Wysyłki internetowe)", value: "warehouse" }
                                ]}
                                value={newLocation.type}
                                onChange={(val) => setNewLocation({...newLocation, type: val})}
                            />
                        </div>

                      <div className="flex gap-3 mt-4">
                          <button type="button" onClick={() => setIsAddLocationModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold cursor-pointer transition-colors">Anuluj</button>
                          <button type="submit" disabled={isSubmittingLocation || !newLocation.name} className="flex-1 py-3 bg-(--medium-shade) hover:brightness-110 text-[#24201d] rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50">
                              {isSubmittingLocation ? "Tworzenie..." : "Utwórz"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>,
          document.body
      )}
    </AdminPageLayout>
  );
}