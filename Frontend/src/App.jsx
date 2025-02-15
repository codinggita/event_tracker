import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";
import { AuthContext } from "../src/Context/AuthContext";
import { server } from "./main";


function App() {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${server}/me`, {
        withCredentials: true,  // ✅ Fix: Ensure cookies are sent
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
        setIsAuthenticated(false);
      });
  }, [setUser, setIsAuthenticated]);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
