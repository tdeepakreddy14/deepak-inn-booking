import { useState } from "react";
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

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const rooms: Record<string, any> = {
    "1": { id: 1, name: "Deluxe Room", image: deluxeRoom, price: 2999 },
    "2": { id: 2, name: "Standard Room", image: standardRoom, price: 1999 },
    "3": { id: 3, name: "Executive Suite", image: suiteRoom, price: 4999 },
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
    
    toast.success("Booking confirmed! Redirecting...");
    setTimeout(() => navigate("/my-bookings"), 2000);
  };

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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
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
                              disabled={(date) => date < new Date()}
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
                              disabled={(date) => !checkInDate || date <= checkInDate}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Input id="requests" placeholder="Any special requirements?" />
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
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{room.name}</h3>
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
