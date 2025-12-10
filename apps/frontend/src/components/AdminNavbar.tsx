'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContex';

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo_RentMe.png" 
              alt="RentMe Logo" 
              width={180} 
              height={70}
              className="object-contain max-h-16 w-auto brightness-0 invert"
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/browse" 
                className="px-4 py-2 hover:bg-slate-700 rounded-md transition font-medium"
              >
                Browse
              </Link>
              <Link 
                href="/admin/dashboard" 
                className="px-4 py-2 hover:bg-slate-700 rounded-md transition font-medium"
              >
                Dashboad
              </Link>
              <Link 
                href="/admin/users" 
                className="px-4 py-2 hover:bg-slate-700 rounded-md transition font-medium"
              >
                Users
              </Link>
              <Link 
                href="/admin/properties" 
                className="px-4 py-2 hover:bg-slate-700 rounded-md transition font-medium"
              >
                Properties
              </Link>
              {/* <Link 
                href="/admin/profile" 
                className="px-4 py-2 hover:bg-slate-700 rounded-md transition font-medium"
              >
                Profile
              </Link> */}
            </div>
          </div>

          {/* Logout Section */}
          <div className="flex items-center space-x-3">
            {user && (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-white text-slate-800 px-5 py-2 rounded-md transition font-medium hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
