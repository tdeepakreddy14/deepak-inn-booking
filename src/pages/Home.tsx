import { Link } from "react-router-dom";
import { Wifi, MapPin, Utensils } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-hotel.jpg";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";
import "./Home.css";

const Home = () => {
  const featuredRooms = [
    {
      id: 1,
      name: "Deluxe Room",
      image: deluxeRoom,
      price: 2999,
      capacity: 2,
      hasAC: true,
      hasWifi: true,
      description: "Spacious room with modern amenities and king-size bed.",
    },
    {
      id: 2,
      name: "Standard Room",
      image: standardRoom,
      price: 1999,
      capacity: 2,
      hasAC: true,
      hasWifi: true,
      description: "Comfortable twin bed room perfect for travelers.",
    },
    {
      id: 3,
      name: "Executive Suite",
      image: suiteRoom,
      price: 4999,
      capacity: 4,
      hasAC: true,
      hasWifi: true,
      description: "Luxurious suite with separate living area and premium furnishings.",
    },
  ];

  const features = [
    {
      title: "Free WiFi",
      description: "High-speed internet connection throughout the hotel for all guests",
    },
    {
      title: "Prime Location",
      description: "Centrally located with easy access to major attractions and transport",
    },
    {
      title: "Restaurant",
      description: "Delicious meals served daily with a variety of cuisines to choose from",
    },
  ];

  return (
    <div className="home">
      <Navbar />
      
      <section className="hero">
        <img src={heroImage} alt="Deepak Inn Hotel" className="hero-image" />
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Deepak Inn</h1>
          <p className="hero-subtitle">Experience comfort and hospitality at its finest</p>
          <Link to="/rooms" className="hero-btn">
            Explore Rooms
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why Choose Us</h2>
            <p className="features-subtitle">Discover what makes us special</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <Wifi className="feature-icon" />
              <h3 className="feature-title">Free WiFi</h3>
              <p className="feature-description">
                {features[0].description}
              </p>
            </div>

            <div className="feature-card">
              <MapPin className="feature-icon" />
              <h3 className="feature-title">Prime Location</h3>
              <p className="feature-description">
                {features[1].description}
              </p>
            </div>

            <div className="feature-card">
              <Utensils className="feature-icon" />
              <h3 className="feature-title">Restaurant</h3>
              <p className="feature-description">
                {features[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rooms-preview">
        <div className="features-container">
          <div className="rooms-header">
            <h2 className="features-title">Featured Rooms</h2>
            <p className="features-subtitle">Discover our most popular accommodations</p>
          </div>

          <div className="rooms-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>

          <div className="rooms-footer">
            <Link to="/rooms" className="rooms-btn">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
