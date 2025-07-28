
import React from 'react';
import './styles/footer.css';
const Footer=()=>{
  return(
    <footer className="utbs-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>UTBS</h3>
          <p>Your one-stop platform for booking movies, concerts, and train tickets—securely and instantly.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Browse Events</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: <a href="mailto:support@utbs.com">support@utbs.com</a></p>
          <p>Phone: +91-8888892035</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UTBS. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
