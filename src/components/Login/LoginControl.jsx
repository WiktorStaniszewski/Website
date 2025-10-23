import { useState } from "react";
import { NavLink } from 'react-router-dom';
        

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState('');

  let email = 'bodyespressobar@gmail.com'

  const handleLoginClick = () => setIsLoggedIn(true);
  const handleLogoutClick = () => setIsLoggedIn(false);

  return (
    <div className="loginHover flex fixed cursor-default flex-col items-center bg-transparent backdrop-brightness-70 backdrop-blur-[11px] h-fit w-fit right-22 top-22 shadow-[1px_2px_4px_var(--header-footer-bg)]">
          <h2>Login</h2>
      {isLoggedIn ? (
        <>
          <div className='px-4'>{email}</div>
          <button onClick={handleLogoutClick} className="w-4 mt-5">Logout</button>
          <NavLink to="accManager"><button className="w-auto mt-4">Zarządzaj kontem</button></NavLink>
        </>
      ) : (
        <>
          <form className='flex justify-center flex-col items-center' action="post">
            <input type="email" name="nameHolder" placeholder='Email' className='nameField' autoComplete="off"/>
            <input 
              value={value} 
              onChange={(e) => setValue(e.target.value)} 
              type="password" name="passwordHolder" 
              id="" 
              placeholder="Password" 
              className="passwordField" 
              autoComplete="off"
            />
            <button onClick={handleLoginClick} className="w-20 m-1">Login</button>
          </form>
          <p className='text-sm'>Nie masz konta?</p><button>Zarejestruj się</button>
        </>
        )}
    </div>
  );
}

export default LoginControl
