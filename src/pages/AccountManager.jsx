import React, { useState, useEffect } from 'react';
import { useAuth } from "components/Context/Login/AuthProvider";
import { useSearchParams } from "react-router-dom";

function AccountManager() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const tabs = [
    { id: "profile", label: "Mój Profil", icon: "👤" },
    { id: "history", label: "Historia zamówień", icon: "📦" },
    { id: "security", label: "Hasło i Bezpieczeństwo", icon: "🔒" },
    { id: "status", label: "Status zamówienia", icon: "🚚" },
  ];

  return (
    <div className="lg:min-h-156 text-(--font-color) p-4 lg:p-10 pt-24">
      <div className="lg:max-w-6xl w-9/10 mx-auto flex flex-col lg:flex-row gap-8 p-8 rounded-3xl border border-white/5 shadow-xl">
        
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-6 px-2">Konto</h1>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id 
                ? "bg-(--80-shade) shadow-lg" 
                : "hover:bg-white/5 opacity-80 hover:opacity-120"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 rounded-3xl p-6 lg:p-10 shadow-xl border border-white/5 backdrop-brightness-85 backdrop-blur-lg">

          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Dane profilu</h2>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs opacity-50">Email</p>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs opacity-50">Użytkownik</p>
                  <p className="text-lg">{user?.username}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Historia zamówień</h2>
              <p className="opacity-50">Nie masz jeszcze żadnych zamówień.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Zmień hasło</h2>
              <form className="flex flex-col gap-4 max-w-sm">
                <input type="password" placeholder="Obecne hasło" className="loginInput" />
                <input type="password" placeholder="Nowe hasło" className="loginInput" />
                <button className="bg-(--80-shade) p-3 rounded-2xl cursor-pointer">Zaktualizuj hasło</button>
              </form>
            </div>
          )}

          {activeTab === "status" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-semibold mb-4">Śledzenie zamówienia</h2>
              <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center">
                 🔍 Wpisz numer zamówienia, aby sprawdzić status.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AccountManager;