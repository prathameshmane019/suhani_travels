'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext'; //

export const AuthStatus = () => {
  const { user, loading, logout } = useAuth(); // Use useAuth hook
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Call logout from context
    toast.info('Logged out successfully.');
    router.push('/login');
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading user...</div>;
  }

  if (user && user.role == 'passenger') {
    return (
      <div className="flex items-center  gap-2">
        <Button
          onClick={() => router.push('/bookings')}
          className="ml-2"
          size={'sm'}
        >
          My Bookings
        </Button>
        <span className="text-sm font-medium">Welcome, {user.name}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

   if (user && user.role == 'agent') {
    return (
      <div className="flex items-center  gap-2">
        <Button
          onClick={() => router.push('/agent')}
          className="ml-2"
          size={'sm'}
        >
        Trips
        </Button>
        <span className="text-sm font-medium">Welcome, {user.name}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

   if (user && user.role == 'admin') {
    return (
      <div className="flex items-center  gap-2">
        <Button
          onClick={() => router.push('/admin')}
          className="ml-2"
          size={'sm'}
        >
          Dashboard
        </Button>
        <span className="text-sm font-medium">Welcome, {user.name}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center   gap-1 ">
      <Button 
        onClick={() => router.push('/bookings')}
        className=""
        size={'sm'}
      >
        Book Now
      </Button>
      <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>Login</Button>
      <Button variant="ghost" size="sm" onClick={() => router.push('/register')}>Register</Button>
    </div>
  );
};
