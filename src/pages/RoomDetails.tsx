import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Wifi, Wind, Tv, Coffee, Shield, ArrowLeft } from "lucide-react";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();

  // Mock room data (in real app, fetch from API)
  const rooms: Record<string, any> = {
    "1": {
      id: 1,
      name: "Deluxe Room",
      image: deluxeRoom,
      price: 2999,
      capacity: 2,
      hasAC: true,
      hasWifi: true,
      description: "Spacious room with modern amenities and king-size bed.",
      longDescription: "Our Deluxe Room offers a perfect blend of comfort and luxury. Featuring a king-size bed with premium linens, modern furnishings, and a spacious layout, this room is ideal for couples or business travelers seeking a peaceful retreat.",
      amenities: ["King Size Bed", "Air Conditioning", "Free WiFi", "LED TV", "Mini Bar", "Coffee Maker", "24/7 Room Service", "Safe Deposit"],
      size: "320 sq ft",
    },
    "2": {
      id: 2,
      name: "Standard Room",
      image: standardRoom,
      price: 1999,
      capacity: 2,
      hasAC: true,
      hasWifi: true,
      description: "Comfortable twin bed room perfect for travelers.",
      longDescription: "Our Standard Room provides all the essential comforts for a pleasant stay. With twin beds, modern amenities, and a cozy atmosphere, it's perfect for friends or colleagues traveling together.",
      amenities: ["Twin Beds", "Air Conditioning", "Free WiFi", "LED TV", "Mini Bar", "Coffee Maker", "Room Service", "Safe Deposit"],
      size: "280 sq ft",
    },
    "3": {
      id: 3,
      name: "Executive Suite",
      image: suiteRoom,
      price: 4999,
      capacity: 4,
      hasAC: true,
      hasWifi: true,
      description: "Luxurious suite with separate living area and premium furnishings.",
      longDescription: "Experience ultimate luxury in our Executive Suite. Featuring a separate living area, premium furnishings, and exceptional space, this suite is perfect for families or extended stays. Enjoy panoramic views and world-class amenities.",
      amenities: ["King Size Bed + Sofa Bed", "Separate Living Area", "Air Conditioning", "Free WiFi", "LED TV", "Mini Bar", "Coffee Maker", "24/7 Room Service", "Safe Deposit", "Work Desk", "Bathtub"],
      size: "550 sq ft",
    },
  };

  const room = rooms[id || "1"];

  if (!room) {
    return (
      <div className="room-details">
        <Navbar />
        <div className="room-not-found">
          <div className="not-found-card">
            <h2 className="not-found-title">Room Not Found</h2>
            <Link to="/rooms" className="not-found-btn">
              Back to Rooms
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="room-details">
      <Navbar />
      
      <main className="room-main">
        {/* Back Button */}
        <Link to="/rooms" className="back-button">
          <ArrowLeft className="back-icon" />
          Back to Rooms
        </Link>

        <div className="room-layout">
          {/* Main Content */}
          <div className="room-content">
            <img
              src={room.image}
              alt={room.name}
              className="room-image"
            />

            <div className="room-header">
              <div>
                <h1 className="room-name">{room.name}</h1>
                <div className="room-info">
                  <div className="info-item">
                    <Users />
                    <span>Up to {room.capacity} Guests</span>
                  </div>
                  <div className="info-item">
                    <span className="room-size">{room.size}</span>
                  </div>
                </div>
              </div>
              <div className="room-price-badge">
                <div className="price-label">Starting from</div>
                <div className="price-amount">₹{room.price.toLocaleString()}</div>
                <div className="price-period">per night</div>
              </div>
            </div>

            <div className="room-section">
              <h2 className="section-title">Description</h2>
              <p className="section-text">{room.longDescription}</p>
            </div>

            <div className="room-section">
              <h2 className="section-title">Amenities</h2>
              <div className="amenities-grid">
                {room.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="amenity-item">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="room-section">
              <h2 className="section-title">Room Features</h2>
              <div className="features-grid">
                <div className="feature-badge">
                  <Wind />
                  <span>Air Conditioned</span>
                </div>
                <div className="feature-badge">
                  <Wifi />
                  <span>Free WiFi</span>
                </div>
                <div className="feature-badge">
                  <Tv />
                  <span>LED TV</span>
                </div>
                <div className="feature-badge">
                  <Coffee />
                  <span>Coffee Maker</span>
                </div>
              </div>
            </div>

            <div className="room-section">
              <h2 className="section-title">Cancellation Policy</h2>
              <div className="policy-card">
                <Shield className="policy-icon" />
                <div>
                  <p className="policy-title">Flexible Cancellation</p>
                  <p className="policy-text">
                    Free cancellation up to 24 hours before check-in. After that, a cancellation fee may apply.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <h3 className="booking-title">Book This Room</h3>
              <div className="booking-price">
                <span className="price-label">Price per night</span>
                <span className="price-value">₹{room.price.toLocaleString()}</span>
              </div>
              <Link to={`/booking/${room.id}`} className="book-now-btn">
                Book Now
              </Link>
              <div className="booking-info">
                <p>✓ Best Price Guarantee</p>
                <p>✓ Instant Confirmation</p>
                <p>✓ Secure Payment</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const getAmenityIcon = (amenity: string) => {
  if (amenity.toLowerCase().includes('wifi')) return <Wifi className="amenity-icon" />;
  if (amenity.toLowerCase().includes('tv')) return <Tv className="amenity-icon" />;
  if (amenity.toLowerCase().includes('coffee')) return <Coffee className="amenity-icon" />;
  if (amenity.toLowerCase().includes('air') || amenity.toLowerCase().includes('ac')) return <Wind className="amenity-icon" />;
  return <Shield className="amenity-icon" />;
};

export default RoomDetails;
