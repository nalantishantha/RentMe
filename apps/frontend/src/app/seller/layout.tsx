"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContex";
import SellerNavbar from '@/components/SellerNavbar';
import Footer from '@/components/Footer';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "seller") {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "seller") {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SellerNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

