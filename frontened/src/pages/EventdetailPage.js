import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Loader from '../component/loader'
import movieIcon from './../logo/video.png';
import concertIcon from './../logo/singing.png';
import trainIcon from './../logo/railway.png';
import './styles/EventDetailPage.css';
const EventDetailPage=()=>{
  const navigate=useNavigate();
  const {id}=useParams();
  const [event,setEvent]=useState(null);
  const [showBooking,setShowBooking]=useState(false);
  const [seats,setSeats]=useState(1);
  const iconMap={
    movie:movieIcon,
    concert:concertIcon,
    train:trainIcon,
  };
  useEffect(()=>{
    const fetchEvent=async()=>{
      try {
        const res=await api.get(`/events/${id}`);
        setEvent(res.data.data.doc);
      } catch(err){
        console.error('Error fetching event details:', err);
      }
    };
    fetchEvent();
  }, [id]);
  const handleBooking = (e) => {
    e.preventDefault();
    navigate(`/events/${event.id}/book`,{state:{event,seats}});
  };
  if (!event) return <Loader />;
  return (
    <div className="container">
      <div className="event-detail-container">
        <div className="event-detail-wrapper">
          <div className="event-banner">
        <img src={iconMap[event.type]} alt={event.type} />
        </div>
          <div className="event-details">
            <h2>{event.name}</h2>
            <p><strong>Type:</strong> {event.type}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric'})}</p>
            <p><strong>Price:</strong> ₹{event.price}</p>
            <p><strong>Seats Left:</strong> {event.seatsAvailable}</p>
            {event.type==='movie'&&(
              <>
                <p><strong>Theatre:</strong> {event.theatre}</p>
                <p><strong>Show Time:</strong> {event.showTime}</p>
                <p><strong>Duration:</strong> {event.duration} min</p>
              </>
            )}
            {event.type==='concert'&&(
              <p><strong>Venue:</strong>{event.venue||'TBA'}</p>
            )}
            {event.type==='train'&&(
              <>
                <p><strong>From:</strong> {event.from}</p>
                <p><strong>To:</strong> {event.to}</p>
                <p><strong>Train No:</strong> {event.trainNumber}</p>
              </>
            )}
            <div className="organizer-box">
               📣 Organized by: {event.vendor?.name} ({event.vendor?.email})
             </div>
            <button className="book-btn" onClick={() => setShowBooking(true)}>Book Tickets</button>
          </div>
        </div>
      </div>
      {showBooking&&(
          <div className="booking-popup-overlay">
            <div className="booking-container">
             <button className="close-btn" onClick={()=>setShowBooking(false)}>×</button>
              <form className="booking-form" onSubmit={handleBooking}>
         <input type="number" min="1" max={event.seatsAvailable} value={seats} onChange={(e) => setSeats(e.target.value)} />
          <button type="submit">Confirm Booking</button>
        </form>
       </div>
     </div>
   )}
    </div>
  );
};

export default EventDetailPage;
