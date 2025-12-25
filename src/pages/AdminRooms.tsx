import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchRooms } from '@/integrations/apis/room-apis/fetchRoom';
import { deleteRoom } from '@/integrations/apis/room-apis/deleteRoom';
import { imageMap } from '@/components/RoomCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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


export default function AdminRooms() {
  const navigate = useNavigate();
  const { isAdmin, loading, token } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState(null)


  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    callGetRooms()

  }, []);

  const handleDeleteClick = (id) => {
    setSelectedRoomId(id)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = () => {
    handleDelete(selectedRoomId)
    setOpenDeleteDialog(false)
  }

  const callGetRooms = () => {
    setLoadingRooms(true);

    //getAllRoom API call
    fetchRooms(token)
      .then((resp) => {
        setRooms(resp.data.rooms);
        console.log(resp, "resp of all Rooms");
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      })
      .finally(() => {
        setLoadingRooms(false); // must be FALSE
      });
  }


  const handleDelete = async (id: string) => {
    callDelRoom(id);
  };

  const callDelRoom = (id) => {
    deleteRoom(id, token)
      .then(() => {
        callGetRooms(); // refresh room list
      })
      .catch(err => {
        console.error("Delete error:", err);
      });
  };


  if (loading || loadingRooms) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Manage Rooms</h1>
            <p className="text-muted-foreground">View, edit, and delete rooms</p>
          </div>

          <Button
            onClick={() => navigate('/admin/rooms/create')}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No rooms found. Create your first room!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                {room.image && (
                  <img
                    src={imageMap[room.image]}
                    alt={room.type}
                    className="w-full h-48 object-cover"
                  />
                )}

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{room.type}</CardTitle>
                    <Badge variant={room.available ? 'secondary' : 'default'}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{room.type}</p>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ₹{room.price}/night
                  </p>

                  <div className="flex gap-2">
                    <Badge variant="outline">{room.capacity} guests</Badge>
                    <Badge variant="outline">{room.hasAC ? 'AC' : 'Non-AC'}</Badge>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteClick(room.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Room?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this room.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}
