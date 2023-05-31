
import { useState, useEffect } from 'react';
import './Form.css';
function ChatScreen() {

  return (
    <div className="ChatContainer">
        <div className="InnerChatContainer">
            <div className="ChatScreen">
                <h4>Room #</h4>
            </div>
            
            <div className="messagePart">
                <form className="messagePartForm">
                <textarea className="textMessage" name="textMessage" placeholder='Enter your message'></textarea>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    </div>
  );
}

export default ChatScreen;



