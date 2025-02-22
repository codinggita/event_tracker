import React, { useEffect, useState } from "react";
import { FaCamera, FaEnvelope, FaEdit, FaSignOutAlt, FaStar, FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import YourCreatedEvents from "../Component/YourCreatedEvents";
import YourEventsReview from "../Component/YourEventsReview";
import "../Style/Profile.css";
import { auth, db } from "../Component/firebase.js";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

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
            <FaStar /> EVENTS
          </button>

          <button
            className={`tab-button ${activeTab === "curated" ? "active" : ""}`}
            onClick={() => setActiveTab("curated")}
          >
            <FaClipboardList /> CURATED LIST
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "events" ? <YourCreatedEvents /> : <YourEventsReview />}
        </div>
      </div>
    </div>
  );
};

export default Profile;