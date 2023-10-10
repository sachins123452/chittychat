import React, { useState, useEffect, useCallback } from "react";
import Chat from "./Chat";
import Login from "./Login";

const Main = ({ socket }) => {
  const [newUser, setNewUser] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const checkIfUserExists = useCallback(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      socket.auth = { sessionId: sessionId };
      socket.connect();
    }
  }, [socket]);

  useEffect(() => {
    checkIfUserExists();

    socket.on("connect", () => {
      console.info("connected");
    });
    socket.on("disconnect", () => {
      console.info("Disconnected");
    });
    socket.on("session", ({ userId, username, sessionId }) => {
      socket.auth = { sessionId: sessionId };
      localStorage.setItem("sessionId", sessionId);
      setUser({ userId, username });
    });
    socket.on("users", (users) => {
      console.log("users", users);
      setUsers(users);
    });
  }, [socket, messages, checkIfUserExists]);

  const logNewUser = () => {
    socket.auth = { username: newUser };
    socket.connect();
  };
  return (
    <main className="content">
      <div className="container mt-3">
        {user.userId && (
          <Chat
            user={user}
            users={users}
            socket={socket}
            setUsers={setUsers}
            setMessages={setMessages}
            messages={messages}
          />
        )}
        {!user.userId && (
          <Login
            newUser={newUser}
            setNewUser={setNewUser}
            logNewUser={logNewUser}
          />
        )}
      </div>
    </main>
  );
};
export default Main;
