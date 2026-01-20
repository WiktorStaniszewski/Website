import RegisterCard from "src/pages/Auth/RegisterCard";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center pt-20 pb-10">
      <div className="w-full max-w-md bg-[#24201d]/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <RegisterCard />
      </div>
    </div>
  );
}