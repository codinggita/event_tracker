import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./Component/Nav";
import Home from "./Component/Home";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import {Toaster} from "react-hot-toast";


function Layout() {
  const location = useLocation();

  const hideNav = location.pathname === "/Login" || location.pathname === "/SignUp";

  return (
    <>
      {!hideNav && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default Layout;
