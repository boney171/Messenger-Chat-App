// Lobby.js
import { useState, useEffect } from 'react';
import './Form.css';
import axios from 'axios';
function Lobby({ onJoinRoom , setSessionID}) {  // take in onJoinRoom as prop

    const [newRoom, setNewRoom] = useState("");
    const [rooms, setRooms] = useState([]);
    const activeChatRooms = () =>{

    };

    const retrieveRooms = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/rooms/all", { withCredentials: true });
        const roomNames = res.data.map(room => room.name);
        setRooms(roomNames);
        console.log(rooms);
      } catch (err) {
        console.error(err);
      }
    };
    // this function gets called when a room button is clicked
    const handleJoinRoom = (roomName) => {
      onJoinRoom(roomName);
    };
    
    useEffect(() => {
      retrieveRooms();
    }, []);
  

    const logout = async () => {
       setSessionID(null);
       try{
        axios.get("http://localhost:3001/api/auth/logout", { withCredentials: true })
        .then(res => {
          console.log(res.data);
        if (res.data.loggedOut === true) {
          setSessionID("");
        } 
      })
       }catch(error){
        console.log(error)
       }

    }

    const createChatRoom = async (e) => {
      e.preventDefault();
  
      //console.log(newRoom);
      const nR = {
        name: newRoom,
      }
      //const datasend = JSON.stringify(nR);
      try {
        const response = await axios.post('http://localhost:3001/api/rooms/create', nR, {withCredentials: true});
        alert(response.data.message);
      } catch (error) {
        if(error.response) alert (error.response.data.message);
        else console.log(error.message);
      }
      retrieveRooms();
      setNewRoom("");
    };
    return (
      <div className="lobbyContainer">
        <button class="logoutButton" onClick={logout}>Log out</button>
        <form name="createChatRoom" onSubmit={createChatRoom}>
            <label>Create a new chat room, enter a unique name:</label>
            <input type="text" value={newRoom} onChange={e => setNewRoom(e.target.value)}/>
            <input type="submit" value="Create"/>
        </form>
        <h4>Active Chat Rooms</h4>
        <ul>
        {rooms.map((room) => (
          <li key={room}>
            <button onClick={() => handleJoinRoom(room)}>
              {room}
            </button>
          </li>
        ))}
        </ul>
      </div>
    );
}

export default Lobby;