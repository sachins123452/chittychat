import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Login from "./Login";

const Main = ({ socket }) => {
  const [newUser, setNewUser] = useState("");
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("users", (users) => {
      const messagesArr = [];
      for (const { userId, username } of users) {
        const newMessage = { type: "userStatus", userId, username };
        messagesArr.push(newMessage);
      }
      setMessages([...messages, ...messagesArr]);
      setUsers(users);
    });
    socket.on("session", ({ userId, username }) => {
      setUser({ userId, username });
    });
    socket.on("user connected", ({ userId, username }) => {
      const newMessage = { type: "userStatus", userId, username };
      setMessages([...messages, newMessage]);
    });
    socket.on("new message", ({ userId, username, message })=>{
        const newMessage = {
            type: "message",
            userId: userId,
            username: username,
            message,
          };
          setMessages([...messages, newMessage]);
    });
  }, [socket, messages]);

  const handleChange = ({ currentTarget: input }) => {
    setNewUser(input.value);
  };

  const logNewUser = () => {
    socket.auth = { username: newUser };
    socket.connect();
  };

  const sendMessage = () => {
    socket.emit("new message", message);
    const newMessage = {
      type: "message",
      userId: user.userId,
      username: user.username,
      message,
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };
  return (
    <main className="content">
      <div className="container mt-3">
        {user.userId && (
          <Chat
            user={user}
            message={message}
            sendMessage={sendMessage}
            messages={messages}
            setMessage={setMessage}
          />
        )}
        {!user.userId && (
          <Login
            newUser={newUser}
            handleChange={handleChange}
            logNewUser={logNewUser}
          />
        )}
      </div>
    </main>
  );
};
export default Main;
