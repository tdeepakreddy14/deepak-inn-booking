import { Hotel, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Hotel />
              <span>Deepak Inn</span>
            </div>
            <p className="footer-description">
              Your home away from home. Experience comfort and hospitality at its finest.
            </p>
          </div>

          <div>
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-list">
              <li>
                <Link to="/rooms" className="footer-link">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="footer-link">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-section-title">Contact Us</h3>
            <ul className="footer-list">
              <li className="footer-contact-item">
                <Phone />
                <span>+91 9876543210</span>
              </li>
              <li className="footer-contact-item">
                <Mail />
                <span>info@deepakinn.com</span>
              </li>
              <li className="footer-contact-item">
                <MapPin />
                <span>123 Hotel Street, City, State 123456</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-section-title">Check-in Hours</h3>
            <ul className="footer-list">
              <li>Check-in: 2:00 PM</li>
              <li>Check-out: 11:00 AM</li>
              <li>Reception: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Deepak Inn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
