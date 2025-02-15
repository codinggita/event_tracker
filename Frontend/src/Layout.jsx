import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import {Toaster} from "react-hot-toast";
import Nav from "./Component/Nav";
import Profile from "./Pages/Profile"
import CreateEvent from "./Pages/CreateEvent";
import Events  from "./Pages/Events";
import EventDetail from "./Pages/EventDetail";


function Layout() {
  const location = useLocation();

  const hideNav =
    location.pathname === "/Login" ||
    location.pathname === "/SignUp"

  return (
    <>
      {!hideNav && <Nav />}
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/createEvent" element={<CreateEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      
      <Toaster />
    </>
  );
}

export default Layout
