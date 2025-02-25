import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";
import Modal from "react-modal";
import "../Style/ManageEvent.css";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Add Firebase auth imports

Modal.setAppElement("#root");

const ManageEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    date: "",
    location: "",
    imageUrl: "",
    price: "",
  });
  // Add state for the current user
  const [user, setUser] = useState(null);

  // Firebase auth listener to get the current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEventAndUsers = async () => {
      try {
        const eventResponse = await api.get(`/eventDetail/${id}`);
        setEvent(eventResponse.data);
        setFormData(eventResponse.data);

        // Only fetch registered users if the current user is the host
        if (user && eventResponse.data.createdByEmail === user.email) {
          const usersResponse = await api.get(`/registeredUsers/${id}`);
          setRegisteredUsers(usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching event and registered users:", error);
        toast.error("Failed to load data");
      }
    };
    fetchEventAndUsers();
  }, [id, user]); // Add user to dependency array to refetch when user changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/editEvent/${id}`, formData);
      setEvent(response.data);
      setIsModalOpen(false);
      toast.success("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/deleteEvent/${id}`);
        toast.success("Event deleted successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="manage-event-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="manage-event-card">
        <img src={event.imageUrl} alt={event.title} className="manage-event-image" />
        <div className="manage-event-details">
          <h2>{event.title}</h2>
          <p>{event.shortDescription}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Price:</strong> ₹{event.price}</p>
          <div className="manage-button-group">
            <button className="manage-edit-btn" onClick={() => setIsModalOpen(true)}>
              Edit Event
            </button>
            <button className="manage-delete-btn" onClick={handleDelete}>
              Delete Event
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Registered Users Section (only visible to host) */}
      {user && event.createdByEmail === user.email && (
        <div className="registered-users">
          <h3>Registered Users</h3>
          {registeredUsers.length === 0 ? (
            <p>No users have registered for this event.</p>
          ) : (
            <ul>
              {registeredUsers.map((user, index) => (
                <li key={index}>
                  <span className="user-name">{user.userName}</span> 
                  <span className="user-email">({user.userEmail})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="manage-event-modal"
        overlayClassName="manage-event-overlay"
      >
        <h2>Edit Event</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="shortDescription"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
          <textarea
            name="longDescription"
            placeholder="Long Description"
            value={formData.longDescription}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <div className="modal-buttons">
            <button type="submit" className="manage-save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="manage-cancel-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvent;