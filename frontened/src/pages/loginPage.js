import React, { useState,useRef,useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './styles/auth.css';
import Toast from '../component/toast'
import { useUser } from '../Context/Usercontext';

const Login=()=>{
  const inputRef=useRef(null);
  const { login } = useUser();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
   useEffect(() => {
    inputRef.current.focus();
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await api.post('/users/login', form);
      login(res.data.data.user);
      localStorage.setItem('token', res.data.token);
      setToast({message: "Login successful!",type: "success" });
      setTimeout(()=>{
         navigate('/');
       }, 1500);
    } catch (err) {
      setToast({ message: "Login Failed!", type: "error" });

    }
  };
  return (
    <div className="auth-container">
      {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>)}
      <div className='auth-card'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input  ref={inputRef} name="email" placeholder="Email" onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div className="link">
        Don't have an account? <a href="/signup">Signup</a>
      </div>
      </div>
    </div>
  );
};
export default Login;
