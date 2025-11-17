import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

export default function AdminRoomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    description: '',
    amenities: '',
    max_guests: '',
    has_ac: true,
    image_url: '',
    available: true,
  });

  // 🔴 ADMIN CHECK DISABLED FOR UI TESTING
  /*
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);
  */

  useEffect(() => {
    // Allow fetching even when NOT admin for UI testing
    if (id) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch room details',
        variant: 'destructive',
      });
      navigate('/admin/rooms');
    } else if (data) {
      setFormData({
        name: data.name,
        type: data.type,
        price: data.price.toString(),
        description: data.description || '',
        amenities: data.amenities?.join(', ') || '',
        max_guests: data.max_guests.toString(),
        has_ac: data.has_ac,
        image_url: data.image_url || '',
        available: data.available,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const roomData = {
      name: formData.name,
      type: formData.type,
      price: parseFloat(formData.price),
      description: formData.description,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      max_guests: parseInt(formData.max_guests),
      has_ac: formData.has_ac,
      image_url: formData.image_url || null,
      available: formData.available,
    };

    let error;
    if (id) {
      ({ error } = await supabase.from('rooms').update(roomData).eq('id', id));
    } else {
      ({ error } = await supabase.from('rooms').insert([roomData]));
    }

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${id ? 'update' : 'create'} room`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Room ${id ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/rooms');
    }

    setSubmitting(false);
  };

  // Keep loader but REMOVE admin blocker
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // 🔴 Remove admin restriction (UI testing only)
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

              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

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
                <Label htmlFor="price">Price per Night ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_guests">Maximum Guests *</Label>
                <Input
                  id="max_guests"
                  type="number"
                  min="1"
                  value={formData.max_guests}
                  onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="has_ac"
                  checked={formData.has_ac}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_ac: checked })}
                />
                <Label htmlFor="has_ac">Air Conditioned</Label>
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
