import React, { useEffect, useState } from 'react';
import api from '../api';
import './styles/ProfilePage.css';
import Toast from '../component/toast';
import { useUser } from '../Context/Usercontext';
const ProfilePage=()=>{;
  const {user}=useUser();
  const [toast, setToast] = useState(null);
  const [bookings,setBookings]=useState([]);
  const [editMode, setEditMode]=useState(false);
  const [form,setForm]=useState({ name: '', email: '' });
  useEffect(()=>{
    fetchProfile();
    fetchBookings();
  },[]);
  const fetchProfile=async()=>{
    try {
      const res = await api.get('/users/me');
      setForm({ name: res.data.data.doc.name, email: res.data.data.doc.email });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };
  const fetchBookings=async()=>{
    try {
      const res=await api.get('bookings/my-bookings');
      setBookings(res.data.data.cleanedDocs);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };
  const handleProfileUpdate =async(e)=>{
    e.preventDefault();
    try {
      await api.patch('/users/updateMe', form);
      setEditMode(false);
      fetchProfile();
      setToast({ message: "Profile updated successfully!", type: "success" });

    } catch (err) {
    setToast({ message: "Update failed!", type: "success" });
    }
  };
  return (
    <div className="profile-container">
    {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>
)}
      <h2>👤 My Profile</h2>
      <form className="profile-section" onSubmit={handleProfileUpdate}>
        <label>Name:</label>
        <input type="text"value={form.name}onChange={(e) => setForm({ ...form, name: e.target.value })}disabled={!editMode}/>
        <label>Email:</label>
        <input type="email"value={form.email}onChange={(e) => setForm({ ...form, email: e.target.value })}disabled={!editMode}/>
        {editMode?(
          <button type="submit">Save Changes</button>
        ):(
          <button type="button" onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </form>
      <div className="bookings-section">
        <h3>📋 My Bookings</h3>
        {bookings.length===0?(
          <p>No bookings yet.</p>
        ):(
          <ul className="booking-list">
            {bookings.map((b)=>(
              <li key={b._id}>
                {b.event?.name}-{b.seats}seat(s)-₹{b.totalPrice}
                <span className="status">{b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
