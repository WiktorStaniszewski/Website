import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "src/context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import api from "src/services/api";

export default function RegisterCard() {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Call our new "register" endpoint in mockDatabase
      const response = await api.post("register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response && response.data) {
        // Auto-login after successful registration
        login(response.data);
        navigate("/"); // Redirect to home
      }

    } catch (err) {
      console.error("Register error:", err);
      setServerError(err.message || "Błąd rejestracji.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl pb-4 text-center text-(--font-color)">
        Dołącz do Somnium!
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex justify-center flex-col items-center gap-3 w-full'
      >
        {/* Username */}
        <div className="w-full">
          <input
            {...register("username", { 
                required: "Nazwa użytkownika jest wymagana",
                minLength: { value: 3, message: "Minimum 3 znaki" }
            })}
            type="text"
            placeholder="Nazwa użytkownika"
            className={`loginInput w-full ${errors.username ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.username && (
            <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.username.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="w-full">
          <input
            {...register("email", { 
                required: "Email jest wymagany",
                pattern: { value: /^\S+@\S+$/i, message: "Niepoprawny format email" }
            })}
            type="email"
            placeholder="Adres Email"
            className={`loginInput w-full ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.email && (
            <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.email.message}</span>
          )}
        </div>
        
        {/* Password */}
        <div className="w-full">
          <input
            {...register("password", { 
                required: "Hasło jest wymagane",
                minLength: { value: 6, message: "Hasło musi mieć min. 6 znaków" }
            })}
            type="password"
            placeholder="Hasło"
            className={`loginInput w-full ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.password && (
            <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="w-full">
          <input
            {...register("confirmPassword", { 
                validate: value => value === password || "Hasła muszą być identyczne"
            })}
            type="password"
            placeholder="Powtórz hasło"
            className={`loginInput w-full ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          />
          {errors.confirmPassword && (
            <span className="text-red-400 text-xs pl-2 pt-1 block">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-2 self-start ml-2 text-sm text-(--font-color) mt-2">
          <input 
            {...register("terms", { required: true })} 
            type="checkbox" 
            id="terms" 
            className="cursor-pointer mt-1"
          />
          <label htmlFor="terms" className="cursor-pointer select-none text-xs opacity-80">
            Akceptuję regulamin sklepu Somnium oraz politykę prywatności.
          </label>
        </div>
        {errors.terms && <span className="text-red-400 text-xs self-start ml-2">Musisz zaakceptować regulamin</span>}

        {serverError && (
          <div className="w-full bg-red-500/20 text-red-200 text-sm p-2 rounded text-center border border-red-500/30 mt-2">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 cursor-pointer bg-(--80-shade) hover:bg-(--button-hover-bg) text-(--font-color) p-3 rounded-3xl transition-colors duration-300 disabled:opacity-50 font-bold"
        >
          {isLoading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>
      </form>
    
      <div className="mt-6 flex flex-row gap-2 text-sm text-(--font-color)">
        <p>Masz już konto?</p>
        <Link to="/login" className="cursor-pointer underline font-bold hover:text-(--button-hover-bg) transition-colors">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}