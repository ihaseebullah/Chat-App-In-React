import { useContext, useEffect, useState } from "react";
import Register from "./Register";
import { UserContext } from "./Context/UserContext";
import axios from "axios";
import Chat from "./Chat.jsx";

export function Route() {
  const { id, username, setId, setUsername, loogedin, setLoggedin ,users,setUsers} =
    useContext(UserContext);

  useEffect(() => {
    axios.get("/profile").then((res) => {
      const { id: userId, username: userName, allUsers } = res.data;
      setId(userId);
      setUsername(userName);
      if (res.data === "Unauthorized") {
        setLoggedin(false);
      }
      if (res.data != "Unauthorized") {
        const users=allUsers.filter(user => user._id != id)
        setUsers([...users])
        setLoggedin(true);
      }
    });
  }, [username]);
  return <>{loogedin ? <Chat /> : <Register />}</>;
}
