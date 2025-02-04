import React from "react";
import "../Style/Login.css";
import loginVideo from "../assets/login-video.mp4";
import {server} from "../main"

const LoginPage = () => {

  return (
    <div className="login-page dark-theme">
      <div className="login-container">
        <div className="login-image">
          <video src={loginVideo} autoPlay muted loop />
        </div>
        <div className="login-form">
          <h2 className="form-title">Sign in</h2>
          <p className="form-subtitle">
            If you don’t have an account, register <a href="/SignUp" >here</a>!
          </p>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;