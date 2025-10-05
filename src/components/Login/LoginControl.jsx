import { useState } from "react";
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
            <button onClick={handleLogoutClick}>Logout</button>
        </div>
      ) : (
        <div className="loginHover">
            <h2>Login</h2>
            <input type="text" name="nameHolder" placeholder='Name' className='nameField'/>
            <Password value={value} onChange={(e) => setValue(e.target.value)} feedback={false} className='passwordField' placeholder="Hasło" toggleMask/>
            <button onClick={handleLoginClick}>Login</button>
            <p>Nie masz konta?</p><button>Zarejestruj się</button>
        </div>
      )}
    </div>
  );
}

export default LoginControl
