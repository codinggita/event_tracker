import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Modal from "react-modal";
import "../Style/ManageEvent.css";

Modal.setAppElement("#root");

const ManageEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
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

  // 🔹 Fetch Event Details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/eventDetail/${id}`);
        setEvent(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Update Event
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/editEvent/${id}`, formData);
      setEvent(formData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // 🔹 Delete Event
  const handleDelete = async () => {
    try {
      await api.delete(`/deleteEvent/${id}`);
      navigate("/your-events");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="manage-event-container">
      <div className="manage-event-card">
        <img src={event.imageUrl} alt={event.title} className="manage-event-image" />
        <div className="manage-event-details">
          <h2>{event.title}</h2>
          <p>{event.shortDescription}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Price:</strong> ₹{event.price}</p>
          <div className="manage-button-group">
            <button className="manage-edit-btn" onClick={() => setIsModalOpen(true)}>Edit Event</button>
            <button className="manage-delete-btn" onClick={handleDelete}>Delete Event</button>
          </div>
        </div>
      </div>

      {/* 🔹 Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="manage-event-modal"
        overlayClassName="manage-event-overlay"
      >
        <h2>Edit Event</h2>
        <form onSubmit={handleUpdate}>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required />
          <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} required></textarea>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />

          <button type="submit" className="manage-save-btn">Save Changes</button>
          <button type="button" className="manage-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvent;
