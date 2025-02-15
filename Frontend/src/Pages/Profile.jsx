import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../main";

const Profile = () => {
  const { user, setUser, setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user data when component loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${server}/me`, { withCredentials: true });
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, setIsAuthenticated]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/logout`, { withCredentials: true });

      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isAuthenticated) return <h2>Please log in to view your profile.</h2>;
  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <img src={user.profileImage || "/default-avatar.png"} alt="Profile" className="profile-img" />
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={logoutHandler} className="logout-button">Logout</button>
    </div>
  );
};

export default Profile;
