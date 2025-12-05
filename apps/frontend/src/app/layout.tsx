
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContex";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentMe - Rental Property Management",
  description: "Fullstack rental property management system",
};

export default function RootLayout({children}: Readonly <{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
