import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "src/context/AuthProvider";
import { Link } from "react-router-dom";
import api from "src/services/api"; 
import ConfirmModal from "src/components/ConfirmModal";

export default function AuthCard({ onSuccess }) {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const { login, logout, user } = useAuth(); 
  const [conflictModalOpen, setConflictModalOpen] = useState(false);

  const onSubmit = async (data, force = false) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { rememberMe, ...rest } = typeof data === 'object' && data !== null ? data : {};
      const response = await api.post("auth/login", {
        email: rest.identifier,
        password: rest.password,
        force: force === true
      });

      if (response && response.token) {
        login(response);
        if (onSuccess) onSuccess();
      } else {
        setServerError("Nieznany błąd logowania.");
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 409) {
          setConflictModalOpen(true);
      } else {
          setServerError(err.response?.data?.message || err.message || "Błąd logowania.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogin = () => {
      setConflictModalOpen(false);
      onSubmit(getValues(), true);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl pb-4 text-center text-white">
        {user ? `Witaj, ${user.username}!` : "Hejka! Zaloguj się :)"}
      </h2>

      {user ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col items-center mb-2">
            {user.image && (
              <img src={user.image} alt="avatar" className="w-12 h-12 rounded-full mb-2 bg-white/10" />
            )}
            <div className='font-medium text-white'>@{user.username}</div>
          </div>

          <nav className="flex flex-col w-full gap-1 border-t border-white/10 pt-3 mb-3">
            <Link to="/account?tab=history" onClick={onSuccess} className="text-sm p-2 hover:bg-white/5 rounded-lg transition-colors text-white">
              📦 Historia zamówień
            </Link>
            <Link to="/account?tab=profile" onClick={onSuccess} className="text-sm p-2 hover:bg-white/5 rounded-lg transition-colors text-white">
              ⚙️ Ustawienia konta
            </Link>
          </nav>

          <button onClick={logout} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm p-2 rounded-xl transition-colors cursor-pointer">
            Wyloguj się
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center flex-col items-center gap-3 w-full'>
            <div className="w-full">
              <input
                {...register("identifier", { required: "Email lub nazwa użytkownika są wymagane" })}
                type="text"
                placeholder="Email lub Nazwa użytkownika"
                className={`loginInput w-full bg-black/30 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) text-white ${errors.identifier ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.identifier && <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.identifier.message}</span>}
            </div>
            
            <div className="w-full">
              <input
                {...register("password", { required: "Hasło jest wymagane" })}
                type="password"
                placeholder="Hasło"
                className={`loginInput w-full bg-black/30 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-(--medium-shade) text-white ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.password && <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.password.message}</span>}
            </div>

            <div className="flex items-center gap-2 self-start ml-2 text-sm text-white/70">
              <input {...register("rememberMe")} type="checkbox" id="rememberMe" className="cursor-pointer" />
              <label htmlFor="rememberMe" className="cursor-pointer select-none">Zapamiętaj mnie</label>
            </div>

            {serverError && (
              <div className="w-full bg-red-500/20 text-red-200 text-sm p-3 rounded-xl text-center border border-red-500/30">
                {serverError}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full mt-2 cursor-pointer bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] p-3 rounded-xl font-bold transition-colors duration-300 disabled:opacity-50">
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>
        
          <div className="mt-4 flex flex-row gap-2 text-sm text-white/70">
            <p>Nie masz konta?</p>
            <Link to="/register" className="cursor-pointer underline font-bold text-white hover:text-(--medium-shade) transition-colors">
              Zarejestruj się
            </Link>
          </div>
        </>
      )}

      <ConfirmModal 
          isOpen={conflictModalOpen}
          onClose={() => setConflictModalOpen(false)}
          onConfirm={handleForceLogin}
          title="Konflikt Sesji"
          description="Jesteś już zalogowany na innym urządzeniu. Czy chcesz zakończyć tamtą sesję i zalogować się tutaj?"
          confirmText="Wyloguj tamto urządzenie"
          cancelText="Anuluj"
      />
    </div>
  );
}