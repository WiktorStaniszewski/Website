import React from 'react';

export default function ProfileTab({ user }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif mb-6 border-b border-white/10 pb-4">Twój Profil</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                        <img 
                            src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || user?.username}&backgroundColor=8f785d`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">Zmień</span>
                    </div>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Nazwa Użytkownika</p>
                        <p className="text-xl font-medium text-white">{user?.username || "Gość"}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Adres Email</p>
                        <p className="text-xl font-medium text-white">{user?.email || "brak@email.com"}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors md:col-span-2">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Status Konta</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                            <p className="text-lg text-white">Aktywne</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}