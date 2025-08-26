import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CategoryLayout } from '@/components/category/CategoryLayout';

export default function CategoryPage({ params }) {
  const { category } = params;
  
  // This would typically come from an API or CMS
  const categoryData = {
    title: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: `Explore our exclusive collection of ${category.replace('-', ' ')}. Handcrafted with premium materials and attention to detail.`,
  };

  // Mock product data - replace with actual data fetching
  const products = Array(8).fill().map((_, i) => ({
    id: i + 1,
    name: `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Item ${i + 1}`,
    price: (Math.random() * 200 + 50).toFixed(2),
    image: `/placeholder-shirt-${(i % 4) + 1}.jpg`, // Cycle through placeholder images
    category: category,
    reference: `REF-${category.toUpperCase().substring(0, 3)}-${i + 1000}`,
    description: `Premium quality ${category.replace('-', ' ')} item. Made with care and attention to detail.`,
    details: '100% high-quality materials. Machine washable. Imported.',
    sizeFit: 'Model is 6\'0" (183 cm) and wears size M.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6B7280' },
    ],
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CategoryLayout 
          title={categoryData.title}
          description={categoryData.description}
          products={products}
        />
      </main>
    </div>
  );
}
