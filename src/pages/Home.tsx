import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hotel, Star, Shield, Clock } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-hotel.jpg";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";

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
      icon: Hotel,
      title: "Premium Comfort",
      description: "Experience luxury with our well-appointed rooms and modern facilities.",
    },
    {
      icon: Star,
      title: "Best Service",
      description: "24/7 reception and dedicated staff to make your stay memorable.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your safety is our priority with CCTV surveillance and secure premises.",
    },
    {
      icon: Clock,
      title: "Flexible Booking",
      description: "Easy online booking with flexible check-in and cancellation policies.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Welcome to <span className="text-primary">Deepak Inn</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Your perfect getaway awaits. Experience comfort, hospitality, and unforgettable memories at our beautiful lodging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg">
                <Link to="/rooms">Explore Rooms</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link to="/rooms">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Deepak Inn?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer more than just a place to stay—we provide an experience you'll cherish.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Rooms</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully designed rooms that combine comfort with style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
