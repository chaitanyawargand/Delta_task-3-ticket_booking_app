import React, { useState } from 'react';
import Sidebar from '../component/sideBar';
import ProfileCard from '../component/profileCard';
import EditProfile from '../component/EditProfile';
import ChangePassword from '../component/changePassword';
import MyBookings from '../component/MyBooking';

import './styles/Dashboard.css';
const DashboardPage=()=>{
  const [activeTab, setActiveTab]=useState('profile');
  return (
    <div className="dashboard-container">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="main-content">
        {activeTab === 'profile'&& <ProfileCard />}
        {activeTab === 'edit'&& <EditProfile />}
        {activeTab === 'password'&& <ChangePassword />}
        {activeTab === 'bookings'&& <MyBookings />}
      </div>
    </div>
  );
};
export default DashboardPage;
