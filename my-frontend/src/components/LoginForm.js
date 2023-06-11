import './css/LoginForm.css';
import RegistrationForm from './RegistrationForm';
import Verify from './Verify';
import { useState } from 'react';
import axios from 'axios';

function LoginForm(props) {
  const [loginModal, setLoginModal] = useState(true);
  const [registerModal, setRegisterModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterClick = () => {
    setLoginModal(false);
    setRegisterModal(true);
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    const user = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', user, { withCredentials: true });

      const data = response.data;

      if (data.loggedIn === false) {
        alert(data.message);
      } else {
        console.log(data.user);
        //props.setSessionID(data.user);
        //props.onSessionChange();
        setVerifyModal(true);
        setLoginModal(false);
        setRegisterModal(false);
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
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />

          <label className="up">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <button type="button" onClick={handleRegisterClick}>Register</button>
          <input type="submit" value="Login" />
        </form>
      </div>
    ) : (
      registerModal ? <RegistrationForm setLoginModal={setLoginModal} setRegisterModal={setRegisterModal} />
      : verifyModal ? <Verify username={username} setSessionID={props.setSessionID} onSessionChange={props.onSessionChange} setVerifyModal={setVerifyModal}/> : null
    )
  );
}

export default LoginForm;