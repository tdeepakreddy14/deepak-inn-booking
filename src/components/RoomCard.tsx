import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Wind } from "lucide-react";
import deluxe from "@/assets/room-deluxe.jpg";
import standard from "@/assets/room-standard.jpg";
import suite from "@/assets/room-suite.jpg";
interface RoomCardProps {
  id: string;
  type: string;
  image: string;
  price: number;
  capacity: number;
  hasAC: boolean;
  hasWifi: boolean;
  description: string;
}

export const imageMap: Record<string, string> = {
  deluxe,
  standard,
  suite,
};

const RoomCard = ({ id, type, image, price, capacity, hasAC, hasWifi, description }: RoomCardProps) => {

  const img = imageMap[image] ?? standard;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={type}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground">
            ₹{price}/night
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="text-xl font-semibold mb-2 text-foreground">{type}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {capacity} Guests
          </Badge>
          {hasAC && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              AC
            </Badge>
          )}
          {hasWifi && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              WiFi
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/rooms/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
