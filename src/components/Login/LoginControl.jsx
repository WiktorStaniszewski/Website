import 'styles/LoginControl.css'
import { useState } from "react";
import { NavLink } from 'react-router-dom';
import { Password } from 'primereact/password';
        

function LoginControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState('');

  let email = 'bodyespressobar@gmail.com'

  const handleLoginClick = () => setIsLoggedIn(true);
  const handleLogoutClick = () => setIsLoggedIn(false);

  return (
    <div>
      {isLoggedIn ? (
        <div className="loginHover">
            <h2>Login</h2>
            <div>{email}</div>
            <button onClick={handleLogoutClick} className="logout">Logout</button>
            <NavLink to="accManager"><button className="manageAccount">Zarządzaj kontem</button></NavLink>
        </div>
      ) : (
        <div className="loginHover">
            <h2>Login</h2>
            <form action="post">
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
              <button onClick={handleLoginClick} className="login">Login</button>
            </form>
            <p>Nie masz konta?</p><button>Zarejestruj się</button>
        </div>
      )}
    </div>
  );
}

export default LoginControl
