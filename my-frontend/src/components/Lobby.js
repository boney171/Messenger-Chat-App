// Lobby.js
import { useState, useEffect } from 'react';
import './Form.css';
function Lobby({ onJoinRoom , setSessionID}) {  // take in onJoinRoom as prop

    const [rooms, setRooms] = useState([]);
    const activeChatRooms = () =>{

    };

    // this function gets called when a room button is clicked
    const handleJoinRoom = (roomName) => {
      onJoinRoom(roomName);
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/logout', {
              method: 'GET',
            });
    
            const data = await response.json();
            console.log(data);
        }catch (error) {
            console.log(error);
          }

    }
    return (
      <div className="lobbyContainer">
        <button class="logoutButton" onClick={logout}>Log out</button>
        <form name="createChatRoom">
            <label>Create a new chat room, enter a unique name:</label>
            <input type="text"/>
            <input type="submit" value="Create"/>
        </form>
        <h4>Active Chat Rooms</h4>
        <ul>
            <li><button onClick={() => handleJoinRoom('TreeTrunk111')}>TreeTrunk111</button></li>
            <li><button onClick={() => handleJoinRoom('BoneyChan111')}>BoneyChan111</button></li>
        </ul>
      </div>
    );
}

export default Lobby;