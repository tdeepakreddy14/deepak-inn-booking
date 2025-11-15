import { useState } from "react";
import { Link } from "react-router-dom";
import { Hotel, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Hotel />
          <span>Deepak Inn</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" activeClassName="active">Home</NavLink>
          </li>
          <li>
            <NavLink to="/rooms" activeClassName="active">Rooms</NavLink>
          </li>
          <li>
            <NavLink to="/my-bookings" activeClassName="active">My Bookings</NavLink>
          </li>
        </ul>

        <div className="navbar-actions">
          <Link to="/login">
            <button className="navbar-btn navbar-btn-outline">Login</button>
          </Link>
          <Link to="/register">
            <button className="navbar-btn navbar-btn-primary">Register</button>
          </Link>
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="navbar-mobile">
          <ul className="navbar-mobile-links">
            <li><NavLink to="/" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/rooms" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Rooms</NavLink></li>
            <li><NavLink to="/my-bookings" activeClassName="active" onClick={() => setIsMenuOpen(false)}>My Bookings</NavLink></li>
          </ul>
          <div className="navbar-mobile-actions">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="navbar-btn navbar-btn-outline">Login</button>
            </Link>
            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
              <button className="navbar-btn navbar-btn-primary">Register</button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
