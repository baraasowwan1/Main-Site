import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus, Save, Eye, Settings, Trash2, Edit, Globe, Image as ImageIcon, Type, Layout } from 'lucide-react';

interface Page {
  id: string;
  name: string;
  path: string;
  content: PageSection[];
}

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'contact';
  content: any;
}

export default function WebsiteBuilder() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [siteName, setSiteName] = useState('My Website');
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    // Load saved pages from localStorage
    const savedPages = localStorage.getItem('websiteBuilderPages');
    const savedSiteName = localStorage.getItem('websiteName');
    const savedDomain = localStorage.getItem('customDomain');

    if (savedPages) {
      const parsedPages = JSON.parse(savedPages);
      setPages(parsedPages);
      if (parsedPages.length > 0) {
        setCurrentPage(parsedPages[0]);
      }
    } else {
      // Create default home page
      const defaultPage: Page = {
        id: 'home',
        name: 'Home',
        path: '/',
        content: [
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              title: 'Welcome to My Website',
              subtitle: 'Start editing to customize this page',
              backgroundColor: '#3B82F6'
            }
          }
        ]
      };
      setPages([defaultPage]);
      setCurrentPage(defaultPage);
    }

    if (savedSiteName) setSiteName(savedSiteName);
    if (savedDomain) setCustomDomain(savedDomain);
  }, []);

  const savePages = (updatedPages: Page[]) => {
    localStorage.setItem('websiteBuilderPages', JSON.stringify(updatedPages));
    setPages(updatedPages);
  };

  const addPage = () => {
    const pageName = prompt('Enter page name:');
    if (!pageName) return;

    const newPage: Page = {
      id: Date.now().toString(),
      name: pageName,
      path: '/' + pageName.toLowerCase().replace(/\s+/g, '-'),
      content: []
    };

    const updatedPages = [...pages, newPage];
    savePages(updatedPages);
    setCurrentPage(newPage);
  };

  const deletePage = (pageId: string) => {
    if (pages.length === 1) {
      alert('Cannot delete the last page');
      return;
    }

    if (confirm('Are you sure you want to delete this page?')) {
      const updatedPages = pages.filter(p => p.id !== pageId);
      savePages(updatedPages);
      if (currentPage?.id === pageId) {
        setCurrentPage(updatedPages[0]);
      }
    }
  };

  const addSection = (type: PageSection['type']) => {
    if (!currentPage) return;

    const newSection: PageSection = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    };

    const updatedPage = {
      ...currentPage,
      content: [...currentPage.content, newSection]
    };

    const updatedPages = pages.map(p => p.id === currentPage.id ? updatedPage : p);
    savePages(updatedPages);
    setCurrentPage(updatedPage);
  };

  const getDefaultContent = (type: PageSection['type']) => {
    switch (type) {
      case 'hero':
        return { title: 'New Hero Section', subtitle: 'Add your subtitle here', backgroundColor: '#3B82F6' };
      case 'text':
        return { text: 'Add your text content here', alignment: 'left' };
      case 'image':
        return { url: '', alt: 'Image description', caption: '' };
      case 'gallery':
        return { images: [] };
      case 'contact':
        return { title: 'Contact Us', email: 'contact@example.com' };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, content: any) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      content: currentPage.content.map(section =>
        section.id === sectionId ? { ...section, content } : section
      )
    };

    const updatedPages = pages.map(p => p.id === currentPage.id ? updatedPage : p);
    savePages(updatedPages);
    setCurrentPage(updatedPage);
  };

  const deleteSection = (sectionId: string) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      content: currentPage.content.filter(s => s.id !== sectionId)
    };

    const updatedPages = pages.map(p => p.id === currentPage.id ? updatedPage : p);
    savePages(updatedPages);
    setCurrentPage(updatedPage);
  };

  const saveSiteSettings = () => {
    localStorage.setItem('websiteName', siteName);
    localStorage.setItem('customDomain', customDomain);
    alert('Settings saved successfully!');
    setShowSettings(false);
  };

  const renderSection = (section: PageSection, editable: boolean = true) => {
    switch (section.type) {
      case 'hero':
        return (
          <div
            className="py-20 px-6 text-white text-center"
            style={{ backgroundColor: section.content.backgroundColor }}
          >
            {editable ? (
              <>
                <input
                  type="text"
                  value={section.content.title}
                  onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
                  className="text-4xl font-bold bg-transparent border-b-2 border-white/50 text-center w-full mb-4 focus:outline-none focus:border-white"
                />
                <input
                  type="text"
                  value={section.content.subtitle}
                  onChange={(e) => updateSection(section.id, { ...section.content, subtitle: e.target.value })}
                  className="text-xl bg-transparent border-b-2 border-white/50 text-center w-full focus:outline-none focus:border-white"
                />
                <div className="mt-4">
                  <label className="text-sm mr-2">Background Color:</label>
                  <input
                    type="color"
                    value={section.content.backgroundColor}
                    onChange={(e) => updateSection(section.id, { ...section.content, backgroundColor: e.target.value })}
                    className="ml-2"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">{section.content.title}</h1>
                <p className="text-xl">{section.content.subtitle}</p>
              </>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="py-12 px-6">
            {editable ? (
              <textarea
                value={section.content.text}
                onChange={(e) => updateSection(section.id, { ...section.content, text: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[150px]"
              />
            ) : (
              <p className="text-gray-700">{section.content.text}</p>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="py-12 px-6 bg-gray-50">
            {editable ? (
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  value={section.content.title}
                  onChange={(e) => updateSection(section.id, { ...section.content, title: e.target.value })}
                  className="text-2xl font-bold w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  value={section.content.email}
                  onChange={(e) => updateSection(section.id, { ...section.content, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Contact email"
                />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">{section.content.title}</h2>
                <p className="text-gray-700">Email: {section.content.email}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (previewMode && currentPage) {
    return (
      <div className="min-h-screen">
        <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{siteName}</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold"
          >
            Exit Preview
          </button>
        </div>
        <div className="flex gap-4 p-4 bg-gray-100">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${currentPage.id === page.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {page.name}
            </button>
          ))}
        </div>
        {currentPage.content.map(section => (
          <div key={section.id}>
            {renderSection(section, false)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold mb-4">Pages</h2>
              <button
                onClick={addPage}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Page
              </button>
            </div>

            <div className="p-2">
              {pages.map(page => (
                <div
                  key={page.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer flex justify-between items-center ${
                    currentPage?.id === page.id ? 'bg-blue-50 border border-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  <span className="font-medium">{page.name}</span>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <h3 className="font-bold mb-3">Add Section</h3>
              <div className="space-y-2">
                <button
                  onClick={() => addSection('hero')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <Layout size={18} />
                  Hero Section
                </button>
                <button
                  onClick={() => addSection('text')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <Type size={18} />
                  Text Block
                </button>
                <button
                  onClick={() => addSection('contact')}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <Globe size={18} />
                  Contact Form
                </button>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold">{currentPage?.name || 'No Page Selected'}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                  <Settings size={18} />
                  Settings
                </button>
                <button
                  onClick={() => setPreviewMode(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Eye size={18} />
                  Preview
                </button>
              </div>
            </div>

            {currentPage ? (
              <div className="p-6">
                {currentPage.content.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-xl mb-4">No sections yet</p>
                    <p>Add sections from the sidebar to start building your page</p>
                  </div>
                ) : (
                  currentPage.content.map((section) => (
                    <div key={section.id} className="mb-6 border border-gray-300 rounded-lg overflow-hidden relative group">
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition z-10"
                      >
                        <Trash2 size={16} />
                      </button>
                      {renderSection(section)}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a page from the sidebar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Website Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Custom Domain</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.yourdomain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Note: Domain connection requires DNS configuration. Contact support for assistance.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Demo Mode:</strong> In production, custom domain settings would integrate with your DNS provider.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={saveSiteSettings}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
