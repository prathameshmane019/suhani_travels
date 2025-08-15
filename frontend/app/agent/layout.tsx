// Path: e:\suhani_bus\frontend\app\agent\layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { AgentDashboardProvider } from '@/lib/AgentDashboardContext'; 

const AgentDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'agent')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-4 text-center">Loading user data...</div>;
  }

  if (!user || user.role !== 'agent') {
    return <div className="p-4 text-center">Redirecting to Login...</div>;
  }

  return (
    <AgentDashboardProvider>
      <div className="p-4 pt-20 max-w-7xl mx-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Agent Dashboard - {user.name}</h1> 
        {children}
      </div>
    </AgentDashboardProvider>
  );
};

export default AgentDashboardLayout;