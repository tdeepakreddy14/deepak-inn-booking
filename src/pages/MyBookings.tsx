import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { cancelBookingApi, getBookingsListAPI } from "@/integrations/apis/room-apis/roomBooking";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { imageMap } from "@/components/RoomCard";

const MyBookings = () => {
  const { token, loading } = useAuth();
  // Mock bookings data
  // const bookings = [
  //   {
  //     id: 1,
  //     roomName: "Deluxe Room",
  //     roomImage: deluxeRoom,
  //     checkIn: "2024-12-20",
  //     checkOut: "2024-12-23",
  //     guests: 2,
  //     totalAmount: 8997,
  //     status: "confirmed",
  //   },
  //   {
  //     id: 2,
  //     roomName: "Standard Room",
  //     roomImage: standardRoom,
  //     checkIn: "2024-11-15",
  //     checkOut: "2024-11-17",
  //     guests: 2,
  //     totalAmount: 3998,
  //     status: "completed",
  //   },
  // ];

  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)



  useEffect(() => {
    !loading && getMyBookings()
  }, [loading])

  useEffect(() => {
    console.log(totalPages, "totalPages")
  }, [totalPages])

  const handleCancelClick = (id) => {
    setSelectedBookingId(id)
    setOpenCancelDialog(true)
  }

  const confirmCancel = () => {
    handelCancelEvent(selectedBookingId)
    setOpenCancelDialog(false)
  }

  const getMyBookings = () => {
    setIsLoading(true);
    getBookingsListAPI(token)
      .then((resp) => {
        setMyBookings(resp.data.bookings);
        console.log(resp.data.bookings , "resp.data.bookings")
        setTotalPages(resp.data.pagination.total_pages);
      })
      .finally(() =>
        setIsLoading(false)
      )
  }

  const callCancelBooking = (id) => {
    cancelBookingApi(id, token)
      .then(
        () => getMyBookings()
      )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white hover:bg-green-500";
      case "completed":
        return "bg-blue-500 text-white hover:bg-blue-500";
      case "cancelled":
        return "bg-red-500 text-white hover:bg-red-500";
      default:
        return "bg-gray-400 text-black hover:bg-gray-400";
    }
  };

  const canCancelBooking = (checkInDate: string | Date) => {
  const now = new Date()
  const checkIn = new Date(checkInDate)  // ensure it's a Date object

  const diffMs = checkIn.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours > 24
}


  const handelCancelEvent = (bookingId) => {
    callCancelBooking(bookingId)
  }

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const getPagesToDisplay = () => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);

    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your reservations</p>
        </div>

        {myBookings.length > 0 ? (
          <div className="space-y-6">
            {myBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Room Image */}
                  <div className="md:col-span-1">
                    <img
                      src={imageMap[booking.image]}
                      alt={booking.type}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="md:col-span-3 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold mb-2">{booking.type}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">₹{booking.total_price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Check-in</p>
                          <p className="font-medium">{new Date(booking.check_in).toLocaleDateString("en-IN", { timeZone: "UTC" })}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Check-out</p>
                          <p className="font-medium">{new Date(booking.check_out).toLocaleDateString("en-IN", { timeZone: "UTC" })}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Guests</p>
                          <p className="font-medium">{booking.guests} Guests</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline">View Details</Button>
                      {booking.status === "confirmed" && (
                        <>
                          <Button variant="outline">Modify Booking</Button>
                          {/* <Button variant="destructive" onClick={() => handleCancelClick(booking.id)}>Cancel Booking</Button> */}
                          {canCancelBooking(booking.check_in) ? (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelClick(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center pt-2">
                              Cancellation unavailable (within 24 hrs)
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CardContent>
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our rooms and make your first reservation!
              </p>
              <Button asChild>
                <Link to="/rooms">Browse Rooms</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      (
      <Pagination className="py-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {getPagesToDisplay().map((p, idx) => (
            <PaginationItem key={idx}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === p}
                  onClick={() => handlePageChange(Number(p))}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      )
      <Footer />

      {
        <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking?</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCancelDialog(false)}>
                Keep Booking
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
};

export default MyBookings;