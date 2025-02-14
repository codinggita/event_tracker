"use client"

import { useState } from "react"
import axios from "axios"
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../Style/CreateEvent.css"

const CreateEvent = () => {

  const navigate = useNavigate();

  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    imageUrl: "",
    price: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://zero2-event-tracker-categories.onrender.com/api/createEvents", eventData)
      console.log("Event created:", response.data)
      // Yahan par aap user ko success message dikha sakte hain
      alert("Event successfully created!")
      // Form ko reset karna
      setEventData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        imageUrl: "",
        price: "",
      })
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Error creating event. Please try again.")
    }
  }

  return (
    <div className="create-event">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" value={eventData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input id="time" type="time" name="time" value={eventData.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (INR)</label>
          <input
            id="price"
            type="number"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            placeholder="Enter ticket price"
            required
          />
        </div>

        <button type="submit" className="submit-btn" onClick={()=>{navigate('/')}}>
          Publish Event
        </button>
      </form>
    </div>
  )
}

export default CreateEvent

