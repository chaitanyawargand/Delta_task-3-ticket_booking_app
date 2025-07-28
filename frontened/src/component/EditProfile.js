
import React, { useState, useEffect,} from 'react';
import './styles/EditProfile.css';
import api from '../api';
import Toast from './toast';
import { useUser } from '../Context/Usercontext';
const EditProfile=()=>{
const { user, setUser }=useUser();
useEffect(() => {
  if (user) {
    setName(user.name || '');
    setEmail(user.email || '');
  }
},[user]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange =(e)=>{
    setFile(e.target.files[0]);
  };
  const handleSubmit=async(e)=>{
      e.preventDefault();
      try{
        const data = new FormData();
       data.append('name',name);
       data.append('email',email);
       if(file) data.append('photo',file);  
       const res= await api.patch('/users/updateMe',data);
        setToast({ type: 'success', message: 'Profile updated!' });
        setUser(res.data.data.user);
        if (file) setFile(null);
      }
       catch(err){
       console.log(err.response?.data || err.message);
        setToast({ type: 'error', message: 'Failed to update profile' });
       }
  }
 return ( <div className="update-profile">
  <h2>Update Profile</h2>
  {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>)}
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Name</label>
      <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
    </div>
    <div className="form-group">
      <label>Email</label>
      <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
    </div>
    <div className="form-group">
      <label>Profile Photo</label>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="preview-img" />}
    </div>
    <button type="submit">Update</button>
  </form>
</div>
)
}
export default EditProfile;