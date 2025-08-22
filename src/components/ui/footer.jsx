'use client';

import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-12 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Left Column - Quick Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-gray-600 hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-black transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Middle Column - Contact Info + Newsletter + Social */}
          <div className="md:col-span-2 space-y-8 flex flex-col items-center">
            {/* Contact Info */}
            <div className="space-y-4 flex flex-col items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
              <address className="not-italic space-y-2 text-gray-600">
                <p>123 Fashion Street</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p className="mt-2">
                  <a href="mailto:info@marcellovastore.com" className="hover:text-black transition-colors">
                    info@marcellovastore.com
                  </a>
                </p>
                <p>
                  <a href="tel:+11234567890" className="hover:text-black transition-colors">
                    +1 (123) 456-7890
                  </a>
                </p>
              </address>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 w-full max-w-md mx-auto">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h3>
              <p className="text-gray-600 text-sm">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm flex-grow"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>

            {/* Social Media Icons */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
              <div className="flex justify-center space-x-6">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:opacity-80 transition-opacity"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E1306C] hover:opacity-80 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Service */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-600 hover:text-black transition-colors text-sm">Track Order</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-black transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link href="/payment-options" className="text-gray-600 hover:text-black transition-colors text-sm">Payment Options</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Marcello Vastore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
