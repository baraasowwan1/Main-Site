import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              SowwanPay Services
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition">
              Services
            </Link>
            <Link to="/website-builder" className="text-gray-700 hover:text-blue-600 transition">
              Website Builder
            </Link>
            <Link to="/custom-request" className="text-gray-700 hover:text-blue-600 transition">
              Custom Request
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/services" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link to="/website-builder" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Website Builder
            </Link>
            <Link to="/custom-request" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
              Custom Request
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
