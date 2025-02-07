import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Correct way to use navigation
import "../Style/Login.css";
import loginVideo from "../assets/login-video.mp4";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import axios from "axios";

const LoginPage = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // ✅ useNavigate hook for navigation

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/signIn`,
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login Successful");
      setIsAuthenticated(true);
      navigate("/");  // ✅ Redirect after login

    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page dark-theme">
      <div className="login-container">
        <div className="login-image">
          <video src={loginVideo} autoPlay muted loop />
        </div>
        <div className="login-form">
          <h2 className="form-title">Sign in</h2>
          <p className="form-subtitle">
            If you don’t have an account, register <a href="/SignUp">here</a>!
          </p>
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
