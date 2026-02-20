import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "services/api"; 
import { FiArrowLeft, FiUser, FiMail, FiMapPin, FiBox, FiCalendar } from "react-icons/fi";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ user: null, orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`users/${id}`);
        setData(res);
      } catch (e) {
        console.error("Error fetching user details:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  if (loading) return <div className="text-(--medium-shade) font-bold text-center mt-20">Ładowanie danych klienta...</div>;
  if (!data.user) return <div className="text-red-400 text-center mt-20">Nie znaleziono klienta.</div>;

  const { user, orders } = data;
  const totalSpent = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? Number(o.total) : 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 py-20">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/users')}
          className="p-3 bg-[#46382E] border border-[#5C4A3D] hover:bg-[#5C4A3D] text-[#F2EAE1] rounded-xl transition-colors cursor-pointer"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#F2EAE1]">{user.username}</h1>
          <p className="text-sm text-[#F2EAE1]/60 mt-1">Karta klienta #{user.id}</p>
        </div>
        <span className={`ml-auto px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${
            user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#46382E] text-(--medium-shade) border-[#5C4A3D]'
        }`}>
          {user.role}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lewa kolumna: Informacje o kliencie */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg text-[#F2EAE1]">
            <div className="flex justify-center mb-6">
                <img src={user.image || `https://robohash.org/${user.username}`} alt="avatar" className="w-24 h-24 rounded-full border-2 border-(--medium-shade)" />
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#5C4A3D] pb-3">
                    <FiMail className="text-(--medium-shade) text-xl" />
                    <div>
                        <p className="text-xs text-[#F2EAE1]/50 uppercase tracking-wider">Email</p>
                        <p className="font-bold">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 border-b border-[#5C4A3D] pb-3">
                    <FiMapPin className="text-(--medium-shade) text-xl" />
                    <div>
                        <p className="text-xs text-[#F2EAE1]/50 uppercase tracking-wider">Adres / Paczkomat</p>
                        <p className="font-bold">{user.address || "Brak zapisanych danych"}</p>
                        {user.paczkomat && <p className="text-sm text-(--medium-shade)">Paczkomat: {user.paczkomat}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3 pb-2">
                    <FiCalendar className="text-(--medium-shade) text-xl" />
                    <div>
                        <p className="text-xs text-[#F2EAE1]/50 uppercase tracking-wider">Dołączył/a</p>
                        <p className="font-bold">{new Date(user.createdAt).toLocaleDateString('pl-PL')}</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
             <p className="text-[#F2EAE1]/50 text-sm uppercase tracking-widest font-bold mb-2">Całkowicie wydano</p>
             <p className="text-3xl font-bold text-(--medium-shade)">{totalSpent.toFixed(2)} PLN</p>
          </div>
        </div>

        {/* Prawa kolumna: Historia Zamówień */}
        <div className="lg:col-span-2 bg-[#46382E] border border-[#5C4A3D] p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-[#5C4A3D] pb-3 text-[#F2EAE1]">
            <FiBox className="text-(--medium-shade)" /> Historia Zamówień ({orders.length})
          </h2>
          
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
                <p className="text-[#F2EAE1]/50 italic">Brak zamówień.</p>
            ) : (
                orders.map((o) => (
                    <div 
                        key={o.id} 
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                        className="flex justify-between items-center p-4 bg-[#352A21] hover:bg-[#5C4A3D]/50 border border-[#5C4A3D] rounded-2xl cursor-pointer transition-colors group"
                    >
                        <div>
                            <p className="font-bold text-[#F2EAE1] group-hover:text-(--medium-shade) transition-colors">Zamówienie #{o.id}</p>
                            <p className="text-sm text-[#F2EAE1]/50">{o.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-[#F2EAE1]">{o.total} PLN</p>
                            <p className="text-xs text-(--medium-shade) uppercase font-bold">{o.status}</p>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}