import RegisterCard from "src/pages/Auth/RegisterCard";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
      
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-(--medium-shade) rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#5C4A3D] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full max-w-lg z-10 px-4">
        <div className="bg-[#24201d]/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10 animate-in fade-in zoom-in-95 duration-700 ease-out relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Dołącz do nas</h1>
            <p className="text-white/50 text-sm">Zarejestruj się, aby zarządzać swoimi zamówieniami</p>
          </div>

          <RegisterCard />
        </div>
      </div>
    </div>
  );
}