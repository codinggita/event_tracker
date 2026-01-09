import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Style/CreateEvent.css";
import Loader from "../Component/Loader"; // Loader import

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    date: "",
    location: "",
    imageUrl: "",
    price: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Form Data Submitted:", formData);
    
    setTimeout(async () => {
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
            category: "",
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
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="create-event-container">
      {loading && <Loader />}
      <div className="animated-background"></div>
      <ToastContainer theme="dark" />
      <div className="form-wrapper">
        <div className="form-card">
          <div className="card-header">
            <h2>Create New Event</h2>
            <div className="underline"></div>
          </div>

          {!loading && (
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="title">Event Title</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="shortDescription">Short Description</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  rows="4"
                  className="rp"
                ></textarea>
                <label htmlFor="longDescription">Long Description</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  id="category"
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder=""
                />
                <label htmlFor="category">Category</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="date">Event Date</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder=""
                />
                <label htmlFor="price">Price ($)</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="location">Location</label>
                <div className="input-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="imageUrl">Image URL</label>
                <div className="input-highlight"></div>
              </div>

              <button type="submit" className="submit-button">
                <span>Create Event</span>
                <div className="button-effect"></div>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
