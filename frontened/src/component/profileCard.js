import React from 'react';
import { useEffect,useState } from 'react';
import './styles/ProfileCard.css';
import api from '../api'
import userIcon from './../logo/user.png';
import Loader from './loader';
const ProfileCard = () => {
    const [user,setUser]=useState('')
 useEffect(()=>{
    const fetchEvent=async()=>{
        const res= await api.get('/users/me')
        setUser(res.data.data.doc)
    }
    fetchEvent();
 },[])
  if(!user) return <Loader />;
  return (
    <div className="profile-card">
      <div className="profile-header">
    {console.log(user) }
<img
  className="user-photo"  src={user.photo ? `http://localhost:3001/images/${user.photo}` : userIcon} alt="User profile"/>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="user-role">{user.role}</span>
          <h3>Wallet Balance: ₹{user.balance || 0}</h3>
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;
