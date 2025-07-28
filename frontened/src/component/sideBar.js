import React from 'react';
import './styles/Sidebar.css';
const Sidebar=({activeTab,setActiveTab })=>{
  return (
    <div className="sidebar">
      <div className="sidebar-title">🎟️ Ticket Dashboard</div>
      <ul>
        <li onClick={() =>setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>👤 Profile</li>
        <li onClick={() =>setActiveTab('edit')} className={activeTab === 'edit' ? 'active' : ''}>✏️ Edit Profile</li>
        <li onClick={() =>setActiveTab('password')} className={activeTab === 'password' ? 'active' : ''}>🔒 Change Password </li>
        <li onClick={() =>setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>📦 My Bookings</li>
        <li onClick={() =>alert('Logged out!')}>🚪 Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
