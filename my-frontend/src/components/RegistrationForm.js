import "./css/RegistrationForm.css";
import { useState } from "react";
import imageSrc from "./images/wallpaper2.jpg";

function RegistrationForm({ setLoginModal, setRegisterModal }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  //This function is to turn of the register modal, and turn on the login modal
  const haveAccountHandler = () => {
    setLoginModal(true);
    setRegisterModal(false);
  };

  //This function handles registering new account
  const submitNewAccountHandler = async (e) => {
    e.preventDefault();

    const user = {
      username: userName,
      password: password,
      email: email,
    };
    console.log(user);

    //Send an api call to the server to create a new user.
    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log("Data sent successfully");
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.log(error);
    }
    setLoginModal(true);
  };

  return (
    <div className="container">
      <div className="imageContainer">
        <img src={imageSrc} alt="Your Image" className="image" />
      </div>
      <div className="formContainer">
        <h4>Register</h4>

        <form className="registerForm" onSubmit={submitNewAccountHandler}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {/* <button className="haveAccount" onClick={haveAccountHandler}>
            Already Have An Account?
          </button> */}

          <input type="submit" />
          <p>
            Already have an account?{" "}
            <span onClick={haveAccountHandler} className="register-link">
              Click here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
