import { Link } from "react-router-dom";
import { Users, Wifi, Wind } from "lucide-react";

interface RoomCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  capacity: number;
  hasAC: boolean;
  hasWifi: boolean;
  description: string;
}

const RoomCard = ({ id, name, image, price, capacity, hasAC, hasWifi, description }: RoomCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
            <Users className="h-3 w-3" />
            {capacity} Guests
          </span>
          
          {hasAC && (
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              <Wind className="h-3 w-3" />
              AC
            </span>
          )}
          
          {hasWifi && (
            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              <Wifi className="h-3 w-3" />
              WiFi
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            <span className="text-sm text-muted-foreground ml-1">/night</span>
          </div>
          <Link
            to={`/rooms/${id}`}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
