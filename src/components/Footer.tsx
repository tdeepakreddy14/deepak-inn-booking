import { Hotel, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xl font-bold text-primary">
              <Hotel className="h-6 w-6" />
              <span>Deepak Inn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your home away from home. Experience comfort and hospitality at its finest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/rooms" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-muted-foreground hover:text-primary transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@deepakinn.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>123 Hotel Street, City, State 123456</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Check-in Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Check-in: 2:00 PM</li>
              <li>Check-out: 11:00 AM</li>
              <li>Reception: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Deepak Inn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
