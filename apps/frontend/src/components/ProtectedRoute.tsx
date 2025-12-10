"use client";

import { useAuth } from '@/contexts/AuthContex';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    if (user.role && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'seller':
          router.push('/seller/my-properties');
          break;
        default:
          router.push('/browse');
      }
    }
  }, [token, user, allowedRoles, router]);

  if (!token || !user || (user.role && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
