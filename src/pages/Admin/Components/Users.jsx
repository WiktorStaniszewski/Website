import { useState, useEffect } from "react";
import api from "services/api"; 
import { FaUserShield, FaUser } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("users");
      if (Array.isArray(res)) setUsers(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if(window.confirm(`Zmienić uprawnienia na ${newRole.toUpperCase()}?`)) {
      try {
        await api.put("users", `${id}/role`, { role: newRole });
        fetchUsers();
      } catch (err) {
        alert("Błąd zmiany uprawnień");
      }
    }
  };

  if (loading) return <div className="text-white/50 text-center mt-20">Ładowanie użytkowników...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-serif font-bold text-white">Użytkownicy</h1>
      
      <div className="rounded-4xl border border-white/5 overflow-hidden bg-[#24201d]/60 backdrop-blur-xl shadow-xl p-6">
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <p className="font-bold text-lg">{u.username}</p>
                <p className="text-sm opacity-50">{u.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${u.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                  {u.role.toUpperCase()}
                </span>
                <button 
                  onClick={() => changeRole(u.id, u.role)}
                  className="p-3 bg-white/10 hover:bg-(--medium-shade) hover:text-black rounded-xl transition-colors cursor-pointer"
                  title="Zmień rolę"
                >
                  {u.role === 'admin' ? <FaUser /> : <FaUserShield />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}