import React, { useEffect, useState } from 'react';
import api from '../api';
import './styles/MyBooking.css';
import Toast from './toast';
import Loader from './loader';

const MyBookings=()=>{
  const [toast, setToast] = useState(null);
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchBookings=async()=>{
      try {
        const res=await api.get('bookings/my-bookings'); 
        setBookings(res.data.data||[]);
      }catch (err) {
        console.error('Failed to fetch bookings:', err);
      }finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  const handleCancel=async(bookingId) =>{
    console.log("Cancelling booking:", bookingId);
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;
    try {
      await api.delete(`/bookings/${bookingId}/cancel`);
     const res = await api.get('bookings/my-bookings');
    setBookings(res.data.data || []);
      setToast({message: "Booking cancled!",type: "error" });

    } catch (err) {
      console.error('Cancel failed:', err);
      setToast({message: "Failed to cancle",type: "error" });
    }
  };
  if (loading) return <Loader/>;
  if (bookings.length === 0) return <div className="mybookings-empty">No bookings yet.</div>;
  return (
    <div className="mybookings-container">
      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>
)}
      <h2>📄 My Bookings</h2>
      {bookings.map((b) => (
        <div className="mybookings-card" key={b.id}>
          <div>
            <h3>{b.name}</h3>
            <p><strong>Type:</strong> {b.eventType}</p>
            <p><strong>Date:</strong> {new Date(b.createdAt).toLocaleDateString()}</p>
            <p><strong>Seats:</strong> {b.seats}</p>
            <p><strong>Total:</strong> ₹{b.seats * b.price}</p>
          </div>
         {console.log("Rendering booking:", b.id)};
          <button className="cancel-btn" onClick={() => handleCancel(b.id)}>
            ❌ Cancel
          </button>
        </div>
      ))}
    </div>
  );
};
export default MyBookings;
