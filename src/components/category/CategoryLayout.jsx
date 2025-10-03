'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CategoryLayout({ title, description, products = [], loading = false }) {
  return (
    <div className="w-full bg-white">
      {/* Category Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 md:gap-1.5 w-full px-0.5 md:px-1.5">
        {loading ? (
          // Loading spinner that spans all columns
          <div className="col-span-4 flex items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-lg rounded-full shadow-lg border border-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin">
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          // Render products when not loading and products exist
          products.map((product) => (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`}
              className="group block"
              onClick={(e) => {
                // Only navigate if the click wasn't on the wishlist button
                if (e.target.closest('button')) {
                  e.preventDefault();
                }
              }}
            >
              <div className="group">
                {/* Product Image */}
                <div className="aspect-[3/4.5] bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle wishlist functionality here
                        console.log('Add to wishlist', product.id);
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Show message when no products are found
          <div className="col-span-4 text-center py-12 text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
