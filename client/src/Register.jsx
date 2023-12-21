import { useContext, useState } from "react";
import axios from "axios";
import { UserContextProvider, UserContext } from "./Context/UserContext";

export default function Register() {
  const {
    setUsername: setNewUsername,
    setId,
    loogedin,
    setLoggedin,
  } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setUser] = useState("");

  async function register(ev) {
    ev.preventDefault();

    const { data } = await axios.post(
      newUser === true ? "/register" : "/login",
      {
        username: username,
        password: password,
      }
    );
    setNewUsername(username);
    setId(data.id);
  }

  return (
    <>
      <div className="bg-sky-100 h-screen  flex items-center">
        <form className="w-60 mx-auto" onSubmit={register}>
          <input
            type="text"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            className="block w-full p-2 mb-2 focus:outline-transparent rounded-sm"
            placeholder="username"
          />
          <input
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="block w-full p-2 my-2 focus:outline-transparent rounded-sm"
            placeholder="password"
          />
          <button
            type="submit"
            className="bg-sky-500 mt-3 w-full text-white rounded-sm p-2"
          >
            {newUser === true ? "Register" : "Login"}
          </button>

          <p className="mt-3 text-sm">
            New to the platform?{" "}
            <button
              className="hover: text-red"
              style={{ textDecoration: "underline" }}
              onClick={(ev) => {
                ev.preventDefault();
                setUser(!newUser);
              }}
            >
              {" "}
              Signup{" "}
            </button>{" "}
            instaed
          </p>
        </form>
      </div>
    </>
  );
}
