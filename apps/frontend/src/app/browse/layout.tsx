"use client";

import RenterNavbar from '@/components/RenterNavbar';
import SellerNavbar from '@/components/SellerNavbar';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContex';

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  let Navbar = RenterNavbar;
  if (!isLoading && user) {
    if (user.role === 'admin') {
      Navbar = AdminNavbar;
    } else if (user.role === 'seller') {
      Navbar = SellerNavbar;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
