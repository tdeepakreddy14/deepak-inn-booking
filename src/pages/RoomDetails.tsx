import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Wifi, Wind, Tv, Coffee, Shield, ArrowLeft } from "lucide-react";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Room Not Found</h2>
            <Button asChild>
              <Link to="/rooms">Back to Rooms</Link>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/rooms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{room.name}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Up to {room.capacity} Guests
                    </Badge>
                    <Badge variant="secondary">{room.size}</Badge>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{room.longDescription}</p>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-primary">₹{room.price}</span>
                    <span className="text-muted-foreground ml-2">/ night</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to={`/booking/${room.id}`}>Book Now</Link>
                  </Button>
                  
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3">Quick Highlights</h3>
                    <div className="space-y-2">
                      {room.hasAC && (
                        <div className="flex items-center text-sm">
                          <Wind className="h-4 w-4 mr-2 text-primary" />
                          <span>Air Conditioned</span>
                        </div>
                      )}
                      {room.hasWifi && (
                        <div className="flex items-center text-sm">
                          <Wifi className="h-4 w-4 mr-2 text-primary" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Tv className="h-4 w-4 mr-2 text-primary" />
                        <span>LED Television</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Coffee className="h-4 w-4 mr-2 text-primary" />
                        <span>Coffee Maker</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Free cancellation up to 24 hours before check-in. Full refund applicable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoomDetails;
