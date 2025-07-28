import React, { useState, useEffect ,useRef} from 'react';
import api from '../api';
import './styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../component/loader';
import { useUser } from '../Context/Usercontext';

const HomePage = () => {
  const eventRef= useRef(null);
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  const handleScroll =()=>{
    eventRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/events');
      setEvents(res.data.data);
    };
    fetchData();
  }, []);
  const filtered = category === 'all' ? events: events.filter(event => event.type === category);
  
  if (!events) return <Loader />
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-text">
         <h1>Welcome {user? user.name:''} to <span className="utbs-highlight">UTBS</span></h1>
          <p>Book your movie, concert, and train tickets – all in one place,<br /> instantly and securely.</p>
         <button className="get-started-btn" onClick={handleScroll}>Get Started</button>
          </div>
    </div>
      <section className="category-bar">
        {['all', 'movie', 'concert', 'train'].map(type => (
          <button
            key={type}
            className={`category-btn ${category === type ? 'active' : ''}`}
            onClick={() => setCategory(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </button>
        ))}
      </section>
      <section ref={eventRef}className="event-grid">
        {filtered.map(event => (
          <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
              <div className="event-logo">
  </div>
            <div className="event-type-tag">{event.type}</div>
            <h3>{event.name}</h3>
            <p><strong>Price:</strong> ₹{event.price}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.theatre || event.venue || `${event.from} → ${event.to}` || 'N/A'}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
