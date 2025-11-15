import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const rooms: Record<string, any> = {
    "1": { id: 1, name: "Deluxe Room", image: deluxeRoom, price: 2999, maxGuests: 2 },
    "2": { id: 2, name: "Standard Room", image: standardRoom, price: 1999, maxGuests: 2 },
    "3": { id: 3, name: "Executive Suite", image: suiteRoom, price: 4999, maxGuests: 4 },
  };

  const room = rooms[id || "1"];

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * room.price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    
    if (checkOutDate <= checkInDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    
    if (guests > room.maxGuests) {
      toast.error(`Maximum ${room.maxGuests} guests allowed for this room`);
      return;
    }
    
    toast.success("Booking confirmed! Redirecting...");
    setTimeout(() => navigate("/my-bookings"), 2000);
  };

  return (
    <div className="booking-page">
      <Navbar />
      
      <main className="booking-main">
        <h1 className="booking-title">Complete Your Booking</h1>

        <div className="booking-layout">
          {/* Booking Form */}
          <div className="booking-form-section">
            <div className="booking-form-header">
              <h2 className="booking-form-title">Booking Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Guest Information */}
              <div className="form-section">
                <h3 className="form-section-title">Guest Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input id="firstName" type="text" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input id="lastName" type="text" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input id="phone" type="tel" className="form-input" required />
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="form-section">
                <h3 className="form-section-title">Stay Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="checkIn" className="form-label">Check-in Date</label>
                    <button
                      type="button"
                      className={`date-picker-button ${!checkInDate ? 'empty' : ''}`}
                      onClick={() => {
                        const date = prompt("Enter check-in date (YYYY-MM-DD):");
                        if (date) setCheckInDate(new Date(date));
                      }}
                    >
                      <span>{checkInDate ? checkInDate.toLocaleDateString() : "Pick a date"}</span>
                      <CalendarIcon />
                    </button>
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkOut" className="form-label">Check-out Date</label>
                    <button
                      type="button"
                      className={`date-picker-button ${!checkOutDate ? 'empty' : ''}`}
                      onClick={() => {
                        const date = prompt("Enter check-out date (YYYY-MM-DD):");
                        if (date) setCheckOutDate(new Date(date));
                      }}
                    >
                      <span>{checkOutDate ? checkOutDate.toLocaleDateString() : "Pick a date"}</span>
                      <CalendarIcon />
                    </button>
                  </div>
                  <div className="form-group">
                    <label htmlFor="guests" className="form-label">Number of Guests</label>
                    <input
                      id="guests"
                      type="number"
                      min={1}
                      max={room.maxGuests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="form-section">
                <h3 className="form-section-title">Special Requests</h3>
                <div className="form-group">
                  <label htmlFor="requests" className="form-label">Additional Notes</label>
                  <textarea
                    id="requests"
                    rows={4}
                    placeholder="Any special requirements?"
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="booking-submit">
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="booking-summary-section">
            <div className="summary-header">
              <h2 className="summary-title">Booking Summary</h2>
            </div>
            <img
              src={room.image}
              alt={room.name}
              className="summary-room-image"
            />
            <h3 className="summary-room-name">{room.name}</h3>
            <div className="summary-details">
              <div className="summary-detail-item">
                <span className="summary-detail-label">Check-in</span>
                <span className="summary-detail-value">
                  {checkInDate ? checkInDate.toLocaleDateString() : "Not selected"}
                </span>
              </div>
              <div className="summary-detail-item">
                <span className="summary-detail-label">Check-out</span>
                <span className="summary-detail-value">
                  {checkOutDate ? checkOutDate.toLocaleDateString() : "Not selected"}
                </span>
              </div>
              <div className="summary-detail-item">
                <span className="summary-detail-label">Nights</span>
                <span className="summary-detail-value">
                  {checkInDate && checkOutDate
                    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                    : 0}
                </span>
              </div>
              <div className="summary-detail-item">
                <span className="summary-detail-label">Guests</span>
                <span className="summary-detail-value">{guests}</span>
              </div>
              <div className="summary-detail-item">
                <span className="summary-detail-label">Price per night</span>
                <span className="summary-detail-value">₹{room.price.toLocaleString()}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="summary-total-amount">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
