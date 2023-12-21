import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider(props) {
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [loogedin, setLoggedin] = useState(false);
  const [users,setUsers]=useState([])
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId,loogedin,setLoggedin,users,setUsers }}>
      {props.children}
    </UserContext.Provider>
  );
}
