import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import { Search } from "lucide-react";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [roomType, setRoomType] = useState("all");
  const [acFilter, setAcFilter] = useState("all");

  const allRooms = [
    {
      id: 1,
      name: "Deluxe Room",
      image: deluxeRoom,
      price: 2999,
      capacity: 2,
      hasAC: true,
      hasWifi: true,
      description: "Spacious room with modern amenities and king-size bed.",
      type: "deluxe",
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
      type: "standard",
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
      type: "suite",
    },
    {
      id: 4,
      name: "Premium Deluxe",
      image: deluxeRoom,
      price: 3499,
      capacity: 3,
      hasAC: true,
      hasWifi: true,
      description: "Enhanced deluxe room with additional space and amenities.",
      type: "deluxe",
    },
    {
      id: 5,
      name: "Budget Room",
      image: standardRoom,
      price: 1499,
      capacity: 2,
      hasAC: false,
      hasWifi: true,
      description: "Affordable and comfortable room for budget travelers.",
      type: "standard",
    },
    {
      id: 6,
      name: "Family Suite",
      image: suiteRoom,
      price: 5999,
      capacity: 6,
      hasAC: true,
      hasWifi: true,
      description: "Spacious suite perfect for families with multiple bedrooms.",
      type: "suite",
    },
  ];

  const filteredRooms = allRooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType = roomType === "all" || room.type === roomType;
    const matchesAC = acFilter === "all" || (acFilter === "ac" ? room.hasAC : !room.hasAC);
    
    return matchesSearch && matchesPrice && matchesType && matchesAC;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Rooms</h1>
          <p className="text-muted-foreground">Find the perfect room for your stay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="search"
                      type="text"
                      placeholder="Search rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <label htmlFor="room-type" className="text-sm font-medium">Room Type</label>
                  <select
                    id="room-type"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>

                {/* AC Filter */}
                <div className="space-y-2">
                  <label htmlFor="ac-filter" className="text-sm font-medium">Air Conditioning</label>
                  <select
                    id="ac-filter"
                    value={acFilter}
                    onChange={(e) => setAcFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All</option>
                    <option value="ac">AC</option>
                    <option value="non-ac">Non-AC</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Rooms Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-muted-foreground">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg shadow-sm p-12 text-center">
                <p className="text-muted-foreground">No rooms match your filters. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rooms;
