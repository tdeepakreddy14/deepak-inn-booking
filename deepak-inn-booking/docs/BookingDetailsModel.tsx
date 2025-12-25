// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Calendar, MapPin, Users2 } from "lucide-react";

// interface BookingDetailsProps {
//   open: boolean;
//   onClose: () => void;
//   booking: any; // You can replace with your Booking type
// }

// export default function BookingDetailsModal({
//   open,
//   onClose,
//   booking,
// }: BookingDetailsProps) {
//   if (!booking) return null;

//   const nights =
//     (new Date(booking.check_out).getTime() -
//       new Date(booking.check_in).getTime()) /
//     (1000 * 60 * 60 * 24);

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent
//         className="max-w-2xl rounded-xl p-0 overflow-hidden animate-in fade-in duration-200"
//       >
//         {/* Banner Image */}
//         <div className="h-56 overflow-hidden relative">
//           <img
//             src={booking.room_image}
//             alt={booking.room_name}
//             className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
//           />
//         </div>

//         {/* Details */}
//         <div className="p-6 space-y-5">

//           <DialogHeader>
//             <DialogTitle className="text-2xl font-semibold">
//               {booking.room_name}
//             </DialogTitle>
//             <Badge
//               variant={booking.status === "confirmed" ? "default" : "secondary"}
//               className="mt-2"
//             >
//               {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//             </Badge>
//           </DialogHeader>

//           <Separator />

//           {/* Stay Details */}
//           <div>
//             <h3 className="font-medium text-lg mb-2">Stay Details</h3>
//             <div className="grid grid-cols-2 gap-4 text-sm">

//               <div className="flex items-start gap-2">
//                 <Calendar className="h-4 w-4 mt-1" />
//                 <div>
//                   <p className="font-medium">Check-in</p>
//                   <p>{new Date(booking.check_in).toDateString()}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2">
//                 <Calendar className="h-4 w-4 mt-1" />
//                 <div>
//                   <p className="font-medium">Check-out</p>
//                   <p>{new Date(booking.check_out).toDateString()}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2">
//                 <Users2 className="h-4 w-4 mt-1" />
//                 <div>
//                   <p className="font-medium">Guests</p>
//                   <p>{booking.guests} Guests</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2">
//                 <MapPin className="h-4 w-4 mt-1" />
//                 <div>
//                   <p className="font-medium">Hotel</p>
//                   <p>Deepak Inn</p>
//                 </div>
//               </div>

//             </div>
//           </div>

//           <Separator />

//           {/* Special Request */}
//           {booking.special_requests && (
//             <>
//               <h3 className="font-medium text-lg">Special Requests</h3>
//               <p className="text-sm bg-muted p-3 rounded-md border">
//                 {booking.special_requests}
//               </p>
//               <Separator />
//             </>
//           )}

//           {/* Price Breakdown */}
//           <div>
//             <h3 className="font-medium text-lg mb-3">Price Breakdown</h3>

//             <div className="rounded-lg border p-4 space-y-3">
//               <div className="flex justify-between text-sm">
//                 <span>Room Price (₹{booking.price_per_night} × {nights} nights)</span>
//                 <span>₹{booking.total_price}</span>
//               </div>

//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <span>Taxes (Included)</span>
//                 <span>₹0</span>
//               </div>

//               <Separator />

//               <div className="flex justify-between font-semibold text-lg">
//                 <span>Total Amount</span>
//                 <span className="text-orange-600">₹{booking.total_price}</span>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Footer */}
//         <DialogFooter className="flex justify-end gap-3 p-4 bg-muted/40 border-t">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>

//           {booking.status === "confirmed" && (
//             <Button variant="destructive">
//               Cancel Booking
//             </Button>
//           )}
//         </DialogFooter>

//       </DialogContent>
//     </Dialog>
//   );
// }

// 🎨 2. Animation Ideas Included

// In the code:

// className="max-w-2xl rounded-xl p-0 overflow-hidden animate-in fade-in duration-200"


// ShadCN built-in animations:

// fade-in

// zoom-in

// slide-in-from-bottom

// slide-in-from-right

// You can try these:

// animate-in fade-in zoom-in-95 duration-200


// or

// animate-in slide-in-from-bottom-10 duration-300


// Just replace the animation class on the DialogContent.

// 🎨 3. Tailwind / ShadCN UI layout features included

// The modal includes:

// Clean card layout

// Room image banner

// Status badge (Confirmed / Pending / Cancelled)

// Stay details grid

// Special requests section

// Professional price breakdown box

// Buttons footer

// Soft shadows + rounded edges

// Looks like a hotel booking app (OYO / Booking.com style).



// const [open, setOpen] = useState(false);
// const [selectedBooking, setSelectedBooking] = useState(null);

// // Example booking object structure
// const booking = {
//   room_name: "Deluxe Room",
//   room_image: "/image/deluxe.jpg",
//   check_in: "2024-12-20",
//   check_out: "2024-12-23",
//   guests: 2,
//   price_per_night: 2999,
//   total_price: 8997,
//   status: "confirmed",
//   special_requests: "Need early check-in",
// };

// <BookingDetailsModal
//   open={open}
//   onClose={() => setOpen(false)}
//   booking={selectedBooking}
// />
