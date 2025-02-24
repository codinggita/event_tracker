import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWithGoogle";
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import "../Style/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("authToken", token);
      
      setInterval(async () => {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem("authToken", newToken);
        }
      }, 10 * 60 * 1000);

      toast.success("User logged in Successfully", { position: "top-center" });
      window.location.href = "/";
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaUser size={48} className="auth-icon" />
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <SignInwithGoogle />

          <p className="auth-redirect">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
      
      <div className="auth-shapes">
        <div className="auth-shape"></div>
        <div className="auth-shape"></div>
        <div className="auth-shape"></div>
      </div>
    </div>
  );
}

export default Login;