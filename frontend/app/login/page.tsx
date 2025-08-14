'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, { identifier, password });
      login(res.data.token, res.data.user);
      toast.success(res.data.message);
      
      if (callbackUrl) {
        router.push(decodeURIComponent(callbackUrl));
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !callbackUrl) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'agent') {
        router.push('/agent');
      } else {
        router.push('/');
      }
    }
    if (user && callbackUrl) {
      router.push(decodeURIComponent(callbackUrl));
    }
  }, [user, router, callbackUrl]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50">
        <div className="overflow-hidden">
          <Image 
            src="/images/mobile.png" 
            width={600}
            height={650}  
            alt="Mobile Boarding Pass UI"
          />
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Phone or Registration Number</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
