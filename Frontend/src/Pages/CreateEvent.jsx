import React, { useState } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/CreateEvent.css"; // CSS file for styling

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    date: "",
    location: "",
    imageUrl: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("createEvent", formData);
      if (response.status === 201) {
        toast.success("Event created successfully!");
        setFormData({
          title: "",
          shortDescription: "",
          longDescription: "",
          date: "",
          location: "",
          imageUrl: "",
          price: "",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        window.location.href = "/login";
      } else {
        toast.error("Failed to create event. Try again!");
      }
    }
  };

  return (
    <div className="create-event-container">
      <ToastContainer theme="dark" />
      <div className="form-card">
        <h2 className="form-title">Create New Event</h2>
        <form onSubmit={handleSubmit} className="animate-form">
          {/* Event Title */}
          <div className="form-group">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder=" " // Required for label animation
            />
            <label htmlFor="title" className="form-label">
              Event Title
            </label>
            <span className="focus-border"></span>
          </div>

          {/* Short Description */}
          <div className="form-group">
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              className="form-input"
              placeholder=" " // Required for label animation
            />
            <label htmlFor="shortDescription" className="form-label">
              Short Description
            </label>
            <span className="focus-border"></span>
          </div>

          {/* Long Description */}
          <div className="form-group">
            <textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              required
              className="form-input textarea"
              placeholder=" " // Required for label animation
            ></textarea>
            <label htmlFor="longDescription" className="form-label">
              Long Description
            </label>
            <span className="focus-border"></span>
          </div>

          {/* Date and Price */}
          <div className="form-row">
            <div className="form-group half">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
                placeholder=" " // Required for label animation
              />
              <label htmlFor="date" className="form-label">
                Event Date
              </label>
              <span className="focus-border"></span>
            </div>

            <div className="form-group half">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="form-input"
                placeholder=" " // Required for label animation
              />
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <span className="focus-border"></span>
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
              placeholder=" " // Required for label animation
            />
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <span className="focus-border"></span>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="form-input"
              placeholder=" " // Required for label animation
            />
            <label htmlFor="imageUrl" className="form-label">
              Image URL
            </label>
            <span className="focus-border"></span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            <span>Create Event</span>
            <div className="btn-glow"></div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;