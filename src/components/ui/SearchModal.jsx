import { useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = [
  'Wallet',
  'Saddle bag',
  'Bracelet',
  'Necklace',
  'Earrings',
];

const youMayAlsoLike = [
  {
    src: '/images/products/sneaker.jpg',
    alt: 'Sneaker',
  },
  {
    src: '/images/products/earrings.jpg',
    alt: 'Earrings',
  },
  {
    src: '/images/products/fabric.jpg',
    alt: 'Fabric',
  },
];

export default function SearchModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 right-0 top-20 bottom-0 z-40 bg-white/95 flex flex-col" style={{backdropFilter:'blur(2px)'}}
        >
          <div className="flex items-center h-16 px-8 relative">
            <button onClick={onClose} className="mr-6 text-gray-700 hover:text-black text-xl focus:outline-none">
              <X size={24} /> <span className="sr-only">Close</span>
            </button>
            <span className="text-base font-normal text-gray-700">Close</span>
          </div>
      <div className="flex-1 w-full max-w-4xl mx-auto pt-10 px-4">
        <div className="flex items-center border-b border-gray-300 pb-2 mb-2">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            className="flex-1 text-lg bg-transparent outline-none placeholder-gray-400"
            placeholder="What are you looking for?"
            autoFocus
          />
          <button className="ml-2 text-gray-400 hover:text-black">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="mt-3">
          <div className="text-gray-400 text-sm mb-2">Suggestions</div>
          <ul className="mb-6">
            {suggestions.map((s, i) => (
              <li key={i} className="text-gray-700 text-base mb-1 cursor-pointer hover:underline w-fit">{s}</li>
            ))}
          </ul>
          <div className="font-semibold text-base mb-4 mt-10">You may also like</div>
          <div className="grid grid-cols-3 gap-1.5 mb-8">
            {youMayAlsoLike.map((item, i) => (
              <div key={i} className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden rounded">
                <Image src={item.src} alt={item.alt} width={180} height={180} className="object-contain w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-end w-full px-8 pb-6">
        <Link href="#" className="text-xs text-gray-500 hover:underline">
          Search for <span className="underline">Fragrance & Beauty</span> products
        </Link>
      </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
