import { useState } from "react";
import io from "socket.io-client";
import "./chat.css";

const socket = io("http://localhost:5000");
 const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [spinner, setSpinner] = useState(false);

  socket.on("receiveMessage", (data) => {
    const newChat = [...messageList, { role: "server", message: data.message }];
    setMessageList(newChat);
    setSpinner(false);
  });

  function submitHandler() {
    socket.emit("sendMessage", { message });
    const newChat = [...messageList, { role: "user", message: message }];
    setMessageList(newChat);
    setMessage("");
    setSpinner(true);
  }

  function handleInputText(e) {
    const value = e.target.value;
    setMessage(value);
  }

  return (
    <>
      <div className="chat-container">
        {messageList.map((chat, index) => {
          return (
            <div
              key={index}
              className={
                chat.role === "user"
                  ? "message sender"
                  : "message receiver"
              }
            >
              <p>{chat.message}</p>
            </div>
          );
        })}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          placeholder="Ask query"
          onChange={handleInputText}
        />
        <div>
          <button onClick={submitHandler}>
            {!spinner ? "Send" : <div id="spinner" className="spinner"></div>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;