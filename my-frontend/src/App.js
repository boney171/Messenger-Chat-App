import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import { useState, useEffect } from 'react';

function App() {
  const [sessionID, setSessionID] = useState(localStorage.getItem('sessionID') || null);

  useEffect(() => {
    // This function runs when the sessionID state changes
    console.log(sessionID); // logs the sessionID stored in localStorage
  }, [sessionID]); // add sessionID to the dependency array

  const handleSessionChange = () => {
    setSessionID(localStorage.getItem('sessionID'));
  };

  return (
    <div className="App">
      <LoginForm onSessionChange={handleSessionChange} />
    </div>
  );
}

export default App;



