"use client"

import { useState } from "react"
import "../Style/CreateEvent.css"

const CreateEvent = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Event Data:", eventData)
  }

  return (
    <div className="create-event">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="form-group">
          <label>Event Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input type="time" name="time" value={eventData.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="form-group">
          <label>Price (INR)</label>
          <input
            type="number"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            placeholder="Enter ticket price"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Publish Event
        </button>
      </form>
    </div>
  )
}

export default CreateEvent

