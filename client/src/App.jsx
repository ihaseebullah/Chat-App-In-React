import axios from "axios";
import { UserContext, UserContextProvider } from "./Context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Route } from "./Route";

export default function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Route />
    </UserContextProvider>
  );
}
