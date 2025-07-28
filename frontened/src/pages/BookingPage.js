import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './styles/BookingPage.css';
import Loader from '../component/loader';
import Toast from '../component/toast';
const BookingPage=()=>{
  const {state}=useLocation();
  const [toast, setToast]=useState(null);
  const {eventId}=useParams();
  const navigate=useNavigate();
  const event=state?.event;
  const handleBooking=async(e)=>{
    e.preventDefault();
    try {
    await api.post(`/events/${eventId}/bookings`,{seats:state.seats});
      setToast({message: "Booking successful!",type: "success" });
       setTimeout(()=>{
         navigate('/');
       }, 1500);
    } catch (err) {
      console.error('Booking failed:', err);
       setToast({message: "Failed to Book!!",type: "error" });
    }
  };
  if (!event) return <Loader/>;
  return(
    <div className="ticket-summary-container">
       {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>
)}
      <div className="ticket-card">
       <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
       <h2>🎟️ Booking Summary</h2>
    <div className="ticket-details">
       <p><strong>Event:</strong> {event.name}</p>
       <p><strong>Type:</strong> {event.type}</p>
       <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
       {event.showTime && <p><strong>Time:</strong> {event.showTime}</p>}
        <p><strong>Seats:</strong> {state.seats}</p>
       <p><strong>Price per Seat:</strong> ₹{event.price}</p>
       <p className="total"><strong>Total:</strong> ₹{event.price * state.seats}</p>
    </div>
    <div className="ticket-actions">
     <button className="confirm-btn" onClick={handleBooking}>✅ Confirm Booking</button>
   </div>
  </div>
</div>
  );
};
export default BookingPage;
