import ProductDetails from "@/components/ui/product-details";
import { notFound } from "next/navigation";

// Fetch product data from the database
async function getProduct(id) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/products/${id}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Product not found
      }
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
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
    description: product.description || "No description available.",
    details: product.details || product.productDetails || "Product details not specified.",
    sizeFit: product.sizeFit || "Standard fit.",
    // Handle main image and additional images properly
    images: (() => {
      let allImages = [];

      // Add main image first if it exists
      if (product.image && typeof product.image === 'string' && product.image.trim()) {
        allImages.push(product.image.trim());
      }

      // Add additional images from the new field structure
      if (Array.isArray(product.additionalImages)) {
        const validAdditionalImages = product.additionalImages.filter(
          img => img && typeof img === 'string' && img.trim() !== ''
        );
        allImages.push(...validAdditionalImages.map(img => img.trim()));
      }

      // Fallback: check old images field for backward compatibility
      if (Array.isArray(product.images)) {
        const validOldImages = product.images.filter(
          img => img && typeof img === 'string' && img.trim() !== '' && !allImages.includes(img.trim())
        );
        allImages.push(...validOldImages.map(img => img.trim()));
      }

      // Remove duplicates and ensure all URLs are valid
      allImages = [...new Set(allImages)].filter(img => 
        img.startsWith('http') || img.startsWith('/') || img.startsWith('data:')
      );

      // If no images at all, use placeholder
      return allImages.length > 0 ? allImages : ["/placeholder-product.jpg"];
    })(),
    // Keep original main image separately for reference
    mainImage: product.image,
    sizes: (() => {
      const sizes = product.sizes || ["S", "M", "L", "XL"];
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      return sizes.sort((a, b) => {
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        // If size not found in order, put it at the end
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
    })(),
    colors: (product.colors || []).map((color) => ({
      name: color.name || color,
      hex: color.hex || (typeof color === "string" ? color : "#000000"),
    })),
    collection: product.collection,
    category: product.category,
    reference: product.reference || "N/A",
    // Add any additional fields that might be needed
    ...product,
  };

  return <ProductDetails product={formattedProduct} />;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  try {
    // Fetch all product IDs from the API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/products`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    // Return an array of params for each product
    return data.products.map((product) => ({
      id: product._id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export const dynamicParams = true; // Enable fallback for non-generated routes
