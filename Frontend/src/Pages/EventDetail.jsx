import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Style/EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://zero2-event-tracker-categories.onrender.com/api/event/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-detail-container">
      <h1>{event.title}</h1>
      <img src={event.imageUrl} alt={event.title} />
      <p>{event.longDescription}</p>

      <div className="host-info">
        <img src={event.host.profilePic} alt={event.host.name} className="host-pic" />
        <p>Hosted by: {event.host.name}</p>
      </div>
    </div>
  );
};

export default EventDetail;
