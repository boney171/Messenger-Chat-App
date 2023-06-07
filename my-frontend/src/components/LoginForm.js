import "./css/LoginForm.css";
import RegistrationForm from "./RegistrationForm";
import { useState } from "react";
import imageSrc from "./images/wallpaper2.jpg";
import axios from "axios";
function LoginForm(props) {
    const [loginModal, setLoginModal] = useState(true);
    const [registerModal, setRegisterModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    //This function is to toggle login modal and register modal on and off
    const handleRegisterClick = () => {
      setLoginModal(false);
      setRegisterModal(true);
    }
    
    //This function handle login
    const handleLoginClick = async (e) => {
      e.preventDefault();
    
      //Create temp user object
      const user = {
        username: username,
        password: password,
      };
    

      //Send an api call to the server to verify if user exists
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', user, {withCredentials: true});
    
        const data = response.data;
        
        //If server send back sessionID === null, means user does not exists
        if(data.sessionID === null){
          alert(data.message);
          
          //If server send back a legit sessionID, means user exists
        } else {
          props.setSessionID(data.user);
          console.log(data.user);
          //to retrieve const sessionID = localStorage.getItem('sessionID');
          props.setSessionID(data.user);
          props.onSessionChange();
          setLoginModal(false);
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
            <span
              onClick={handleRegisterClick}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
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
