"use client"

import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContex";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }){
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect( () => {
        if(!isLoading){
            if(!user || user.role !== 'admin'){
                router.replace("/login");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "admin") {
        return null; 
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-grow container mx-auto px-6 py-12">
                {children}
            </main>
            <Footer />
        </div>
      );
}