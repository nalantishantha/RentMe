export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          © {currentYear} RentMe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
