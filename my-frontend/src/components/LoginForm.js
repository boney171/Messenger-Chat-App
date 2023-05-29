import './Form.css';
import RegistrationForm from './RegistrationForm';
import {useState} from 'react';

function LoginForm(props) {
    const [loginModal, setLoginModal] = useState(true);
    const [registerModal, setRegisterModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleRegisterClick = () => {
      setLoginModal(false);
      setRegisterModal(true);
    }
 
    const handleLoginClick = async (e) => {
      e.preventDefault();

      const user = {
        username: username,
        password: password,
      };

      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(user)
        });

        const data = await response.json();
        
        if(data.sessionID === null){
          alert(data.message);
        } else {
          localStorage.setItem('sessionID', data.sessionID);
          //to retrieve const sessionID = localStorage.getItem('sessionID');
          props.onSessionChange();
          setLoginModal(false);
        }

      } catch (error) {
        console.log(error);
      }
    };

    return (
      loginModal ? (
        <div className="formContainer">
          <form className="loginForm" onSubmit={handleLoginClick}>
            <label className="up">Username</label>
            <input type="text" value={username} onChange={e=> setUsername(e.target.value)} />
    
            <label className="up">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    
            <button type="button" onClick={handleRegisterClick}>Register</button>
            <input type="submit" value="Login" />
          </form>
        </div>
      ) : (
        registerModal ? <RegistrationForm setLoginModal={setLoginModal} setRegisterModal={setRegisterModal} /> : null
      )
    );
}

export default LoginForm;