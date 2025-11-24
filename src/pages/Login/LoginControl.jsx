import { useForm } from "react-hook-form";
import { useAuth } from "components/Context/Login/AuthProvider";

export default function LoginControl() {

  const { register, handleSubmit } = useForm();
  const { login, logout, user } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      const result = await res.json();
      if (!result) throw new Error("No JSON returned");

      if (result.success) {
        login(result.user);
      } else {
        alert(result.message);
      }

    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="loginHover flex fixed right-5 lg:right-15 cursor-default flex-col items-center bg-transparent backdrop-brightness-70 backdrop-blur-[11px] shadow-[1px_2px_4px_var(--header-footer-bg)] rounded-3xl p-4">

      <h2 className="text-2xl pb-4">
        {user ? "Witaj ponownie!" : "Hejka! Zaloguj się :)"}
      </h2>

      {user ? (
        <>
          <div className='px-4'>{user.email}</div>

          <button onClick={logout} className="w-4 mt-5">
            Logout
          </button>

        </>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex justify-center flex-col items-center'
          >
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="nameField"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="passwordField"
            />

            <button
              type="submit"
              className="w-20 m-1 cursor-pointer"
            >
              Login
            </button>
          </form>

          <p className="text-sm">Nie masz konta?</p>
          <button>Zarejestruj się</button>
        </>
      )}

    </div>
  );
}
