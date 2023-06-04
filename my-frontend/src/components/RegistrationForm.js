import './css/RegistrationForm.css'
import {useState} from 'react';

function RegistrationForm({setLoginModal, setRegisterModal}) {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    //This function is to turn of the register modal, and turn on the login modal
    const haveAccountHandler =  () => {
      setLoginModal(true);
      setRegisterModal(false);
    }

    //This function handles registering new account
    const submitNewAccountHandler = async  (e) =>{
      e.preventDefault();

      const user = {
        username: userName,
        password: password,
        email: email
      };
      console.log(user);
      
      //Send an api call to the server to create a new user.
      try{
        const response =  await fetch('http://localhost:3001/api/auth/signup', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(user)
        });

        if (response.ok) {
          console.log('Data sent successfully');
        } else {
          console.error('Error:', response);
        }
      }catch(error){
        console.log(error);
      }
      setLoginModal(true);
    }

    return (
      <div className="registerFormContainer">
        <h4>Register A New Account</h4>
        <form className="registerForm" onSubmit={submitNewAccountHandler}>
          <label className="up">Username</label>
          <input type="text" value={userName} onChange={e => setUsername(e.target.value)} />
          <label className="up">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <label className="up">Email</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
          <button className="haveAccount" onClick={haveAccountHandler}>Already Have An Account?</button>
          <input type="submit" />
        </form>
      </div>
    );
}

export default RegistrationForm;