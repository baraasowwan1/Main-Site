import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Globe, TrendingUp, Palette, Code, MapPin, Search } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: 'Social Media Management',
      description: 'Professional management of your social media accounts and advertising campaigns',
      price: '$299/month',
      serviceId: 'social-media'
    },
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: 'SEO & Google Ads',
      description: 'Search engine optimization, Google Ads campaigns, and Google Maps setup',
      price: '$399/month',
      serviceId: 'seo-google'
    },
    {
      icon: <Palette className="w-12 h-12 text-blue-600" />,
      title: 'Visual Identity Design',
      description: 'Complete brand identity design including logos, colors, and brand guidelines',
      price: '$599',
      serviceId: 'visual-identity'
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: 'Website Creation',
      description: 'Professional website development tailored to your business needs',
      price: '$999',
      serviceId: 'website-creation'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Digital Presence
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Professional digital marketing, web development, and branding services to grow your business online
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/services" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              View All Services
            </Link>
            <Link to="/website-builder" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition">
              Try Website Builder
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">{service.price}</p>
                <Link
                  to={`/services?service=${service.serviceId}`}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Website Builder CTA */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Build Your Website</h2>
              <p className="text-gray-700 mb-6">
                Use our intuitive website builder to create and customize your own website.
                Add pages, modify designs, and connect your custom domain - all from one platform.
              </p>
              <Link to="/website-builder" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start Building
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Code className="w-16 h-16 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Drag & drop interface</li>
                <li>✓ Custom domain connection</li>
                <li>✓ Mobile responsive designs</li>
                <li>✓ Real-time preview</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Request CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
          <p className="text-gray-700 mb-6">
            Have specific requirements? Our team can create a tailored solution just for you.
          </p>
          <Link to="/custom-request" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Submit Custom Request
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
