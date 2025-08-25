'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, UserCircle, Menu, Heart, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import { AnimatePresence } from 'framer-motion';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

// Custom font for the logo
const logoFont = {
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const pathname = usePathname();
  const router = useRouter();


  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event) => {
      const isMenuButton = event.target.closest('button[aria-label*="menu"]');
      const isInsideMenu = event.target.closest('.mobile-menu-container');
      
      if (!isMenuButton && !isInsideMenu) {
        setIsMobileMenuOpen(false);
        setActiveCategory(null);
      }
    };

    // Use a slight delay to prevent the initial click from triggering the close
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = {
    'Atlier 1': [
      { name: 'Shirts', slug: 'atelier-1-shirts' },
      { name: 'Pants & Shorts', slug: 'atelier-1-pants-shorts' },
      { name: 'Co-Ord Capsule', slug: 'atelier-1-co-ord-capsule' },
      { name: 'Lustralis Estate', slug: 'atelier-1-lustralis-estate' }
    ],
    'Atlier 2': [
      { name: 'Dresses', slug: 'atelier-2-dresses' },
      { name: 'Tops', slug: 'atelier-2-tops' },
      { name: 'Skirts', slug: 'atelier-2-skirts' },
      { name: 'Co-Ord Capsule', slug: 'atelier-2-co-ord-capsule' },
      { name: 'Riviera Vastore', slug: 'atelier-2-riviera-vastore' }
    ]
  };

  // --- Highlight Bar State ---
  const iconRefs = {
    search: React.useRef(null),
    heart: React.useRef(null),
    bag: React.useRef(null),
    user: React.useRef(null)
  };
  const navBarRef = React.useRef(null);

  // Determine which icon is currently 'active' for highlight
  let highlight = null;
  if (activeIcon === 'search') highlight = 'search';
  else if (!isSearchOpen && pathname.startsWith('/favorites')) highlight = 'heart';
  else if (!isSearchOpen && pathname.startsWith('/cart')) highlight = 'bag';
  else if (!isSearchOpen && (pathname.startsWith('/login') || pathname.startsWith('/register'))) highlight = 'user';


  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
        style={{ zIndex: 100 }}
      >
        <nav ref={navBarRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 100 }}>
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center relative">
              {!isSearchOpen && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(prev => !prev);
                    if (isMobileMenuOpen) {
                      setActiveCategory(null);
                    }
                  }}
                  className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none relative h-6 w-8 flex items-center justify-center"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  style={{ zIndex: 1000 }}
                >
                  <div className="relative w-6 h-5">
                    <span 
                      className={`absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2' : 'top-0'}`}
                    />
                    <span 
                      className={`absolute left-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2' : 'bottom-0'}`}
                    />
                  </div>
                </button>
              )}
            </div>

            {/* Desktop Navigation - Empty div to maintain layout */}
            <div className="hidden md:block w-1/3"></div>

            {/* Centered Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl md:text-3xl font-bold tracking-wider" style={logoFont}>
              MARCELLO VASTORE
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative flex flex-col items-center"
              onClick={() => {
                setIsSearchOpen(true);
                setActiveIcon('search');
              }}
              aria-label="Open search"
            >
              <span className="relative flex flex-col items-center" ref={iconRefs.search}>
                <Search className="h-5 w-5" />
                
              </span>
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative flex flex-col items-center"
              aria-label="Favorites"
              onClick={() => {
                if (isSearchOpen) setIsSearchOpen(false);
                setActiveIcon(null);
                router.push('/favorites');
              }}
            >
              <span className="relative flex flex-col items-center" ref={iconRefs.heart}>
                <Heart className="h-5 w-5" />
                
              </span>
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative flex flex-col items-center"
              aria-label="Cart"
              ref={iconRefs.bag}
              onClick={() => {
                if (isSearchOpen) setIsSearchOpen(false);
                setActiveIcon(null);
                router.push('/cart');
              }}
            >
              <div className="relative flex flex-col items-center">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
                
              </div>
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 transition-colors relative flex flex-col items-center"
              aria-label="User"
              ref={iconRefs.user}
              onClick={() => {
                if (isSearchOpen) setIsSearchOpen(false);
                setActiveIcon(null);
                router.push('/login');
              }}
            >
              <span className="relative flex flex-col items-center">
                <UserCircle className="h-6 w-6" />
                
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-20 bg-white shadow-lg z-40 py-6 mobile-menu-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center w-full">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col md:flex-row gap-8">
                  {Object.entries(navItems).map(([category, items]) => (
                    <NavigationMenuItem key={category} className="relative">
                      <NavigationMenuTrigger className="w-full justify-between">
                        {category}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="w-full md:w-[600px]">
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-gray-900 border-b pb-2">
                                {category} Collection
                              </h3>
                              <div className="text-sm font-medium text-gray-900 py-1">
                                Ready-to-wear
                              </div>
                              <ul className="space-y-3">
                                {items.map((item) => (
                                  <li key={item}>
                                    <Link
                                      href={`/collections/${item.slug}`}
                                      className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors block py-1.5 px-2 rounded"
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                      }}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-gray-50 rounded-md flex items-center justify-center p-8">
                              <span className="text-gray-400 text-sm">Featured Collection</span>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <SearchModal open={isSearchOpen} onClose={() => { setIsSearchOpen(false); setActiveIcon(null); }} />
    </>
  );
}
