import React, { useState } from 'react';
import './styles/ChangePassword.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Toast from './toast'
const ChangePassword=()=>{
  const navigate=useNavigate()
  const [toast,setToast]=useState(null);
  const [form, setForm]=useState({
  passwordCurrent: '',
  password: '',
  passwordConfirm: ''
  });
  const handleChange=(e)=>{
    setForm({...form,[e.target.name]:e.target.value });
  };
  const handleSubmit =async(e)=>{
    e.preventDefault();
    if (form.password.length < 6) {
       setToast({ message: "New password must be at least 6 characters", type: "error" });
      return;
    }
    if (form.password!==form.passwordConfirm) {
       setToast({ message: "New passwords do not match", type: "error" });     
      return;
    }
     await api.patch('/users/updateMyPassword',form)
    setToast({ message: "Password changed. Please log in again.", type: "success" });
    localStorage.removeItem("token");
       setTimeout(()=>{
         navigate('/login');
       }, 1500);
  };
  return (
    <div className="change-password-container">
    {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>
)}
      <h2>🔒 Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Current Password:
         <input type="password" name="passwordCurrent"value={form.passwordCurrent} onChange={handleChange} required/>
        </label>
        <label>
          New Password:
          <input type="password"name="password" value={form.password} onChange={handleChange} required/>
        </label>
        <label>
          Confirm New Password:
          <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} required/>
        </label>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};
export default ChangePassword;
