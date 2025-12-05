import Link from 'next/link';
import Image from 'next/image';

export default function RenterNavbar() {
  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo_RentMe.png" 
              alt="RentMe Logo" 
              width={180} 
              height={70}
              className="object-contain max-h-12 w-auto brightness-0 invert"
            />
          </Link>
          {/* Login/Signup on the right */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="bg-white text-slate-800 px-4 py-2 rounded-md transition font-medium hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-slate-800 px-5 py-2 rounded-md transition font-medium hover:bg-slate-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
