import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { fetchRoomById } from '@/integrations/apis/room-apis/fetchRoom';

export default function AdminRoomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    price: '',
    description: '',
    longDescription: '',
    amenities: '',
    capacity: '',
    hasAC: true,
    hasWifi: true,
    image: '',
    available: true,
    roomCount: "",
    size: ""
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);


  useEffect(() => {
    if (id) {
      callFetchRoomByID(id);
    }
  }, [id]);

  //FetchRoomByID API call 
  const callFetchRoomByID = (id) => {
    fetchRoomById(id, token)
      .then((resp) => setFormData(resp.data))
  }

  // const fetchRoom = async () => {
  //   const { data, error } = await supabase
  //     .from('rooms')
  //     .select('*')
  //     .eq('id', id)
  //     .single();

  //   if (error) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to fetch room details',
  //       variant: 'destructive',
  //     });
  //     navigate('/admin/rooms');
  //   } else if (data) {
  //     setFormData({
  //       name: data.name,
  //       type: data.type,
  //       price: data.price.toString(),
  //       description: data.description || '',
  //       amenities: data.amenities?.join(', ') || '',
  //       capacity: data.capacity.toString(),
  //       hasAC: data.hasAC,
  //       image: data.image || '',
  //       available: data.available,
  //     });
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    //TODO:remove
    // const roomData = {
    //   type: formData.type,
    //   price: parseFloat(formData.price),
    //   description: formData.description,
    //   amenities: formData.amenities.split(",").map(a => a.trim()).filter(Boolean),
    //   capacity: parseInt(formData.capacity),
    //   hasAC: formData.hasAC,
    //   image: formData.image || null,
    //   available: formData.available,
    // };
    const roomData = {
      type: formData.type,
      image: formData.image,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      hasAC: formData.hasAC,
      hasWifi: formData.hasWifi,
      description: formData.description,
      longDescription: formData.longDescription,
      amenities: Array.isArray(formData.amenities) ?
        formData.amenities
        :
        formData.amenities
          .split(",")
          .map(a => a.trim())
          .filter(Boolean),
      size: formData.size,
      available: formData.available,
      roomCount: formData.roomCount
    };


    const method = id ? "PUT" : "POST";
    const url = id ? `http://localhost:8000/api/rooms/${id}` : `http://localhost:8000/api/rooms/`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        console.log(res, "room created resp")
        return res.json();
      })
      .then(() => {
        toast({
          title: "Success",
          description: `Room ${id ? "updated" : "created"} successfully`,
        });
        // navigate("/admin/rooms");
      })
      .catch(() => {
        toast({
          title: "Error",
          description: `Failed to ${id ? "update" : "create"} room`,
          variant: "destructive",
        });
      })
      .finally(() => setSubmitting(false));
  };


  // Keep loader but REMOVE admin blocker
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  /*
  if (!isAdmin) {
    return null;
  }
  */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-primary">
              {id ? 'Edit Room' : 'Create New Room'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="type">Room Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Deluxe, Standard, Suite"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Night (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  // step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Maximum Guests *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="Long_description"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="e.g., WiFi, TV, Mini Bar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="deluxe/standard/suite"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomCount">Room Count</Label>
                <Input
                  id="roomCount"
                  type="number"
                  value={formData.roomCount}
                  max={5}
                  onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                  placeholder="No of Rooms"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasAC"
                  checked={formData.hasAC}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasAC: checked })}
                />
                <Label htmlFor="hasAC">Air Conditioned</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="hasWifi"
                  checked={formData.hasWifi}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasWifi: checked })}
                />
                <Label htmlFor="hasWifi">Wifi</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available for Booking</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? 'Saving...' : id ? 'Update Room' : 'Create Room'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/rooms')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
