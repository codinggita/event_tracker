import React, { useEffect, useState } from "react";
import { FaCamera, FaEnvelope, FaEdit, FaSignOutAlt, FaStar, FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import YourCreatedEvents from "../Component/YourCreatedEvents";
import UserTickets from "../Component/UserTickets.jsx";
import { auth, db } from "../Component/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // ✅ Redirect ke liye useNavigate()
import Loader from "../Component/Loader"; // ✅ Import Loader
import "../Style/Profile.css"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const navigate = useNavigate(); // ✅ Use navigate instead of window.location

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // ✅ Firebase me logged-in user check
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      } else {
        console.log("User not logged in");
      }
      setLoading(false); // ✅ Hide loader once data is fetched
    };

    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login"); // ✅ Better redirect method
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (loading) return <Loader />; // ✅ Show Loader while data is loading

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">
            {userDetails?.firstName?.charAt(0) || "R"}
          </span>
          <div className="camera-icon">
            <FaCamera />
          </div>
        </div>

        <div className="profile-info">
          <h1>Username: {userDetails ? userDetails.firstName : "Loading..."}</h1>
          <p className="email">Email: {userDetails ? userDetails.email : "Loading..."}</p>
          <p className="location">
            <FaMapMarkerAlt /> Ahmedabad
          </p>

          <div className="profile-actions">
            <button>
              <FaEnvelope /> Inbox
            </button>
            <button>
              <FaEdit /> Edit Profile
            </button>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <FaStar /> Your Events
          </button>

          <button
            className={`tab-button ${activeTab === "curated" ? "active" : ""}`}
            onClick={() => setActiveTab("curated")}
          >
            <FaClipboardList />Your Tickets
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "events" ? <YourCreatedEvents /> : <UserTickets />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
