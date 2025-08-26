'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Minus, Plus, Check } from 'lucide-react';

export default function ProductDetails({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Mock data for recently viewed products - replace with your actual data
  const recentlyViewed = [
    { id: 2, name: 'Classic White Shirt', price: 79.99, image: '/placeholder-shirt-2.jpg' },
    { id: 3, name: 'Casual Blue Shirt', price: 84.99, image: '/placeholder-shirt-3.jpg' },
    { id: 4, name: 'Formal Black Shirt', price: 89.99, image: '/placeholder-shirt-4.jpg' },
  ];

  return (
    <div className="w-full">
      <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="relative aspect-square mb-4">
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative aspect-square ${currentImage === index ? 'ring-2 ring-black' : ''}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">Ref. {product.reference}</p>
            </div>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">4.0 (1)</span>
          </div>

          <div className="mb-8">
            <p className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Size Selector */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-3">COLOR</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-black' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors">
                ADD TO BAG
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6">
                <h3 className="font-medium mb-2">PRODUCT DETAILS</h3>
                <p className="text-gray-700">{product.details}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">SIZE & FIT</h3>
                <p className="text-gray-700">{product.sizeFit}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-xl font-medium mb-6">RECENTLY VIEWED</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-square mb-2 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View More Section */}
      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-light mb-2">YOU MAY ALSO LIKE</h2>
              <p className="text-gray-600 max-w-md">Discover more products that match your style</p>
            </div>
            <button className="border border-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors">
              VIEW MORE
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {[...recentlyViewed, { id: 5, name: 'Premium Linen Shirt', price: 94.99, image: '/placeholder-shirt-1.jpg' }].map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-square mb-3 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
