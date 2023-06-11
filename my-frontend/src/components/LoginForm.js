import './css/LoginForm.css';
import RegistrationForm from './RegistrationForm';
import Verify from './Verify';
import { useState } from 'react';
import axios from 'axios';
import imageSrc from "./images/wallpaper2.jpg";
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


  return loginModal ? (
    <div className="container">
      <div className="imageContainer">
        <img src={imageSrc} alt="Your Image" className="image" />
      </div>
      <div className="formContainer">
        <div className="title">Login</div>
        <form className="loginForm" onSubmit={handleLoginClick}>
          {/* <label className="up">Username</label> */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          {/* <label className="up">Password</label> */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <input type="submit" value="Login" />
          <p>
            Don't have an account?{" "}
            <span onClick={handleRegisterClick} className="register-link">
              Click here
            </span>
          </p>
        </form>
      </div>
    </div>
  ) : registerModal ? (
    <RegistrationForm
      setLoginModal={setLoginModal}
      setRegisterModal={setRegisterModal}
    />
  ) : null;
}

export default LoginForm;
