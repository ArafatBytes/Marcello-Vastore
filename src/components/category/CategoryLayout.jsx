'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CategoryLayout({ title, description, products }) {
  return (
    <div className="w-full bg-white">
      {/* Category Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 md:gap-1.5 w-full px-0.5 md:px-1.5">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`}
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
        ))}
      </div>
    </div>
  );
}
