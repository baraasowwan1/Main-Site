import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SowwanPay Services</h3>
            <p className="text-gray-400">
              Professional digital marketing and web development services for your business growth.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/services" className="hover:text-white transition">Our Services</a></li>
              <li><a href="/website-builder" className="hover:text-white transition">Website Builder</a></li>
              <li><a href="/custom-request" className="hover:text-white transition">Custom Request</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:sowwanpay@gmail.com" className="hover:text-white transition">
                  sowwanpay@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span>+962 (079) 008-2373</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Online Services Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 SowwanPay Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
