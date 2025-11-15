import { Link } from "react-router-dom";
import { Users, Wifi, Wind } from "lucide-react";
import "./RoomCard.css";

interface RoomCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  capacity: number;
  hasAC: boolean;
  hasWifi: boolean;
  description: string;
}

const RoomCard = ({ id, name, image, price, capacity, hasAC, hasWifi, description }: RoomCardProps) => {
  return (
    <div className="room-card">
      <img src={image} alt={name} className="room-card-image" />
      <div className="room-card-content">
        <div className="room-card-header">
          <h3 className="room-card-title">{name}</h3>
          <div className="room-card-price">
            <p className="room-card-price-label">Per Night</p>
            <p className="room-card-price-amount">₹{price.toLocaleString()}</p>
          </div>
        </div>
        
        <p className="room-card-description">{description}</p>
        
        <div className="room-card-features">
          <div className="room-card-feature">
            <Users />
            <span>{capacity} Guests</span>
          </div>
          {hasWifi && (
            <div className="room-card-feature">
              <Wifi />
              <span>Free WiFi</span>
            </div>
          )}
          {hasAC && (
            <div className="room-card-feature">
              <Wind />
              <span>AC</span>
            </div>
          )}
        </div>

        <div className="room-card-actions">
          <Link to={`/rooms/${id}`} className="room-card-btn room-card-btn-outline">
            View Details
          </Link>
          <Link to={`/booking/${id}`} className="room-card-btn room-card-btn-primary">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
