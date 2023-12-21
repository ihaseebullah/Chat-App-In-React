import { useContext } from "react";
import { UserContext } from "./Context/UserContext";

export default function Avatar(props) {

const {users}=useContext(UserContext)

const dot=props.online === true ?"absolute w-4 h-4  bg-green-400 bottom-0 right-0 rounded-full ":null

  
  if (props.userId !== undefined) {
    const Colors = [
      "bg-blue-200",
      "bg-yellow-100",
      "bg-purple-100",
      "bg-green-100",
      "bg-orange-100",
    ];
    const index = parseInt(props.userId, 16);
    const indexRevised = index % 3;
    return (
      <div className="relative">
        <div
          className={
            Colors[indexRevised] +
            " border-sm p-2 ml-2 w-12 h-12 rounded-full  flex items-center"
          }
        >
          <span className="text-center w-full"> {props.username[0]}</span>
          
          <div className={dot}></div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
