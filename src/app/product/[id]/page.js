import ProductDetails from '@/components/ui/product-details';

// This would normally fetch from your API or database
const getProduct = (id) => {
  // Mock product data - replace with actual API call
  const products = {
    '1': {
      id: '1',
      name: 'Slim Fit Cotton Shirt',
      reference: 'SH12345',
      price: 89.99,
      description: 'A classic slim fit shirt made from 100% organic cotton. Perfect for both casual and formal occasions.',
      details: '100% organic cotton. Machine washable. Imported.',
      sizeFit: 'Slim fit. Model is 6\'2" (188 cm) and wears size M.',
      images: [
        '/placeholder-shirt-1.jpg',
        '/placeholder-shirt-2.jpg',
        '/placeholder-shirt-3.jpg',
        '/placeholder-shirt-4.jpg',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Gray', hex: '#6B7280' },
      ],
    },
    // Add more products as needed
  };
  
  return products[id] || null;
};

export default function ProductPage({ params }) {
  const product = getProduct(params.id);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return <ProductDetails product={product} />;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  // In a real app, you would fetch all product IDs from your database
  return [
    { id: '1' },
    // Add more product IDs as needed
  ];
}

export const dynamicParams = true; // Enable fallback for non-generated routes
