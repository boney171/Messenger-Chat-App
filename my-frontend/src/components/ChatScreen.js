import { useRef } from "react";
import "./css/ChatScreen.css";
import axios from "axios";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faClock, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
const SOCKET_SERVER_URL = "http://localhost:3001";

function ChatScreen(props) {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserMSGs, setCurrentUserMSGs] = useState([]);
  const [otherUserMSGs, setOtherUserMSGs] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(new Date()); // Initialize currentDay as a Date object
  const [showToday, setShowToday] = useState(false); // Add state to track whether to show "Today" message
  const [showMiddleTimestamp, setShowMiddleTimestamp] = useState(true); // State to control the display of the middle timestamp
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false); // State to track whether the messages have been fetched
  const [selectedMessage, setSelectedMessage] = useState([]); // State to track the selected message
  const [selectedReaction, setSelectedReaction] = useState([]); // keeps track of the picked reactions
  const [reactions, setReactions] = useState([]); // sets the reactions
  const socketRef = useRef();

  const addReaction = async (messageId, reactionType, index) => {
    console.log("inside addReact")
    try {
      const response = await axios.post(
        `http://localhost:3001/api/rooms/edit?reaction=${reactionType}`,
        { messageId },
        { withCredentials: true }
      );
      // Handle the response as needed
      console.log(response.data);
      setReactions((prevReactions) => [
        ...prevReactions,
        { messageId, reaction: reactionType },
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    setShowMiddleTimestamp(true);
    setHasFetchedMessages(false);
  }, [room]);

  useEffect(() => {
    if (!hasFetchedMessages) {
      const fetchData = async () => {
        await retrieveMessages();
        setHasFetchedMessages(true);
      };
      fetchData();
    }
  }, [hasFetchedMessages]);
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
      },
      transports: ["websocket"],
    });
    socketRef.current = socket; // Storing socket reference

    socket.emit("joinRoom", room);

    socket.on("reaction", (data) => {
      const { messageId, reactionType } = data;
      setReactions((prevReactions) =>
        [...prevReactions, { messageId, reaction: reactionType }]
      );
    });

    // Listen for messages from the server

    socket.on("message", (data) => {
      const newMessage = {
        ...data,
        id: data.messageId,  // this assumes the messageId is included in the socket data
      };
      //console.log("Socket sending data to the whole room", data.user, data.message);
      if (currentUser === data.user) {
        setCurrentUserMSGs((prevDatas) => [...prevDatas, newMessage]);
      } else setOtherUserMSGs((prevDatas) => [...prevDatas, newMessage]);
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
            id: message._id,
          };
        })
      );

      // Update the currentUserMSGs state
      setCurrentUserMSGs(messages);
      console.log("Current user messages:", currentUserMSGs); // Check if the messages are set correctly
      setIsLoading(false);
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
      socketRef.current.emit("message", newMessage, room, "0"); // Use socketRef.current to access socket
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const formatTimeOrDate = (messageDate) => {
    const today = new Date();
    const isSameDay =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    return isSameDay
      ? messageDate.toLocaleTimeString()
      : messageDate.toLocaleDateString();
  };

  // Helper function to check if two dates belong to different days
  const isDifferentDay = (date1, date2) => {
    return (
      date1.getDate() !== date2.getDate() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getFullYear() !== date2.getFullYear()
    );
  };
  return (
    <div className="ChatContainer">
      <div className="InnerChatContainer">
        <div className="ChatScreen">
          <h4>{room}</h4>
          <div className="messagesContainer">
            {isLoading && <div className="daySeparator">Loading...</div>}
            {!isLoading && (
              <>
                {currentUserMSGs.length === 0 && otherUserMSGs.length === 0 && (
                  <div className="daySeparator">Today</div>
                )}
                {currentUserMSGs
                  .concat(otherUserMSGs)
                  .sort((a, b) => new Date(a.time) - new Date(b.time))
                  .map((message, index, arr) => {
                    const messageDate = new Date(message.time);
                    const currentDate = new Date();
                    const isEndOfDay =
                      index === arr.length - 1 ||
                      messageDate.getDate() !==
                      new Date(arr[index + 1].time).getDate() ||
                      messageDate.getMonth() !==
                      new Date(arr[index + 1].time).getMonth() ||
                      messageDate.getFullYear() !==
                      new Date(arr[index + 1].time).getFullYear();
                    const isToday =
                      messageDate.getDate() === currentDate.getDate() &&
                      messageDate.getMonth() === currentDate.getMonth() &&
                      messageDate.getFullYear() === currentDate.getFullYear();

                    // Update showToday state if messageDate is a new day
                    if (
                      !isEndOfDay &&
                      messageDate.getDate() !== currentDay.getDate() &&
                      messageDate.getMonth() !== currentDay.getMonth() &&
                      messageDate.getFullYear() !== currentDay.getFullYear()
                    ) {
                      setCurrentDay(messageDate);
                      setShowToday(true);
                    }

                    const showTimestamp = (showToday && isToday) || isEndOfDay;

                    // Reset showToday state after rendering the first "Today" message
                    if (showToday) {
                      setShowToday(false);
                    }

                    return (
                      <>
                        {showTimestamp && (
                          <div className="daySeparator">
                            {isToday ? "Today" : formatTimeOrDate(messageDate)}
                          </div>
                        )}

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
                                      console.log("Thumbs up selected for message index: ", index);
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
                                      console.log("Thumbs down selected for message index: ", index);
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
                                setSelectedReaction((prevReactions) => {
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
                              console.log(" selected for message index: ", index);
                            }}
                          >
                            <p className="message-content">{message.message}</p>
                          </div>
                          <p className="timestamp">
                            {formatTimeOrDate(new Date(message.time))}
                          </p>{" "}
                          {/* Timestamp is now outside the message bubble */}
                        </div>
                      </>
                    );
                  })}
              </>
            )}
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
