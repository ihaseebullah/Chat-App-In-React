import { useEffect, useState, useContext, useRef } from "react";
import Avatar from "./Avatar";
import { UserContext } from "./Context/UserContext";
import _, { last } from "lodash";
import axios from "axios";

export default function Chat() {
  const { users } = useContext(UserContext);
  const { username, id } = useContext(UserContext);
  const [ws, setWs] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeUser, setActiveUser] = useState("No user selected");
  const [activeUserId, setActiveUserId] = useState(undefined);
  const [message, setMessage] = useState("");
  const [prevConversation, setConversation] = useState([]);
  const [image, setImage] = useState("");
  const [onlines, setOnlines] = useState([]);
  const [offlines, setOfflines] = useState([]);
  const [offlineObject, setOfflineObject] = useState({});
  const [onlineObject, setOnlineObject] = useState({});
  const chatTab = useRef();
  const lastMessage = useRef();
  useEffect(() => {
    const myWebSocket = new WebSocket("ws://localhost:3000");
    myWebSocket.addEventListener("message", handleMessage);
    setWs(myWebSocket);
  }, []);

  useEffect(() => {
    // console.log(Object.keys(onlineUsers))
    const onlineUsersRaw = Object.keys(onlineUsers);

    let iterator = 0;
    const online = users.filter((user) => {
      iterator + 1;
      return Object.values(user).includes(onlineUsersRaw[iterator]) === true;
    });
    setOnlines(online);
    const offline = users.filter((user) => {
      iterator + 1;
      return Object.values(user).includes(onlineUsersRaw[iterator]) === false;
    });
    setOfflines(offline);
  }, [onlineUsers]);
  // console.log(offline)

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);

    // console.log(messageData);
    if (messageData != [] || {} || undefined) {
      if (Array.isArray(messageData)) {
        showResult(messageData);
      } else {
        setConversation((prev) => [...prev, messageData]);
      }
    } else {
      // console.log(messageData);
    }
  }
  function sendMessage(ev) {
    ev.preventDefault();
    const MessageData = JSON.stringify({
      messageId: new Date(),
      textMessage: message,
      to: activeUserId,
      reciever: activeUser,
      username: username,
      from: id,
      sender: username,
      image: image !== undefined ? image : " ",
      timeStamp:
        new Date().toLocaleTimeString() +
        "  " +
        new Date().toLocaleDateString(),
    });
    const savingMessage = JSON.parse(MessageData);
    ws.send(MessageData);
    setConversation((prev) => [...prev, savingMessage]);
    setMessage(" ");
    chatTab.current.focus;
  }
  function showResult(messageData) {
    const clients = {};
    messageData.forEach(({ username, id }) => {
      clients[id] = username;
    });

    delete clients[id];
    setOnlineUsers({ ...clients });
  }
  const withoutDupes = _.uniqBy(prevConversation, "messageId");
  useEffect(() => {
    let MyObj = {};
    offlines.map((user) => {
      MyObj[user._id] = user.username;
    });
    setOfflineObject(MyObj);
    let MyObj1 = {};
    onlines.map((user) => {
      MyObj[user._id] = user.username;
    });
    setOnlineObject(MyObj1);
  }, [onlineUsers, onlines]);
  useEffect(() => {
    if (activeUserId != undefined) {
      lastMessage.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [prevConversation]);

  useEffect(() => {
    axios.get("/chateoo/" + activeUserId).then((res) => {
      setConversation(res.data);
      console.log("Refreshing conversation......");
    });
  }, [activeUserId, activeUser,message]);

  useEffect(() => {
    axios
      .get("/chateoo/markMessegesRead/" + id + "/" + activeUserId)
      .then(() => {
        console.log("Marking messages read......");
      });

    console.log("Marking messages read......");
  }, [prevConversation]);

  return (
    <div className=" flex h-screen bg-sky-100">
      <div className="w-1/3 bg-white">
        <div className="relative h-full">
          <div className="overflow-y-scroll absolute   inset-0 ">
            <div className="flex items-center px-2 py-2">
              <span className="flex items-center gap-2 w-full text-center font-bold text-2xl h-10  text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                Chateeoo
              </span>
            </div>

            {/* {Object.keys(onlineUsers).map((user) => {
         
          return (
            <div
              key={user}
              onClick={() => {
                if (onlineUsers[user] == activeUser) {
                  setActiveUser("No user selected");
                  setActiveUserId(undefined);
                } else {
                  setActiveUser(onlineUsers[user]);
                  setActiveUserId(user);
                }
              }}
              className={
                onlineUsers[user] === activeUser
                  ? "bg-sky-200 p-2 flex py-2 cursor-pointer border-l-4 rounded-md-l border-indigo-500  items-center rounded-sm"
                  : " " +
                    " flex p-2 border-l-4 border-white  cursor-pointer hover:bg-slate-100  py-2 border-b  rounded-sm items-center"
              }
            >
              
              <Avatar
                online={true}
                userId={user}
                username={onlineUsers[user]}
              />
              <span className="p-2 ">{onlineUsers[user]}</span>
            </div>
          );
        })} */}

            {onlines.map((user) => {
              return (
                <div
                  key={user._id || user}
                  onClick={() => {
                    if (user.username == activeUser) {
                      setActiveUser("No user selected");
                      setActiveUserId(undefined);
                    } else {
                      setActiveUser(user.username);
                      setActiveUserId(user._id);
                    }
                  }}
                  className={
                    user.username === activeUser
                      ? "bg-sky-200 p-2 flex py-2 cursor-pointer border-l-4 rounded-md-l border-indigo-500  items-center rounded-sm"
                      : " " +
                        " flex p-2 border-l-4 border-white  cursor-pointer hover:bg-slate-100  py-2 border-b  rounded-sm items-center"
                  }
                >
                  <Avatar
                    online={true}
                    userId={user._id}
                    username={user.username}
                  />
                  <span className="p-2 ">{user.username}</span>
                </div>
              );
            })}
            {offlines.map((user) => {
              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (user.username == activeUser) {
                      setActiveUser("No user selected");
                      setActiveUserId(undefined);
                    } else {
                      setActiveUser(user.username);
                      setActiveUserId(user._id);
                    }
                  }}
                  className={
                    user.username === activeUser
                      ? "bg-sky-200 p-2 flex py-2 cursor-pointer border-l-4 rounded-md-l border-indigo-500  items-center rounded-sm"
                      : " " +
                        " flex p-2 border-l-4 border-white  cursor-pointer hover:bg-slate-100  py-2 border-b  rounded-sm items-center"
                  }
                >
                  <Avatar
                    online={false}
                    userId={user._id}
                    username={user.username}
                  />
                  <span className="p-2 ">{user.username}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col  w-2/3 ">
        <div className="flex-grow">
          {onlineUsers[activeUserId] || offlineObject[activeUserId] ? (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute   inset-0 ">
                <div className="bg-sky-500 p-2 inset-0  w-full  flex gap-2 items-center rounded-b-md">
                  <div className="flex flex-grow items-center  gap-2">
                    <Avatar
                      userId={activeUserId}
                      username={
                        onlineUsers[activeUserId]
                          ? onlineUsers[activeUserId]
                          : offlineObject[activeUserId]
                      }
                    />
                    <h1 className="text-white">
                      {onlineUsers[activeUserId] || offlineObject[activeUserId]
                        ? onlineUsers[activeUserId] ||
                          offlineObject[activeUserId]
                        : "Select a contact to view conversation"}
                    </h1>{" "}
                  </div>
                  <span className="text-white cursor-pointer ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </span>
                  <span className="text-white cursor-pointer mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="p-3">
                  {withoutDupes.map((message) => {
                    if (
                      (message.from === activeUserId && message.to === id) ||
                      (message.from === id && message.to === activeUserId)
                    ) {
                      if (message.from === id) {
                        return (
                          <div
                            key={message.messageId}
                            className="bg-sky-300 ml-auto text-gray-800 w-2/3 p-3 rounded-md my-3"
                          >
                            <p>{message.textMessage}</p>
                            <p className="text-xs text-gray-500">
                              Sent to {message.reciever} {message.timeStamp}{" "}
                              {message.seen === true ? "seen" : "Delivered"}
                              {message.from === id ||
                                (message.to === id && "true")}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div key={Math.random()} className="">
                            <div className="bg-gray-200  text-gray-600 w-2/3 text-left p-3 rounded-md my-3">
                              <p>{message.textMessage}</p>
                              <p className="text-xs text-gray-500">
                                sent by {message.sender} {message.timeStamp}
                              </p>
                              {/* <p>{message.timeStamp.toLocaleTimeString()}</p> */}
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
                <p ref={lastMessage} className="p-2"></p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center flex-grow">
              <p
                className="text-gray-500 w-full"
                style={{ textAlign: "center" }}
              >
                &larr; Please select a contact form the sidebar
              </p>
            </div>
          )}
        </div>

        {onlineUsers[activeUserId] || offlineObject[activeUserId] ? (
          <form className="flex gap-2 m-2" onSubmit={sendMessage}>
            <input
              ref={chatTab}
              value={message}
              onChange={(ev) => {
                setMessage(ev.target.value);
              }}
              placeholder="Tap to start typing"
              className="flex-grow p-2 bg-white bordered"
            />

            <button
              className="bg-sky-500 p-2 rounded-md text-white"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
