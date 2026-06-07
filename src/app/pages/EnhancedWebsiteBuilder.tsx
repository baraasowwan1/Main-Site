import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Plus, Save, Eye, Settings as SettingsIcon, Trash2, Globe,
  Type, Image as ImageIcon, Layout, Mail, Grid, Columns,
  Edit2, X, FileText, Link as LinkIcon
} from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface Component {
  id: string;
  type: 'hero' | 'text' | 'image' | 'button' | 'contact' | 'gallery' | 'columns' | 'footer';
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

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Component library
  const componentTypes = [
    { type: 'hero', icon: Type, label: 'Hero Section', color: 'bg-blue-500' },
    { type: 'text', icon: Type, label: 'Text Block', color: 'bg-gray-500' },
    { type: 'image', icon: ImageIcon, label: 'Image', color: 'bg-green-500' },
    { type: 'button', icon: Layout, label: 'Button', color: 'bg-purple-500' },
    { type: 'contact', icon: Mail, label: 'Contact Form', color: 'bg-red-500' },
    { type: 'gallery', icon: Grid, label: 'Gallery', color: 'bg-yellow-500' },
    { type: 'columns', icon: Columns, label: 'Two Columns', color: 'bg-indigo-500' },
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
        title: 'Welcome to My Website',
        subtitle: 'Start your journey here',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF'
      },
      text: {
        content: 'Add your text content here. You can write anything you want!',
        fontSize: '16px',
        textAlign: 'left'
      },
      image: {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926',
        alt: 'Beautiful image',
        caption: 'Image caption'
      },
      button: {
        text: 'Click Me',
        link: '#',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF'
      },
      contact: {
        title: 'Get in Touch',
        subtitle: 'Send us a message',
        email: 'contact@example.com'
      },
      gallery: {
        images: [
          { url: 'https://images.unsplash.com/photo-1557683316-973673baf926', alt: 'Image 1' },
          { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85', alt: 'Image 2' },
          { url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5', alt: 'Image 3' }
        ]
      },
      columns: {
        leftContent: 'Left column content',
        rightContent: 'Right column content'
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
        }
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
        alert('Website saved successfully!');
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
        body: JSON.stringify({
          paymentId: paymentDetails.id
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Website published! Live at: ${data.url}`);
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
        <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit {component.type}</h2>
            <button onClick={() => setEditingComponent(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {component.type === 'hero' && (
            <div className="space-y-4">
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
                <label className="block font-semibold mb-2">Background Color</label>
                <input
                  type="color"
                  value={component.props.backgroundColor}
                  onChange={(e) => updateComponent(component.id, { backgroundColor: e.target.value })}
                  className="w-full h-12 border rounded"
                />
              </div>
            </div>
          )}

          {component.type === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Content</label>
                <textarea
                  value={component.props.content}
                  onChange={(e) => updateComponent(component.id, { content: e.target.value })}
                  className="w-full px-4 py-2 border rounded h-32"
                />
              </div>
            </div>
          )}

          {component.type === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  value={component.props.url}
                  onChange={(e) => updateComponent(component.id, { url: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Caption</label>
                <input
                  type="text"
                  value={component.props.caption}
                  onChange={(e) => updateComponent(component.id, { caption: e.target.value })}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <p className="text-sm text-gray-600">
                💡 Tip: Use <a href="https://unsplash.com" target="_blank" className="text-blue-600 underline">Unsplash.com</a> for free high-quality images
              </p>
            </div>
          )}

          {component.type === 'button' && (
            <div className="space-y-4">
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
            </div>
          )}

          {component.type === 'gallery' && (
            <div className="space-y-4">
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
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newImages = [...component.props.images, { url: '', alt: 'New image' }];
                  updateComponent(component.id, { images: newImages });
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add Image
              </button>
            </div>
          )}

          <button
            onClick={() => setEditingComponent(null)}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Done
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
              backgroundColor: props.backgroundColor,
              color: props.textColor,
              padding: '100px 20px',
              textAlign: 'center'
            }}
          >
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{props.title}</h1>
            <p style={{ fontSize: '1.5rem' }}>{props.subtitle}</p>
          </div>
        );

      case 'text':
        return (
          <div style={{ padding: '40px 20px', textAlign: props.textAlign }}>
            <p style={{ fontSize: props.fontSize }}>{props.content}</p>
          </div>
        );

      case 'image':
        return (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <img
              src={props.url}
              alt={props.alt}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
            {props.caption && (
              <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                {props.caption}
              </p>
            )}
          </div>
        );

      case 'button':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <a
              href={props.link}
              style={{
                backgroundColor: props.backgroundColor,
                color: props.textColor,
                padding: '15px 40px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {props.text}
            </a>
          </div>
        );

      case 'contact':
        return (
          <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
              {props.title}
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
              {props.subtitle}
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Name" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="email" placeholder="Email" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <textarea placeholder="Message" rows={5} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '15px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                Send Message
              </button>
            </form>
          </div>
        );

      case 'gallery':
        return (
          <div style={{ padding: '60px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
              {props.images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt}
                  style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ))}
            </div>
          </div>
        );

      case 'columns':
        return (
          <div style={{ padding: '60px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
              <div>{props.leftContent}</div>
              <div>{props.rightContent}</div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer style={{ backgroundColor: '#1F2937', color: 'white', padding: '40px 20px', marginTop: '60px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                {props.links.map((link: any, idx: number) => (
                  <a key={idx} href={link.url} style={{ color: 'white', textDecoration: 'none' }}>
                    {link.text}
                  </a>
                ))}
              </div>
              <p>{props.copyright}</p>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  if (previewMode && currentPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Preview: {siteName}</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Exit Preview
          </button>
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>
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

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Pages Section */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Pages</h3>
              <button
                onClick={addPage}
                className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {pages.map(page => (
                <div
                  key={page.pageId}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    currentPage?.pageId === page.pageId ? 'bg-blue-50 border border-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  <span className="text-sm font-medium">{page.name}</span>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.pageId);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Components Section */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Components</h3>
            <div className="space-y-2">
              {componentTypes.map(({ type, icon: Icon, label, color }) => (
                <button
                  key={type}
                  onClick={() => addComponent(type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition text-left"
                >
                  <div className={`${color} p-2 rounded`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="text-xl font-bold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={saveWebsite}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setShowPublish(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                <Globe className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="p-8">
            {currentPage && currentPage.components.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl mb-2">Start building your website</p>
                <p>Add components from the sidebar</p>
              </div>
            )}

            {currentPage && currentPage.components.map((component) => (
              <div key={component.id} className="mb-4 group relative border-2 border-transparent hover:border-blue-500 rounded">
                {renderComponent(component)}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
                  <button
                    onClick={() => setEditingComponent(component.id)}
                    className="bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteComponent(component.id)}
                    className="bg-red-600 text-white p-2 rounded shadow hover:bg-red-700"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Website Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Custom Domain</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.yourdomain.com"
                  className="w-full px-4 py-2 border rounded"
                />
                <p className="text-sm text-gray-600 mt-2">
                  After publishing, you can connect your custom domain
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowSettings(false);
                  saveWebsite();
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublish && PAYPAL_CLIENT_ID && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Publish Your Website</h2>
            <p className="text-gray-600 mb-6">
              Pay $49 one-time to publish your website and get a live subdomain.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <p className="text-sm text-blue-800">
                Your website will be live at:<br />
                <strong>yoursite.sowwanpay.com</strong>
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
                  alert('Payment failed');
                }}
              />
            </PayPalScriptProvider>

            <button
              onClick={() => setShowPublish(false)}
              className="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300"
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
