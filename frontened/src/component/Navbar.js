import React from 'react';
import  './styles/navbar.css';
import { Link, useNavigate } from'react-router-dom';
import {useUser } from '../Context/Usercontext';
const Navbar=()=>{
  const { user,logout} = useUser();
  const navigate= useNavigate();
  function Logout() {
    localStorage.removeItem('token')
    logout();
    navigate('/');
  }
  return (
  <nav className="navbar">
     <Link to="/" className="logo">UTBS</Link>
      <div className="nav-links">
      {user?(
  <>
    <Link to="/Dashboard">Dashboard</Link>
    <button onClick={Logout}>Logout</button>
  </>):(
  <>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
  </>
)}
</div>
  </nav>
)
}
export default Navbar;
