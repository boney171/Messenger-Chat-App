import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import ChatScreen from './components/ChatScreen';
import Lobby from './components/Lobby';
import { useState, useEffect } from 'react';

function App() {
  const [sessionID, setSessionID] = useState(localStorage.getItem('sessionID') || null);
  const [activeRoom, setActiveRoom] = useState(null);  // added this line

  useEffect(() => {
    // Reset the sessionID in local storage
    localStorage.removeItem('sessionID');
  }, []);  // Empty dependency array means this runs on mount and cleanup on unmount

  useEffect(() => {
    // This function runs when the sessionID state changes
    console.log(sessionID); // logs the sessionID stored in localStorage
  }, [sessionID]); // add sessionID to the dependency array

  const handleSessionChange = () => {
    setSessionID(localStorage.getItem('sessionID'));
  };

  return (
    <div className="App">
      { sessionID 
          ? activeRoom 
            ? <ChatScreen room={activeRoom} onLeaveRoom={() => setActiveRoom(null)} /> 
            : <Lobby onJoinRoom={setActiveRoom} setSessionID={setSessionID} /> 
          : <LoginForm onSessionChange={handleSessionChange} /> 
      }
    </div>
  );
}

export default App;


