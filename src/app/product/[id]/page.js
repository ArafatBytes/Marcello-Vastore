import ProductDetails from '@/components/ui/product-details';
import { notFound } from 'next/navigation';

// Fetch product data from the database
async function getProduct(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Product not found
      }
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Transform the product data to match the expected format
  const formattedProduct = {
    id: product._id,
    name: product.name,
    price: product.price,
    description: product.description || 'No description available.',
    details: product.details || 'Product details not specified.',
    sizeFit: product.sizeFit || 'Standard fit.',
    // Handle both single image string and array of images
    images: (() => {
      if (!product.image && !product.images) return ['/placeholder-product.jpg'];
      if (typeof product.image === 'string') return [product.image];
      if (Array.isArray(product.images) && product.images.length > 0) return product.images;
      if (Array.isArray(product.image) && product.image.length > 0) return product.image;
      return ['/placeholder-product.jpg'];
    })(),
    sizes: product.sizes || ['S', 'M', 'L', 'XL'],
    colors: product.colors || [
      { name: 'Default', hex: '#000000' }
    ],
    collection: product.collection,
    category: product.category,
    reference: product.reference || 'N/A',
    // Add any additional fields that might be needed
    ...product
  };

  return <ProductDetails product={formattedProduct} />;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  try {
    // Fetch all product IDs from the API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    
    // Return an array of params for each product
    return data.products.map((product) => ({
      id: product._id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const dynamicParams = true; // Enable fallback for non-generated routes
