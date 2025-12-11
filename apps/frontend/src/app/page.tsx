'use client';

import Link from 'next/link';
import RenterNavbar from '@/components/RenterNavbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContex';
import AdminNavbar from '@/components/AdminNavbar';
import SellerNavbar from '@/components/SellerNavbar';

export default function Home() {
  const { user, isLoading } = useAuth();

  let Navbar = RenterNavbar;
  if(!isLoading && user) {
    if(user.role === 'admin'){
      Navbar = AdminNavbar;
    } else if (user.role === 'seller'){
      Navbar = SellerNavbar;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-100 to-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Welcome to RentMe
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Find your perfect rental property. Browse thousands of listings and discover your next home.
          </p>
          <Link
            href="/browse"
            className="inline-block bg-slate-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-slate-700 transition"
          >
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Seller Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Are you a Property Owner?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            List your properties and reach thousands of potential renters. Manage your listings with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-slate-800 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-700 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-slate-800 border-2 border-slate-800 px-6 py-3 rounded-md font-medium hover:bg-slate-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
