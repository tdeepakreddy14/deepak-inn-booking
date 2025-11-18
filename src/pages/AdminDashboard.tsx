import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hotel, Users, Calendar, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();

  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalUsers: 0,
  });

  
  useEffect(() => {
    if (loading) return;      
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, loading, navigate]);


  useEffect(() => {
    const fetchStats = async () => {
      const { data: rooms } = await supabase.from('rooms').select('id, available');
      const { data: users } = await supabase.from('user_roles').select('user_id');

      setStats({
        totalRooms: rooms?.length || 0,
        availableRooms: rooms?.filter(r => r.available).length || 0,
        totalBookings: 0,
        totalUsers: users?.length || 0,
      });
    };

    // 🔴  ALLOW FETCHING EVEN IF NOT ADMIN
    // if (isAdmin) fetchStats();
    fetchStats();
  }, []);

  // 🔴 REMOVE ADMIN BLOCKER (so UI always loads)
  /*
  if (!isAdmin) {
    return null;
  }
  */

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your hotel operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
              <Hotel className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalRooms}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.availableRooms} available
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$0</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/rooms')} className="bg-primary hover:bg-primary/90">
            Manage Rooms
          </Button>
          <Button onClick={() => navigate('/admin/rooms/create')} variant="outline">
            Create New Room
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
