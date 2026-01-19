import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "components/Context/Login/AuthProvider";

export default function LoginControl() {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, logout, user } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          // w przyszlosci dodac expires i rememberMe handler
        }),
      });

      const result = await res.json();

      if (res.ok) {
        login(result); 
      } else {
        setServerError(result.message || "Błędne dane logowania");
      }
    } catch (err) {
      setServerError("Błąd połączenia z serwerem.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginHover flex lg:fixed absolute right-5 lg:right-15 cursor-default flex-col items-center backdrop-brightness-70 bg-(--darker-bg) shadow-[1px_2px_4px_var(--header-footer-bg)] rounded-2xl p-4 min-w-[300px]">
      <h2 className="text-2xl pb-4 text-center">
        {user ? `Witaj, ${user.firstName || user.username || 'ponownie'}!` : "Hejka! Zaloguj się :)"}
      </h2>

      {user ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className='px-4 font-medium text-center break-all'>
            {user.email || user.username}
          </div>
          {user.image && (
             <img src={user.image} alt="avatar" className="w-12 h-12 rounded-full bg-white/10" />
          )}
          <button 
            onClick={logout} 
            className="w-full bg-red-500/20 hover:bg-red-500/40 p-2 rounded-xl transition-colors"
          >
            Wyloguj się
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex justify-center flex-col items-center gap-3 w-full'
          >
            {/* Username Input */}
            <div className="w-full">
              <input
                {...register("username", { required: "Nazwa użytkownika jest wymagana" })}
                type="text"
                placeholder="Nazwa użytkownika (np. emilys)"
                className={`loginInput w-full ${errors.username ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.username && (
                <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.username.message}</span>
              )}
            </div>
            
            {/* Password Input */}
            <div className="w-full">
              <input
                {...register("password", { required: "Hasło jest wymagane" })}
                type="password"
                placeholder="Hasło"
                className={`loginInput w-full ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.password && (
                <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 self-start ml-2 text-sm">
              <input 
                {...register("rememberMe")} 
                type="checkbox" 
                id="rememberMe" 
                className="cursor-pointer"
              />
              <label htmlFor="rememberMe" className="cursor-pointer select-none">Zapamiętaj mnie</label>
            </div>

            {/* Server Error Display */}
            {serverError && (
              <div className="w-full bg-red-500/20 text-red-200 text-sm p-2 rounded text-center border border-red-500/30">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 cursor-pointer bg-(--80-shade) hover:bg-(--button-hover-bg) text-(--font-color) p-3 rounded-3xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>
        
          <div className="mt-4 flex flex-row gap-2 text-sm">
            <p>Nie masz konta?</p>
            <button className="cursor-pointer underline font-bold hover:text-(--button-hover-bg) transition-colors">
              Zarejestruj się
            </button>
          </div>
        </>
      )}
    </div>
  );
}