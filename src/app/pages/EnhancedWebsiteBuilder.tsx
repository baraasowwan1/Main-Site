import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Plus, Save, Eye, Settings as SettingsIcon, Trash2, Globe,
  Type, Image as ImageIcon, Layout, Mail, Grid, Columns,
  Edit2, X, FileText, Link as LinkIcon, ArrowUp, ArrowDown,
  Copy, Search, DollarSign, Star, Users, MessageSquare,
  CheckCircle, Zap
} from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface Component {
  id: string;
  type: 'hero' | 'text' | 'image' | 'button' | 'contact' | 'gallery' | 'columns' | 'footer' | 'features' | 'pricing' | 'testimonial' | 'cta' | 'stats';
  props: {
    [key: string]: any;
  };
}

interface Page {
  pageId: string;
  name: string;
  path: string;
  components: Component[];
}

export default function WebsiteBuilder() {
  const navigate = useNavigate();
  const [websiteId, setWebsiteId] = useState<string>('');
  const [siteName, setSiteName] = useState('My Website');
  const [customDomain, setCustomDomain] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [imageSearch, setImageSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Enhanced component library
  const componentTypes = [
    { type: 'hero', icon: Layout, label: 'Hero Section', color: 'bg-blue-500' },
    { type: 'features', icon: Zap, label: 'Features', color: 'bg-purple-500' },
    { type: 'text', icon: Type, label: 'Text Block', color: 'bg-gray-500' },
    { type: 'image', icon: ImageIcon, label: 'Image', color: 'bg-green-500' },
    { type: 'gallery', icon: Grid, label: 'Gallery', color: 'bg-yellow-500' },
    { type: 'pricing', icon: DollarSign, label: 'Pricing Table', color: 'bg-emerald-500' },
    { type: 'testimonial', icon: MessageSquare, label: 'Testimonial', color: 'bg-pink-500' },
    { type: 'stats', icon: Star, label: 'Stats/Numbers', color: 'bg-orange-500' },
    { type: 'cta', icon: CheckCircle, label: 'Call-to-Action', color: 'bg-red-500' },
    { type: 'button', icon: Layout, label: 'Button', color: 'bg-indigo-500' },
    { type: 'contact', icon: Mail, label: 'Contact Form', color: 'bg-teal-500' },
    { type: 'columns', icon: Columns, label: 'Two Columns', color: 'bg-cyan-500' },
    { type: 'footer', icon: Globe, label: 'Footer', color: 'bg-gray-700' }
  ];

  useEffect(() => {
    loadOrCreateWebsite();
  }, []);

  const loadOrCreateWebsite = async () => {
    const savedId = localStorage.getItem('currentWebsiteId');
    if (savedId) {
      try {
        const response = await fetch(`${API_BASE}/websites/${savedId}`);
        const data = await response.json();
        if (data.success) {
          setWebsiteId(data.website.websiteId);
          setSiteName(data.website.siteName);
          setCustomDomain(data.website.customDomain || '');
          setPages(data.website.pages);
          setCurrentPage(data.website.pages[0]);
          return;
        }
      } catch (error) {
        console.error('Error loading website:', error);
      }
    }
    createNewWebsite();
  };

  const createNewWebsite = async () => {
    try {
      const response = await fetch(`${API_BASE}/websites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: 'user_' + Date.now(),
          ownerEmail: 'customer@example.com',
          siteName: 'My New Website'
        })
      });
      const data = await response.json();
      if (data.success) {
        setWebsiteId(data.website.websiteId);
        setSiteName(data.website.siteName);
        setPages(data.website.pages);
        setCurrentPage(data.website.pages[0]);
        localStorage.setItem('currentWebsiteId', data.website.websiteId);
      }
    } catch (error) {
      console.error('Error creating website:', error);
      alert('Failed to create website. Please check your backend connection.');
    }
  };

  const addPage = () => {
    const pageName = prompt('Enter page name:');
    if (!pageName) return;
    const newPage: Page = {
      pageId: 'page_' + Date.now(),
      name: pageName,
      path: '/' + pageName.toLowerCase().replace(/\s+/g, '-'),
      components: []
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setCurrentPage(newPage);
  };

  const deletePage = (pageId: string) => {
    if (pages.length === 1) {
      alert('Cannot delete the last page');
      return;
    }
    if (confirm('Delete this page?')) {
      const updatedPages = pages.filter(p => p.pageId !== pageId);
      setPages(updatedPages);
      if (currentPage?.pageId === pageId) {
        setCurrentPage(updatedPages[0]);
      }
    }
  };

  const addComponent = (type: string) => {
    if (!currentPage) return;
    const newComponent: Component = {
      id: Date.now().toString(),
      type: type as any,
      props: getDefaultProps(type)
    };
    const updatedPage = {
      ...currentPage,
      components: [...currentPage.components, newComponent]
    };
    updateCurrentPage(updatedPage);
  };

  const getDefaultProps = (type: string) => {
    const defaults: Record<string, any> = {
      hero: {
        title: 'Build Something Amazing',
        subtitle: 'Create stunning websites with our easy-to-use builder',
        backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        buttonText: 'Get Started',
        buttonLink: '#',
        showButton: true,
        height: 'large'
      },
      features: {
        title: 'Amazing Features',
        subtitle: 'Everything you need to succeed',
        items: [
          { icon: 'zap', title: 'Fast Performance', description: 'Lightning-fast load times' },
          { icon: 'shield', title: 'Secure', description: 'Bank-level security' },
          { icon: 'star', title: 'Easy to Use', description: 'Intuitive interface' }
        ]
      },
      text: {
        content: 'Add your text content here. You can write anything you want!',
        fontSize: '16px',
        textAlign: 'left',
        maxWidth: '800px'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
        alt: 'Beautiful image',
        caption: '',
        width: 'full'
      },
      pricing: {
        title: 'Simple Pricing',
        subtitle: 'Choose the plan that fits your needs',
        plans: [
          {
            name: 'Basic',
            price: '$9',
            period: '/month',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            buttonText: 'Get Started',
            buttonLink: '#',
            highlighted: false
          },
          {
            name: 'Pro',
            price: '$29',
            period: '/month',
            features: ['Everything in Basic', 'Feature 4', 'Feature 5', 'Priority Support'],
            buttonText: 'Get Started',
            buttonLink: '#',
            highlighted: true
          },
          {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            features: ['Everything in Pro', 'Custom features', 'Dedicated support'],
            buttonText: 'Contact Us',
            buttonLink: '#',
            highlighted: false
          }
        ]
      },
      testimonial: {
        quote: 'This product changed my life! Highly recommend to everyone.',
        author: 'John Doe',
        role: 'CEO, Company',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        rating: 5
      },
      stats: {
        title: 'Trusted by thousands',
        items: [
          { number: '10K+', label: 'Happy Customers' },
          { number: '50M+', label: 'Projects Completed' },
          { number: '99%', label: 'Satisfaction Rate' },
          { number: '24/7', label: 'Support Available' }
        ]
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of satisfied customers today',
        buttonText: 'Start Free Trial',
        buttonLink: '#',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF'
      },
      button: {
        text: 'Click Me',
        link: '#',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        size: 'medium'
      },
      contact: {
        title: 'Get in Touch',
        subtitle: 'Send us a message and we\'ll get back to you soon',
        email: 'contact@example.com',
        showPhone: true,
        phone: '+1 (555) 123-4567'
      },
      gallery: {
        images: [
          { url: 'https://images.unsplash.com/photo-1557683316-973673baf926', alt: 'Image 1' },
          { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85', alt: 'Image 2' },
          { url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5', alt: 'Image 3' },
          { url: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f', alt: 'Image 4' }
        ],
        columns: 4
      },
      columns: {
        leftContent: 'Left column content',
        rightContent: 'Right column content',
        leftWidth: '50%'
      },
      footer: {
        copyright: '© 2026 My Website. All rights reserved.',
        links: [
          { text: 'Home', url: '/' },
          { text: 'About', url: '/about' },
          { text: 'Contact', url: '/contact' }
        ],
        social: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        },
        showSocial: true
      }
    };
    return defaults[type] || {};
  };

  const updateCurrentPage = (updatedPage: Page) => {
    setCurrentPage(updatedPage);
    const updatedPages = pages.map(p =>
      p.pageId === updatedPage.pageId ? updatedPage : p
    );
    setPages(updatedPages);
  };

  const updateComponent = (componentId: string, newProps: any) => {
    if (!currentPage) return;
    const updatedPage = {
      ...currentPage,
      components: currentPage.components.map(c =>
        c.id === componentId ? { ...c, props: { ...c.props, ...newProps } } : c
      )
    };
    updateCurrentPage(updatedPage);
  };

  const deleteComponent = (componentId: string) => {
    if (!currentPage) return;
    const updatedPage = {
      ...currentPage,
      components: currentPage.components.filter(c => c.id !== componentId)
    };
    updateCurrentPage(updatedPage);
  };

  const moveComponent = (componentId: string, direction: 'up' | 'down') => {
    if (!currentPage) return;
    const index = currentPage.components.findIndex(c => c.id === componentId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentPage.components.length - 1) return;

    const newComponents = [...currentPage.components];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newComponents[index], newComponents[targetIndex]] = [newComponents[targetIndex], newComponents[index]];

    updateCurrentPage({ ...currentPage, components: newComponents });
  };

  const duplicateComponent = (componentId: string) => {
    if (!currentPage) return;
    const component = currentPage.components.find(c => c.id === componentId);
    if (!component) return;

    const newComponent = {
      ...component,
      id: Date.now().toString()
    };

    const index = currentPage.components.findIndex(c => c.id === componentId);
    const newComponents = [...currentPage.components];
    newComponents.splice(index + 1, 0, newComponent);

    updateCurrentPage({ ...currentPage, components: newComponents });
  };

  const searchUnsplashImages = async (query: string) => {
    try {
      // Using Unsplash API - you'd need to add VITE_UNSPLASH_ACCESS_KEY to your .env
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=12`,
        {
          headers: {
            Authorization: 'Client-ID YOUR_UNSPLASH_ACCESS_KEY'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Unsplash search error:', error);
      // Fallback: Show some default Unsplash URLs
      setSearchResults([
        { id: '1', urls: { regular: 'https://images.unsplash.com/photo-1557683316-973673baf926' } },
        { id: '2', urls: { regular: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85' } },
        { id: '3', urls: { regular: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5' } }
      ]);
    }
  };

  const saveWebsite = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/websites/${websiteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pages,
          siteName,
          customDomain,
          settings: { siteName, customDomain }
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('✓ Website saved successfully!');
      } else {
        alert('Failed to save: ' + data.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save website');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (paymentDetails: any) => {
    try {
      const response = await fetch(`${API_BASE}/websites/${websiteId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentDetails.id })
      });
      const data = await response.json();
      if (data.success) {
        alert(`🎉 Website published!\n\nLive at: ${data.url}`);
        window.open(data.url, '_blank');
        setShowPublish(false);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish website');
    }
  };

  const renderComponentEditor = (component: Component) => {
    if (editingComponent !== component.id) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)}</h2>
            <button onClick={() => setEditingComponent(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Hero Component Editor */}
            {component.type === 'hero' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={component.props.title}
                    onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Subtitle</label>
                  <textarea
                    value={component.props.subtitle}
                    onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded h-20"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Background Image URL</label>
                  <input
                    type="text"
                    value={component.props.backgroundImage}
                    onChange={(e) => updateComponent(component.id, { backgroundImage: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    onClick={() => {
                      const query = prompt('Search Unsplash (e.g., "mountain", "office", "technology")');
                      if (query) searchUnsplashImages(query);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    Search Unsplash for images
                  </button>
                  {searchResults.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {searchResults.map((img) => (
                        <img
                          key={img.id}
                          src={img.urls.regular}
                          alt="Unsplash"
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                          onClick={() => {
                            updateComponent(component.id, { backgroundImage: img.urls.regular });
                            setSearchResults([]);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-2">Text Color</label>
                  <input
                    type="color"
                    value={component.props.textColor}
                    onChange={(e) => updateComponent(component.id, { textColor: e.target.value })}
                    className="w-full h-12 border rounded"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={component.props.showButton}
                      onChange={(e) => updateComponent(component.id, { showButton: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Show Button</span>
                  </label>
                </div>
                {component.props.showButton && (
                  <>
                    <div>
                      <label className="block font-semibold mb-2">Button Text</label>
                      <input
                        type="text"
                        value={component.props.buttonText}
                        onChange={(e) => updateComponent(component.id, { buttonText: e.target.value })}
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Button Link</label>
                      <input
                        type="text"
                        value={component.props.buttonLink}
                        onChange={(e) => updateComponent(component.id, { buttonLink: e.target.value })}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="https://example.com or #contact"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Text Component Editor */}
            {component.type === 'text' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Content</label>
                  <textarea
                    value={component.props.content}
                    onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                    className="w-full px-4 py-2 border rounded h-32"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Text Alignment</label>
                  <select
                    value={component.props.textAlign}
                    onChange={(e) => updateComponent(component.id, { textAlign: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </>
            )}

            {/* Image Component Editor */}
            {component.type === 'image' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    value={component.props.url}
                    onChange={(e) => updateComponent(component.id, { url: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    onClick={() => {
                      const query = prompt('Search Unsplash (e.g., "landscape", "business", "food")');
                      if (query) searchUnsplashImages(query);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    Search Unsplash for images
                  </button>
                  {searchResults.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {searchResults.map((img) => (
                        <img
                          key={img.id}
                          src={img.urls.regular}
                          alt="Unsplash"
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                          onClick={() => {
                            updateComponent(component.id, { url: img.urls.regular });
                            setSearchResults([]);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-2">Caption (optional)</label>
                  <input
                    type="text"
                    value={component.props.caption}
                    onChange={(e) => updateComponent(component.id, { caption: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
              </>
            )}

            {/* Button Component Editor */}
            {component.type === 'button' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Button Text</label>
                  <input
                    type="text"
                    value={component.props.text}
                    onChange={(e) => updateComponent(component.id, { text: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Link URL</label>
                  <input
                    type="text"
                    value={component.props.link}
                    onChange={(e) => updateComponent(component.id, { link: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="https://example.com or /about"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Button Color</label>
                  <input
                    type="color"
                    value={component.props.backgroundColor}
                    onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                    className="w-full h-12 border rounded"
                  />
                </div>
              </>
            )}

            {/* Gallery Component Editor */}
            {component.type === 'gallery' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Number of Columns</label>
                  <select
                    value={component.props.columns}
                    onChange={(e) => updateComponent(component.id, { columns: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="2">2 columns</option>
                    <option value="3">3 columns</option>
                    <option value="4">4 columns</option>
                  </select>
                </div>
                <label className="block font-semibold mb-2">Images</label>
                {component.props.images.map((img: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={img.url}
                      onChange={(e) => {
                        const newImages = [...component.props.images];
                        newImages[idx].url = e.target.value;
                        updateComponent(component.id, { images: newImages });
                      }}
                      className="flex-1 px-4 py-2 border rounded"
                      placeholder="Image URL"
                    />
                    <button
                      onClick={() => {
                        const newImages = component.props.images.filter((_: any, i: number) => i !== idx);
                        updateComponent(component.id, { images: newImages });
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newImages = [...component.props.images, { url: 'https://images.unsplash.com/photo-1557683316-973673baf926', alt: 'New image' }];
                    updateComponent(component.id, { images: newImages });
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Add Image
                </button>
              </>
            )}

            {/* Pricing Component Editor */}
            {component.type === 'pricing' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={component.props.title}
                    onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={component.props.subtitle}
                    onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="border-t pt-4 mt-4">
                  <label className="block font-semibold mb-3">Pricing Plans</label>
                  {component.props.plans.map((plan: any, idx: number) => (
                    <div key={idx} className="border rounded p-4 mb-4">
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...component.props.plans];
                          newPlans[idx].name = e.target.value;
                          updateComponent(component.id, { plans: newPlans });
                        }}
                        className="w-full px-4 py-2 border rounded mb-2"
                        placeholder="Plan name"
                      />
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const newPlans = [...component.props.plans];
                          newPlans[idx].price = e.target.value;
                          updateComponent(component.id, { plans: newPlans });
                        }}
                        className="w-full px-4 py-2 border rounded mb-2"
                        placeholder="$29"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Contact Component Editor */}
            {component.type === 'contact' && (
              <>
                <div>
                  <label className="block font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={component.props.title}
                    onChange={(e) => updateComponent(component.id, { title: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={component.props.subtitle}
                    onChange={(e) => updateComponent(component.id, { subtitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={component.props.email}
                    onChange={(e) => updateComponent(component.id, { email: e.target.value })}
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setEditingComponent(null)}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
          >
            Done Editing
          </button>
        </div>
      </div>
    );
  };

  const renderComponent = (component: Component) => {
    const { type, props } = component;

    switch (type) {
      case 'hero':
        return (
          <div
            style={{
              backgroundImage: props.backgroundImage ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${props.backgroundImage})` : `linear-gradient(135deg, ${props.backgroundColor} 0%, #1e3a8a 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: props.textColor,
              padding: props.height === 'large' ? '120px 20px' : '80px 20px',
              textAlign: 'center',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 'bold', maxWidth: '900px' }}>{props.title}</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '700px', opacity: 0.95 }}>{props.subtitle}</p>
            {props.showButton && (
              <a
                href={props.buttonLink}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e3a8a',
                  padding: '16px 48px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {props.buttonText}
              </a>
            )}
          </div>
        );

      case 'features':
        return (
          <div style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{props.title}</h2>
              <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '4rem' }}>{props.subtitle}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                {props.items.map((item: any, idx: number) => (
                  <div key={idx} style={{ padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: '#6b7280' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{props.title}</h2>
              <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '4rem' }}>{props.subtitle}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {props.plans.map((plan: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '40px',
                      backgroundColor: plan.highlighted ? '#3B82F6' : 'white',
                      color: plan.highlighted ? 'white' : 'black',
                      borderRadius: '12px',
                      boxShadow: plan.highlighted ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)',
                      transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{plan.name}</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {plan.price}<span style={{ fontSize: '1rem', fontWeight: 'normal' }}>{plan.period}</span>
                    </div>
                    <ul style={{ textAlign: 'left', marginTop: '2rem', marginBottom: '2rem' }}>
                      {plan.features.map((feature: string, fidx: number) => (
                        <li key={fidx} style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '0' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.buttonLink}
                      style={{
                        display: 'block',
                        backgroundColor: plan.highlighted ? 'white' : '#3B82F6',
                        color: plan.highlighted ? '#3B82F6' : 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {plan.buttonText}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '2rem', color: '#3B82F6' }}>★★★★★</div>
              <p style={{ fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '2rem', color: '#374151' }}>
                "{props.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <img
                  src={props.image}
                  alt={props.author}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{props.author}</div>
                  <div style={{ color: '#6b7280' }}>{props.role}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div style={{ padding: '80px 20px', backgroundColor: '#1e3a8a', color: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {props.title && (
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem' }}>
                  {props.title}
                </h2>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
                {props.items.map((item: any, idx: number) => (
                  <div key={idx}>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.number}</div>
                    <div style={{ fontSize: '1.125rem', opacity: 0.9 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div
            style={{
              padding: '80px 20px',
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              textAlign: 'center'
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{props.title}</h2>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>{props.subtitle}</p>
              <a
                href={props.buttonLink}
                style={{
                  backgroundColor: 'white',
                  color: props.backgroundColor,
                  padding: '16px 48px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {props.buttonText}
              </a>
            </div>
          </div>
        );

      case 'text':
        return (
          <div style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: props.maxWidth || '800px', margin: '0 auto', textAlign: props.textAlign }}>
              <p style={{ fontSize: props.fontSize, lineHeight: '1.75', color: '#374151' }}>{props.content}</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: props.width === 'full' ? '100%' : '800px', margin: '0 auto', textAlign: 'center' }}>
              <img
                src={props.url}
                alt={props.alt}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              {props.caption && (
                <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  {props.caption}
                </p>
              )}
            </div>
          </div>
        );

      case 'button':
        return (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <a
              href={props.link}
              style={{
                backgroundColor: props.backgroundColor,
                color: props.textColor,
                padding: props.size === 'large' ? '16px 48px' : '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: props.size === 'large' ? '18px' : '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {props.text}
            </a>
          </div>
        );

      case 'contact':
        return (
          <div style={{ padding: '80px 20px', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
                {props.title}
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#6b7280', fontSize: '1.125rem' }}>
                {props.subtitle}
              </p>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                />
                {props.showPhone && (
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                )}
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  style={{ padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', resize: 'vertical' }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '16px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
                  gap: '20px'
                }}
              >
                {props.images.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={img.alt}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'columns':
        return (
          <div style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: `${props.leftWidth} auto`, gap: '60px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.125rem', lineHeight: '1.75', color: '#374151' }}>{props.leftContent}</div>
              <div style={{ fontSize: '1.125rem', lineHeight: '1.75', color: '#374151' }}>{props.rightContent}</div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer style={{ backgroundColor: '#1F2937', color: 'white', padding: '60px 20px', marginTop: '0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {props.links.map((link: any, idx: number) => (
                  <a key={idx} href={link.url} style={{ color: 'white', textDecoration: 'none', fontSize: '1.125rem', opacity: 0.9 }}>
                    {link.text}
                  </a>
                ))}
              </div>
              {props.showSocial && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {props.social.facebook && <a href={props.social.facebook} style={{ color: 'white', fontSize: '1.5rem' }}>f</a>}
                    {props.social.twitter && <a href={props.social.twitter} style={{ color: 'white', fontSize: '1.5rem' }}>𝕏</a>}
                    {props.social.instagram && <a href={props.social.instagram} style={{ color: 'white', fontSize: '1.5rem' }}>📷</a>}
                    {props.social.linkedin && <a href={props.social.linkedin} style={{ color: 'white', fontSize: '1.5rem' }}>in</a>}
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.7 }}>
                {props.copyright}
              </div>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  if (previewMode && currentPage) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
          <h1 className="text-xl font-bold">{siteName} - Preview</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Exit Preview
            </button>
          </div>
        </div>
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {currentPage.components.map(component => (
            <div key={component.id}>
              {renderComponent(component)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {/* Pages Section */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm uppercase text-gray-600">Pages</h3>
              <button
                onClick={addPage}
                className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"
                title="Add new page"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {pages.map(page => (
                <div
                  key={page.pageId}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer transition ${
                    currentPage?.pageId === page.pageId
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  <span className="text-sm font-medium truncate">{page.name}</span>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.pageId);
                      }}
                      className={`p-1 rounded ${
                        currentPage?.pageId === page.pageId
                          ? 'hover:bg-blue-700'
                          : 'hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Components Section */}
          <div className="p-4">
            <h3 className="font-bold text-sm uppercase text-gray-600 mb-4">Add Components</h3>
            <div className="space-y-1.5">
              {componentTypes.map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  onClick={() => addComponent(type)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-100 transition text-left group"
                >
                  <div className={`${color} p-1.5 rounded group-hover:scale-110 transition`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="text-lg font-bold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-1"
              placeholder="Website Name"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={saveWebsite}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={() => setShowPublish(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Publish</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="p-6 bg-gray-50 min-h-screen">
            {currentPage && currentPage.components.length === 0 && (
              <div className="text-center py-32 text-gray-400">
                <Layout className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-2xl mb-2 font-semibold">Start Building</p>
                <p className="text-lg">Add components from the sidebar to create your website</p>
              </div>
            )}

            {currentPage && currentPage.components.map((component, index) => (
              <div key={component.id} className="mb-1 group relative">
                <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-400">
                  {renderComponent(component)}
                </div>

                {/* Component Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition">
                  {index > 0 && (
                    <button
                      onClick={() => moveComponent(component.id, 'up')}
                      className="bg-gray-700 text-white p-2 rounded shadow-lg hover:bg-gray-800 transition"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  )}
                  {index < (currentPage?.components.length || 0) - 1 && (
                    <button
                      onClick={() => moveComponent(component.id, 'down')}
                      className="bg-gray-700 text-white p-2 rounded shadow-lg hover:bg-gray-800 transition"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => duplicateComponent(component.id)}
                    className="bg-green-600 text-white p-2 rounded shadow-lg hover:bg-green-700 transition"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingComponent(component.id)}
                    className="bg-blue-600 text-white p-2 rounded shadow-lg hover:bg-blue-700 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteComponent(component.id)}
                    className="bg-red-600 text-white p-2 rounded shadow-lg hover:bg-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {renderComponentEditor(component)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Website Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Custom Domain</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.yourdomain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Connect your domain after publishing
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowSettings(false);
                  saveWebsite();
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublish && PAYPAL_CLIENT_ID && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Publish Your Website</h2>
            <p className="text-gray-600 mb-6">
              Pay $49 one-time to publish your website and get a live subdomain.
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium">
                Your website will be live at:<br />
                <strong className="text-lg">{siteName.toLowerCase().replace(/\s+/g, '-')}.sowwanpay.com</strong>
              </p>
            </div>

            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: { value: '49.00', currency_code: 'USD' },
                      description: `Website Publishing - ${siteName}`
                    }]
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order!.capture();
                  handlePublish(details);
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  alert('Payment failed. Please try again.');
                }}
              />
            </PayPalScriptProvider>

            <button
              onClick={() => setShowPublish(false)}
              className="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
