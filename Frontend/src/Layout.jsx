import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import {Toaster} from "react-hot-toast";
import Trending from "./Pages/TrendingPage";
import Upcoming from "./Pages/UpcomingPage";
import Festival from "./Pages/FestivalPage";
import Business from "./Pages/BusinessPage";
import OnlyNavbar from "./Component/OnlyNav";


function Layout() {
  const location = useLocation();

  const hideNav =
    location.pathname === "/Login" ||
    location.pathname === "/SignUp" ||
    location.pathname === "/";

  return (
    <>
      {!hideNav && <OnlyNavbar />}
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/festival" element={<Festival />} />
          <Route path="/business" element={<Business />} />
        </Routes>
      
      <Toaster />
    </>
  );
}

export default Layout
