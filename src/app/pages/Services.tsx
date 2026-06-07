import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PayPalButton from '../components/PayPalButton';
import { TrendingUp, Search, Palette, Globe, Check, X } from 'lucide-react';

export default function Services() {
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, [searchParams]);

  const services = [
    {
      id: 'social-media',
      icon: <TrendingUp className="w-16 h-16 text-blue-600" />,
      title: 'Social Media Management',
      price: '299',
      billing: 'per month',
      description: 'Comprehensive social media account management and advertising campaigns to boost your online presence.',
      features: [
        'Daily content posting (5-7 posts/week)',
        'Community management & engagement',
        'Facebook & Instagram advertising campaigns',
        'Monthly analytics reports',
        'Hashtag research & strategy',
        'Story & reel creation',
        'Competitor analysis',
        'Ad budget optimization'
      ],
      notIncluded: [
        'Content creation (photos/videos)',
        'Influencer partnerships'
      ]
    },
    {
      id: 'seo-google',
      icon: <Search className="w-16 h-16 text-blue-600" />,
      title: 'SEO & Google Services',
      price: '399',
      billing: 'per month',
      description: 'Complete search engine optimization, Google Ads management, and Google Maps setup for maximum visibility.',
      features: [
        'On-page SEO optimization',
        'Keyword research & targeting',
        'Google Ads campaign management',
        'Google My Business setup & verification',
        'Google Maps listing optimization',
        'Monthly SEO performance reports',
        'Backlink building strategy',
        'Local SEO optimization',
        'Google Analytics setup'
      ],
      notIncluded: [
        'PPC ad spend (billed separately)',
        'Content writing'
      ]
    },
    {
      id: 'visual-identity',
      icon: <Palette className="w-16 h-16 text-blue-600" />,
      title: 'Visual Identity Design',
      price: '599',
      billing: 'one-time',
      description: 'Professional brand identity design package to establish your unique visual presence.',
      features: [
        'Logo design (3 concepts, unlimited revisions)',
        'Color palette development',
        'Typography selection',
        'Brand style guide (PDF)',
        'Business card design',
        'Social media profile graphics',
        'Email signature design',
        'Brand usage guidelines',
        'All source files included'
      ],
      notIncluded: [
        'Website design',
        'Print materials'
      ]
    },
    {
      id: 'website-creation',
      icon: <Globe className="w-16 h-16 text-blue-600" />,
      title: 'Custom Website Development',
      price: '999',
      billing: 'starting at',
      description: 'Fully custom website tailored to your specific business needs and requirements.',
      features: [
        'Custom design mockups',
        'Responsive mobile-first development',
        'Up to 10 pages',
        'Contact form integration',
        'SEO-friendly structure',
        'Google Analytics integration',
        '3 months free support',
        'Content management system',
        'SSL certificate setup',
        'Domain connection assistance'
      ],
      notIncluded: [
        'Domain registration (can assist)',
        'Hosting fees',
        'Content writing',
        'E-commerce functionality'
      ]
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-gray-600">
              Choose the perfect service package for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition ${
                  selectedService === service.id ? 'ring-4 ring-blue-600' : ''
                }`}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>{service.icon}</div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        ${service.price}
                      </div>
                      <div className="text-sm text-gray-600">{service.billing}</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      What's Included:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-600" />
                      Not Included:
                    </h4>
                    <ul className="space-y-2">
                      {service.notIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleServiceSelect(service.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {selectedService === service.id ? 'Hide Payment Options' : 'Purchase Now'}
                  </button>

                  {selectedService === service.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold mb-4">Complete Your Purchase</h4>
                      <PayPalButton
                        amount={service.price}
                        serviceName={service.title}
                        serviceId={service.id}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need a Custom Package?</h3>
            <p className="text-gray-700 mb-4">
              We can create a tailored solution that perfectly fits your requirements.
            </p>
            <a
              href="/custom-request"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Request Custom Quote
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
