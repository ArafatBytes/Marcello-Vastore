'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// Custom font for the logo
const logoFont = {
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  letterSpacing: '0.05em',
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const categoriesRef = useRef(null);
  
  const smoothScrollTo = (element, offset = 0) => {
    if (!element) return;
    
    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let start = null;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeInOutQuad)
      const easeInOutQuad = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
      
      window.scrollTo(0, startPosition + distance * easeInOutQuad(percentage));
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }
    
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-white/30" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatePresence>
            {mounted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-3xl mx-auto"
                key="hero-content"
              >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={logoFont}>
              Elevate Your Style
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto" style={logoFont}>
              Discover the latest collection of premium fashion for the modern individual. 
              Timeless pieces designed for those who appreciate quality and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </a>
              <a
                href="/collections"
                className="px-8 py-3 border border-black text-black font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                View Collections
              </a>
            </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => smoothScrollTo(categoriesRef.current, 80)}
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section ref={categoriesRef} className="py-16 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Men', 'Women', 'Kids', 'Accessories'].map((category) => (
              <div key={category} className="group relative h-64 bg-white rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
                <span className="text-gray-700 font-medium text-lg">{category}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {['Shoes', 'Bags', 'Watches', 'Jewelry'].map((category) => (
              <div key={category} className="group relative h-64 bg-white rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
                <span className="text-gray-700 font-medium text-lg">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcello Vastore Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-5xl md:text-6xl text-gray-900 mb-4"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            Marcello Vastore
          </h2>
          <h3 
            className="text-2xl md:text-3xl text-gray-700 mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              letterSpacing: '0.05em',
              fontStyle: 'italic'
            }}
          >
            Honoring You
          </h3>
          <p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              letterSpacing: '0.03em',
              lineHeight: '1.8'
            }}
          >
            Our true craft lies beyond the garment - it lives in the way it makes you feel
          </p>
        </div>
      </section>

      {/* Second Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-100">
        {/* This is a placeholder for your photo or video */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-lg">Image/Video Placeholder</span>
        </div>
      </section>
    </div>
  );
}
