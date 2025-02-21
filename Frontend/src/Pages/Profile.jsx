import React, { useEffect, useState } from "react";
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
          <span className="avatar-text">R</span>
          <span className="camera-icon">📷</span>
        </div>

        <div className="profile-info">
          <h1>
            Username: {userDetails ? userDetails.firstName : "Loading..."}
          </h1>
          <p>Email: {userDetails ? userDetails.email : "Loading..."}</p>
          <p className="location">📍 Ahmedabad</p>
        </div>

        <div className="profile-actions">
          <button className="btn-inbox">📧 Inbox</button>
          <button className="btn-edit">✏️ Edit Profile</button>
          <button className="btn-edit" onClick={handleLogout}>
            {" "}
            Logout
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          ⭐ EVENTS
        </button>
        <button
          className={`tab ${activeTab === "curated" ? "active" : ""}`}
          onClick={() => setActiveTab("curated")}
        >
          📋 CURATED LIST
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "events" ? <YourCreatedEvents /> : <YourEventsReview />}
      </div>
    </div>
  );
};

export default Profile;
