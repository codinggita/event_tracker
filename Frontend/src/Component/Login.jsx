import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import SignInwithGoogle, { googleLogin } from "./signInWithGoogle";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Auth.css";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Added Link here

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error("Email not verified! Please check your inbox.", { position: "top-center" });
        setLoading(false);
        return;
      }

      const token = await user.getIdToken(true);
      localStorage.setItem("authToken", token);

      setInterval(async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const newToken = await currentUser.getIdToken(true);
          localStorage.setItem("authToken", newToken);
        }
      }, 10 * 60 * 1000);

      toast.success("User logged in Successfully", { position: "top-center" });
      setTimeout(() => {
        navigate(redirect || "/");
      }, 2000);
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const user = await googleLogin(false);
    if (user) {
      toast.success("Google Sign-In Successful!", { position: "top-center" });
      setTimeout(() => {
        navigate(redirect || "/");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
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

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="auth-button google-signin"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In with Google"}
          </button>

          <p className="auth-redirect">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
