import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import api from "services/api"; 
import { FiBox } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiPackage } from "react-icons/fi";
import { FiEdit2 } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import DeliveryModal from './DeliveryModal';
import ProductEditModal from './ProductEditModal';
import AdminPageLayout, { SkeletonGrid, SkeletonRow } from './AdminPageLayout';

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", type: "cafe" });
  const [isSubmittingLocation, setIsSubmittingLocation] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'locations');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const openEditModal = (product) => {
      setProductToEdit(product);
      setIsEditModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [locs, prods] = await Promise.all([
            api.get("locations"),
            api.get("products")
        ]);
        setLocations(locs);
        setGlobalProducts(prods);
        
        const locParam = searchParams.get('location');
        if (locParam) {
           const loc = locs.find(l => String(l.id) === locParam);
           if (loc) setSelectedLocation(loc);
        }

        if (searchParams.get('action') === 'add') {
            openEditModal(null);
            setSearchParams(prev => {
                prev.delete('action');
                return prev;
            }, { replace: true });
        }
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); },[]);

  const handleBack = () => {
      setSelectedLocation(null);
      if (searchParams.has('location')) {
          setSearchParams({});
      }
  };

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
                          onClick={handleBack}
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
      <div className="mb-6 flex gap-4 border-b border-white/5 pb-4">
        <button 
          onClick={() => setViewMode('locations')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${viewMode === 'locations' ? 'bg-(--medium-shade) text-[#24201d]' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
        >
          Magazyny i Placówki
        </button>
        <button 
          onClick={() => setViewMode('products')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${viewMode === 'products' ? 'bg-(--medium-shade) text-[#24201d]' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
        >
          Wszystkie Produkty
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
              <input 
                  type="text" 
                  placeholder={viewMode === 'locations' ? "Szukaj produktu na stanach..." : "Szukaj produktu na liście..."}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#2D231C] border border-[#5C4A3D] rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-(--medium-shade) transition-colors placeholder-white/30"
              />
              {productSearch && (
                  <button
                      onClick={() => setProductSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors cursor-pointer flex items-center justify-center p-1"
                      title="Wyczyść"
                  >
                      <FiX />
                  </button>
              )}
          </div>
      </div>

      {viewMode === 'locations' && productSearch.trim().length > 0 && !loading && (() => {
          const q = productSearch.toLowerCase();
          const matchingProducts = globalProducts.filter(p => p.name.toLowerCase().includes(q));
          
          if (matchingProducts.length === 0) {
              return (
                  <div className="rounded-2xl border border-white/5 bg-[#24201d]/60 p-8 text-center text-white/40 italic mb-6">
                      Nie znaleziono produktów pasujących do "{productSearch}".
                  </div>
              );
          }

          return (
              <div className="rounded-2xl border border-white/5 bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-4 sm:p-6 mb-6 space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-sm uppercase tracking-widest text-(--medium-shade) font-bold">Wyniki wyszukiwania ({matchingProducts.length})</h3>
                  {matchingProducts.slice(0, 10).map(product => {
                      const stockByLocation = locations.map(loc => {
                          const inv = loc.Inventories?.find(i => i.productId === product.id);
                          return { locationName: loc.name, locationType: loc.type, stock: inv ? inv.stockQuantity : 0 };
                      });
                      const totalStock = stockByLocation.reduce((sum, s) => sum + s.stock, 0);

                      return (
                          <div key={product.id} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <div>
                                      <h4 className="font-bold text-white text-lg">{product.name}</h4>
                                      <span className="text-xs text-white/40">{product.category} · {product.price} PLN</span>
                                  </div>
                                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${totalStock > 5 ? 'border-green-500/30 text-green-400 bg-green-500/10' : totalStock > 0 ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                      Łącznie: {totalStock} szt.
                                  </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {stockByLocation.map((s, idx) => (
                                      <div key={idx} className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2 border border-white/5">
                                          <span className="flex items-center gap-2 text-sm text-white/70">
                                              {s.locationType === 'warehouse' ? <FiBox size={14} className="text-(--medium-shade)" /> : <FiMapPin size={14} className="text-(--medium-shade)" />}
                                              {s.locationName}
                                          </span>
                                          <span className={`font-bold text-sm ${s.stock > 5 ? 'text-green-400' : s.stock > 0 ? 'text-yellow-400' : 'text-red-400/60'}`}>
                                              {s.stock} szt.
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
                  {matchingProducts.length > 10 && (
                      <p className="text-xs text-white/40 text-center italic">...i {matchingProducts.length - 10} więcej wyników. Doprecyzuj wyszukiwanie.</p>
                  )}
              </div>
          );
      })()}

      <div className="min-h-[400px]">
        {loading ? (
            <SkeletonGrid count={4} />
        ) : viewMode === 'locations' ? (
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
        ) : (
            <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-2 sm:p-8">
                <div className="flex justify-between items-center mb-6 px-4 md:px-0 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-(--medium-shade) flex items-center gap-2">
                        <FiPackage className="text-(--medium-shade)" /> Lista wszystkich produktów ({globalProducts.length})
                    </h2>
                    <button 
                        onClick={() => openEditModal(null)}
                        className="bg-(--medium-shade) hover:brightness-110 text-[#24201d] px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                        <FiPlus /> Dodaj produkt
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#F2EAE1] min-w-[800px]">
                        <thead className="text-(--medium-shade) uppercase text-[10px] tracking-widest font-black border-b border-white/5">
                            <tr>
                                <th className="p-4">Zdjęcie</th>
                                <th className="p-4">Nazwa / Kategoria</th>
                                <th className="p-4 text-center">Cena</th>
                                <th className="p-4 text-center">Ogólny Stan Magazynowy</th>
                                <th className="p-4 text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {globalProducts
                                .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                                .map(product => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 w-16">
                                        <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-[#2D231C]">
                                            {product.image ? (
                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/products/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20"><FiImage /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-lg">{product.name}</p>
                                        <p className="text-xs text-white/40">{product.category} {product.size ? `· ${product.size}` : ''}</p>
                                    </td>
                                    <td className="p-4 text-center font-bold">{product.price} PLN</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stockQuantity > 5 ? 'bg-green-500/10 text-green-400' : product.stockQuantity > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.stockQuantity} szt.
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => openEditModal(product)}
                                            className="p-2 bg-white/5 hover:bg-(--medium-shade) hover:text-[#24201d] text-white/50 rounded-xl transition-colors cursor-pointer"
                                            title="Edytuj produkt"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

      {/* Modal edycji/dodawania produktu */}
      <ProductEditModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
              setIsEditModalOpen(false);
              setProductToEdit(null);
          }} 
          product={productToEdit}
          onSuccess={fetchData} 
      />
    </AdminPageLayout>
  );
}