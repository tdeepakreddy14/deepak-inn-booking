import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "@/integrations/apis/room-apis/fetchRoom";

const Rooms = () => {

  const { token, loading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [roomType, setRoomType] = useState("all");
  const [acFilter, setAcFilter] = useState("all");
  const [allRooms, setAllRooms] = useState([]);

  const { isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => fetchRooms(token)
      .then((resp) => {
        setAllRooms(resp.data.rooms)
      }),
  });


  // const allRooms = [
  //   {
  //     id: 1,
  //     name: "Deluxe Room",
  //     image: deluxeRoom,
  //     price: 2999,
  //     capacity: 2,
  //     hasAC: true,
  //     hasWifi: true,
  //     description: "Spacious room with modern amenities and king-size bed.",
  //     type: "deluxe",
  //   },
  //   {
  //     id: 2,
  //     name: "Standard Room",
  //     image: standardRoom,
  //     price: 1999,
  //     capacity: 2,
  //     hasAC: true,
  //     hasWifi: true,
  //     description: "Comfortable twin bed room perfect for travelers.",
  //     type: "standard",
  //   },
  //   {
  //     id: 3,
  //     name: "Executive Suite",
  //     image: suiteRoom,
  //     price: 4999,
  //     capacity: 4,
  //     hasAC: true,
  //     hasWifi: true,
  //     description: "Luxurious suite with separate living area and premium furnishings.",
  //     type: "suite",
  //   },
  //   {
  //     id: 4,
  //     name: "Premium Deluxe",
  //     image: deluxeRoom,
  //     price: 3499,
  //     capacity: 3,
  //     hasAC: true,
  //     hasWifi: true,
  //     description: "Enhanced deluxe room with additional space and amenities.",
  //     type: "deluxe",
  //   },
  //   {
  //     id: 5,
  //     name: "Budget Room",
  //     image: standardRoom,
  //     price: 1499,
  //     capacity: 2,
  //     hasAC: false,
  //     hasWifi: true,
  //     description: "Affordable and comfortable room for budget travelers.",
  //     type: "standard",
  //   },
  //   {
  //     id: 6,
  //     name: "Family Suite",
  //     image: suiteRoom,
  //     price: 5999,
  //     capacity: 6,
  //     hasAC: true,
  //     hasWifi: true,
  //     description: "Spacious suite perfect for families with multiple bedrooms.",
  //     type: "suite",
  //   },
  // ];



  // useEffect(() => {
  //   setLoading(true);
  //   !loading && fetchAllRooms()
  //     .then((resp) => {
  //       setAllRooms(resp.data.rooms);
  //       console.log(resp, "resp of all Rooms")
  //     }
  //     )
  //     .finally(() => setLoading(false))
  // }, [loading])

  const fetchAllRooms = () => {


    // return fetch("http://localhost:8000/api/rooms/", {
    //   method: "GET",
    //   headers: {
    //     "Authorization": `Bearer ${token}`,
    //   },
    // })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch rooms");
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     // data = array of rooms
    //     return data;
    //   })
    //   .catch(error => {
    //     console.error("Error fetching rooms:", error);
    //     throw error;
    //   });
  };


  const filteredRooms = allRooms.filter((room) => {
    const matchesSearch = room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType = roomType === "all" || room.type === roomType;
    const matchesAC = acFilter === "all" || (acFilter === "ac" ? room.hasAC : !room.hasAC);

    return matchesSearch && matchesPrice && matchesType && matchesAC;
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={10000}
                      step={500}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-2">
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger id="room-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Standard Room">Standard Room</SelectItem>
                      <SelectItem value="Deluxe Room">Deluxe</SelectItem>
                      <SelectItem value="Executive Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* AC Filter */}
                <div className="space-y-2">
                  <Label htmlFor="ac-filter">Air Conditioning</Label>
                  <Select value={acFilter} onValueChange={setAcFilter}>
                    <SelectTrigger id="ac-filter">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ac">AC</SelectItem>
                      <SelectItem value="non-ac">Non-AC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
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
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No rooms match your filters. Try adjusting your search criteria.</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rooms;
