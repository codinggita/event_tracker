import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import SignInwithGoogle, { googleLogin } from "./signInWithGoogle";
import "react-toastify/dist/ReactToastify.css";
import "../Style/Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: ""
        });

        await sendEmailVerification(user);
        toast.success("Verification email sent! Please check your inbox.", { position: "top-center" });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handleGoogleSignup = async () => {
    // Use the googleLogin function with isRegistration=true
    const user = await googleLogin(true);
    
    if (user) {
      try {
        // Create user document in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName ? user.displayName.split(' ')[0] : "",
          lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : "",
          photo: user.photoURL || ""
        });
        
        toast.success("Account created successfully!", { position: "top-center" });
        
        setTimeout(() => {
          window.location.href = "/profile";
        }, 2000);
      } catch (error) {
        toast.error("Error creating account: " + error.message, { position: "top-center" });
      }
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="auth-card">
        <div className="auth-header">
          <FaUserPlus size={48} className="auth-icon" />
          <h2>Create Account</h2>
          <p>Join us today and start your journey</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="First name" onChange={(e) => setFname(e.target.value)} required />
          </div>

          <div className="form-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Last name" onChange={(e) => setLname(e.target.value)} />
          </div>

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="auth-button">Create Account</button>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <button onClick={handleGoogleSignup} className="auth-button google-signin">
            Sign Up with Google
          </button>

          <p className="auth-redirect">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;