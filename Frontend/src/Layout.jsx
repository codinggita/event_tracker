import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import {Toaster} from "react-hot-toast";
import Trending from "./Pages/TrendingPage";
import Upcoming from "./Pages/UpcomingPage";
import Nav from "./Component/Nav";


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
          <Route path="/trending" element={<Trending />} />
          <Route path="/upcoming" element={<Upcoming />} />
        </Routes>
      
      <Toaster />
    </>
  );
}

export default Layout
