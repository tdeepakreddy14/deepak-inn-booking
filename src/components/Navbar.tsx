import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Hotel, User, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/rooms", label: "Rooms" },
    { to: "/my-bookings", label: "My Bookings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary hover:opacity-90 transition-opacity">
            <Hotel className="h-6 w-6" />
            <span>Deepak Inn</span>
          </Link>

          {/* Desktop Navigation */}
          {
            user || isAdmin ?
              <div className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="text-foreground hover:text-primary transition-colors"
                    activeClassName="text-primary font-medium"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div> : ""
          }

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdmin && (
              <Button variant="ghost" asChild>
                <Link to="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
            {user ? (
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 text-foreground hover:text-primary transition-colors ${location.pathname === link.to ? "text-primary font-medium" : ""
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              {isAdmin && (
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              {user ? (
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
