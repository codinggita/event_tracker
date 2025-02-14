import "../Style/Profile.css";
import Tabs from "../Component/Tabs"; // Import the TabsComponent

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          <div className="avatar-letter">R</div>
          <span className="camera-icon">📷</span>
        </div>

        <h1 className="profile-name">Rijans Patel</h1>

        <div className="location">
          <span className="location-icon">📍</span>
          Ahmedabad
        </div>

        <div className="stats">
          <span>0 Followers</span>
          <span className="dot">•</span>
          <span>0 Following</span>
        </div>

        <div className="action-buttons">
          <button className="btn edit">
            <span className="icon">✏️</span>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Component */}
      <Tabs />
    </div>
  );
}

export default Profile;
