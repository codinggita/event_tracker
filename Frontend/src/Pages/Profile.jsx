import React, { useEffect, useState } from "react";
import { FaCamera, FaEnvelope, FaEdit, FaSignOutAlt, FaStar, FaClipboardList, FaMapMarkerAlt } from "react-icons/fa";
import YourCreatedEvents from "../Component/YourCreatedEvents";
import UserTickets from "../Component/UserTickets.jsx";
import { auth, db } from "../Component/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import "../Style/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          console.log("User not logged in");
          navigate("/"); // Redirect to login if not logged in
          return;
        }
        
        // Wait for auth to be fully initialized
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserDetails(docSnap.data());
            } else {
              // If user document doesn't exist, create a basic one
              setUserDetails({
                firstName: user.displayName || "User",
                email: user.email || "",
              });
              console.log("No user document found");
            }
          } catch (firestoreError) {
            console.error("Firestore Error:", firestoreError);
            setError("Permission error: " + firestoreError.message);
          }
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        fetchUserData();
      }
    });

    // Clean up listener
    return () => unsubscribe();
  }, [navigate]);

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (loading) return <Loader />;
  
  // Show error message if there's an error
  if (error) {
    return (
      <div className="error-container" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">
            {userDetails?.firstName?.charAt(0) || "U"}
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