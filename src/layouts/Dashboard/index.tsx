import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden lg:block border-r bg-white transition-all duration-300 ease-in-out",
          "transform translate-x-0"
        )}>
          <Sidebar />
        </aside>

        {/* Mobile Drawer Overlay */}
        <div 
          className={cn(
            "fixed inset-0 bg-black/60 z-40 lg:hidden drawer-overlay",
            sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Mobile Drawer */}
        <div 
          className={cn(
            "fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden drawer-panel",
            "transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <div className="lg:hidden p-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className={cn(
                    "h-10 w-10 rounded-lg border border-gray-200 bg-white shadow-sm",
                    "hover:bg-gray-50 hover:border-gray-300 transition-all duration-200",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "active:scale-95"
                  )}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
              
              <div className="flex-1">
                <Header />
              </div>
            </div>
          </header>

          {/* Main content area with enhanced styling */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="container mx-auto p-6 max-w-7xl">
              {/* Breadcrumb */}
              <div className="mb-6">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Home</span>
                  <span>/</span>
                  <span className="font-medium text-gray-900">DashboardLayout</span>
                </nav>
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};