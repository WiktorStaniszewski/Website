import AuthCard from "src/pages/Auth/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-160 w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-(--darker-bg) p-8 rounded-3xl shadow-xl border border-white/5">
        <AuthCard />
      </div>
    </div>
  );
}