import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import deluxeRoom from "@/assets/room-deluxe.jpg";
import standardRoom from "@/assets/room-standard.jpg";
import suiteRoom from "@/assets/room-suite.jpg";
import { fetchRoomById } from "@/integrations/apis/room-apis/fetchRoom";
import { useAuth } from "@/hooks/useAuth";
import { roomBookingAPI } from "@/integrations/apis/room-apis/roomBooking";
import { imageMap } from "@/components/RoomCard";
import { BlockedDatesApi } from "@/integrations/apis/booking-apis/blockedDates";

const Booking = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [splReq, setSplReq] = useState("");

  interface Room {
    id: string;
    type: string;
    image: string | null;
    price: number;
    capacity: number;
    hasAC: boolean;
    hasWifi: boolean;
    description: string;
    longDescription: string;
    amenities: string[];
    size: string;
    available: boolean;
  }

  const [room, setRoom] = useState<Room | null>(null);      //nullable state, because room data comes from fetch:
  const [blockedDates, setBlockedDates] = useState([]);

  //TODO: remove
  // const rooms: Record<string, any> = {
  //   "1": { id: 1, name: "Deluxe Room", image: deluxeRoom, price: 2999, maxGuests: 2 },
  //   "2": { id: 2, name: "Standard Room", image: standardRoom, price: 1999, maxGuests: 2 },
  //   "3": { id: 3, name: "Executive Suite", image: suiteRoom, price: 4999, maxGuests: 4 },
  // };

  // const room = rooms[id || "1"];

  useEffect(() => {
    callFetchRoomById(id)
  }, [])

  useEffect(() => {
    callBlockedDates(room?.type)
  }, [room])

  const callBlockedDates = (type: string) => {

    BlockedDatesApi(type, token)
      .then(
        (resp) => setBlockedDates(resp.data.BlokedDates)
      )


    // fetch(`http://localhost:8000/api/bookings/blocked_dates/${type}`, {
    //   method: "GET",

    // }).then((response) => {
    //   if (response.ok) {
    //     return response.json()
    //   }
    // }).then((resp) => {
    //   setBlockedDates(resp.data.BlokedDates)
    // })
  }


  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * room.price;
  };

  //Fetch room by ID api call
  const callFetchRoomById = (id) => {
    fetchRoomById(id, token)
      .then((resp) => {
        setRoom(resp.data);
        console.log(resp, "room resppppppppppp")
      })
      .catch((error) => {
        console.error("Error fetching room:", error);
        throw error;
      });
  }

  const callBookRoom = () => {

    let bookingData = {
      room_id: room.id,
      check_in: checkInDate,
      check_out: checkOutDate,
      type: room.type,
      image: room.image,
      guests: guests,
      special_requests: splReq
    }

    roomBookingAPI(token, bookingData)
      .then((data) => {
        toast.success("Booking confirmed! Redirecting...");
        setTimeout(() => navigate("/my-bookings"), 2000);
      })
  }


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

    if (guests > room.capacity) {
      toast.error(`Maximum ${room.capacity} guests allowed for this room`);
      return;
    }

    callBookRoom();
    // toast.success("Booking confirmed! Redirecting...");
    // setTimeout(() => navigate("/my-bookings"), 2000);
  };

  if (!room) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Guest Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span style={{ color: "red" }}>*</span></Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span style={{ color: "red" }}>*</span></Label>
                        <Input id="lastName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span style={{ color: "red" }}>*</span></Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone <span style={{ color: "red" }}>*</span></Label>
                        <Input id="phone" type="tel" required />
                      </div>
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Stay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Check-in Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkInDate}
                              onSelect={setCheckInDate}
                              // disabled={(date) => date < new Date()}
                              disabled={(date) => {
                                const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD

                                // If no blocked dates, only block past/today
                                if (!blockedDates || blockedDates.length === 0) {
                                  return date <= new Date();
                                }

                                const blockedSet = new Set(blockedDates);

                                return (
                                  date <= new Date() ||      // block past/today
                                  blockedSet.has(formatted)  // block specific dates
                                );
                              }}

                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Check-out Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkOutDate}
                              onSelect={setCheckOutDate}
                              // disabled={(date) => !checkInDate || date <= checkInDate}
                              disabled={(date) => {
                                if (!checkInDate) return true;

                                const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD

                                // If no blocked dates, only block past/today
                                if (!blockedDates || blockedDates.length === 0) {
                                  return date <= checkInDate;
                                }

                                const blockedSet = new Set(blockedDates);

                                return (
                                  date <= checkInDate ||      // block past/today
                                  blockedSet.has(formatted)  // block specific dates
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guests">Number of Guests (Max: {room.capacity})</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max={room.capacity}
                          value={guests}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value <= room.capacity) {
                              setGuests(value);
                            }
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Input
                      id="requests"
                      type="string"
                      placeholder="Any special requirements?"
                      value={splReq}
                      onChange={(e) => setSplReq(e.target.value)}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={imageMap[room.image]}
                    alt={room.type}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{room.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{room.price} per night
                  </p>
                </div>

                {checkInDate && checkOutDate && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Check-in:</span>
                      <span>{format(checkInDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Check-out:</span>
                      <span>{format(checkOutDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Nights:</span>
                      <span>
                        {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Guests:</span>
                      <span>{guests}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusive of all taxes
                  </p>
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

export default Booking;
