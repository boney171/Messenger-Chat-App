import { useRef } from "react";
import "./css/ChatScreen.css";
import axios from "axios";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faClock, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
const SOCKET_SERVER_URL = "http://localhost:3001";

function ChatScreen(props) {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserMSGs, setCurrentUserMSGs] = useState([]);
  const [otherUserMSGs, setOtherUserMSGs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedMessage, setSelectedMessage] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState([]);
  const [reactions, setReactions] = useState([]);
  const socketRef = useRef();

  const addReaction = async (messageId, reactionType, index) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/messages/react",
        { messageId, reactionType },
        { withCredentials: true }
      );
      // Handle the response as needed
      console.log(response.data);
      setReactions((prevReactions) => 
      [...prevReactions, { messageId, reaction: reactionType }]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const retrieveCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/auth/session",
          { withCredentials: true }
        );
        //console.log("RESPONSE: ", response);
        setCurrentUser(response.data.user);
        setCurrentUserId(response.data.id);
        //console.log("CURRENT id: ", response.data.id)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          console.log(error.message);
        }
      }
    };

    retrieveCurrentUser();
  }, []);
  useEffect(() => {
    const sendJoinRoomRequest = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/rooms/join",
          { room: props.room },
          { withCredentials: true }
        );
        console.log(response);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          console.log(error.message);
        }
      }
    };

    sendJoinRoomRequest();
  }, []);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, {
          cors: {
            origin: SOCKET_SERVER_URL,
            credentials: true,
          }, transports: ['websocket']
    });
    socketRef.current = socket; // Storing socket reference

    socket.emit("joinRoom", room);

    // Listen for messages from the server

    socket.on("message", (data) => {
      //console.log("Socket sending data to the whole room", data.user, data.message);
      if (currentUser === data.user) {
        setCurrentUserMSGs((prevDatas) => [...prevDatas, data]);
      } else setOtherUserMSGs((prevDatas) => [...prevDatas, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [room, currentUser]);

  const retrieveMessages = async () => {
    try {
      console.log("ROOM: ", room);
      const res = await axios.get(
        `http://localhost:3001/api/rooms/messages?room=${encodeURIComponent(
          props.room
        )}`,
        { withCredentials: true }
      );
      console.log("Response data:", res.data); // Check if the response data is received correctly

      // Map over the response data and create an object for each message
      const messages = await Promise.all(
        res.data.map(async (message) => {
          console.log("Sender: ", message.sender);
          console.log("id: ", currentUserId);
          const user =
            message.sender === currentUserId
              ? currentUser
              : await retrieveUsername(message.sender);
          return {
            time: message.createdAt,
            message: message.message.text,
            user: user,
          };
        })
      );

      // Update the currentUserMSGs state
      setCurrentUserMSGs(messages);
      console.log("Current user messages:", currentUserMSGs); // Check if the messages are set correctly
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  const retrieveUsername = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/rooms/user?user=${userId}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.log("Error fetching username:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await retrieveMessages();
    };

    fetchData();
  }, [currentUserId]);

  const leaveChatRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "http://localhost:3001/api/rooms/leave",
        {
          data: { room: props.room },
          withCredentials: true,
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
    props.onLeaveRoom();
  };

  const sendMessage = async () => {
    try {
      socketRef.current.emit("message", newMessage, room); // Use socketRef.current to access socket
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="ChatContainer">
      <div className="InnerChatContainer">
        <div className="ChatScreen">
          <h4>{room}</h4>
          <div className="messagesContainer">
            {currentUserMSGs
              .concat(otherUserMSGs)
              .sort((a, b) => new Date(a.time) - new Date(b.time))
              .map((message, index) => (
                <div
                  key={index}
                  className={
                    message.user === currentUser
                      ? "currentUserMessageWrapper"
                      : "otherUserMessageWrapper"
                  }
                >
                  <div className="message-reactions">         
                  {selectedMessage.includes(index) && (
                  <>
                  {selectedReaction[index] !== "dislike" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addReaction(message.id, "like", index);
                        setSelectedReaction((prevReactions) => {
                          const newReactions = [...prevReactions];
                          newReactions[index] = "like";
                          return newReactions;
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                  )}
                  {selectedReaction[index] !== "like" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addReaction(message.id, "dislike", index);
                        setSelectedReaction((prevReactions) => {
                          const newReactions = [...prevReactions];
                          newReactions[index] = "dislike";
                          return newReactions;
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                  )}
                </>
                )}
                  </div>
                  <div
                    className={
                      message.user === currentUser
                        ? "currentUserMessage"
                        : "otherUserMessage"
                    }
                    onClick={() => {
                      if (selectedMessage.includes(index)) {
                        setSelectedMessage((prevSelectedMessages) =>
                          prevSelectedMessages.filter((i) => i !== index)
                        );
                        setSelectedReaction7((prevReactions) => {
                          const newReactions = [...prevReactions];
                          newReactions[index] = null;
                          return newReactions;
                        });
                      } else {
                        setSelectedMessage((prevSelectedMessages) => [
                          ...prevSelectedMessages,
                          index,
                        ]);
                      }
                    }}
                  >
                    <p className="message-content">{message.message}</p>
                    {reactions.find(r => r.messageId === message.id) && (
                      <FontAwesomeIcon icon={
                        reactions.find(r => r.messageId === message.id).reaction === 'like' 
                          ? faThumbsUp 
                          : faThumbsDown
                      } />
                   )}
                  </div>
                  <p className="timestamp">
                    {new Date(message.time).toLocaleTimeString()}
                  </p>{" "}
                  {/* Timestamp is now outside the message bubble */}
                </div>
              ))}
          </div>
        </div>

        <div className="messagePart">
          <form
            className="messagePartForm"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              className="textMessage"
              name="textMessage"
              placeholder="Enter your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
          <button className="exitButton" onClick={leaveChatRoom}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;



