import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import "../Style/Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: ""
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaUserPlus size={48} className="auth-icon" />
          <h2>Create Account</h2>
          <p>Join us today and start your journey</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

          <p className="auth-redirect">
            Already have an account? <a href="/login">Sign in</a>
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

export default Register;