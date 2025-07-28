import React, { useState ,useEffect,useRef} from 'react';
import api from '../api';
import './styles/auth.css';
import { useNavigate } from 'react-router-dom';
import Toast from '../component/toast';
import { useUser } from '../Context/Usercontext';

const Signup = () => {
  const inputRef= useRef(null);
  const { Signup } = useUser();
  const [toast, setToast] = useState(null);
  useEffect(() => {
    inputRef.current.focus(); 
  }, []);
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' ,role:'user'});
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
     const res=await api.post('/users/signup', form);
      Signup(res.data.data.user);
      localStorage.setItem('token', res.data.token);
      setToast({ message: "Signup successful!", type: "success" });
       setTimeout(()=>{
         navigate('/');
       }, 1500);
    } catch (err) {
      setToast({ message: "signup failed!", type: "error" });
    }
  };
   return (
  <div className="auth-container">
    {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>
)}
    <div className='auth-card'>
    <h2>Signup</h2>
    <form onSubmit={handleSignup}>
      <label>Name</label>
      <input ref={inputRef} name="name" placeholder="Name" onChange={handleChange} required />
      <label>Email</label>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <label>Password</label>
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <label>Confirm Password</label>
      <input name="passwordConfirm" placeholder="Confirm Password" type="password" onChange={handleChange} required />
      <label>Role</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="vendor">Vendor</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
    <div className="link">
      Already have an account? <a href="/login">Login</a>
    </div>
    </div>
  </div>
);

};

export default Signup;
