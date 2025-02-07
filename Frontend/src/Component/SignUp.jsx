import { useState, useContext } from "react";
import "../Style/SignUp.css";
import signUpVideo from "../assets/login-video.mp4";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  // Redirect to homepage if already authenticated
  if (isAuthenticated) {
    navigate("/");
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make the API request to register the user
      const { data } = await axios.post(
        `${server}/signUp`,
        { name, email, password },
        { withCredentials: true }
      );
      
      // If registration is successful, show success message and update authentication state
      toast.success("Registered Successfully");
      setIsAuthenticated(true); // Update state after successful registration

      // Redirect after successful registration
      navigate("/");

    } catch (error) {
      // If registration fails, show error message
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-image">
          <video src={signUpVideo} autoPlay muted loop />
        </div>
        <div className="signup-form">
          <h2 className="form-title">Sign Up</h2>
          <p className="form-subtitle">
            Already have an account? <a href="/login">Sign in here!</a>
          </p>
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                placeholder="Enter your full name"
                required
              />
            </div>
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
                <input type="checkbox" required /> I agree to the Terms and Conditions
              </label>
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
  